import { decryptData } from "@utils/Utils";
import { Config } from "@configs/Config";
import { BEARER_TOKEN } from "@constants/CommonConstants";
import axios, { type AxiosResponse, type RawAxiosRequestHeaders } from "axios";

export const api = async (
  endpoint: string,
  data: object,
  type: "post" | "postMultipart" | "get" | "put" | "patch" | "delete",
) => {
  let response: AxiosResponse;
  const headers: RawAxiosRequestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${decryptData(localStorage.getItem(BEARER_TOKEN) ?? "")}`,
  };

  if (endpoint === undefined) throw new Error("endpoint undefined");

  try {
    switch (type) {
      case "post":
        response = await axios.post(
          `${Config.apiBaseUrl}${Config.apiVersion}${endpoint}`,
          { ...data },
          {
            headers,
          },
        );
        break;

      case "postMultipart":
        headers["Content-Type"] = "multipart/form-data";
        response = await axios.post(`${Config.apiBaseUrl}${Config.apiVersion}${endpoint}`, data, {
          headers,
        });
        break;
      case "get":
        response = await axios.get(`${Config.apiBaseUrl}${Config.apiVersion}${endpoint}`, {
          headers,
        });
        break;
      case "put":
        response = await axios.put(`${Config.apiBaseUrl}${Config.apiVersion}${endpoint}`, data, {
          headers,
        });
        break;
      case "patch":
        response = await axios.patch(`${Config.apiBaseUrl}${Config.apiVersion}${endpoint}`, data, {
          headers,
        });
        break;
      case "delete":
        response = await axios.delete(`${Config.apiBaseUrl}${Config.apiVersion}${endpoint}`, {
          data,
          headers,
        });
        break;
    }

    return response;
  } catch (error) {
    console.error("API error", error);
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    throw error;
  }
};
