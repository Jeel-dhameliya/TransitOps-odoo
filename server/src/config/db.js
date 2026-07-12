const mongoose = require("mongoose");
const name = "TransitOps";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_URL}/${name}`);
        console.log(`MongoDB connected !! DB HOST : ${connect.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;