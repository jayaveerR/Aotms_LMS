const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Course } = require('./models/Course');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

const seedCourses = async () => {
    try {
        // Read JSON file
        const jsonPath = path.join(__dirname, 'Aotms.courses.json');
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

        console.log(`Found ${jsonData.length} courses to process.`);

        // Clear existing courses (Optional, but safer for re-runs)
        // await Course.deleteMany({});
        // console.log('Cleared existing courses.');

        let count = 0;
        for (const item of jsonData) {
            // Parse fields
            const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            const originalPrice = item.originalPrice ? parseFloat(item.originalPrice.replace(/[^\d.]/g, '')) : 0;
            
            // Construct Course Object
            const courseData = {
                title: item.title,
                slug: item.slug,
                description: item.description || `Comprehensive course on ${item.title}`,
                thumbnail_url: item.image,
                category: item.category,
                price: price,
                original_price: originalPrice,
                status: 'published', // Make them visible immediately
                level: item.level || 'Beginner',
                duration: item.duration,
                rating: item.rating,
                theme_color: item.themeColor,
                is_active: true
            };

            // Use updateOne with upsert to avoid duplicates based on slug
            await Course.updateOne(
                { slug: item.slug },
                { $set: courseData },
                { upsert: true }
            );
            count++;
        }

        console.log(`Successfully seeded/updated ${count} courses.`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedCourses();
