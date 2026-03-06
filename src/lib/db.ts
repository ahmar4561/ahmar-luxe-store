import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://ahmaralimemon187_db_user:Ahmar786@cluster0.8bxe3gp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  // Agar pehle se connect hai to dubara mehnat mat karo
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Mubarak ho! Database Connect ho gaya 🚀");
  } catch (error) {
    console.error("Database connection mein masla hai:", error);
  }
};

export default connectDB;