require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { User, Profile, UserRole } = require('./models/User');

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address.');
    console.log('Usage: node makeAdmin.js <email>');
    process.exit(1);
}

const makeAdmin = async () => {
    try {
        await connectDB();
        
        console.log(`Looking up user with email: ${email}...`);
        const user = await User.findOne({ email });

        if (!user) {
            console.error('User not found.');
            process.exit(1);
        }

        console.log(`Found User ID: ${user._id}`);

        // Update Role
        await UserRole.findOneAndUpdate(
            { user_id: user._id },
            { role: 'admin', updated_at: new Date() },
            { upsert: true, new: true }
        );

        // Update Profile
        await Profile.findOneAndUpdate(
            { user_id: user._id },
            { approval_status: 'approved', updated_at: new Date() },
            { upsert: true, new: true }
        );

        console.log(`✅ Success! User ${email} is now an ADMIN.`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

makeAdmin();
