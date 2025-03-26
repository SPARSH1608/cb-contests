import axios from "axios";
import qs from "qs";
import Cookies from "js-cookie";

export default function createAxiosClient({
  baseURL = import.meta.env.VITE_API_ENDPOINT, 
} = {}) {
  const cookie = Cookies.get("cb_auth");
console.log('baseURL: ' + baseURL)
const client = axios.create({
    baseURL,
    withCredentials: true, // ✅ Ensures cookies and CORS credentials work
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(cookie ? { Authorization: `JWT ${cookie}` } : {}),
    },
  });

  client.interceptors.request.use(function (config) {
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: "brackets" });
    };
    return config;
  });

  client.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      console.log("ERROR from axios client", error);
      return Promise.reject(error);
    }
  );

  return client;
}
