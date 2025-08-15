import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "verification email sent successfully" };
  } catch (emailError) {
    console.log("error sending email: ", emailError);
    return { success: false, message: "error sending email" };
  }
}
