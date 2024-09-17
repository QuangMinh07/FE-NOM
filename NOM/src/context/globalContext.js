import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const globalContext = createContext({});

export const GlobalContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [storeData, setStoreData] = useState(null); // Thêm state lưu trữ toàn bộ thông tin cửa hàng

  // Tải thông tin người dùng từ AsyncStorage khi khởi động
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("User data loaded from AsyncStorage:", JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user data from storage:", error);
      }
    };

    loadUserFromStorage(); // Gọi hàm tải thông tin khi ứng dụng khởi động
  }, []);

  const globalData = {
    user,
    storeData, // Lưu toàn bộ thông tin cửa hàng
  };

  const globalHandler = {
    setUser: async (userData) => {
      setUser(userData);
      try {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        console.log("User data saved to AsyncStorage:", userData);
      } catch (error) {
        console.error("Error saving user data to storage:", error);
      }
    },
    setStoreData: async (storeInfo) => { // Hàm để lưu toàn bộ thông tin cửa hàng
      setStoreData(storeInfo);
      console.log("Store data set in GlobalContext:", storeInfo);
      try {
        await AsyncStorage.setItem("storeData", JSON.stringify(storeInfo));
        console.log("Store data saved to AsyncStorage:", storeInfo);
      } catch (error) {
        console.error("Error saving store data to storage:", error);
      }
    },
    loadUser: async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedStoreData = await AsyncStorage.getItem("storeData");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("User data loaded from AsyncStorage:", JSON.parse(storedUser));
        }
        if (storedStoreData) {
          setStoreData(JSON.parse(storedStoreData));
          console.log("Store data loaded from AsyncStorage:", JSON.parse(storedStoreData));
        }
      } catch (error) {
        console.error("Error loading user or store data from storage:", error);
      }
    },

    clearUser: async () => {
      setUser(null);
      try {
        await AsyncStorage.removeItem("user"); // Clear user data from AsyncStorage
      } catch (error) {
        console.error("Error clearing user data:", error);
      }
    },
  };

  return (
    <globalContext.Provider value={{ globalData, globalHandler }}>
      {children}
    </globalContext.Provider>
  );
};
