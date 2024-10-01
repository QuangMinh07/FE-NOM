import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, Image, Alert, TouchableWithoutFeedback, Keyboard, AppState } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalContext } from "../../context/globalContext";
import { api, typeHTTP } from "../../utils/api"; // Import API module

const { width, height } = Dimensions.get("window");

export default function Login() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isRememberMeChecked, setRememberMeChecked] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { globalHandler } = useContext(globalContext);
  const navigation = useNavigation();
  const [appState, setAppState] = useState(AppState.currentState); // Theo dõi trạng thái ứng dụng

  // Tải thông tin tài khoản và mật khẩu từ AsyncStorage khi vào trang login
  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const savedPhone = await AsyncStorage.getItem("saved_phone");
        const savedPassword = await AsyncStorage.getItem("saved_password");
        const rememberMe = await AsyncStorage.getItem("remember_me");
        if (savedPhone && savedPassword && rememberMe === "true") {
          setPhone(savedPhone);
          setPassword(savedPassword);
          setRememberMeChecked(true); // Nếu có dữ liệu, đặt checkbox "Ghi nhớ mật khẩu" thành true
        }
      } catch (error) {
        console.log("Lỗi khi tải thông tin đã lưu:", error);
      }
    };

    loadRememberedCredentials();

    // Theo dõi khi trạng thái của ứng dụng thay đổi
    const handleAppStateChange = async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // Ứng dụng được mở lại, cập nhật trạng thái isOnline
        await api({
          method: typeHTTP.PUT,
          url: "/user/setOnlineStatus",
          body: { isOnline: true },
          sendToken: true,
        });
      } else if (nextAppState === "background") {
        // Ứng dụng bị đóng hoặc chuyển sang background, cập nhật trạng thái isOnline
        await api({
          method: typeHTTP.PUT,
          url: "/user/setOnlineStatus",
          body: { isOnline: false },
          sendToken: true,
        });
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      // Hủy bỏ subscription khi component bị unmount
      subscription.remove();
    };
  }, [appState]);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ số điện thoại và mật khẩu!");
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/login",
        body: { phone, password },
        sendToken: false,
      });

      if (response.success) {
        globalHandler.setUser(response.user);
        console.log("User data set in global context:", response.user);

        // Lưu token và user vào AsyncStorage
        await AsyncStorage.setItem("auth_token", response.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.user));

        console.log("Token saved:", response.token); // Log token để kiểm tra
        console.log("User saved:", response.user); // Log user để kiểm tra

        if (isRememberMeChecked) {
          await AsyncStorage.setItem("saved_phone", phone);
          await AsyncStorage.setItem("saved_password", password);
          await AsyncStorage.setItem("remember_me", "true");
        } else {
          await AsyncStorage.removeItem("saved_phone");
          await AsyncStorage.removeItem("saved_password");
          await AsyncStorage.setItem("remember_me", "false");
        }

        // Cập nhật trạng thái online sau khi đăng nhập thành công
        await api({
          method: typeHTTP.PUT,
          url: "/user/setOnlineStatus",
          body: { isOnline: true },
          sendToken: true,
        });

        // Kiểm tra role và điều hướng tới trang phù hợp
        if (response.user.roleId === "staff") {
          if (response.user.isActive) {
            navigation.navigate("HomeSeller");
          } else {
            Alert.alert("Tài khoản nhân viên chưa được kích hoạt. Vui lòng liên hệ quản trị viên.");
          }
        } else if (response.user.roleId === "customer") {
          console.log("Điều hướng đến HomeKH");
          navigation.navigate("HomeKH");
        } else if (response.user.roleId === "seller") {
          console.log("Điều hướng đến HomeSeller");
          navigation.navigate("HomeSeller");
        } else {
          Alert.alert("Lỗi", "Không xác định được vai trò người dùng!");
        }
      } else {
        Alert.alert("Lỗi", response.message);
      }
    } catch (error) {
      let errorMessage = "Đăng nhập không thành công";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      Alert.alert("Lỗi", errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
        }}
      >
        {/* Logo và Slogan */}
        <View style={{ alignItems: "center", marginBottom: height * 0.05 }}>
          <Image
            source={require("../../img/LOGOBLACK.png")}
            style={{
              width: width * 0.4,
              height: undefined,
              aspectRatio: 1,
              resizeMode: "contain",
              marginBottom: 10,
            }}
          />
          <Text
            style={{
              fontSize: 16,
              color: "#777",
              textAlign: "center",
              marginBottom: 5,
            }}
          >
            Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
          </Text>
        </View>

        {/* Form đăng nhập */}
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Text style={{ fontSize: 14, color: "#000", marginBottom: 5 }}>Số điện thoại</Text>
          <TextInput
            placeholder="Số điện thoại"
            style={{
              width: "100%",
              height: 50,
              borderColor: "#E53935",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 15,
              backgroundColor: "#FFFFFF",
            }}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={{ fontSize: 14, color: "#000", marginBottom: 5, marginTop: 10 }}>Mật khẩu</Text>
          <View style={{ position: "relative", marginBottom: 10 }}>
            <TextInput
              placeholder="Mật khẩu"
              secureTextEntry={!isPasswordVisible}
              style={{
                width: "100%",
                height: 50,
                borderColor: "#E53935",
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 15,
                backgroundColor: "#FFFFFF",
              }}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={{ position: "absolute", right: 15, top: 15 }} onPress={() => setPasswordVisible(!isPasswordVisible)}>
              <Icon name={isPasswordVisible ? "visibility" : "visibility-off"} size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ghi nhớ mật khẩu */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
            marginBottom: 30,
          }}
        >
          <TouchableOpacity style={{ marginRight: 10 }} onPress={() => setRememberMeChecked(!isRememberMeChecked)}>
            <View
              style={{
                width: 18,
                height: 18,
                borderColor: "#E53935",
                borderWidth: 1,
                borderRadius: 4,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: isRememberMeChecked ? "#E53935" : "#FFFFFF",
              }}
            >
              {isRememberMeChecked && <Icon name="check" size={14} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
          <Text style={{ color: "#000", fontSize: 14 }}>Ghi nhớ mật khẩu</Text>
        </View>

        {/* Nút đăng nhập */}
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            width: "100%",
            height: 60,
            backgroundColor: "#E53935",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>Đăng nhập</Text>
        </TouchableOpacity>

        {/* Quên mật khẩu */}
        <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 10 }}>
          <Text onPress={() => navigation.navigate("ForgotPassword")} style={{ color: "#E53935", fontSize: 14 }}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>

        {/* Đăng nhập với */}
        <Text style={{ color: "#777", fontSize: 16, marginBottom: 20 }}>Đăng nhập với</Text>

        {/* Đăng nhập với Facebook và Google */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 30,
            justifyContent: "space-between",
            width: "60%",
          }}
        >
          <TouchableOpacity>
            <Image source={require("../../img/logos_facebook.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../../img/flat-color-icons_google.png")} style={{ width: 50, height: 50, resizeMode: "contain" }} />
          </TouchableOpacity>
        </View>

        {/* Đăng ký tài khoản */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#000", fontSize: 14 }}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={{ color: "#E53935", fontSize: 14, fontWeight: "bold" }}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
