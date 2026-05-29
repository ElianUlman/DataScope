import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://datascope-api.onrender.com/api",
});

export default axiosClient;