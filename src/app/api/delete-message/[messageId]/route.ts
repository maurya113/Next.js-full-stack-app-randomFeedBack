import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

import UserModel from "@/model/User.model";

export async function DELETE(request: Request, context: { params: any }) {
  const { messageId } = context.params;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "unauthorized user",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user?._id },
      {
        $pull: { messages: { _id: messageId } },
      }
    );

    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "message deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error deleting message: ", error);
    return Response.json(
      {
        success: true,
        message: "message deletion failed",
      },
      {
        status: 500,
      }
    );
  }
}
