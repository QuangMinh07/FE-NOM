import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const globalContext = createContext({});

export const GlobalContext = ({ children }) => {
  const [user, setUser] = useState();

  const globalData = {
    user,
  };

  const globalHandler = {
    setUser: async (userData) => {
      setUser(userData);
      try {
        await AsyncStorage.setItem("user", JSON.stringify(userData)); // Store user data in AsyncStorage
      } catch (error) {
        console.error("Error saving user data to storage:", error);
      }
    },
    loadUser: async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
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
