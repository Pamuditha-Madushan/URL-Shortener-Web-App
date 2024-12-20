import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoDBUrl = process.env.MONGODB_URI;

    if (!mongoDBUrl) {
      console.error("MONGODB_URL environment variable is not set.");
      process.exit(1);
    }

    const mongoDBConnection = await mongoose.connect(mongoDBUrl, {
      ssl: true,
    });
    console.log("MongoDB connected successfully ...");
    console.log(`Connected to MongoDB : ${mongoDBConnection.connection.host} `);
  } catch (error) {
    console.error("Failed to connect to the database !", error);
    process.exit(1);
  }
};

export default connectDB;
