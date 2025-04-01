import dayjs from "dayjs";
import img1 from "@/../public/assets/image-1.svg";
import img2 from "@/../public/assets/image-2.svg";
import img3 from "@/../public/assets/image-3.svg";
import img4 from "@/../public/assets/image-4.svg";
import img5 from "@/../public/assets/image-5.svg";

export const formatDate = (date) => {
  return dayjs(date).format("MMMM D, YYYY");
};

export const isValidDomain = (str) => {
  if (!str) return false;
  let regex = new RegExp(
    /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/
  );
  return regex.test(str);
};

export const domain_from_url = (url) => {
  if (!url) return { valid: false, result: "" };

  let match;
  let result = url;

  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
    ))
  ) {
    result = match[1];
  }
  if ((match = result.match(/^[^\.]+\.(.+\..+)$/))) {
    result = match[0];
  }

  return {
    valid: isValidDomain(result),
    result,
  };
};

 
export const footerData = [
  {
    id: 1,
    name: "Australia",
    img: img1,
    location: "25-33 Wills Street, Melbourne, 3000",
    phoneNumber: "+22-1234565307"
  },
  {
    id: 2,
    name: "Culver City",
    img: img2,
    location: "12208, Braddock Dr. Culver City, CA, 90230",
    phoneNumber: "+1-805-319-4889"
  },
  {
    id: 3,
    name: "Los Angeles",
    img: img3,
    location: "600, E.12th Street. Los Angeles, CA, 90015",
    phoneNumber: "+1-805-319-4889"
  },
  {
    id: 4,
    name: "London",
    img: img4,
    location: "A Coldbath Square, Farringdon, London, EC1R 5HL.",
    phoneNumber: "+44-2070975307"
  },
  {
    id: 5,
    name: "India",
    img: img5,
    location: "C-127, 3rd floor, Industrial Area, Phase-8, Mohali, Punjab, India 160071",
    phoneNumber: {
      sales: "+91-9875999230",
      hr: "+91-6283093264"
    }
  }
];