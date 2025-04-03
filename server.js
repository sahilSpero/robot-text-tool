require("dotenv").config({ path: "./.env.local" });
// require('./src/server/')
const express = require("express");
const next = require("next");
const cron = require("node-cron");
const dns = require("dns");
const puppeteer = require("puppeteer-extra");
const Robots = require("./src/server/models/RobotSchema");
const connectDb = require("./src/server/database/serverDb");
const sgMail = require("@sendgrid/mail");
const RoboUser = require("./src/server/models/RoboUser");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const fromMail = process.env.fromMail;
const sendGrid = process.env.sendGrid;
const JWT_SECRET = process.env.JWT_SECRET;


sgMail.setApiKey(sendGrid);

const { promisify } = require("util");
const lookupAsync = promisify(dns.lookup);

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());


app.prepare().then(() => {
  const server = express();

  const getWeeklyDomainInfo = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await Robots.aggregate([
      {
        $match: { updatedAt: { $gte: sevenDaysAgo } }, // Last 7 days records
      },
      {
        $lookup: {
          from: "robousers",
          localField: "domain",
          foreignField: "domains.name",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $unwind: "$user.domains" },
      {
        $match: {
          "user.domains.createdAt": { $gte: sevenDaysAgo }, // Domains created in last 7 days
        },
      },
      {
        $group: {
          _id: { email: "$user.email", domain: "$domain" },
          isChangedStatus: { $push: "$isChanged" }, // Collect all change statuses
          latestUpdatedAt: { $max: "$updatedAt" }, // Get latest update time for that domain
        },
      },
      {
        $group: {
          _id: "$_id.email",
          changeDomain: {
            $addToSet: {
              $cond: [
                { $in: [true, "$isChangedStatus"] }, // If any record has isChanged = true
                "$_id.domain",
                "$$REMOVE",
              ],
            },
          },
          unchangeDomain: {
            $addToSet: {
              $cond: [
                {
                  $and: [
                    { $in: [false, "$isChangedStatus"] }, // If any record has isChanged = false
                    { $not: { $in: [true, "$isChangedStatus"] } }, // But no true records
                  ],
                },
                "$_id.domain",
                "$$REMOVE",
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          email: "$_id",
          changeDomain: {
            $filter: {
              input: "$changeDomain",
              as: "domain",
              cond: { $ne: ["$$domain", "$$REMOVE"] },
            },
          },
          unchangeDomain: {
            $filter: {
              input: "$unchangeDomain",
              as: "domain",
              cond: { $ne: ["$$domain", "$$REMOVE"] },
            },
          },
        },
      },
    ]);

    return result;
  };

  const sendWeeklyEmailRobotsUpdatedDomains = async (data) => {
    for (const user of data) {
      const { email, changeDomain, unchangeDomain } = user;

      const changeDomainList = changeDomain.length
        ? `<ul style="padding-left: 20px; margin: 10px 0;">${changeDomain
            .map(
              (domain) =>
                `<li style="margin-bottom: 5px; font-size: 14px;">${domain}</li>`
            )
            .join("")}</ul>`
        : "<p style='color: #000; font-style: italic; font-size: 14px;'>No domains changed.</p>";

      const unchangeDomainList = unchangeDomain.length
        ? `<ul style="padding-left: 20px; margin: 10px 0;">${unchangeDomain
            .map(
              (domain) =>
                `<li style="margin-bottom: 5px; font-size: 14px;">${domain}</li>`
            )
            .join("")}</ul>`
        : "<p style='color: #000; font-style: italic; font-size: 14px;'>No domains unchanged.</p>";

      const msg = {
        to: email,
        from: fromMail,
        subject: "Robot File Changes Alert",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Robot File Changes Alert</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
                body, p, h1, h3 {
                  font-family: 'Poppins', sans-serif !important;
                }
                .ii a[href] {
                  color: #000 !important;
                }
              </style>
          </head>
          <body style="background-color: #fff; color: #333; font-family: 'Poppins', sans-serif;">
              <div style="max-width: 600px; margin: 40px auto; background: #ff6c55; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                  <div style="background-color: #ff6c55; padding: 20px; text-align: center;">
                      <h1 style="color: #fff; margin: 0; font-size: 24px;">Robot File Changes Alert</h1>
                  </div>
                  
                  <div style="padding: 20px; color: #333; background: #fff; border-radius: 10px;">
                      <p style="font-size: 18px; margin-bottom: 20px;">
                          Hello <strong>${email}</strong>,
                      </p>
                      
                      <p style="font-size: 16px; font-weight: 600; background-color: #ffebe6; padding: 15px; border-left: 5px solid #ff6c55;">
                      The robot files for the following domains have been updated in the past week:
                      </p>
    
                      <h3 style="color: #ff6c55; margin-top: 20px;">Changed Domains</h3>
                      <div style="background: #ffe8e2; padding: 15px; border-radius: 5px;">
                        ${changeDomainList}
                      </div>
    
                      <h3 style="color: #ff6c55; margin-top: 20px;">Unchanged Domains</h3>
                      <div style="background: #ffe8e2; padding: 15px; border-radius: 5px;">
                        ${unchangeDomainList}
                      </div>
    
                      <p style="font-size: 16px; margin-top: 20px; color: #ff6c55;">
                          If you have any questions, feel free to reach out.
                      </p>
                      <p style="font-size: 16px; font-weight: bold; color: #ff6c55;">
                          Best regards,<br>Webspero Solutions
                      </p>
                  </div>
    
                  <div style="background-color: #ff6c55; color: #fff; text-align: center; padding: 15px; font-size: 14px;">
                      © ${new Date().getFullYear()} Webspero Solutions. All Rights Reserved.
                  </div>
              </div>
          </body>
          </html>
          `,
      };

      try {
        await sgMail.send(msg);
        console.log(`Email sent to ${email} successfully!`);
      } catch (err) {
        console.error(
          `Error sending email to ${email}:`,
          err.response ? err.response.body : err
        );
      }
    }
  };

  const isDomainReachable = async (domain) => {
    try {
      console.log(`Checking reachability for ${domain}...`);
      const result = await lookupAsync(domain);
      if (result && typeof result === "object" && result.address) {
        if (result.address === "0.0.0.0" || result.address.startsWith("127.")) {
          console.warn(
            `Domain ${domain} resolved to an invalid address: ${result?.address}`
          );
          return false;
        }
        return true;
      }
      console.warn(`Invalid DNS lookup result for ${domain}:`, result);
      return false;
    } catch (error) {
      console.warn(`DNS Lookup failed for ${domain}:`, error);
      return false;
    }
  };

  const fetchWithRetry = async (url, domain, retries = 3, delay = 3000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Fetching ${url} (Attempt ${attempt})`);
        const response = await axios.get(url, {
          timeout: 8000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
            Accept: "text/plain, text/html, */*",
            Referer: "https://www.google.com/",
            Connection: "keep-alive",
          },
          maxRedirects: 5,
          validateStatus: (status) => status < 400,
        });

        if (response.status === 404) {
          console.warn(
            `robots.txt not found for ${domain}, but site is reachable.`
          );
          return "NO_ROBOTS_TXT";
        }

        if (response.status === 200 && response.data?.trim().length > 0) {
          return response.data;
        } else {
          console.warn(`Received empty or invalid robots.txt for ${domain}`);
        }
      } catch (error) {
        if (error.response) {
          console.error(
            `HTTP error ${error.response.status} for ${domain}: ${error.response.statusText}`
          );
          if (
            error.response.status === 403 ||
            error.response.status === 429 ||
            error.response.status === 404
          ) {
            console.warn(`Access denied for ${domain}, skipping.`);
            break;
          }
        } else if (
          error.code === "ENOTFOUND" ||
          error.code === "ECONNREFUSED"
        ) {
          console.error(
            `Fatal network error for ${domain}: ${error.code}. Skipping.`
          );
          break;
        }

        if (attempt < retries) {
          console.warn(`Retrying in ${delay / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          console.error(`Failed after ${retries} attempts: ${domain}`);
        }
      }
    }
    return null;
  };

  const getRobotsTxtWithPuppeteer = async (domain, browser) => {
    try {
      const url = `https://${domain}/robots.txt`;
      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
      );

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });

      const data = await page.evaluate(() => document.body.innerText);
      console.log(`[PUPPETEER SUCCESS] Fetched robots.txt for ${domain}`);

      await page.close();
      return data;
    } catch (error) {
      console.error(
        `[PUPPETEER ERROR] Fetching robots.txt for ${domain}:`,
        error
      );
      return null;
    }
  };
  const delayBetweenBatches = (baseDelay = 2000) => {
    return new Promise((resolve) => setTimeout(resolve, baseDelay));
  };

  const fetchRobots = async (domain, domain_id, robotText) => {
    try {
      const existingRecords = await Robots.find({ domain })
        .sort({ createdAt: -1 })
        .limit(2);
      let isChanged = false;
      if (existingRecords.length >= 1) {
        const latest = existingRecords[0];
        isChanged = latest.robotText !== robotText;
      }
      const newRecord = await new Robots({
        domain_id: domain_id,
        domain: domain,
        robotText: robotText,
        isChanged: isChanged, // Store isChanged in the new record
      }).save();
      console.log(
        `Record added for domain: ${domain}, Change detected: ${isChanged}`
      );
      return newRecord;
    } catch (error) {
      console.error("Error creating record:", error);
      throw error;
    }
  };

  const getDomainWithUser = async () => {
    try {
      const result = await Robots.aggregate([
        // Step 1: Sort by createdAt (latest first)
        { $sort: { createdAt: -1 } },

        // Step 2: Group by domain to get latest and second-latest robotText
        {
          $group: {
            _id: "$domain",
            domain_id: { $first: "$domain_id" },
            robotTexts: { $push: "$robotText" }, // Collect all texts
          },
        },

        // Step 3: Extract latest and second-latest robotText
        {
          $project: {
            domainName: "$_id",
            domain_id: 1,
            latestRobotText: { $arrayElemAt: ["$robotTexts", 0] }, // Latest text
            secondLatestRobotText: { $arrayElemAt: ["$robotTexts", 1] }, // Second latest text
          },
        },

        // Step 4: Filter records where latest and second-latest texts are different
        {
          $match: {
            $expr: { $ne: ["$latestRobotText", "$secondLatestRobotText"] },
          },
        },

        // Step 5: Lookup user email from RoboUser collection
        {
          $lookup: {
            from: "robousers",
            let: { domainName: "$domainName" },
            pipeline: [
              { $unwind: "$domains" },
              { $match: { $expr: { $eq: ["$domains.name", "$$domainName"] } } }, // Match domain name
              { $project: { email: 1, _id: 0 } },
            ],
            as: "userEmails",
          },
        },

        // Step 6: Restructure output
        {
          $project: {
            domainName: 1,
            userEmails: {
              $map: { input: "$userEmails", as: "user", in: "$$user.email" },
            }, // Extract emails
            latestRobotText: 1,
            secondLatestRobotText: 1,
          },
        },
      ]).allowDiskUse(true); // Enable disk usage for large queries

      return result;
    } catch (error) {
      console.error("Error in getDomainWithUser:", error);
      return [];
    }
  };

  const sendSendGridMailToUsers = async (data) => {
    const highlightChanges = (latest, previous) => {
      if (!latest || !previous) return latest || "No data available";

      const latestLines = latest.split("\n");
      const previousLines = new Set(previous.split("\n"));

      return latestLines
        .map(
          (line) =>
            previousLines.has(line)
              ? line // Unchanged lines
              : `<span style="background-color: #ecfdf0; color: black; padding: 2px 5px;">${line}</span>` // Highlight new changes
        )
        .join("\n");
    };

    const highlightRemovedChanges = (latest, previous) => {
      if (!latest || !previous) return previous || "No data available";

      const latestLines = new Set(latest.split("\n"));
      const previousLines = previous.split("\n");

      return previousLines
        .map(
          (line) =>
            latestLines.has(line)
              ? line // Unchanged lines
              : `<span style="background-color: #fbe9eb; color: #000; padding: 2px 5px;">${line}</span>` // Highlight removed lines
        )
        .join("\n");
    };

    const highlightedLatest = highlightChanges(
      data?.latestRobotText,
      data?.secondLatestRobotText
    );
    const highlightedPrevious = highlightRemovedChanges(
      data?.latestRobotText,
      data?.secondLatestRobotText
    );

    const msg = {
      to: data?.userEmails, // Array of recipients
      from: fromMail, // Ensure this is set correctly
      subject: `Robot File Changes Detected for ${data?.domainName}`, // Updated subject with domain name
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Robot File Changes Alert</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
          body, p, h4, h5 {
            font-family: 'Poppins', sans-serif !important;
          }
          .ii a[href] {
            color: #000 !important;
          }
        </style>
    </head>
    <body style="background-color: #fff; color: #333; font-family: 'Poppins', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ff6c55; border-radius: 10px;">
            <h4 style="color: #fff; font-size: 24px; margin-bottom: 20px;">Robot File Changes Detected</h4>
            <p style="font-size: 18px; line-height: 1.5; color: #fff;">
                <strong>New changes found in the robot files of:</strong> ${data?.domainName}
            </p>
            <div style="background-color: #fff; color: #333; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h5 style="margin: 0; font-size: 18px; color: #ff6c55;">Latest Robot File:</h5>
                <pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 14px;">${highlightedLatest}</pre>
            </div>
            <div style="background-color: #fff; color: #333; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h5 style="margin: 0; font-size: 18px; color: #ff6c55;">Previous Robot File:</h5>
                <pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 14px;">${highlightedPrevious}</pre>
            </div>
            <p style="font-size: 18px; line-height: 1.5; color: #fff;">
                Please review these changes to ensure they align with your SEO strategy.
            </p>
            <p style="font-size: 18px; line-height: 1.5; color: #fff;">
                If you have any questions, feel free to reach out.
            </p>
            <p style="font-size: 18px; line-height: 1.5; color: #fff;">
                Best regards,<br>Webspero Solutions
            </p>
        </div>
    </body>
    </html>
    `,
    };

    try {
      await sgMail.sendMultiple(msg);
      console.log(`Email sent successfully to: ${data?.userEmails.join(", ")}`);
    } catch (err) {
      console.error(
        "Error sending emails:",
        err.response ? err.response.body : err
      );
    }
  };

  // // Schedule a cron job to run every minute
  // cron.schedule("**/10 * * * * *", () => {
  //   console.log("Cron job executed every 10 sec...");
  //   getWeeklyUpadateOfRobotDomains();
  //   // Add your background logic here
  // });

  // cron.schedule("**/10 * * * * *", async () => {
  //   console.log("Running scheduled task every 12 hours...");
  //   getRobotDataByCron();
  //   console.log("Task completed");
  // });

  async function getWeeklyUpadateOfRobotDomains() {
    try {
      connectDb();
      const data = await getWeeklyDomainInfo();
      await sendWeeklyEmailRobotsUpdatedDomains(data);
      console.log("📧 Weekly email sent successfully!");
      return { data };
    } catch (error) {
      console.error(
        "❌ Error in getWeeklyUpadateOfRobotDomains:",
        error.message
      );
      return { error: error.message };
    }
  }

  async function getRobotDataByCron() {
    try {
      connectDb();
      const users = await RoboUser.find({}, "domains").lean();
      let allDomains = users.flatMap((user) => user.domains);

      // Remove duplicates based on domain name
      const uniqueDomains = Array.from(
        new Map(allDomains.map((d) => [d.name, d])).values()
      );

      console.log(
        `Fetched ${allDomains.length} domains, reduced to ${uniqueDomains.length} unique domains.`
      );

      const chunkSize = 5;

      for (let i = 0; i < uniqueDomains.length; i += chunkSize) {
        const chunk = uniqueDomains.slice(i, i + chunkSize);
        const browser = await puppeteer.launch({
          headless: "new",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        console.log(
          `Processing batch ${i / chunkSize + 1} with ${chunk.length} domains.`
        );

        await Promise.all(
          chunk.map(async (ele) => {
            try {
              const robotsTxtUrl = `https://${ele.name}/robots.txt`;
              if (!(await isDomainReachable(ele.name))) {
                console.warn(`DNS lookup failed, skipping ${ele.name}`);
                return;
              }
              let response = await fetchWithRetry(robotsTxtUrl, ele.name);
              if (response === "NO_ROBOTS_TXT" || !response) {
                console.warn(
                  ` No valid robots.txt found for ${ele.name}, trying Puppeteer...`
                );
                response = await getRobotsTxtWithPuppeteer(ele.name, browser);
              }
              if (response && response.trim().length > 0) {
                const lowerCaseResponse = response.toLowerCase();
                if (
                  lowerCaseResponse.includes("403 forbidden") ||
                  lowerCaseResponse.includes("access denied") ||
                  lowerCaseResponse.includes("404")
                ) {
                  console.warn(
                    ` Forbidden response detected for ${ele.name}, skipping DB storage.`
                  );
                  return;
                }
                console.log(
                  `Valid robots.txt fetched for ${ele.name}, storing in DB.`
                );
                await fetchRobots(ele.name, ele._id, response);
              } else {
                console.warn(
                  `Skipping ${ele.name}, empty or invalid robots.txt.`
                );
              }
            } catch (error) {
              console.error(
                `Error fetching robots.txt for ${ele.name}:`,
                error
              );
            }
          })
        );

        console.log(`Processed batch ${i / chunkSize + 1}`);
        await delayBetweenBatches(2000);
        await browser.close();
      }
      // Fetch updated domains and send notifications (UNCHANGED)
      const response = await getDomainWithUser();
      if (Array.isArray(response) && response.length > 0) {
        await Promise.all(
          response.map(async (item) => {
            try {
              await sendSendGridMailToUsers(item);
              console.log(`Notification sent for ${item.domainName}`);
            } catch (error) {
              console.error(
                `Error sending email for ${item.domainName}:`,
                error
              );
            }
          })
        );
      }

      console.log("All batches processed successfully.");
    } catch (error) {
      console.error("Unexpected error in getRobotDataByCron:", error);
    }
  }

//   server.use((req, res, next) => {
//     console.log("Testing middleware");

//     const token = req.cookies?.authToken;  // Make sure you have cookie-parser installed and used if not already
//     const protectedRoutes = ['/register'];

//     // Redirect if route is protected and token is missing
//     if (!token && protectedRoutes.includes(req.path)) {
//         return res.redirect('/home');
//     }

//     next(); // continue if authenticated or public route
// });

  // Handle all requests with Next.js***---
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // server.listen(3001, (err) => {
  //   if (err) throw err;
  //   console.log("> Ready on http://localhost:3001");
  // });
});
