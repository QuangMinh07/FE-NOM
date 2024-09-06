import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { WelcomeScreen, Log, Login, SignUp, SignUpMailOrPhone, ForgotPassword, ResetPassword, OTPMail, OTPPhone } from "./src/Component/Login";
import { OrdersScreen, MessagesScreen, ProfileScreen } from "./src/Component/Home";
import {UpdateAccount} from "./src/Component/Profile";
import MyTabs from "./src/Component/Home/MyTabs"; // Import MyTabs từ file vừa tạo

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Login and Signup Screens */}
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="Log" component={Log} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="SignUpMailOrPhone" component={SignUpMailOrPhone} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="OTPMail" component={OTPMail} />
        <Stack.Screen name="OTPPhone" component={OTPPhone} />
        <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
        <Stack.Screen name="HomeKH" component={MyTabs} />

        <Stack.Screen name="MessagesScreen" component={MessagesScreen} />

        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        {/* Home after login */}
        {/* <Stack.Screen name="MyTabs" component={MyTabs} /> */}

        <Stack.Screen name="UpdateAccount" component={UpdateAccount} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
