// require('dotenv').config();
const mongoose = require('mongoose');

// const MONGODB_URI = "mongodb+srv://rank-tracking:rank-tracking@rank-tracking.p78ob.mongodb.net/robots-tool?retryWrites=true&w=majority"
const MONGODB_URI = process.env.MONGODB_URI;

console.log(MONGODB_URI, "dddddddddd")

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Export the connectDb function
module.exports = connectDb;
