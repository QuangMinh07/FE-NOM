import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "https://aloper.fun:8081/api";

export const typeHTTP = {
  POST: "post",
  PUT: "put",
  GET: "get",
  DELETE: "delete",
};

export const api = async ({ method, url, body, sendToken }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (sendToken) {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    switch (method) {
      case typeHTTP.POST:
        const postResponse = await axios.post(`${baseURL}${url}`, body, { headers });
        return postResponse.data;
      case typeHTTP.PUT:
        const putResponse = await axios.put(`${baseURL}${url}`, body, { headers });
        return putResponse.data;
      case typeHTTP.GET:
        const getResponse = await axios.get(`${baseURL}${url}`, { headers });
        return getResponse.data;
      case typeHTTP.DELETE:
        const deleteResponse = await axios.delete(`${baseURL}${url}`, { headers });
        return deleteResponse.data;
      default:
        throw new Error("Invalid method");
    }
  } catch (error) {
    throw error;
  }
};
