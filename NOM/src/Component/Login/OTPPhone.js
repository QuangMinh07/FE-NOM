import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Alert, Keyboard, TouchableWithoutFeedback, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from "firebase/compat/app";
import { firebaseConfig } from "../../utils/firebase";
import { api, typeHTTP } from "../../utils/api";
import { formatPhoneByFireBase } from "../../utils/call";

const { width, height } = Dimensions.get("window");

export default function OTPPhone({ route }) {
  const { phone } = route.params; // Nhận số điện thoại từ params
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 ô OTP
  const [timeLeft, setTimeLeft] = useState(60); // Countdown timer cho OTP, mặc định là 1 phút
  const [canResend, setCanResend] = useState(false); // Điều khiển khi nào người dùng có thể gửi lại OTP
  const [verificationId, setVerificationId] = useState(null); // ID xác thực của Firebase
  const recaptchaVerifier = useRef(null); // ReCAPTCHA verifier
  const navigation = useNavigation();
  const otpInputRefs = useRef([]); // Tạo refs cho các ô nhập OTP

  // Khởi tạo xác thực qua số điện thoại bằng Firebase
  useEffect(() => {
    const sendOTP = async () => {
      try {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const formattedPhone = formatPhoneByFireBase(phone); // Sử dụng hàm formatPhoneByFireBase đã import
        const verificationId = await phoneProvider.verifyPhoneNumber(formattedPhone, recaptchaVerifier.current);
        setVerificationId(verificationId);
      } catch (error) {
        console.error("Error sending OTP:", error.message);
        Alert.alert("Lỗi", `Không thể gửi mã OTP: ${error.message}`);
      }
    };
    sendOTP();
  }, [phone]);

  // Countdown cho bộ đếm thời gian OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true); // Kích hoạt nút gửi lại khi đếm ngược kết thúc
    }
  }, [timeLeft]);

  const handleOTPChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    // Nếu có giá trị và không phải ô cuối cùng, chuyển đến ô tiếp theo
    if (value.length === 1 && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }

    setOtp(newOtp); // Cập nhật giá trị OTP
  };

  const handleVerifyOTP = async () => {
    const verificationCode = otp.join(""); // Ghép các chữ số OTP thành một chuỗi

    if (verificationCode.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã OTP!");
      return;
    }

    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      await firebase.auth().signInWithCredential(credential);

      // Sau khi xác thực thành công qua Firebase, cập nhật trạng thái xác thực trên backend
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/verify-PhoneOtp",
        body: { phone },
        sendToken: false,
      });

      if (response.success) {
        Alert.alert("Thành công", response.message);
        navigation.navigate("Login"); // Điều hướng đến màn hình đăng nhập sau khi xác thực thành công
      } else {
        Alert.alert("Lỗi", response.message);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Xác thực không thành công");
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return; // Không cho phép gửi lại nếu timer còn thời gian

    try {
      setTimeLeft(60); // Khởi động lại timer 1 phút
      setCanResend(false); // Tắt nút gửi lại cho đến khi timer kết thúc
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const newVerificationId = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current);
      setVerificationId(newVerificationId);
      Alert.alert("Thành công", "Mã xác thực đã được gửi lại");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể gửi lại mã xác thực");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />

        {/* Logo */}
        <Image
          source={require("../../img/LOGOBLACK.png")}
          style={{
            width: width * 0.4,
            height: width * 0.4,
            marginBottom: 20,
          }}
        />

        {/* Main Title */}
        <Text
          style={{
            fontSize: width * 0.045,
            textAlign: "center",
            marginBottom: 20,
            color: "#777",
            paddingHorizontal: 10,
          }}
        >
          Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
        </Text>

        {/* Verification Text */}
        <Text
          style={{
            fontSize: width * 0.06,
            fontWeight: "bold",
            color: "#E53935",
            marginBottom: 10,
          }}
        >
          Xác minh
        </Text>
        <Text
          style={{
            fontSize: width * 0.03,
            textAlign: "center",
            marginBottom: 20,
            color: "#E53935",
            paddingHorizontal: 20,
          }}
        >
          NOM đã gửi một mã để xác minh tới tài khoản của bạn
        </Text>

        {/* Phone OTP Text */}
        <Text
          style={{
            fontSize: width * 0.04,
            marginBottom: 22,
            color: "#999",
            textAlign: "left",
            width: "100%",
          }}
        >
          Phone OTP
        </Text>

        {/* OTP Input */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 30,
            paddingHorizontal: width * 0.05,
          }}
        >
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpInputRefs.current[index] = ref)} // Set ref cho mỗi ô input
              value={digit}
              style={{
                width: width * 0.12,
                height: width * 0.12,
                borderWidth: 1,
                borderColor: "#E53935",
                borderRadius: 10,
                textAlign: "center",
                fontSize: width * 0.05,
                color: "#E53935",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 5,
                marginHorizontal: width * 0.015,
              }}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(value) => handleOTPChange(value, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
                  otpInputRefs.current[index - 1].focus();
                }
              }}
            />
          ))}
        </View>

        {/* Countdown */}
        <Pressable onPress={handleResendCode} disabled={!canResend}>
          <Text
            style={{
              fontSize: width * 0.04,
              color: "#E53935",
              marginBottom: 30,
            }}
          >
            Gửi lại : <Text>{`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}</Text>
          </Text>
        </Pressable>

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={handleVerifyOTP}
          style={{
            backgroundColor: "#E53935",
            paddingHorizontal: width * 0.2,
            paddingVertical: height * 0.02,
            borderRadius: 30,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: width * 0.05,
              fontWeight: "bold",
            }}
          >
            Xác nhận
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
