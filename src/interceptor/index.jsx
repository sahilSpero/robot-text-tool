import axios from "axios";
import * as service from "../service";

const api = axios.create({
  // http://localhost:5000/api/
  // https://api-robot-tool.websperotech.com/
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = () => {
  return (
    // service.getAuthToken() ||
    new URLSearchParams(window.location.search).get("token")
  );
};

api.interceptors.request.use(
  (config) => {
    // const token = service.getAuthToken();
    const token =
      getToken() || service.getAuthToken() || localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // service.removeAuthToken();
      localStorage.removeItem("authToken");
      localStorage.removeItem("email");
      // window.location.href = "https://webspero.com/"; // Redirect on 401
    }
    return Promise.reject(error);
  }
);

export default api;
