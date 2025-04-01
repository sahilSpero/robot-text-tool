import Cookies from "js-cookie";

export const setAuthToken = (token) => {
  Cookies.set("authToken", token, { expires: 1 });
};

export const getAuthToken = () => {
  return Cookies.get("authToken");
};

export const removeAuthToken = () => {
  Cookies.remove("authToken");
};
