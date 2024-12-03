import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// export const baseURLOrigin = "http://192.168.1.66:5000";
export const baseURLOrigin = "https://nom-9xxu.onrender.com";

// const baseURL = "http://192.168.1.66:5000/v1";
const baseURL = "https://nom-9xxu.onrender.com/v1";

export const typeHTTP = {
  POST: "post",
  PUT: "put",
  GET: "get",
  DELETE: "delete",
};

export const api = async ({ method, url, body, sendToken, isMultipart = false }) => {
  const headers = {};

  if (sendToken) {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) {
      console.log("Token không tồn tại");
      return null;
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Nếu là multipart, không đặt Content-Type, Axios sẽ tự động thêm
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
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
