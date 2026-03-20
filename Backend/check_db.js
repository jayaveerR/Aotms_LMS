require('dotenv').config();
const mongoose = require('mongoose');
const { Enrollment, Course, User } = require('./models/Course'); // Start with Course.js exports
// User model is in User.js but Enrollment references it.
// We need to require User model file to register the schema if it's not already registered by Course.js imports?
// Course.js does not require User.js.
const { User: UserModel } = require('./models/User'); // Load User model

const connectDB = require('./config/db');

const check = async () => {
    await connectDB();
    
    console.log("Checking database...");
    
    try {
        const enrollmentCount = await mongoose.model('Enrollment').countDocuments();
        console.log(`Enrollments count: ${enrollmentCount}`);
        
        if (enrollmentCount > 0) {
            const enrollments = await mongoose.model('Enrollment').find()
                .populate('user_id', 'full_name email')
                .populate('course_id', 'title price')
                .limit(2);
            
            console.log("Populated enrollments:", JSON.stringify(enrollments, null, 2));

            const mapped = enrollments.map(e => ({
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
            console.log("Mapped data:", JSON.stringify(mapped, null, 2));
        }

        const userCount = await mongoose.model('User').countDocuments();
        console.log(`Users count: ${userCount}`);

        const courseCount = await mongoose.model('Course').countDocuments();
        console.log(`Courses count: ${courseCount}`);
        
    } catch (err) {
        console.error("Error:", err);
    } finally {
        mongoose.disconnect();
    }
};

check();
