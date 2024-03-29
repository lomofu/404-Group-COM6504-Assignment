/**
 * @format
 * @desc
 */
import axios from "https://cdn.skypack.dev/pin/axios@v0.26.1-3c1TUCVdnljWzSKyoXbP/mode=imports,min/optimized/axios.js";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

const instance = axios.create({ crossDomain: true, baseURL: "/" });

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.error(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return Promise.resolve(response);
    }
  },
  (error) => {
    if (error.response.status === 501) {
      window.location.href = `/error?msg=${error.response.data}`;
    }

    return Promise.reject(error.response);
  },
);

export default instance;
