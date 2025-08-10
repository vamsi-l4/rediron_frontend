import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000"
      : "https://rediron-backend-1.onrender.com",
});

export default API;
