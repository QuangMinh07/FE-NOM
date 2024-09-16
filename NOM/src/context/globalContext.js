import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const globalContext = createContext({});

export const GlobalContext = ({ children }) => {
  const [user, setUser] = useState(null);

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
    loadUser: async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("User data loaded from AsyncStorage:", JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user data from storage:", error);
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
