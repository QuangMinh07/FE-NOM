import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const globalContext = createContext({});

export const GlobalContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [storeData, setStoreData] = useState(null); // Thêm state lưu trữ toàn bộ thông tin cửa hàng
  const [sellingTime, setSellingTime] = useState([]); // Thêm state lưu trữ sellingTime
  const [foods, setFoods] = useState([]); // Thêm state lưu trữ danh sách món ăn (foods)
  const [selectedFoodId, setSelectedFoodId] = useState(null); // Thêm state để lưu selectedFoodId
  const [cart, setCart] = useState([]); // Thêm state để lưu giỏ hàng

  // Tải thông tin người dùng, cửa hàng, thời gian bán hàng và món ăn từ AsyncStorage khi khởi động
  useEffect(() => {
    const loadDataFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("User data loaded from AsyncStorage:", JSON.parse(storedUser));
        }

        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) setCart(JSON.parse(storedCart));

        const storedStoreData = await AsyncStorage.getItem("storeData");
        if (storedStoreData) {
          setStoreData(JSON.parse(storedStoreData));
          console.log("Store data loaded from AsyncStorage:", JSON.parse(storedStoreData)); // Kiểm tra giá trị storeData
        }

        const storedSellingTime = await AsyncStorage.getItem("sellingTime");
        if (storedSellingTime) {
          setSellingTime(JSON.parse(storedSellingTime));
          console.log("SellingTime data loaded from AsyncStorage:", JSON.parse(storedSellingTime));
        }

        const storedFoods = await AsyncStorage.getItem("foods");
        if (storedFoods) {
          setFoods(JSON.parse(storedFoods));
          console.log("Foods data loaded from AsyncStorage:", JSON.parse(storedFoods));
        }
      } catch (error) {
        console.error("Error loading data from storage:", error);
      }
    };

    loadDataFromStorage(); // Gọi hàm tải thông tin khi ứng dụng khởi động
  }, []);

  const globalData = {
    user,
    storeData, // Lưu toàn bộ thông tin cửa hàng
    sellingTime, // Thêm sellingTime vào globalData
    foods, // Thêm foods vào globalData
    selectedFoodId,
    cart,
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
    setStoreData: async (storeInfo) => {
      try {
        // Cập nhật vào state và GlobalContext
        setStoreData(storeInfo);
        console.log("Store data set in GlobalContext:", storeInfo);

        // Lưu thông tin vào AsyncStorage
        await AsyncStorage.setItem("storeData", JSON.stringify(storeInfo));
        console.log("Store data saved to AsyncStorage:", storeInfo);
      } catch (error) {
        console.error("Error saving store data to storage:", error);
      }
    },
    setCart: async (cartData) => {
      setCart(cartData); // Cập nhật giỏ hàng trong state
      await AsyncStorage.setItem("cart", JSON.stringify(cartData)); // Lưu giỏ hàng vào AsyncStorage
    },
    setSellingTime: async (timeData) => {
      // Hàm để lưu dữ liệu sellingTime
      setSellingTime(timeData);
      console.log("SellingTime data set in GlobalContext:", timeData);
      try {
        await AsyncStorage.setItem("sellingTime", JSON.stringify(timeData));
        console.log("SellingTime data saved to AsyncStorage:", timeData);
      } catch (error) {
        console.error("Error saving sellingTime data to storage:", error);
      }
    },
    setFoods: async (foodsData) => {
      setFoods(foodsData); // Cập nhật foods trong state
      console.log("Foods data set in GlobalContext:", foodsData);
      try {
        await AsyncStorage.setItem("foods", JSON.stringify(foodsData)); // Lưu lại vào AsyncStorage
        console.log("Foods data saved to AsyncStorage:", foodsData);
      } catch (error) {
        console.error("Error saving foods data to storage:", error);
      }
    },
    setSelectedFoodId, // Thêm hàm này để cập nhật selectedFoodId
    loadUser: async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedStoreData = await AsyncStorage.getItem("storeData");
        const storedSellingTime = await AsyncStorage.getItem("sellingTime");
        const storedFoods = await AsyncStorage.getItem("foods");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("User data loaded from AsyncStorage:", JSON.parse(storedUser));
        }
        if (storedStoreData) {
          setStoreData(JSON.parse(storedStoreData));
          console.log("Store data loaded from AsyncStorage:", JSON.parse(storedStoreData));
        }
        if (storedSellingTime) {
          setSellingTime(JSON.parse(storedSellingTime));
          console.log("SellingTime data loaded from AsyncStorage:", JSON.parse(storedSellingTime));
        }
        if (storedFoods) {
          setFoods(JSON.parse(storedFoods));
          console.log("Foods data loaded from AsyncStorage:", JSON.parse(storedFoods));
        }
      } catch (error) {
        console.error("Error loading data from storage:", error);
      }
    },
    clearUser: async () => {
      setCart([]); // Xóa giỏ hàng khi đăng xuất
      setUser(null);
      setStoreData(null);
      setSellingTime([]);
      setFoods([]); // Clear foods data when clearing user data
      try {
        await AsyncStorage.removeItem("user"); // Clear user data from AsyncStorage
        await AsyncStorage.removeItem("storeData"); // Clear store data
        await AsyncStorage.removeItem("sellingTime"); // Clear sellingTime data
        await AsyncStorage.removeItem("foods"); // Clear foods data
      } catch (error) {
        console.error("Error clearing user data:", error);
      }
    },
    removeAllFoods: async () => {
      try {
        setFoods([]); // Xóa toàn bộ mảng món ăn
        await AsyncStorage.setItem("foods", JSON.stringify([])); // Cập nhật AsyncStorage
        console.log("Tất cả món ăn đã được xóa.");
      } catch (error) {
        console.error("Lỗi khi xóa tất cả món ăn:", error);
      }
    },
    removeFoodById: async (foodId) => {
      try {
        // Lọc bỏ món ăn có foodId tương ứng khỏi mảng foods
        const updatedFoods = foods.filter((food) => food._id !== foodId);

        // Kiểm tra log để đảm bảo foods đã được cập nhật
        console.log("Foods sau khi xóa:", updatedFoods);

        // Cập nhật foods trong GlobalContext
        setFoods(updatedFoods);

        // Cập nhật foods vào AsyncStorage
        await AsyncStorage.setItem("foods", JSON.stringify(updatedFoods));
        console.log(`Đã xóa món ăn có ID: ${foodId} khỏi GlobalContext và AsyncStorage.`);
      } catch (error) {
        console.error("Lỗi khi xóa món ăn:", error);
      }
    },
  };

  return <globalContext.Provider value={{ globalData, globalHandler }}>{children}</globalContext.Provider>;
};
