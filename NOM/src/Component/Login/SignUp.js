import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, Image, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Import module API

const { width, height } = Dimensions.get("window");

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho trạng thái tải
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!username || !phone || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ các trường!");
      return;
    }

    setIsLoading(true); // Bật trạng thái tải trước khi gọi API

    try {
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/register",
        body: {
          username,
          phone,
          email,
          password,
        },
        sendToken: false,
      });

      if (response.success) {
        Alert.alert("Thành công", response.message);
        navigation.navigate("SignUpMailOrPhone", { email, phone });
      } else {
        Alert.alert("Lỗi", response.message);
      }
    } catch (error) {
      let errorMessage = "Đăng ký không thành công";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setIsLoading(false); // Tắt trạng thái tải sau khi xử lý xong
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        {/* Hiển thị vòng tròn tải khi isLoading là true */}
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
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền tối khi loading
              zIndex: 999,
            }}
          >
            <ActivityIndicator size="large" color="#E53935" />
          </View>
        )}

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
              fontWeight: "bold",
              color: "#000",
              textAlign: "center",
            }}
          >
            NOM - NGON ĐỒNG Ý
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#888888",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
          </Text>
        </View>

        {/* Form đăng ký */}
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Text style={{ fontSize: 14, color: "#000", marginBottom: 5 }}>Tên đăng nhập</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Tên đăng nhập"
            style={{
              width: "100%",
              height: 50,
              borderColor: "#E53935",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 15,
              marginBottom: 15,
              backgroundColor: "#FFFFFF",
            }}
          />

          <Text style={{ fontSize: 14, color: "#000", marginBottom: 5 }}>Số điện thoại</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Số điện thoại"
            style={{
              width: "100%",
              height: 50,
              borderColor: "#E53935",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 15,
              marginBottom: 15,
              backgroundColor: "#FFFFFF",
            }}
            keyboardType="phone-pad"
          />

          <Text style={{ fontSize: 14, color: "#000", marginBottom: 5 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={{
              width: "100%",
              height: 50,
              borderColor: "#E53935",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 15,
              marginBottom: 15,
              backgroundColor: "#FFFFFF",
            }}
            keyboardType="email-address"
          />

          <Text style={{ fontSize: 14, color: "#000", marginBottom: 5 }}>Mật khẩu</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
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
            />
            <TouchableOpacity style={{ position: "absolute", right: 15, top: 15 }} onPress={() => setPasswordVisible(!isPasswordVisible)}>
              <Icon name={isPasswordVisible ? "visibility" : "visibility-off"} size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nút đăng ký */}
        <TouchableOpacity
          onPress={handleSignUp}
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
          disabled={isLoading} // Vô hiệu hóa nút khi đang tải
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>Đăng ký</Text>
        </TouchableOpacity>

        {/* Đã có tài khoản */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#000", fontSize: 14 }}>Đã có tài khoản? </Text>
          <TouchableOpacity>
            <Text onPress={() => navigation.navigate("Login")} style={{ color: "#E53935", fontSize: 14, fontWeight: "bold" }}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
