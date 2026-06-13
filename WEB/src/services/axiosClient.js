import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://datascope26-datascope-api.hf.space/api"
});

export default axiosClient;