import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

//https://datascope-api.onrender.com/api

export default axiosClient;