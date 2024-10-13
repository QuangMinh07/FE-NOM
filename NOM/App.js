import React, { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { WelcomeScreen, Log, Login, SignUp, ForgotPassword, ResetPassword, OTPMail, OTPPhone, SignUpSeller, SignUpMailOrPhone, Route, SignUpShiper } from "./src/Component/Login";
import { OrdersScreen, MessagesScreen, ProfileScreen } from "./src/Component/Home";
import {HomeShiper, DeliveryODDetails,HistoryScreenSP,NotificationsScreenSP} from "./src/Component/Shipper";

import {  CustomerNotice, FavoriteFood, Seemore , CustomerChat} from "./src/Component/Main";

import { Seach, StoreKH, Shopping, EditAddress, Select, Orderfood, ReviewFood } from "./src/Component/Customer";
import { LoginSeller, TermsDetails, TimeClose, Comment, Staff, UpdateHome, ListFood, AddEat, AddDishGroup, TimeScheduleSell, DishDetails, SellerProfileScreen, ChatSellerScreen, OrderManagementScreen, ImagePickerScreen } from "./src/Component/SellerUser";
import { UpdateAccount, InformationUser, Information, UpdateInformation } from "./src/Component/Profile";
import { GlobalContext } from "./src/context/globalContext";
import { api, typeHTTP } from "./src/utils/api";
import CustomerTabs from "./src/Component/Home/CustomerTabs"; // Import các tab cho customer
import SellerTabs from "./src/Component/SellerUser/SellerTabs"; // Import các tab cho seller

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("");
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        // Lấy token và thông tin người dùng từ AsyncStorage
        const token = await AsyncStorage.getItem("auth_token");
        const user = await AsyncStorage.getItem("user");
        console.log("Token:", token); // Thêm log để kiểm tra token
        console.log("User:", user); // Thêm log để kiểm tra user

        if (token && user) {
          const userData = JSON.parse(user); // Parse lại thông tin user từ chuỗi JSON
          console.log("User Data Role ID:", userData.roleId); // Log roleId
          console.log("User Data isActive:", userData.isActive); // Log isActive

          // Điều hướng đến trang tương ứng dựa trên role của người dùng
          if (userData.roleId === "customer") {
            setInitialRoute("HomeKH"); // Điều hướng đến trang Home của khách hàng
          } else if (userData.roleId === "seller") {
            setInitialRoute("HomeSeller"); // Điều hướng đến trang Home của người bán
          } else if (userData.roleId === "staff" && userData.isActive) {
            setInitialRoute("HomeSeller"); // Điều hướng đến trang Home của nhân viên nếu isActive là true
          } else {
            setInitialRoute("WelcomeScreen"); // Fallback nếu không xác định được role
          }

          // Cập nhật trạng thái online sau khi kiểm tra thành công
          await api({
            method: typeHTTP.PUT,
            url: "/user/setOnlineStatus",
            body: { isOnline: true },
            sendToken: true,
          });
        } else {
          // Nếu không có token, điều hướng về màn hình Welcome/Login
          setInitialRoute("WelcomeScreen");
        }
      } catch (error) {
        console.error("Error checking login state:", error);
        setInitialRoute("WelcomeScreen"); // Nếu có lỗi, điều hướng về màn hình Welcome/Login
      } finally {
        setIsLoading(false); // Dừng trạng thái loading sau khi hoàn thành kiểm tra
      }
    };

    // Gọi hàm kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
    checkLoginState();

    const handleAppStateChange = async (nextAppState) => {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        if (nextAppState === "active") {
          await api({
            method: typeHTTP.PUT,
            url: "/user/setOnlineStatus",
            body: { isOnline: true },
            sendToken: true,
          });
        } else if (nextAppState === "inactive" || nextAppState === "background") {
          await api({
            method: typeHTTP.PUT,
            url: "/user/setOnlineStatus",
            body: { isOnline: false },
            sendToken: true,
          });
        }
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove(); // Hủy bỏ event listener khi component bị hủy
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            {/* Điều hướng cho CustomerTabs */}
            <Stack.Screen name="HomeKH" component={CustomerTabs} />
            {/* Điều hướng cho SellerTabs */}
            <Stack.Screen name="HomeSeller" component={SellerTabs} />
            <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="UpdateAccount" component={UpdateAccount} />
            <Stack.Screen name="SignUpSeller" component={SignUpSeller} />
            <Stack.Screen name="SignUpShiper" component={SignUpShiper} />

            <Stack.Screen name="SignUpMailOrPhone" component={SignUpMailOrPhone} />
            <Stack.Screen name="Route" component={Route} />
            <Stack.Screen name="LoginSeller" component={LoginSeller} />
            <Stack.Screen name="InformationUser" component={InformationUser} />
            <Stack.Screen name="Information" component={Information} />
            <Stack.Screen name="UpdateInformation" component={UpdateInformation} />
            <Stack.Screen name="TermsDetails" component={TermsDetails} />
            <Stack.Screen name="Comment" component={Comment} />
            <Stack.Screen name="UpdateHome" component={UpdateHome} />
            <Stack.Screen name="ListFood" component={ListFood} />
            <Stack.Screen name="TimeClose" component={TimeClose} />
            <Stack.Screen name="Staff" component={Staff} />
            <Stack.Screen name="AddEat" component={AddEat} />
            <Stack.Screen name="AddDishGroup" component={AddDishGroup} />
            <Stack.Screen name="TimeScheduleSell" component={TimeScheduleSell} />
            <Stack.Screen name="DishDetails" component={DishDetails} />
            <Stack.Screen name="Seach" component={Seach} />
            <Stack.Screen name="StoreKH" component={StoreKH} />
            <Stack.Screen name="Shopping" component={Shopping} />
            <Stack.Screen name="EditAddress" component={EditAddress} />
            <Stack.Screen name="Select" component={Select} />
            <Stack.Screen name="Orderfood" component={Orderfood} />
            <Stack.Screen name="ReviewFood" component={ReviewFood} />
            <Stack.Screen name="ChatSellerScreen" component={ChatSellerScreen} />
            <Stack.Screen name="SellerProfileScreen " component={SellerProfileScreen} />
            <Stack.Screen name="OrderManagementScreen " component={OrderManagementScreen} />
            <Stack.Screen name="ImagePickerScreen " component={ImagePickerScreen} />
            <Stack.Screen name="CustomerNotice" component={CustomerNotice} />
            <Stack.Screen name="FavoriteFood" component={FavoriteFood} />
            <Stack.Screen name="Seemore" component={Seemore} />
            <Stack.Screen name="CustomerChat" component={CustomerChat} />
            <Stack.Screen name="HomeShiper" component={HomeShiper} />
            <Stack.Screen name="DeliveryODDetails" component={DeliveryODDetails} />
            <Stack.Screen name="HistoryScreenSP" component={HistoryScreenSP} />
            <Stack.Screen name="NotificationsScreenSP" component={NotificationsScreenSP} />
          </Stack.Navigator>
        </NavigationContainer>
      </GlobalContext>
    </GestureHandlerRootView>
  );
};

export default App;
