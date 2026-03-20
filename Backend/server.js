require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { generateUploadUrl, generateViewUrl, deleteObject } = require('./utils/s3');
const axios = require('axios');
const connectDB = require('./config/db');

// Import Mongoose Models
const { User, Profile, UserRole, OTP, VerifiedEmail, InstructorApplication, GuestCredential } = require('./models/User');
const { Course, Enrollment, Topic, Module, Video, Announcement, Timeline, Resource, InstructorProgress } = require('./models/Course');
const { Exam, QuestionBank, ExamSchedule, StudentExamAccess, ExamResult, MockPaper, ExamRule, MockTestConfig } = require('./models/Exam');
const { Assignment, Submission, Playlist, LiveClass } = require('./models/Content');
const { SystemLog, SecurityEvent, LeaderboardStat } = require('./models/System');

// Map table names to Models for generic routes
const MODEL_MAP = {
    'profiles': Profile,
    'user_roles': UserRole,
    'courses': Course,
    'course_topics': Topic,
    'course_modules': Module,
    'course_videos': Video,
    'course_resources': Resource,
    'course_timeline': Timeline,
    'course_announcements': Announcement,
    'course_enrollments': Enrollment,
    'exams': Exam,
    'question_bank': QuestionBank,
    'exam_schedules': ExamSchedule,
    'student_exam_access': StudentExamAccess,
    'exam_results': ExamResult,
    'student_exam_results': ExamResult, // Alias
    'mock_papers': MockPaper,
    'mock_test_configs': MockTestConfig,
    'exam_rules': ExamRule,
    'assignments': Assignment,
    'assignment_submissions': Submission,
    'playlists': Playlist,
    'live_classes': LiveClass,
    'system_logs': SystemLog,
    'security_events': SecurityEvent,
    'leaderboard_stats': LeaderboardStat,
    'leaderboard': LeaderboardStat, // Alias
    'instructor_applications': InstructorApplication,
    'instructor_progress': InstructorProgress,
    'guest_credentials': GuestCredential
};

const ALLOWED_TABLES = Object.keys(MODEL_MAP);
const ADMIN_ONLY_TABLES = ['user_roles', 'system_logs', 'security_events'];

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_me';
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Zoom Credentials
const ZOOM_ACCOUNT_ID = process.env.ZOOM_S2S_ACCOUNT_ID || process.env.ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_S2S_CLIENT_ID || process.env.CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_S2S_CLIENT_SECRET || process.env.CLIENT_SECRET;

// Zoom Helper: Get Access Token (Server-to-Server OAuth)
const getZoomAccessToken = async () => {
    try {
        const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');
        const response = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'account_credentials',
                account_id: ZOOM_ACCOUNT_ID
            },
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Zoom access token:', error.response?.data || error.message);
        throw new Error('Failed to connect to Zoom');
    }
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * Helper to standardise error responses
 */
const handleError = (res, err, context = '') => {
    console.error(`[Error ${context}]`, err);
    res.status(500).json({ error: err.message || 'Internal Server Error', context });
};

// --- Authentication Middleware ---

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id, // Use Mongoose ObjectId
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Auth token required' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid or expired token' });
        req.user = decoded;
        next();
    });
};

// Role Caching (Simple In-Memory for now, similar to previous version)
const roleCache = new Map();
const ROLE_CACHE_TTL = 30 * 1000;

const getUserRole = async (userId) => {
    if (roleCache.has(userId)) {
        const { role, timestamp } = roleCache.get(userId);
        if (Date.now() - timestamp < ROLE_CACHE_TTL) return role;
    }

    try {
        const roleDoc = await UserRole.findOne({ user_id: userId });
        const role = roleDoc ? roleDoc.role : null;
        if (role) roleCache.set(userId, { role, timestamp: Date.now() });
        return role;
    } catch (error) {
        console.error(`[Auth] Failed to fetch role for ${userId}:`, error);
        return null;
    }
};

const requireRole = (allowedRoles) => async (req, res, next) => {
    try {
        const role = await getUserRole(req.user.id);
        if (!role) return res.status(401).json({ error: 'User role not found' });
        if (!allowedRoles.includes(role)) return res.status(403).json({ error: 'Access denied' });
        next();
    } catch (err) {
        handleError(res, err, 'requireRole');
    }
};

