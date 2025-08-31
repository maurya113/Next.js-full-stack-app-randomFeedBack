import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import { dbConnect } from "@/lib/dbConnect";
import { success } from "zod";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: "false",
        message: "unauthorized user",
      },
      {
        status: 400,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user?._id);
  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "no messages received or user not found",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error occured while getting the messages: ", error);
    return Response.json(
      {
        success: false,
        message: "error occured while getting the messages",
      },
      { status: 500 }
    );
  }
}
