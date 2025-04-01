import bcrypt from "bcryptjs";
import RoboUser from "../models/RoboUser";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";
import Robots from "@/server/models/RobotSchema"

export const randomInt = () => Math.floor(100000 + Math.random() * 900000);
const fromMail = process.env.fromMail;
const sendGrid = process.env.sendGrid;
const JWT_SECRET = process.env.JWT_SECRET;


export const bcryptAuthCode = async (code) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(code.toString(), salt);
};

export const fetchRoboUser = async (email, domains = []) => {
  let user = await RoboUser.findOne({ email });
  if (!user) {
    user = new RoboUser({ email, domains });
  }

  const authCode = randomInt();
  user.authCodeHash = await bcryptAuthCode(authCode);
  user.authCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  return authCode;
};

export const sentAuthCodeByEmail = async (email, authCode, type) => {
  sgMail.setApiKey(sendGrid);
  const isResend = type === "resend";
  const msg = {
    to: email,
    from: fromMail,
    subject: isResend
      ? `Your New Verification Code ${authCode}`
      : `Verify Your Email - Authentication Code ${authCode}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">${
            isResend ? "Resend Verification Code" : "Verify Your Email"
          }</h2>
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">${
            isResend
              ? "Here is your new authentication code:"
              : "Your authentication code is:"
          }</p>
          <div style="text-align: center; padding: 15px; background-color: #eef; border-radius: 8px; font-size: 24px; font-weight: bold; color: #007bff;">
            ${authCode}
          </div>
          <p style="font-size: 14px; color: #777; text-align: center;">This code is valid for <strong>5 minutes</strong>.</p>
          <p style="font-size: 14px; color: #777; text-align: center;">If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd;">
          <p style="text-align: center; font-size: 12px; color: #999;">© Copyright 2025. All rights reserved.</p>
        </div>
      `,
  };
  try {
    await sgMail.send(msg);
    console.log("Email sent successfully!");
  } catch (err) {
    console.error(
      "Error sending email:",
      err.response ? err.response.body : err
    );
  }
};

export const findRoboUserbyEmail = (email) => {
  console.log(email, ">:user");
  return RoboUser.findOne({ email });
};

export const compareAuthCode = async (authCode, authCodeHash) => {
  return await bcrypt.compare(authCode, authCodeHash);
};
export const updateVerifyCode = async (user) => {
  const result = await authCodeCommonFunc(user);
  return result;
};

export const authCodeCommonFunc = async (user) => {
  const authCode = await randomInt();
  const authCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  user.authCodeHash = await bcryptAuthCode(authCode);
  user.authCodeExpiresAt = authCodeExpiresAt;
  await user.save();
  return authCode;
};

export const roboUserVerify = (user) => {
  user.isVerified = true;
  return user.save();
};

export const generateTokenForRoboUser = async (user) => {
  return jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: 360000,
  });
};

export const findRoboUserbyUserId = (userId, type) => {
  if (type === "authCodeHash")
    return RoboUser.findById(userId).select("-authCodeHash");
  if (type === "domains") return RoboUser.findById(userId).select("domains");
  if (type === "userId") return RoboUser.findById(userId);
};

export const getWeeklyDomainInfo = async () => {
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

export const sendWeeklyEmailRobotsUpdatedDomains = async (data) => {
  
console.log(sendGrid, "sendddddd", fromMail)
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
