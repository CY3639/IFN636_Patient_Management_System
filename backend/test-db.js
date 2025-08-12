require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        console.log('Testing MongoDB connection...');
        console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Missing');
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
        
        // Test basic operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        process.exit(0);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

testConnection();