import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://datascope-api.onrender.com/api",
  withCredentials: true,
});

export default axiosClient;