const requireAdmin = requireRole(['admin']);
const requireManager = requireRole(['admin', 'manager']);
const requireAdminOrManager = requireRole(['admin', 'manager']);
const requireInstructor = requireRole(['admin', 'manager', 'instructor']);

// Zoom Routes
app.post('/api/zoom/meetings', authenticateToken, requireInstructor, async (req, res) => {
    const { topic, startTime, duration, agenda } = req.body;
    try {
        const accessToken = await getZoomAccessToken();
        const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
            topic,
            type: 2, // Scheduled meeting
            start_time: startTime,
            duration,
            agenda,
            settings: {
                host_video: true,
                participant_video: false,
                join_before_host: false,
                mute_upon_entry: true,
                waiting_room: true,
                auto_recording: 'cloud'
            }
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            meetingId: response.data.id,
            joinUrl: response.data.join_url,
            startUrl: response.data.start_url,
            password: response.data.password
        });
    } catch (err) {
        handleError(res, err, 'create-zoom-meeting');
    }
});

app.post('/api/zoom/signature', authenticateToken, async (req, res) => {
    // Basic signature generation for Meeting SDK (if needed by frontend)
    // Note: For S2S, we usually use the start_url (ZAK token included) for instructors
    // and just the meeting ID/password for students.
    // If the frontend needs a signature for the Web SDK, it requires a different set of credentials (SDK Key/Secret).
    // Assuming the frontend uses the generic Join URL or Start URL for now.
    res.json({ message: 'Signature endpoint placeholder - use meeting URLs' }); 
});


// --- Auth Routes ---

app.post('/api/auth/send-otp', async (req, res) => {
    const { email, full_name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        await OTP.findOneAndUpdate(
            { email },
            { otp, full_name, expires_at: expiresAt },
            { upsert: true, new: true }
        );

        console.log(`[AUTH-OTP] OTP for ${email}: ${otp}`);

        // Trigger n8n webhook (Legacy support)
        if (process.env.N8N_EMAIL_WEBHOOK_URL) {
            axios.post(process.env.N8N_EMAIL_WEBHOOK_URL, {
                event: 'otp_request', email, otp, full_name, timestamp: new Date()
            }).catch(e => console.error('n8n OTP trigger failed:', e.message));
        }

        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        handleError(res, err, 'send-otp');
    }
});

