import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "http://192.168.0.178:5000/v1";

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
    const token = await AsyncStorage.getItem("auth_token"); // Lấy token từ AsyncStorage
    if (!token) {
      console.log("Token không tồn tại");
      return null; 
    }
    headers["Authorization"] = `Bearer ${token}`; // Gửi token trong header
  }

  try {
    switch (method) {
      case typeHTTP.POST:
        const postResponse = await axios.post(`${baseURL}${url}`, body, {
          headers,
        });
        return postResponse.data;
      case typeHTTP.PUT:
        const putResponse = await axios.put(`${baseURL}${url}`, body, {
          headers,
        });
        return putResponse.data;
      case typeHTTP.GET:
        const getResponse = await axios.get(`${baseURL}${url}`, { headers });
        return getResponse.data;
      case typeHTTP.DELETE:
        const deleteResponse = await axios.delete(`${baseURL}${url}`, {
          headers,
        });
        return deleteResponse.data;
      default:
        throw new Error("Invalid method");
    }
  } catch (error) {
    // console.error("API Error:", error);
    throw error;
  }
};
