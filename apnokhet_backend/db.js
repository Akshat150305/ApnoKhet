const mongoose = require('mongoose');

// Make sure your MongoDB server is running on this address
const mongoURI = "mongodb://localhost:27017/apnokhet";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to Mongo Successfully");
    } catch (error) {
        console.error("Error connecting to Mongo:", error);
        process.exit(1); // Exit the process if connection fails
    }
};

module.exports = connectToMongo;