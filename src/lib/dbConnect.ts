// import mongoose from "mongoose";

// type ConnectionObject = {
//   isConnected?: number;
// };

// const connection: ConnectionObject = {};

// async function dbConnect(): Promise<void> {
//   if (connection.isConnected) {
//     console.log("already connected to database");
//     return;
//   }
//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI || "");
//     connection.isConnected = db.connections[0].readyState;
//     // stores the true or false value inside the isConnected

//     console.log("db connected successfull");
//   } catch (error) {
//     console.log("db connection failed", error);
//     process.exit(1);
//   }
// }

// export default dbConnect;

import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected successfully");
  } catch (error) {
    console.log("db connection failed: ", error);
    process.exit(1);
  }
}