app.post('/api/auth/resend-otp', async (req, res) => {
    // Reuse logic, maybe separate if needed differently
    const { email, full_name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    try {
         const otp = Math.floor(100000 + Math.random() * 900000).toString();
         const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
         
         await OTP.findOneAndUpdate(
            { email },
            { otp, full_name, expires_at: expiresAt },
            { upsert: true, new: true }
        );
        console.log(`[AUTH-OTP] Resent OTP for ${email}: ${otp}`);

        if (process.env.N8N_EMAIL_WEBHOOK_URL) {
            axios.post(process.env.N8N_EMAIL_WEBHOOK_URL, {
                event: 'otp_request', email, otp, full_name, timestamp: new Date()
            }).catch(e => console.error('n8n OTP trigger failed:', e.message));
        }

        res.json({ message: 'OTP resent successfully' });
    } catch (err) {
        handleError(res, err, 'resend-otp');
    }
});

app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    try {
        const otpDoc = await OTP.findOne({ email });
        if (!otpDoc) return res.status(400).json({ error: 'No OTP found' });
        if (otpDoc.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
        if (new Date() > otpDoc.expires_at) return res.status(400).json({ error: 'OTP expired' });

        await VerifiedEmail.findOneAndUpdate(
            { email },
            { verified: true, verified_at: new Date() },
            { upsert: true }
        );

        res.json({ success: true, message: 'OTP verified' });
    } catch (err) {
        handleError(res, err, 'verify-otp');
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/refresh', async (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ error: 'Refresh token required' });
    // In a real app, verify refresh_token in DB. For now, we just mock success if token exists.
    res.json({ 
        session: { 
            access_token: 'new_mock_token_' + Date.now(),
            refresh_token: 'new_mock_refresh_' + Date.now()
        } 
    });
});

app.post('/api/auth/signup', async (req, res) => {
    const { email, password, fullName, phone } = req.body;
    try {
        // ... (verification check)
        const verifiedDoc = await VerifiedEmail.findOne({ email });
        
        // ... (existing check)
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`;

        // Create User
        const user = await User.create({
            email,
            password_hash: passwordHash,
            full_name: fullName,
            avatar_url: avatarUrl,
            phone: phone // Store phone in User model too
        });

        // Create Profile
        await Profile.create({
            user_id: user._id,
            email,
            full_name: fullName,
            avatar_url: avatarUrl,
            mobile_number: phone, // Store as mobile_number in Profile
            approval_status: 'pending'
        });

        // Create Role
        await UserRole.create({
            user_id: user._id,
            role: 'student'
        });

        const token = generateToken(user);
        res.json({
            user: { id: user._id, email, full_name: fullName },
            session: { access_token: token, expires_in: 604800 }
        });

    } catch (err) {
        handleError(res, err, 'signup');
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const [profile, roleDoc] = await Promise.all([
            Profile.findOne({ user_id: user._id }),
            UserRole.findOne({ user_id: user._id })
        ]);

        const token = generateToken(user);

        res.json({
            user: {
                id: user._id,
                email,
                full_name: user.full_name,
                role: roleDoc?.role || 'student',
                approval_status: profile?.approval_status || 'pending'
            },
            session: { access_token: token, expires_in: 604800 }
        });

    } catch (err) {
        handleError(res, err, 'login');
    }
});

// --- Admin/User Management ---

app.put('/api/admin/update-user-role', authenticateToken, requireAdmin, async (req, res) => {
    const { userId, role } = req.body;
    if (!userId || !role) return res.status(400).json({ error: 'Missing userId or role' });

    try {
        await UserRole.findOneAndUpdate(
            { user_id: userId },
            { role, updated_at: new Date() },
            { upsert: true }
        );

        if (['admin', 'manager'].includes(role)) {
            await Profile.findOneAndUpdate({ user_id: userId }, { approval_status: 'approved' });
        }

        res.json({ message: 'User role updated', userId, role });
    } catch (err) {
        handleError(res, err, 'update-role');
    }
});

app.put('/api/admin/update-user-status', authenticateToken, requireAdmin, async (req, res) => {
    const { userId, status } = req.body;
    if (!userId || !status) return res.status(400).json({ error: 'Missing userId or status' });

    try {
        await Profile.findOneAndUpdate(
            { user_id: userId },
            { approval_status: status, updated_at: new Date() },
            { new: true }
        );
        res.json({ message: `User status updated to ${status}` });
    } catch (err) {
        handleError(res, err, 'update-user-status');
    }
});

app.post('/api/admin/send-approval-email', authenticateToken, requireAdmin, async (req, res) => {
    const { userId } = req.body;
    try {
        const profile = await Profile.findOne({ user_id: userId });
        if (!profile) return res.status(404).json({ error: 'User not found' });

        if (process.env.N8N_EMAIL_WEBHOOK_URL) {
            axios.post(process.env.N8N_EMAIL_WEBHOOK_URL, {
                event: 'user_approved',
                email: profile.email,
                full_name: profile.full_name,
                user_id: userId,
                timestamp: new Date()
            }).catch(e => console.error('n8n trigger failed', e.message));
        }
        res.json({ message: 'Approval email sent' });
    } catch (err) {
        handleError(res, err, 'send-approval-email');
    }
});

app.post('/api/rpc/log_admin_action', authenticateToken, requireAdminOrManager, async (req, res) => {
    const { _module, _action, _details } = req.body;
    try {
        await SystemLog.create({
            log_type: 'audit',
            module: _module,
            action: _action,
            details: _details,
            user_id: req.user.id
        });
        res.json({ success: true });
    } catch (err) {
        handleError(res, err, 'log-admin-action');
    }
});

app.put('/api/admin/approve-course', authenticateToken, requireAdmin, async (req, res) => {
    const { courseId, status, rejectionReason } = req.body;
    if (!courseId || !status) return res.status(400).json({ error: 'Missing courseId or status' });

    try {
        const updateData = {
            status,
            reviewed_at: new Date(),
            reviewed_by: req.user.id,
            updated_at: new Date()
        };
        if (rejectionReason) updateData.rejection_reason = rejectionReason;

        const course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        
        // Log action
        await SystemLog.create({
            log_type: 'audit',
            module: 'Course',
            action: `Course ${status}`,
            details: { course_id: courseId, status },
            user_id: req.user.id
        });

        res.json({ message: `Course ${status}`, course });
    } catch (err) {
        handleError(res, err, 'approve-course');
    }
});

app.get('/api/admin/courses-with-instructors', authenticateToken, requireAdminOrManager, async (req, res) => {
    try {
        const courses = await Course.find()
            .sort({ created_at: -1 })
            .lean();

        // Get all unique instructor IDs
        const instructorIds = [...new Set(courses.map(c => c.instructor_id).filter(id => id))];

        // Fetch profiles for these instructors
        const profiles = await Profile.find({ user_id: { $in: instructorIds } }).lean();
        const profileMap = profiles.reduce((acc, p) => {
            acc[p.user_id] = p;
            return acc;
        }, {});

        // Map courses to include instructor details
        const data = courses.map(course => {
            const instructor = profileMap[course.instructor_id] || {};
            return {
                ...course,
                id: course._id, // Ensure id is present for frontend
                instructor_name: instructor.full_name || 'Unknown',
                instructor_email: instructor.email || '',
                instructor_avatar: instructor.avatar_url || ''
            };
        });

        res.json(data);
    } catch (err) {
        handleError(res, err, 'admin-courses-with-instructors');
    }
});

app.get('/api/admin/course-enrollments/:courseId', authenticateToken, requireAdminOrManager, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ course_id: req.params.courseId })
            .populate('user_id')
            .lean();

        // Get profiles for these users to get mobile numbers
        const userIds = enrollments.map(e => e.user_id?._id).filter(id => id);
        const [profiles, roles] = await Promise.all([
            Profile.find({ user_id: { $in: userIds } }).lean(),
            UserRole.find({ user_id: { $in: userIds } }).lean()
        ]);

        const profileMap = profiles.reduce((acc, p) => { acc[p.user_id] = p; return acc; }, {});
        const roleMap = roles.reduce((acc, r) => { acc[r.user_id] = r.role; return acc; }, {});

        const data = enrollments.map(e => {
            const user = e.user_id || {};
            const profile = profileMap[user._id] || {};
            return {
                id: e._id,
                student_id: user._id,
                full_name: user.full_name || profile.full_name,
                email: user.email || profile.email,
                avatar_url: user.avatar_url || profile.avatar_url,
                mobile_number: profile.mobile_number || 'N/A',
                role: roleMap[user._id] || 'student',
                status: e.status,
                progress: e.progress_percentage || 0,
                enrolled_at: e.enrolled_at
            };
        });

        res.json(data);
    } catch (err) {
        handleError(res, err, 'admin-course-enrollments');
    }
});

app.get('/api/admin/instructors', authenticateToken, requireAdminOrManager, async (req, res) => {
    try {
        const roles = await UserRole.find({ role: 'instructor' });
        const userIds = roles.map(r => r.user_id);
        const profiles = await Profile.find({ user_id: { $in: userIds } });

        const data = profiles.map(p => ({
            user_id: p.user_id,
            full_name: p.full_name,
            email: p.email,
            mobile_number: p.mobile_number,
            phone: p.phone,
            role: 'instructor',
            created_at: p.created_at,
            avatar_url: p.avatar_url
        }));
        
        res.json(data);
    } catch (err) {
        handleError(res, err, 'get-admin-instructors');
    }
});

app.post('/api/admin/assign-course', authenticateToken, requireAdminOrManager, async (req, res) => {
    const { courseId, instructorId } = req.body;
    if (!courseId) return res.status(400).json({ error: 'Missing courseId' });

    try {
        const updateData = {
            instructor_id: instructorId || null,
            updated_at: new Date()
        };

        const course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        
        // Log action
        await SystemLog.create({
            log_type: 'audit',
            module: 'Course',
            action: instructorId ? 'Course Assigned' : 'Course Unassigned',
            details: { course_id: courseId, instructor_id: instructorId },
            user_id: req.user.id
        });

        res.json({ message: 'Course assignment updated', course });
    } catch (err) {
        handleError(res, err, 'assign-course');
    }
});

app.get('/api/admin/lookup-user/:userId', authenticateToken, requireAdminOrManager, async (req, res) => {
    const { userId } = req.params;
    try {
        let user = await User.findById(userId);
        if (!user) {
            const profile = await Profile.findById(userId);
            if (profile) user = await User.findById(profile.user_id);
        }

        if (!user) return res.status(404).json({ error: 'User not found' });

        const profile = await Profile.findOne({ user_id: user._id });
        const userRole = await UserRole.findOne({ user_id: user._id });

        res.json({
            user_id: user._id,
            full_name: user.full_name || profile?.full_name,
            email: user.email || profile?.email,
            avatar_url: user.avatar_url || profile?.avatar_url,
            role: userRole?.role || 'user'
        });
    } catch (err) {
        handleError(res, err, 'lookup-user-admin');
    }
});

app.delete('/api/admin/delete-user/:userId', authenticateToken, requireAdmin, async (req, res) => {
    const { userId } = req.params;
    try {
        // Unassign courses (set to draft so they don't appear without instructor)
        await Course.updateMany(
            { instructor_id: userId },
            { $unset: { instructor_id: "" }, status: 'draft' }
        );
        
        // Delete User Data
        await Promise.all([
            User.findByIdAndDelete(userId),
            Profile.findOneAndDelete({ user_id: userId }),
            UserRole.findOneAndDelete({ user_id: userId })
        ]);

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        handleError(res, err, 'delete-user');
    }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const [role, profile] = await Promise.all([
            getUserRole(req.user.id),
            Profile.findOne({ user_id: req.user.id })
        ]);

        res.json({
            profile,
            user: {
                id: req.user.id,
                email: req.user.email,
                role: role || 'student',
                approval_status: profile?.approval_status || 'pending'
            }
        });
    } catch (err) {
        handleError(res, err, 'get-profile');
    }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        await Profile.findOneAndUpdate(
            { user_id: req.user.id },
            { ...req.body, updated_at: new Date() },
            { new: true }
        );
        res.json({ message: 'Profile updated' });
    } catch (err) {
        handleError(res, err, 'update-profile');
    }
});

// --- Instructor Routes ---

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/instructor/register', upload.single('resume'), async (req, res) => {
    const { email, password, fullName, areaOfExpertise, customExpertise, experience } = req.body;
    try {
        // Reuse Signup Logic (Partial)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email, password_hash: passwordHash, full_name: fullName });
        }

        // Create Application
        await InstructorApplication.create({
            user_id: user._id,
            full_name: fullName,
            email,
            area_of_expertise: areaOfExpertise === 'Other' ? customExpertise : areaOfExpertise,
            custom_expertise: areaOfExpertise === 'Other' ? customExpertise : null,
            experience,
            status: 'pending'
        });

        // Ensure Profile
        await Profile.findOneAndUpdate(
            { user_id: user._id },
            { user_id: user._id, email, full_name: fullName, approval_status: 'pending' },
            { upsert: true }
        );

        // Set Role
        await UserRole.findOneAndUpdate(
            { user_id: user._id },
            { role: 'instructor' },
            { upsert: true }
        );

        res.json({ message: 'Instructor application submitted', userId: user._id });

    } catch (err) {
        handleError(res, err, 'instructor-register');
    }
});

app.post('/api/instructor/choose-course', authenticateToken, requireInstructor, async (req, res) => {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ error: 'courseId is required' });

    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        
        if (course.instructor_id && course.instructor_id.toString() !== req.user.id) {
            return res.status(400).json({ error: 'Course already assigned to another instructor' });
        }

        course.instructor_id = req.user.id;
        course.status = 'pending';
        course.updated_at = new Date();
        await course.save();

        res.json({ message: 'Course requested successfully' });
    } catch (err) {
        handleError(res, err, 'choose-course');
    }
});

app.get('/api/instructor/courses', authenticateToken, requireInstructor, async (req, res) => {
    try {
        let query = { instructor_id: req.user.id };
        if (req.user.role === 'admin' || req.user.role === 'manager') {
            query = {}; // Managers and admins can see all courses
        }
        const courses = await Course.find(query);
        res.json(courses);
    } catch (err) {
        handleError(res, err, 'instructor-courses');
    }
});

// --- Enrollment & Course Logic ---

app.get('/api/courses/enrollments', authenticateToken, requireAdminOrManager, async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('user_id', 'full_name email') // Populate user details
            .populate('course_id', 'title price')   // Populate course details
            .sort({ enrolled_at: -1 });

        // Transform to match frontend expectation
        const data = enrollments.map(e => ({
            id: e._id,
            user_id: e.user_id?._id,
            course_id: e.course_id?._id,
            status: e.status,
            enrollment_date: e.enrolled_at,
            profile: {
                full_name: e.user_id?.full_name,
                email: e.user_id?.email
            },
            course: {
                title: e.course_id?.title,
                price: e.course_id?.price
            }
        }));

        res.json(data);
    } catch (err) {
        handleError(res, err, 'get-enrollments-admin');
    }
});

app.post('/api/courses/enroll', authenticateToken, async (req, res) => {
    const { course_id, courseId } = req.body;
    const finalCourseId = course_id || courseId;
    if (!finalCourseId) return res.status(400).json({ error: 'Course ID required' });

    try {
        const course = await Course.findById(finalCourseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        await Enrollment.findOneAndUpdate(
            { user_id: req.user.id, course_id: finalCourseId },
            { 
                status: 'active', // Changed from 'pending' to 'active' for immediate access
                enrolled_at: new Date(),
                progress_percentage: 0 
            },
            { upsert: true, new: true }
        );

        res.json({ message: 'Enrollment successful! You can now start learning.' });
    } catch (err) {
        handleError(res, err, 'enroll-course');
    }
});

app.get('/api/courses/enrollment/:courseId', authenticateToken, async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ 
            user_id: req.user.id, 
            course_id: req.params.courseId 
        });
        res.json({ enrolled: !!enrollment });
    } catch (err) {
        handleError(res, err, 'check-enrollment');
    }
});

app.get('/api/student/my-courses', authenticateToken, async (req, res) => {
    try {
        // Fetch enrollments and populate nested course details in one go
        const enrollments = await Enrollment.find({ user_id: req.user.id })
            .populate('course_id')
            .sort({ enrolled_at: -1 })
            .lean();

        // Transform into a flat structure for easier frontend consumption
        const data = enrollments.map(e => {
            const course = e.course_id || {};
            return {
                id: course._id,
                enrollmentId: e._id,
                title: course.title || 'Untitled Course',
                description: course.description || '',
                category: course.category || 'General',
                thumbnail_url: course.thumbnail_url || '',
                status: course.status || 'published',
                level: course.level || 'Beginner',
                duration: course.duration || '0h',
                instructor_id: course.instructor_id,
                enrollmentStatus: e.status, // active, pending, rejected
                progress: e.progress_percentage || 0,
                enrolled_at: e.enrolled_at,
                // Virtual/Helper fields for UI badges
                is_active: course.is_active !== false
            };
        });

        res.json(data);
    } catch (err) {
        handleError(res, err, 'student-my-courses');
    }
});

app.put('/api/courses/enrollment-status', authenticateToken, requireAdmin, async (req, res) => {
    const { enrollmentId, status } = req.body;
    try {
        await Enrollment.findByIdAndUpdate(enrollmentId, { status, updated_at: new Date() });
        res.json({ success: true });
    } catch (err) {
        handleError(res, err, 'update-enrollment-status');
    }
});

// --- Student Exam Routes ---

app.get('/api/student/accessible-exams', authenticateToken, async (req, res) => {
    try {
        const accessList = await StudentExamAccess.find({ student_id: req.user.id })
            .populate('exam_id')
            .populate('mock_paper_id');
        
        // Transform for frontend consistency
        const data = accessList.map(access => ({
            id: access._id,
            access_type: access.access_type,
            granted_at: access.granted_at,
            exam_id: access.exam_id?._id,
            mock_paper_id: access.mock_paper_id?._id,
            exam_schedules: access.exam_id ? {
                title: access.exam_id.title,
                duration_minutes: access.exam_id.duration_minutes,
                total_marks: access.exam_id.total_marks,
                passing_marks: access.exam_id.passing_marks
            } : null,
            mock_papers: access.mock_paper_id ? {
                title: access.mock_paper_id.title,
                description: access.mock_paper_id.description,
                question_count: access.mock_paper_id.questions?.length || 0
            } : null
        }));

        res.json(data);
    } catch (err) {
        handleError(res, err, 'student-accessible-exams');
    }
});

// --- Manager Routes ---

app.get('/api/manager/lookup-student/:studentId', authenticateToken, requireAdminOrManager, async (req, res) => {
    const { studentId } = req.params;
    try {
        // Try to find by User ID
        let user = await User.findById(studentId);
        if (!user) {
            // Fallback: Try to find by Profile ID
            const profile = await Profile.findById(studentId);
            if (profile) {
                user = await User.findById(profile.user_id);
            }
        }

        if (!user) return res.status(404).json({ error: 'Student not found' });

        const profile = await Profile.findOne({ user_id: user._id });
        
        res.json({
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            avatar_url: user.avatar_url,
            role: 'student', // Default assumption unless role checked
            profile: profile
        });
    } catch (err) {
        handleError(res, err, 'lookup-student');
    }
});

app.post('/api/manager/grant-exam-access', authenticateToken, requireAdminOrManager, async (req, res) => {
    const { studentId, examId, mockPaperId } = req.body;
    
    if (!studentId || (!examId && !mockPaperId)) {
        return res.status(400).json({ error: 'Student ID and either Exam ID or Mock Paper ID required' });
    }

    try {
        const accessType = examId ? 'exam' : 'mock';
        
        await StudentExamAccess.findOneAndUpdate(
            { 
                student_id: studentId, 
                exam_id: examId || null, 
                mock_paper_id: mockPaperId || null 
            },
            {
                access_type: accessType,
                assigned_by: req.user.id,
                granted_at: new Date()
            },
            { upsert: true, new: true }
        );

        res.json({ message: 'Access granted successfully' });
    } catch (err) {
        handleError(res, err, 'grant-exam-access');
    }
});

app.get('/api/manager/approved-question-banks', authenticateToken, requireAdminOrManager, async (req, res) => {
    try {
        const questions = await QuestionBank.find({ approval_status: 'approved' })
            .sort({ created_at: -1 });
        res.json(questions);
    } catch (err) {
        handleError(res, err, 'get-approved-questions');
    }
});

app.post('/api/manager/grant-question-bank-access', authenticateToken, requireAdminOrManager, async (req, res) => {
    const { studentId, topic } = req.body;
    if (!studentId || !topic) return res.status(400).json({ error: 'Student ID and Topic required' });

    try {
        await StudentExamAccess.findOneAndUpdate(
            { student_id: studentId, question_bank_topic: topic },
            {
                access_type: 'question_bank',
                assigned_by: req.user.id,
                granted_at: new Date()
            },
            { upsert: true, new: true }
        );
        res.json({ message: `Access granted for topic: ${topic}` });
    } catch (err) {
        handleError(res, err, 'grant-qb-access');
    }
});

// --- Generic Course Resources ---

const createCourseResourceRoutes = (resourceName, Model) => {
    app.get(`/api/courses/:courseId/${resourceName}`, async (req, res) => {
        try {
            const filter = { course_id: req.params.courseId };
            
            // Support basic filtering (e.g., ?module_id=eq.123)
            Object.keys(req.query).forEach(key => {
                if (req.query[key].startsWith('eq.')) {
                    filter[key] = req.query[key].slice(3);
                } else {
                    filter[key] = req.query[key];
                }
            });

            const data = await Model.find(filter).sort({ order_index: 1, created_at: -1 });
            res.json(data);
        } catch (err) {
            handleError(res, err, `get-${resourceName}`);
        }
    });

    app.post(`/api/courses/:courseId/${resourceName}`, authenticateToken, requireInstructor, async (req, res) => {
        try {
            const item = await Model.create({ ...req.body, course_id: req.params.courseId });
            res.json(item);
        } catch (err) {
            handleError(res, err, `create-${resourceName}`);
        }
    });
};

createCourseResourceRoutes('topics', Topic);
createCourseResourceRoutes('modules', Module);
createCourseResourceRoutes('videos', Video);
createCourseResourceRoutes('resources', Resource);
createCourseResourceRoutes('timeline', Timeline);
createCourseResourceRoutes('announcements', Announcement);

app.get('/api/courses/:courseId/roster', authenticateToken, requireInstructor, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ course_id: req.params.courseId })
            .populate('user_id', 'full_name email phone avatar_url')
            .lean();
        
        // Fetch profiles separately if needed, or join if possible. 
        // For now, let's just get the basic user info and use the Profile model if mobile_number is there.
        const userIds = enrollments.map(e => e.user_id?._id).filter(id => id);
        const profiles = await Profile.find({ user_id: { $in: userIds } }).lean();
        const profileMap = profiles.reduce((acc, p) => {
            acc[p.user_id.toString()] = p;
            return acc;
        }, {});

        const roster = enrollments.map(e => {
            const userIdStr = e.user_id?._id?.toString();
            const profile = userIdStr ? profileMap[userIdStr] : null;

            return {
                id: e.user_id?._id,
                full_name: e.user_id?.full_name || profile?.full_name,
                email: e.user_id?.email || profile?.email,
                mobile_number: profile?.mobile_number || e.user_id?.phone,
                avatar_url: e.user_id?.avatar_url || profile?.avatar_url,
                role: 'student',
                status: e.status,
                enrolled_at: e.enrolled_at,
                progress: e.progress_percentage || 0
            };
        });
        
        res.json(roster);
    } catch (err) {
        handleError(res, err, 'get-course-roster');
    }
});


// --- Generic Data Proxy (The "Supabase" style API) ---

app.get('/api/data/:table', authenticateToken, async (req, res) => {
    const { table } = req.params;
    const Model = MODEL_MAP[table];
    
    if (!Model) return res.status(403).json({ error: 'Invalid table' });

    try {
        let query = {};
        let sort = {};
        let limit = 100;
        let skip = 0;

        // Filter Logic
        for (const [key, value] of Object.entries(req.query)) {
            if (['sort', 'order', 'limit', 'offset', 'select'].includes(key)) continue;

            if (value.toString().startsWith('eq.')) query[key] = value.slice(3);
            else if (value.toString().startsWith('in.')) query[key] = { $in: value.slice(4, -1).split(',') };
            else if (value.toString().startsWith('lt.')) query[key] = { $lt: value.slice(3) };
            else if (value.toString().startsWith('gt.')) query[key] = { $gt: value.slice(3) };
            else query[key] = value; // Default exact match
        }

        // Authorization Scoping
        const role = await getUserRole(req.user.id);
        if (!['admin', 'manager'].includes(role)) {
            if (['course_enrollments', 'student_exam_access', 'exam_results'].includes(table)) {
                query['user_id'] = req.user.id;
            }
        }

        // Sort & Pagination
        if (req.query.sort) {
            sort[req.query.sort] = req.query.order === 'desc' ? -1 : 1;
        }
        if (req.query.limit) limit = parseInt(req.query.limit);
        if (req.query.offset) skip = parseInt(req.query.offset);

        const data = await Model.find(query).sort(sort).limit(limit).skip(skip);
        res.json(data);

    } catch (err) {
        handleError(res, err, `data-get-${table}`);
    }
});

app.post('/api/data/:table', authenticateToken, async (req, res) => {
    const { table } = req.params;
    const Model = MODEL_MAP[table];
    if (!Model) return res.status(403).json({ error: 'Invalid table' });

    try {
        const item = await Model.create(req.body);
        res.json(item);
    } catch (err) {
        handleError(res, err, `data-create-${table}`);
    }
});

app.put('/api/data/:table/:id', authenticateToken, async (req, res) => {
    const { table, id } = req.params;
    const Model = MODEL_MAP[table];
    if (!Model) return res.status(403).json({ error: 'Invalid table' });

    try {
        const item = await Model.findByIdAndUpdate(id, req.body, { new: true });
        res.json(item);
    } catch (err) {
        handleError(res, err, `data-update-${table}`);
    }
});

app.delete('/api/data/:table/:id', authenticateToken, async (req, res) => {
    const { table, id } = req.params;
    const Model = MODEL_MAP[table];
    if (!Model) return res.status(403).json({ error: 'Invalid table' });

    try {
        await Model.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (err) {
        handleError(res, err, `data-delete-${table}`);
    }
});

// --- Public Course Routes ---

app.get('/api/public/courses', async (req, res) => {
    try {
        const query = { status: 'published' }; // Assuming 'published' status logic
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }
        const courses = await Course.find(query).limit(50);
        res.json(courses);
    } catch (err) {
        handleError(res, err, 'public-courses');
    }
});

app.get('/api/courses/:id', async (req, res) => {
    try {
        let course;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            course = await Course.findById(req.params.id);
        } else {
             // Fallback for slugs if you use them
             course = await Course.findOne({ slug: req.params.id });
        }
        
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        handleError(res, err, 'get-course-detail');
    }
});

// --- S3 Helper Routes ---

app.post('/api/s3/upload-url', authenticateToken, requireInstructor, async (req, res) => {
    try {
        const { fileName, fileType, folder } = req.body;
        const folderPath = folder ? `${folder}/` : `${req.user.id}/`;
        const uploadFileName = `${folderPath}${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const uploadUrl = await generateUploadUrl(uploadFileName, fileType);
        res.json({ uploadUrl, fileName: uploadFileName });
    } catch (err) {
        handleError(res, err, 's3-upload');
    }
});

app.post('/api/s3/view-url', authenticateToken, async (req, res) => {
    try {
        const viewUrl = await generateViewUrl(req.body.fileName);
        res.json({ viewUrl });
    } catch (err) {
        handleError(res, err, 's3-view');
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port} - MongoDB/Mongoose Version`);
});
