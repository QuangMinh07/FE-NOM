import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image, Alert, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Đảm bảo đường dẫn chính xác đến file API

const { width, height } = Dimensions.get("window");

export default function SignUpMailOrPhone({ route }) {
  const { email, phone } = route.params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho trạng thái tải
  // Hàm gọi API để gửi mã OTP qua email
  const requestEmailOTP = async () => {
    try {
      setIsLoading(true);
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/send-verify-email", // Chỉ định phần đường dẫn sau baseURL
        body: { email },
      });

      Alert.alert("Thành công", response.message);
      // Chuyển sang màn hình OTPMail khi thành công
      navigation.navigate("OTPMail", { email });
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.error || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false); // Tắt vòng tròn loading sau khi xử lý xong
    }
  };

  const requestPhoneOTP = async () => {
    try {
      setIsLoading(true); // Hiển thị loading
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/send-phone-otp", // Đường dẫn API để gửi OTP qua số điện thoại
        body: { phone },
      });

      Alert.alert("Thành công", response.message);
      // Điều hướng đến trang OTPPhone và truyền số điện thoại
      navigation.navigate("OTPPhone", { phone });
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false); // Ẩn loading
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF", paddingHorizontal: 20 }}>
      {/* Logo và Slogan */}
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Tối màu nền nhưng vẫn hiển thị loading
            zIndex: 999, // Đảm bảo loading hiển thị trên cùng
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
        </View>
      )}
      <View style={{ alignItems: "center", marginBottom: height * 0.03 }}>
        <Image source={require("../../img/LOGOBLACK.png")} style={{ width: width * 0.3, height: undefined, aspectRatio: 1, resizeMode: "contain", marginBottom: height * 0.02 }} />
        <Text style={{ fontSize: 14, color: "#777", textAlign: "center", marginBottom: height * 0.02 }}>Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày</Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#E53935", textAlign: "center", marginBottom: height * 0.03 }}>Nhận mã xác minh qua</Text>
      </View>

      {/* Các lựa chọn Email OTP và Số điện thoại OTP */}
      <View style={{ width: "100%", marginBottom: height * 0.05 }}>
        <TouchableOpacity
          onPress={requestEmailOTP} // Gọi hàm requestEmailOTP khi nhấn
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 10,
            marginBottom: height * 0.02,
            borderColor: "#1111",
            borderWidth: 1,
            shadowColor: "#555",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3.84,
            elevation: 10,
          }}
        >
          <Text style={{ fontSize: 16, color: "#000" }}>Email OTP</Text>
          <Icon name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={requestPhoneOTP}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            paddingVertical: 15,
            paddingHorizontal: 15,
            borderRadius: 10,
            borderColor: "#1111",
            borderWidth: 1,
            shadowColor: "#555",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3.84,
            elevation: 10,
          }}
        >
          <Text style={{ fontSize: 16, color: "#000" }}>Số điện thoại OTP</Text>
          <Icon name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Nút tiếp tục */}
      <TouchableOpacity
        style={{
          width: "100%",
          height: 60,
          backgroundColor: "#E53935",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 30,
          marginBottom: height * 0.02,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
}
