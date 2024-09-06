import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

// Lấy kích thước màn hình
const { width, height } = Dimensions.get('window');

export default function OTPMail() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 ô OTP
  const [timeLeft, setTimeLeft] = useState(50); // Optional timer
  const navigation = useNavigation();  // Sử dụng useNavigation

  const handleOTPChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <View style={{
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    }}>
      {/* Logo */}
      <Image 
        source={require('../../img/LOGOBLACK.png')} 
        style={{ 
          width: width * 0.4, // Tỷ lệ theo kích thước màn hình
          height: width * 0.4, 
          marginBottom: 20, // Tăng khoảng cách dưới logo
        }} 
      />

      {/* Main Title */}
      <Text style={{ 
        fontSize: width * 0.045, // Kích thước chữ linh hoạt theo chiều rộng
        textAlign: 'center',
        marginBottom: 20, // Tăng khoảng cách giữa tiêu đề chính và phần xác minh
        color: '#777',
        paddingHorizontal: 10, // Thêm padding ngang để căn giữa cho màn hình rộng hơn
      }}>
        Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
      </Text>

      {/* Verification Text */}
      <Text style={{ 
        fontSize: width * 0.06, 
        fontWeight: 'bold', 
        color: '#E53935', 
        marginBottom: 10 
      }}>
        Xác minh
      </Text>
      <Text style={{ 
        fontSize: width * 0.03, 
        textAlign: 'center', 
        marginBottom: 20, 
        color: '#E53935',
        paddingHorizontal: 20, // Thêm padding ngang để khoảng cách từ lề đều hơn
      }}>
        NOM đã gửi một mã để xác minh tới tài khoản của bạn
      </Text>
      
      {/* Email OTP Text */}
      <Text style={{ 
        fontSize: width * 0.04, 
        marginBottom: 22, 
        color: '#999',
        textAlign: 'left', // Căn trái
        width: '100%', // Đảm bảo chiều rộng của text để căn trái
      }}>
        Email OTP
      </Text>

      {/* OTP Input */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 30, // Điều chỉnh khoảng cách dưới để tạo độ thoáng
        paddingHorizontal: width * 0.05, // Thêm padding ngang cho container OTP
      }}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            style={{
              width: width * 0.12, // Điều chỉnh kích thước theo chiều rộng
              height: width * 0.12,
              borderWidth: 1,
              borderColor: '#E53935',
              borderRadius: 10,
              textAlign: 'center',
              fontSize: width * 0.05, // Kích thước chữ dựa trên chiều rộng
              color: '#E53935',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 5,
              marginHorizontal: width * 0.015, // Khoảng cách giữa các ô được điều chỉnh đều hơn
            }}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(value) => handleOTPChange(value, index)}
          />
        ))}
      </View>

      {/* Countdown */}
      <Text style={{ 
        fontSize: width * 0.04, 
        color: '#E53935', 
        marginBottom: 30, // Tăng khoảng cách để thoáng hơn
      }}>
        Gửi lại : <Text>{`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}</Text>
      </Text>

      {/* Confirm Button */}
      <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}

      style={{
        backgroundColor: '#E53935',
        paddingHorizontal: width * 0.2, // Điều chỉnh padding theo chiều rộng màn hình
        paddingVertical: height * 0.02, // Điều chỉnh padding theo chiều cao
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
        marginBottom: 20, // Tăng khoảng cách dưới nút xác nhận
      }}>
        <Text style={{ 
          color: '#fff', 
          fontSize: width * 0.05, 
          fontWeight: 'bold' 
        }}>
          Xác nhận
        </Text>
      </TouchableOpacity>
    </View>
  );
}
