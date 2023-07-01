import mongoose from "mongoose";

export const dbConnect = async()=>{
    try {
      const connected= await mongoose.connect(process.env.MONGO_URL)
        mongoose.set('strictQuery',true)
        console.log(`DB on ${connected.connection.host} `);
    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}