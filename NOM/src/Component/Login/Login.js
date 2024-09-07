import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thay đổi từ Cookies sang AsyncStorage
import { globalContext } from "../../context/globalContext"; // Import global context

const { width, height } = Dimensions.get("window");

export default function Login() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isRememberMeChecked, setRememberMeChecked] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { globalHandler } = useContext(globalContext); // Access global context
  const navigation = useNavigation();

  // Kiểm tra token trong AsyncStorage
  const checkTokenInStorage = async () => {
    const token = await AsyncStorage.getItem("auth_token"); // Lấy token từ AsyncStorage
    if (token) {
      console.log("Token đã được lưu vào AsyncStorage:", token);
    } else {
      console.log("Token chưa được lưu vào AsyncStorage.");
    }
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ số điện thoại và mật khẩu!");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.21:5000/v1/user/login",
        {
          phone,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Lưu thông tin user vào global context
        globalHandler.setUser(response.data.user);

        // Lưu token vào AsyncStorage với thời gian tồn tại là 7 ngày
        await AsyncStorage.setItem('auth_token', response.data.token);

        // Kiểm tra token trong AsyncStorage
        checkTokenInStorage();

        Alert.alert("Thành công", response.data.message);
        navigation.navigate("HomeKH"); // Chuyển hướng đến trang Home
      } else {
        Alert.alert("Lỗi", response.data.message);
      }
    } catch (error) {
      let errorMessage = "Đăng nhập không thành công";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
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
          <Text style={{ fontSize: 14, color: "#000", marginBottom: 5 }}>
            Số điện thoại
          </Text>
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

          <Text style={{ fontSize: 14, color: "#000", marginBottom: 5 }}>
            Mật khẩu
          </Text>
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
            <TouchableOpacity
              style={{ position: "absolute", right: 15, top: 15 }}
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            >
              <Icon
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={20}
                color="#E53935"
              />
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
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => setRememberMeChecked(!isRememberMeChecked)}
          >
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
              {isRememberMeChecked && (
                <Icon name="check" size={14} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={{ color: "#000", fontSize: 14 }}>Ghi nhớ mật khẩu</Text>
        </View>

        {/* Nút đăng nhập */}
        <TouchableOpacity
          onPress={handleLogin} // Call the handleLogin function on press
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
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>
            Đăng nhập
          </Text>
        </TouchableOpacity>

        {/* Quên mật khẩu */}
        <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 10 }}>
          <Text
            onPress={() => navigation.navigate("ForgotPassword")}
            style={{ color: "#E53935", fontSize: 14 }}
          >
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>

        {/* Đăng nhập với */}
        <Text style={{ color: "#777", fontSize: 16, marginBottom: 20 }}>
          Đăng nhập với
        </Text>

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
            <Image
              source={require("../../img/logos_facebook.png")} // Thay bằng đường dẫn đúng đến logo Facebook
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../img/flat-color-icons_google.png")} // Thay bằng đường dẫn đúng đến logo Google
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </View>

        {/* Đăng ký tài khoản */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#000", fontSize: 14 }}>
            Chưa có tài khoản?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text
              style={{ color: "#E53935", fontSize: 14, fontWeight: "bold" }}
            >
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
