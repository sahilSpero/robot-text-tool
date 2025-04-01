import { Container } from "@mui/material";
import React, { useState } from "react";
// import { Container } from 'reactstrap';
// import "../styles/FaqSection.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is a robots.txt file, and why is it important?",
      answer:
        "A robots.txt file provides directives to web crawlers about which pages or sections of your site should not be crawled or indexed. Proper configuration ensures that search engines access your site's valuable content while avoiding areas you wish to keep private.",
    },
    {
      question: "How does this monitoring tool work?",
      answer:
        "Once you enter your domain, our free tool regularly checks your robots.txt file for any changes. If any modifications are detected, you receive immediate email alerts, allowing you to review and address potential issues promptly. ",
    },
    {
      question: "Is this tool really free?",
      answer:
        "Yes, our robots.txt monitoring service is entirely free, with no hidden fees. We aim to provide website owners with an essential tool to maintain their site's search engine visibility without any cost.",
    },
    {
      question: "What happens if my robots.txt file changes?",
      answer:
        "Changes to your robots.txt file can significantly impact how search engines crawl and index your site. Unintended modifications might block important pages, affecting your site's search rankings and traffic. ",
    },
    {
      question: "Can I monitor multiple websites?",
      answer:
        "Yes. With our robot.text tester, you can monitor multiple domains and manage all your websites from a single dashboard, ensuring comprehensive oversight of your robots.txt files.",
    },
    {
      question:
        "Will I receive notifications even if my robots.txt file stays the same?",
      answer:
        "Not so much of notifications, but you'll receive detailed weekly status reports summarizing the current state of your robots.txt file, even if no changes have occurred. This helps you stay informed about your site's configuration.",
    },
    {
      question: "Do I need any technical knowledge to use this tool?",
      answer:
        "No technical expertise or coding is required to use our online robot.txt validator. ",
    },
    {
      question: "How do I contact support if I have issues?",
      answer:
        "For support, please visit our Contact Us page, where you can submit a support request. Our team is ready to assist you with any questions or concerns.",
    },
  ];

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <React.Fragment>
      <div className="description-bg">
        <Container className="FAQ-con">
          {faqs.map((faq, index) => (
            <div
              className="faq-container"
              key={index}
              onClick={() => toggleAnswer(index)}
            >
              <div className="question">
                <span>{faq.question}</span>
                <span
                  className={`arrow ${activeIndex === index ? "expanded" : ""}`}
                >{`>`}</span>
              </div>
              {activeIndex === index && (
                <div className="answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FAQ;
