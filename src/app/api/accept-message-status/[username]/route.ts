/* eslint-disable @typescript-eslint/no-explicit-any */
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: any }) {
  await dbConnect();
  const { username } = context.params;
  console.log(username);
  if (!username) {
    return Response.json(
      {
        success: false,
        message: "username is required",
      },
      {
        status: 400,
      }
    );
  }

  const foundUser = await UserModel.findOne({ username });
  if (!foundUser) {
    return Response.json(
      {
        success: false,
        message: "user not found",
      },
      {
        status: 400,
      }
    );
  }

  return Response.json(
    {
      success: true,
      isAcceptingMessages: foundUser.isAcceptingMessage,
    },
    {
      status: 200,
    }
  );
}
