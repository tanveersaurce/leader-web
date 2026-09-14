const mongoose = require('mongoose');
const dns = require('dns');

// Fix DNS resolution for MongoDB Atlas SRV lookup on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.log('DNS setServers fallback active');
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leader-portfolio');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
