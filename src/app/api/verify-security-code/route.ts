import UserModel from "@/model/User.model";
import { dbConnect } from "@/lib/dbConnect";
import { success } from "zod";

export async function POST(request: Request) {
  //GET method doesn't have body the data is fethed from either query parameter or from the path params both from the url only so when dealing with the sensitive data post method is used.
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 401,
        }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "user verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "verification code expired, signup again",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "incorrect verification code",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Error verifying user: ", error);
    return Response.json(
      {
        success: false,
        message: "error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
