import { decryptData } from "@utils/Utils";
import { Config } from "@configs/Config";
import { BEARER_TOKEN } from "@constants/CommonConstants";
import axios from "axios";

import applyCaseMiddleware from "axios-case-converter";

const api = applyCaseMiddleware(axios.create({
  baseURL: `${Config.apiBaseUrl}${Config.apiVersion}`,
}));

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${decryptData(localStorage.getItem(BEARER_TOKEN) ?? "")}`;
    return config;
  }
)

export default api;
