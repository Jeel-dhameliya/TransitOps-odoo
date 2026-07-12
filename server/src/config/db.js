const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Pass the environment variable directly
        const connect = await mongoose.connect(process.env.MONGO_URL);
        
        console.log(`MongoDB connected !! DB HOST : ${connect.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;