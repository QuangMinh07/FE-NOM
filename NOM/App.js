import React, { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import * as Notifications from "expo-notifications";

import { WelcomeScreen, Log, Login, SignUp, ForgotPassword, ResetPassword, OTPMail, OTPPhone, SignUpSeller, SignUpMailOrPhone, Route, SignUpShiper } from "./src/Component/Login";
import { OrdersScreen, MessagesScreen, ProfileScreen } from "./src/Component/Home";
import { HomeShiper, DeliveryODDetails, HistoryScreenSP, NotificationsScreenSP, ProfileShipper } from "./src/Component/Shipper";

import { CustomerNotice, FavoriteFood, Seemore, CustomerChat } from "./src/Component/Main";
import { RatingScreen } from "./src/Component/Rating";
import { DashboardScreen } from "./src/Component/Dashboard";

import { Seach,SeachAll, StoreKH, Shopping, EditAddress, Select, Orderfood, ReviewFood, OrderingProcess,SearchByGroup,ShoppingAll,CommentDetails} from "./src/Component/Customer";
import { LoginSeller, TermsDetails, TimeClose, Comment, Staff, UpdateHome, ListFood, AddEat, AddDishGroup, TimeScheduleSell, DishDetails, SellerProfileScreen, ChatSellerScreen, OrderManagementScreen, ImagePickerScreen, InvoiceDetails,Offers } from "./src/Component/SellerUser";
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

  // async function registerForPushNotificationsAsync() {
  //   let token;

  //   if (Platform.OS === "android" || Platform.OS === "ios") {
  //     try {
  //       // Thiết lập kênh thông báo cho Android
  //       if (Platform.OS === "android") {
  //         await Notifications.setNotificationChannelAsync("default", {
  //           name: "default",
  //           importance: Notifications.AndroidImportance.MAX,
  //           vibrationPattern: [0, 250, 250, 250],
  //           lightColor: "#FF231F7C",
  //         });
  //       }

  //       // Kiểm tra quyền thông báo
  //       const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //       console.log("Existing notification permission status:", existingStatus);
  //       let finalStatus = existingStatus;

  //       // Nếu chưa có quyền, yêu cầu quyền
  //       if (existingStatus !== "granted") {
  //         const { status } = await Notifications.requestPermissionsAsync();
  //         finalStatus = status;
  //         console.log("Notification permission after request:", finalStatus);
  //       }

  //       // Nếu quyền không được cấp, log lỗi và return
  //       if (finalStatus !== "granted") {
  //         alert("Failed to get push token for push notification!");
  //         console.log("Permission not granted");
  //         return;
  //       }

  //       // Lấy expoPushToken với projectId (cho cả Android và iOS)
  //       token = (await Notifications.getExpoPushTokenAsync({ projectId: "9e43321d-37b0-4cb5-8c99-0ca0009ba83d" })).data;
  //       console.log("Successfully obtained push token:", token);

  //       // Lưu token vào AsyncStorage nếu có
  //       if (token) {
  //         await AsyncStorage.setItem("expoPushToken", token);
  //         console.log("Token saved to AsyncStorage:", token);
  //       } else {
  //         console.log("Push token is undefined");
  //       }
  //     } catch (error) {
  //       console.log("Error while getting push token:", error);
  //     }
  //   } else {
  //     console.log("Push notifications are not supported on this platform.");
  //   }
  // }

  // useEffect(() => {
  //   const getToken = async () => {
  //     const token = await AsyncStorage.getItem("expoPushToken");
  //     console.log("Token retrieved from AsyncStorage after registration:", token);
  //   };

  //   getToken();
  // }, []);

  // useEffect(() => {
  //   registerForPushNotificationsAsync();
  // }, []);

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
          } else if (userData.roleId === "shipper") {
            setInitialRoute("HomeShiper"); // Điều hướng đến trang Home của shipper
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
        // console.error("Error checking login state:", error);
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
            <Stack.Screen name="Offers" component={Offers} />

            <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="UpdateAccount" component={UpdateAccount} />
            <Stack.Screen name="SignUpSeller" component={SignUpSeller} />
            <Stack.Screen name="SignUpShiper" component={SignUpShiper} />

            <Stack.Screen name="SignUpMailOrPhone" component={SignUpMailOrPhone} />
            <Stack.Screen name="Route" component={Route} />
            <Stack.Screen name="LoginSeller" component={LoginSeller} />
            <Stack.Screen name="InvoiceDetails" component={InvoiceDetails} />

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
            <Stack.Screen name="SeachAll" component={SeachAll} />

            <Stack.Screen name="SearchByGroup" component={SearchByGroup} />
            <Stack.Screen name="ShoppingAll" component={ShoppingAll} />
            <Stack.Screen name="CommentDetails" component={CommentDetails} />

            <Stack.Screen name="StoreKH" component={StoreKH} />
            <Stack.Screen name="OrderingProcess" component={OrderingProcess} />

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
            <Stack.Screen name="ProfileShipper" component={ProfileShipper} />

            <Stack.Screen name="RatingScreen" component={RatingScreen} />
            <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GlobalContext>
    </GestureHandlerRootView>
  );
};

export default App;
