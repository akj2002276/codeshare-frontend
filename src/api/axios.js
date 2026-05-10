import axios from "axios";

const API = axios.create({
  baseURL: "https://codeshare-backend-t6dh.onrender.com/api",
});

export default API;