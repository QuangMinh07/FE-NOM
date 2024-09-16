import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Import API module

const { width, height } = Dimensions.get("window");

export default function OTPMail({ route }) {
  const { email } = route.params; // Get email from params
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 ô OTP
  const [timeLeft, setTimeLeft] = useState(60); // Countdown timer for OTP validation, set to 1 minute
  const [canResend, setCanResend] = useState(false); // Controls when user can resend OTP
  const navigation = useNavigation();

  const otpInputRefs = useRef([]); // Create refs for the OTP inputs

  // Countdown for the OTP verification timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true); // Enable resend button when countdown finishes
    }
  }, [timeLeft]);

  const handleOTPChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    // If the value is entered and it's not the last input, move to the next input
    if (value.length === 1 && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }

    // Set the new OTP state
    setOtp(newOtp);
  };

  const handleVerifyOTP = async () => {
    const verificationCode = otp.join(""); // Combine OTP digits into a single string

    if (!email || verificationCode.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã OTP!");
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/verify-email",
        body: { email, verificationCode },
        sendToken: false,
      });

      // Log the response data
      console.log("Response data:", response);

      if (response.success) {
        Alert.alert("Thành công", response.message);
        navigation.navigate("Login"); // Navigate to the login screen after successful verification
      } else {
        Alert.alert("Lỗi", response.message);
      }
    } catch (error) {
      // Kiểm tra chi tiết lỗi từ backend và hiển thị chính xác
      let errorMessage = "Xác thực không thành công";

      // Kiểm tra nếu backend trả về thông tin trong trường 'error'
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }

      Alert.alert("Lỗi", errorMessage); // Hiển thị thông báo lỗi đầy đủ
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return; // Do not allow resend if timer is active

    try {
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/resend-verification-code",
        body: { email },
        sendToken: false,
      });

      console.log("Response data:", response);

      if (response.success) {
        Alert.alert("Thành công", "Mã xác thực đã được gửi lại");
        setTimeLeft(60); // Restart the 1-minute resend timer
        setCanResend(false); // Disable the resend button until the timer completes
      } else {
        Alert.alert("Lỗi", response.message);
      }
    } catch (error) {
      // Hiển thị thông báo lỗi chi tiết từ backend
      let errorMessage = "Gửi lại mã xác thực không thành công";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      Alert.alert("Lỗi", errorMessage); // Hiển thị thông báo lỗi đầy đủ
    }
  };


  return (
    // Dismiss keyboard when tapping outside the input fields
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

        {/* Email OTP Text */}
        <Text
          style={{
            fontSize: width * 0.04,
            marginBottom: 22,
            color: "#999",
            textAlign: "left",
            width: "100%",
          }}
        >
          Email OTP
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
              ref={(ref) => (otpInputRefs.current[index] = ref)} // Set the ref for each input
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
              // Move to previous input if backspace is pressed and it's not the first input
              onKeyPress={({ nativeEvent }) => {
                if (
                  nativeEvent.key === "Backspace" &&
                  index > 0 &&
                  !otp[index]
                ) {
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
            Gửi lại :
            <Text>{`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}</Text>
          </Text>
        </Pressable>

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={handleVerifyOTP} // Call handleVerifyOTP on press
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
