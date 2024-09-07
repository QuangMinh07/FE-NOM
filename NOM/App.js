import React, { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  WelcomeScreen,
  Log,
  Login,
  SignUp,
  ForgotPassword,
  ResetPassword,
  OTPMail,
  OTPPhone,
  SignUpSeller,
} from "./src/Component/Login";
import {
  OrdersScreen,
  MessagesScreen,
  ProfileScreen,
} from "./src/Component/Home";
import { UpdateAccount } from "./src/Component/Profile";
import MyTabs from "./src/Component/Home/MyTabs"; // Import MyTabs từ file vừa tạo
import { GlobalContext } from "./src/context/globalContext";

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Login"); // Default route is Login

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token"); // Lấy token từ AsyncStorage
        if (token) {
          setInitialRoute("HomeKH"); // Nếu có token, điều hướng đến HomeKH
        } else {
          setInitialRoute("WelcomeScreen"); // Nếu không có token, điều hướng đến Login
        }
      } catch (error) {
        console.error("Error checking login state:", error);
        setInitialRoute("WelcomeScreen"); // Nếu lỗi, điều hướng đến Login
      } finally {
        setIsLoading(false); // Dừng hiển thị ActivityIndicator sau khi kiểm tra xong
      }
    };

    checkLoginState();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return (
    <GlobalContext>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="Log" component={Log} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="OTPMail" component={OTPMail} />
          <Stack.Screen name="OTPPhone" component={OTPPhone} />
          <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
          <Stack.Screen name="HomeKH" component={MyTabs} />
          <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="UpdateAccount" component={UpdateAccount} />
          <Stack.Screen name="SignUpSeller" component={SignUpSeller} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalContext>
  );
};

export default App;
