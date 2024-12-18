import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { api, typeHTTP } from "../../utils/api"; // Import API module

const { width, height } = Dimensions.get("window");

export default function ForgotPassword() {
  const [email, setEmail] = useState(""); // Thêm state để lưu email người dùng nhập
  const navigation = useNavigation(); // Sử dụng useNavigation

  const handleSendResetEmail = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }

    // Kiểm tra định dạng input
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Regex kiểm tra email
    const isPhone = /^[0-9]{10,15}$/.test(email); // Regex kiểm tra số điện thoại (10-15 chữ số)

    console.log("isEmail:", isEmail, "isPhone:", isPhone); // Kiểm tra kết quả regex

    console.log("Kiểm tra lần cuối trước điều kiện:");
    console.log("isEmail:", isEmail, "isPhone:", isPhone);

    if (!isEmail && !isPhone) {
      console.log("Cả isEmail và isPhone đều sai, báo lỗi!");
      Alert.alert("Lỗi", "Vui lòng nhập email hoặc số điện thoại hợp lệ");
      return;
    }

    try {
      // Gọi API để xác nhận email tồn tại
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/send-reset-password", // Đảm bảo URL khớp với backend
        body: { emailOrPhone: email.trim() },
        sendToken: false,
      });

      if (response.success) {
        Alert.alert("Thành công", response.msg);
        // Điều hướng và truyền email đến trang ResetPassword
        // Gọi hàm phù hợp
        if (isEmail) {
          await requestEmailOTP(); // Gửi OTP qua email
        } else if (isPhone) {
          await requesPhoneOTP(); // Gửi OTP qua số điện thoại
        }

        // navigation.navigate("ResetPassword", { email });
      } else {
        Alert.alert("Lỗi", response.msg);
      }
    } catch (error) {
      let errorMessage = "Gửi mã đến email thất bại";

      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          errorMessage = "Email hoặc số điện thoại không tồn tại";
        } else if (error.response.status === 500) {
          errorMessage = "Lỗi hệ thống. Vui lòng thử lại.";
        } else {
          errorMessage = error.response.data.msg || error.response.data.error || errorMessage;
        }
      }
      Alert.alert("Lỗi", errorMessage);
    }
  };

  const requestEmailOTP = async () => {
    try {
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/send-verify-email", // Chỉ định phần đường dẫn sau baseURL
        body: { email },
      });

      Alert.alert("Thành công", response.message);
      // Chuyển sang màn hình OTPMail khi thành công
      navigation.navigate("OTPMailOrPhone", { email });
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.error || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  const requesPhoneOTP = async () => {
    try {
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/send-phone-otp", // Chỉ định phần đường dẫn sau baseURL
        body: { phone: email.trim() },
      });

      Alert.alert("Thành công", response.message);
      // Chuyển sang màn hình OTPMail khi thành công
      navigation.navigate("OTPMailOrPhone", { phone: email.trim() });
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.error || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF", paddingHorizontal: 20 }}>
      {/* Logo và Slogan */}
      <View style={{ alignItems: "center", marginBottom: height * 0.04 }}>
        <Image
          source={require("../../img/LOGOBLACK.png")} // Đường dẫn đúng đến logo của bạn
          style={{ width: width * 0.35, height: undefined, aspectRatio: 1, resizeMode: "contain", marginBottom: height * 0.02 }}
        />
        <Text style={{ fontSize: 14, color: "#777", textAlign: "center", marginBottom: height * 0.02 }}>Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày</Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#E53935", textAlign: "center", marginBottom: height * 0.04 }}>Quên mật khẩu</Text>
      </View>

      {/* Form nhập Số điện thoại/gmail */}
      <View style={{ width: "100%", marginBottom: height * 0.05 }}>
        <Text style={{ color: "#000", fontSize: 14, marginBottom: 5 }}>Số điện thoại/Gmail</Text>

        <View style={{ position: "relative", width: "100%" }}>
          <TextInput
            placeholder="Số điện thoại/gmail"
            style={{
              width: "100%",
              height: 50,
              borderColor: "#E53935",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 15,
              backgroundColor: "#FFFFFF",
              marginBottom: 10,
            }}
            value={email}
            onChangeText={setEmail} // Cập nhật email khi người dùng nhập
            keyboardType="email-address" // Sử dụng kiểu nhập cho email
          />
        </View>
      </View>

      {/* Nút xác nhận */}
      <TouchableOpacity
        onPress={handleSendResetEmail} // Gọi hàm xử lý khi người dùng nhấn nút
        style={{
          width: "100%",
          height: 60,
          backgroundColor: "#E53935",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 30,
          marginBottom: height * 0.05,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>Tiếp tục</Text>
      </TouchableOpacity>

      {/* Đã có tài khoản */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: "#000", fontSize: 14 }}>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ color: "#E53935", fontSize: 14, fontWeight: "bold" }}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
