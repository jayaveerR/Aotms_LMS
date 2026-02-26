require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to get authenticated Supabase client
const getAuthClient = (token) => {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
};

// Auth Routes
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Signup error:", err?.message || err);
    res.status(400).json({ error: err?.message || "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Login error:", err?.message || err);
    res.status(401).json({ error: err?.message || "Authentication failed" });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const authClient = getAuthClient(token);
    await authClient.auth.signOut();
  }
  res.json({ message: "Logged out successfully" });
});

// User Routes
app.get("/api/user/role", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const authClient = getAuthClient(token);
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) throw new Error("Invalid token");

    const { data, error } = await authClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    res.json({ role: data?.role || "student" });
  } catch (err) {
    console.error("Get role error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/user/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const authClient = getAuthClient(token);
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      console.warn(
        "Profile auth failed:",
        userError?.message || "No user found",
      );
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { data, error } = await authClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found, which is OK for new users
      console.error("Profile fetch error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ profile: data || {}, user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/user/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });
  const updates = req.body;

  try {
    const authClient = getAuthClient(token);
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) throw new Error("Invalid token");

    const { error } = await authClient
      .from("profiles")
      .upsert({ ...updates, id: user.id });

    if (error) throw error;

    if (updates.full_name || updates.avatar_url) {
      // Must use admin/service role or strict RLS context
      // Here we use the user's auth context client which should work if they can update themselves
      await authClient.auth.updateUser({
        data: {
          full_name: updates.full_name,
          avatar_url: updates.avatar_url,
        },
      });
    }

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Basic Route
app.get("/", (req, res) => {
  res.send("AOTMS LMS Backend is running");
});

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = upload.single("file");

app.post("/api/upload/:bucket", uploadMiddleware, async (req, res) => {
  const { bucket } = req.params;
  const file = req.file;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Missing token" });
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const authClient = getAuthClient(token);
    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await authClient.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data } = authClient.storage.from(bucket).getPublicUrl(fileName);

    res.json({ url: data.publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Instructor Routes
app.post(
  "/api/instructor/register",
  upload.single("resume"),
  async (req, res) => {
    const {
      email,
      password,
      fullName,
      areaOfExpertise,
      customExpertise,
      experience,
    } = req.body;
    const resumeFile = req.file;

    try {
      // 1. Sign Up User
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: "http://localhost:5173/instructor", // Backend URL or specific redirect
          },
        },
      );

      if (signUpError) throw signUpError;
      const userId = authData.user?.id;
      if (!userId) throw new Error("User registration failed");

      // 2. Upload Resume if exists
      let resumeUrl = null;
      if (resumeFile) {
        const fileExt = resumeFile.originalname.split(".").pop();
        const filePath = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("instructor-resumes")
          .upload(filePath, resumeFile.buffer, {
            contentType: resumeFile.mimetype,
          });

        if (uploadError) {
          console.error("Resume upload error:", uploadError);
        } else {
          resumeUrl = filePath;
        }
      }

      // 3. Create Application Record
      const { error: insertError } = await supabase
        .from("instructor_applications")
        .insert({
          user_id: userId,
          full_name: fullName,
          email,
          area_of_expertise:
            areaOfExpertise === "Other" ? customExpertise : areaOfExpertise,
          custom_expertise:
            areaOfExpertise === "Other" ? customExpertise : null,
          experience,
          resume_url: resumeUrl,
        });

      if (insertError) {
        console.error("Application insert error:", insertError);
        // We don't rollback user creation here for simplicity, but in prod we might want to.
      }

      res.json({
        message: "Instructor application submitted successfully",
        user: authData.user,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

app.get("/api/instructor/courses", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const authClient = getAuthClient(token);
    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await authClient
      .from("courses")
      .select("*")
      .eq("instructor_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generic Course Sub-resources (Topics, Videos, Resources, etc)
const createCourseResourceRoutes = (resourceName, tableName) => {
  app.get(`/api/courses/:courseId/${resourceName}`, async (req, res) => {
    const { courseId } = req.params;
    try {
      const { data, error } = await supabase // Public read or use authClient if private
        .from(tableName)
        .select("*")
        .eq("course_id", courseId)
        // Try ordering by common fields, ignore if not present in specific table logic for now
        .order(
          tableName === "course_timeline"
            ? "scheduled_date"
            : tableName === "course_announcements"
              ? "created_at"
              : "order_index",
          { ascending: tableName !== "course_announcements" },
        );

      if (error) {
        if (error.code === "PGRST205") {
          return res.json([]);
        }
        throw error;
      }
      res.json(data);
    } catch (err) {
      if (err.code !== "PGRST205") {
        res.status(500).json({ error: err.message });
      } else {
        res.json([]);
      }
    }
  });

  app.post(`/api/courses/:courseId/${resourceName}`, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });
    try {
      const authClient = getAuthClient(token);
      const { data, error } = await authClient
        .from(tableName)
        .insert(req.body)
        .select()
        .single();
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add PUT/DELETE similarly if needed, for brevity adding DELETE
  app.delete(`/api/${resourceName}/:id`, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });
    const { id } = req.params;
    try {
      const authClient = getAuthClient(token);
      const { error } = await authClient.from(tableName).delete().eq("id", id);
      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add PUT
  app.put(`/api/${resourceName}/:id`, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });
    const { id } = req.params;
    try {
      const authClient = getAuthClient(token);
      const { data, error } = await authClient
        .from(tableName)
        .update(req.body)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

createCourseResourceRoutes("topics", "course_topics");
createCourseResourceRoutes("videos", "course_videos");
createCourseResourceRoutes("resources", "course_resources");
createCourseResourceRoutes("timeline", "course_timeline");
createCourseResourceRoutes("announcements", "course_announcements");

// Chat API Routes (Example)
app.get("/api/chat/rooms/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select(
        `
        *,
        participants:chat_participants!inner(user_id)
      `,
      )
      .eq("participants.user_id", userId);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generic CRUD Routes for legitimate tables
const ALLOWED_TABLES = [
  "exams",
  "question_bank",
  "leaderboard",
  "guest_credentials",
  "mock_test_configs",
  "student_exam_results",
  "profiles",
  "user_roles",
  "courses",
  "security_events",
  "system_logs",
  "instructor_applications",
  "exam_schedules",
  "exam_rules",
  "instructor_progress",
  "course_topics",
  "mock_test_assignments",
  "leaderboard_audit",
  "course_enrollments",
  "live_exams",
  "live_exam_attempts",
  "announcements",
  "attendance",
  "suspended_users",
];

// ═══════════════════════════════════════════════════════════════════════════
// ATTENDANCE & SUSPENSION LOGIC
// ═══════════════════════════════════════════════════════════════════════════

// Specialized route to log daily attendance
app.post("/api/attendance/log", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const authClient = getAuthClient(token);
    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const today = new Date().toISOString().split("T")[0];

    // Check if already logged for today
    const { data: existing } = await authClient
      .from("attendance")
      .select("id")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    if (existing) {
      return res.json({
        message: "Attendance already logged for today",
        alreadyLogged: true,
      });
    }

    // Log new attendance
    const { data, error } = await authClient
      .from("attendance")
      .insert({
        user_id: user.id,
        date: today,
        status: "present",
        role: req.body.role || "student",
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    // If table doesn't exist, we fallback but don't crash
    if (err.code === "PGRST205")
      return res.json({ status: "skipped", reason: "Table not ready" });
    res.status(500).json({ error: err.message });
  }
});

// Specialized route to check suspension
app.get("/api/attendance/check-suspension/:userId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("suspended_users")
      .select("*")
      .eq("user_id", req.params.userId)
      .single();

    if (error && error.code !== "PGRST116") {
      if (error.code === "PGRST205") return res.json({ suspended: false });
      throw error;
    }

    res.json({ suspended: !!data, details: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/data/:table", async (req, res) => {
  const { table } = req.params;
  if (!ALLOWED_TABLES.includes(table))
    return res.status(403).json({ error: "Access denied to table" });

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const authClient = getAuthClient(token);
    let query = authClient.from(table).select("*");

    const { sort, order, limit } = req.query;
    if (sort) {
      query = query.order(sort, { ascending: order === "asc" });
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;
    if (error) {
      if (error.code === "PGRST205") {
        console.warn(
          `[Supabase] Table not found: ${table}. Return empty array.`,
        );
        return res.json([]);
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    console.error(`GET data/${table} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Global Error Handler for PayloadTooLarge and other middleware errors
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error:
        "Request entity too large. Please reduce the size of your data or upload images via the dedicated endpoint.",
    });
  }
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.post("/api/data/:table", async (req, res) => {
  const { table } = req.params;
  if (!ALLOWED_TABLES.includes(table))
    return res.status(403).json({ error: "Access denied to table" });

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const authClient = getAuthClient(token);
    const isArray = Array.isArray(req.body);

    let query = authClient.from(table).insert(req.body).select();

    // Only use .single() if we are inserting a single object
    if (!isArray) {
      query = query.single();
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(`POST data/${table} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/data/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  if (!ALLOWED_TABLES.includes(table))
    return res.status(403).json({ error: "Access denied to table" });

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const authClient = getAuthClient(token);
    const { data, error } = await authClient
      .from(table)
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/data/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  if (!ALLOWED_TABLES.includes(table))
    return res.status(403).json({ error: "Access denied to table" });

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const authClient = getAuthClient(token);
    const { error } = await authClient.from(table).delete().eq("id", id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/rpc/:function", async (req, res) => {
  const { function: rpcFunction } = req.params;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const authClient = getAuthClient(token);
    const { data, error } = await authClient.rpc(rpcFunction, req.body);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
