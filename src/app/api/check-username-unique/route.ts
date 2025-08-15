import { dbConnect } from "@/lib/dbConnect";
import { success, z } from "zod";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

//front-end mei username jaise hi enter karega tabhi turant check kar ke pata chalega ki username available hai ki nahi

export async function GET(request: Request) {
  await dbConnect();

  try {
    //url looks something like this -> '/api/check-username-unique?username=alice'
    const { searchParams } = new URL(request.url);
    //new URL() extracts the whole url and search params is a property inside the url that represents the query parameters
    const queryParam = {
      username: searchParams.get("username"),
    };
    // queryParam is an obeject an a variable bacause zod expects an obeject for the validation and not a variable.
    //get method gets the username from the query parameters
    //validating username with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result); // remove this types of logs after checking
    if (!result.success) {
      //in the result.error all the zod errors gets pushed one by one hence fetch only the username error here
      const usernameError = result.error.format().username?._errors || [];
      //username error returns an array
      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "invalid query parameters or username",
        },
        {
          status: 400,
        }
      );
    }
    //fetch username from result.data
    const { username } = result.data;
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("error checking the username: ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
