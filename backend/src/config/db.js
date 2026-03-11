const mongoose = require('mongoose');
const { mongoUri } = require('./env');

async function connectDB() {
  if (!mongoUri) {
    throw new Error('MONGO_URI not set in env');
  }
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Connected to MongoDB');
}

module.exports = connectDB;
