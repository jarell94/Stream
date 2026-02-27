const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Video = require('./models/Video');

// Sample data
const categories = [
  { name: 'Movies', description: 'Feature films and cinema', order: 1 },
  { name: 'TV Shows', description: 'Television series and episodes', order: 2 },
  { name: 'Documentaries', description: 'Non-fiction educational content', order: 3 },
  { name: 'Anime', description: 'Japanese animation', order: 4 },
  { name: 'Kids', description: 'Family-friendly content', order: 5 }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Video.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@stream.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('👤 Created admin user');
    console.log('   Email: admin@stream.com');
    console.log('   Password: admin123');

    // Create regular user
    const regularUser = await User.create({
      username: 'testuser',
      email: 'user@stream.com',
      password: 'user123',
      role: 'user'
    });
    console.log('👤 Created test user');
    console.log('   Email: user@stream.com');
    console.log('   Password: user123');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`📁 Created ${createdCategories.length} categories`);

    // Create sample videos
    const sampleVideos = [
      {
        title: 'Sample Action Movie',
        description: 'An exciting action-packed movie with thrilling sequences and amazing stunts.',
        thumbnail: 'uploads/thumbnails/default.jpg',
        videoUrl: 'uploads/videos/sample.mp4',
        duration: 7200,
        releaseYear: 2024,
        genre: ['Action', 'Thriller'],
        category: createdCategories[0]._id,
        director: 'John Doe',
        rating: 'PG-13',
        imdbRating: 8.5,
        featured: true,
        trending: true,
        isPublished: true,
        uploadedBy: adminUser._id,
        tags: ['action', 'thriller', 'adventure']
      },
      {
        title: 'Comedy Special',
        description: 'A hilarious comedy show that will make you laugh out loud.',
        thumbnail: 'uploads/thumbnails/default.jpg',
        videoUrl: 'uploads/videos/sample.mp4',
        duration: 3600,
        releaseYear: 2024,
        genre: ['Comedy'],
        category: createdCategories[1]._id,
        rating: 'PG',
        imdbRating: 7.8,
        featured: false,
        trending: true,
        isPublished: true,
        uploadedBy: adminUser._id,
        tags: ['comedy', 'funny', 'entertainment']
      },
      {
        title: 'Nature Documentary',
        description: 'Explore the wonders of nature in this breathtaking documentary.',
        thumbnail: 'uploads/thumbnails/default.jpg',
        videoUrl: 'uploads/videos/sample.mp4',
        duration: 5400,
        releaseYear: 2023,
        genre: ['Documentary'],
        category: createdCategories[2]._id,
        director: 'Jane Smith',
        rating: 'G',
        imdbRating: 9.2,
        featured: true,
        trending: false,
        isPublished: true,
        uploadedBy: adminUser._id,
        tags: ['nature', 'documentary', 'wildlife']
      }
    ];

    const createdVideos = await Video.insertMany(sampleVideos);
    console.log(`🎬 Created ${createdVideos.length} sample videos`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 You can now:');
    console.log('   1. Start the backend: npm start');
    console.log('   2. Login with the credentials above');
    console.log('   3. Upload real videos to replace sample data');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
};

// Run seed
seedDatabase();
