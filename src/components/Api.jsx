import axios from "axios";

const API = axios.create({
  baseURL: "https://your-backend.onrender.com", // replace with your Render backend URL
});

export default API;
