import { NextResponse } from "next/server";
import cron from "node-cron";
import { getWeeklyDomainInfo , sendWeeklyEmailRobotsUpdatedDomains } from "@/server/helpers";
import connectDb from "@/server/database/connectDb";

// // Run this function every 10 seconds
// cron.schedule("*/10 * * * * *", () => {
//   console.log("✅ Cron job running every 10 seconds...");
//   // You can call an API, update the database, etc.
// });

cron.schedule("*/10 * * * * *", async () => {
    console.log("Running the cron job on Tuesday at morning (10:00).");
    getWeeklyUpadateOfRobotDomains();
  });

  async function getWeeklyUpadateOfRobotDomains() {
    try {
        connectDb();
      const data = await getWeeklyDomainInfo();
      await sendWeeklyEmailRobotsUpdatedDomains(data);
      console.log("📧 Weekly email sent successfully!");
      return { data };
    } catch (error) {
      console.error("❌ Error in getWeeklyUpadateOfRobotDomains:", error.message);
      return { error: error.message };
    }
  }

export async function GET() {
  return NextResponse.json({ message: "Cron job is active" });
}
