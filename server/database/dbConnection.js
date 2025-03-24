import mongoose from "mongoose";

export const dbConnection = async() => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/JobPortal`);
        console.log(`\n MongoDB CONNECTED!! DB HOST : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error",error);
  }

};

