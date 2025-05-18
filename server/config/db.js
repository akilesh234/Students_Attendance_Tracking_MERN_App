const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load env variables

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true); // Prepare for Mongoose 7 behavior
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Options are no longer needed in Mongoose 6+
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;