import { Box, Typography } from "@mui/material";
import React, { useRef } from "react";
import FAQ from "./FAQ";

const RightContent = ({box1Ref, box2Ref ,box3Ref, box4Ref, box5Ref}) => {

  return (
    <div className="right-container">
      <Box className="content-box1 content-box" ref={box1Ref}>
        <h1 className="h1">
          Protect Your Website Traffic – Monitor Robots.txt Changes Instantly!
        </h1>
        <Typography variant="p" component={"p"} className="p">
          Easily and quickly monitor changes to your robots.txt with our free
          online robots text checker.
        </Typography>
      </Box>

      <Box className="content-box2  content-box" ref={box2Ref}>
        <h1 component={"h1"} className="h2">
          Why Robots.txt Monitoring Matters
        </h1>
        <Typography component={"p"} variant="p" className="p">
          The robots.txt file serves as a gatekeeper, directing search engine
          crawlers to which parts of your site to access or avoid. Unintended
          modifications can block search engines, reducing your site's
          visibility and traffic in search results.
        </Typography>
        <h3 className="h3">Key Risks:</h3>
        <ul>
          <li>
            <span>Accidental Disallow Directives :</span>Unintentional
            robots.txt restrictions can prevent search engines from indexing
            important pages.​
          </li>
          <li>
            <span>Unauthorized Changes from Developers or Malware :</span>
            Unauthorized alterations can lead to the unintentional blocking of
            critical site areas.
          </li>
          <li>
            <span>Losing Search Visibility Overnight :</span>
            Even minor changes can significantly impact your site's search
            rankings.
          </li>
        </ul>
      </Box>
      <Box className="content-box3 content-box" ref={box3Ref}>
        <h1 component={"h1"} className="h2">
          How to Use the Robot.txt Validator
        </h1>

        <h3 className="h3">
          Using our tool is extremely easy. Here's how it works :
        </h3>
        <ul>
          <li>
            <span>Step 1 :</span>Enter your website's domain.
          </li>
          <li>
            <span>Step 2 :</span>Our tool checks your robots.txt file every day
            for any changes.
          </li>
          <li>
            <span>Step 3 :</span> Get notified immediately if any robot.txt
            changes are detected.
          </li>
          <li>
            <span>Step 4 :</span>
            Take immediate action to protect your site.
          </li>
        </ul>
      </Box>

      <Box className="content-box4 content-box" ref={box4Ref}>
        <h1 component={"h1"} className="h2">
          Features and Benefits of Our Free Robots.txt Checker
        </h1>
        <ul>
          <li>
            <span>Daily Change Detection: </span>
            Stay informed about any alterations to your robots.txt file.​
          </li>
          <li>
            <span>Weekly Status Reports:</span>
            Receive summaries to monitor the health of your file, even if there
            are no changes.
          </li>
          <li>
            <span>Instant Email Alerts:</span>
            Get immediately notified, allowing you to take swift action against
            potential issues.​
          </li>
          <li>
            <span>Completely Free:</span>
            Enjoy free and reliable robot.txt monitoring without any hidden
            costs.​
          </li>
          <li>
            <span>Easy Setup:</span>
            No technical expertise is required; simply input your domain to
            start.
          </li>
        </ul>
      </Box>
      <Box className="content-box5 content-box" ref={box5Ref}>
        <h1 component={"h1"} className="h2">
          Frequently Asked Questions (FAQs)
        </h1>
        <FAQ />
      </Box>
    </div>
  );
};

export default RightContent;
