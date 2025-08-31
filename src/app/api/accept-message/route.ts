import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { Session } from "next-auth";
import { success } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await request.json();
  //acceptMessages parameter will be send by the client from the front-end

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message:
            "failed to update the user status to accept or reject the messages",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "message acceptance status updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("failed to update user status of accepting messages");
    return Response.json(
      {
        success: false,
        message: "failed to update user status of accepting messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const userId = user?._id;
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "failed to find the user",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("error finding the user message status: ", error);
    return Response.json(
      {
        success: false,
        message: "error finding the user message status",
      },
      {
        status: 500,
      }
    );
  }
}
