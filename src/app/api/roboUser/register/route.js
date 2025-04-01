
import connectDb from "@/server/database/connectDb";
import { fetchRoboUser } from "../../../../server/helpers/index";
import { sentAuthCodeByEmail , findRoboUserbyEmail } from "../../../../server/helpers/index";

export async function POST(req) {
  try {
    connectDb();
    const { email, domains } = await req.json(); // Parse the request body
    console.log(email , "email")

    // Validate the email
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    // Find the user by email
    let user = await findRoboUserbyEmail(email);
    console.log(user , ">:user")

    // Fetch authentication code for the user
    const authCode = await fetchRoboUser(email, domains);

    // Determine the action based on whether the user exists
    const action = user ? "resend" : "register";

    // Send the authentication code via email
    await sentAuthCodeByEmail(email, authCode, action);

    // Return the response
    return new Response(
      JSON.stringify({
        message: `Verification code ${user ? "resent" : "sent"} to your email`,
        data: email,
      }),
      { status: user ? 200 : 201 }
    );
  } catch (error) {
    console.log(error, "errprssas")
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
