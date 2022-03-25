/**
 * @format
 * @author lomofu
 * @desc
 * @create 19/Mar/2022 16:41
 */
import axios from "https://cdn.skypack.dev/axios";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

const instance = axios.create({ crossDomain: true });

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
    return Promise.reject(error.response);
  },
);

export default instance;
