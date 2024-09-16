import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { api, typeHTTP } from '../../utils/api'; // Import API module

const { width, height } = Dimensions.get('window');

export default function ResetPassword({ route }) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const { email } = route.params; // Nhận email từ route params

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.POST,
        url: '/user/reset-password', // Đường dẫn tới API cập nhật mật khẩu
        body: { email, newPassword, confirmPassword },
        sendToken: false,
      });

      if (response.success) {
        Alert.alert("Thành công", response.msg);
        navigation.navigate('Login'); // Điều hướng đến trang đăng nhập sau khi đổi mật khẩu thành công
      } else {
        Alert.alert("Lỗi", response.msg);
      }
    } catch (error) {
      let errorMessage = "Cập nhật mật khẩu thất bại";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.msg || error.response.data.error || errorMessage;
      }
      Alert.alert("Lỗi", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // Điều chỉnh khi bàn phím xuất hiện
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>

          {/* Logo và Slogan */}
          <View style={{ alignItems: 'center', marginBottom: height * 0.05 }}>
            <Image
              source={require('../../img/LOGOBLACK.png')}
              style={{ width: width * 0.35, height: undefined, aspectRatio: 1, resizeMode: 'contain', marginBottom: height * 0.02 }}
            />
            <Text style={{ fontSize: 14, color: '#777', textAlign: 'center', marginBottom: height * 0.02 }}>
              Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
            </Text>
          </View>

          {/* Mật khẩu mới */}
          <View style={{ width: '100%', marginBottom: height * 0.03 }}>
            <Text style={{ color: '#000', fontSize: 14, marginBottom: 5 }}>Mật khẩu mới</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                placeholder="Mật khẩu mới"
                secureTextEntry={!isPasswordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
                style={{
                  width: '100%',
                  height: 50,
                  borderColor: '#E53935',
                  borderWidth: 2,
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  backgroundColor: '#FFFFFF',
                  marginBottom: 20,
                }}
              />
              <TouchableOpacity
                style={{ position: 'absolute', right: 15, top: 15 }}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                <Icon name={isPasswordVisible ? "visibility" : "visibility-off"} size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nhập lại mật khẩu */}
          <View style={{ width: '100%', marginBottom: height * 0.03 }}>
            <Text style={{ color: '#000', fontSize: 14, marginBottom: 5 }}>Nhập lại mật khẩu</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={{
                  width: '100%',
                  height: 50,
                  borderColor: '#E53935',
                  borderWidth: 2,
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  backgroundColor: '#FFFFFF',
                  marginBottom: 20,
                }}
              />
              <TouchableOpacity
                style={{ position: 'absolute', right: 15, top: 15 }}
                onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                <Icon name={isConfirmPasswordVisible ? "visibility" : "visibility-off"} size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nút xác nhận */}
          <TouchableOpacity
            onPress={handleResetPassword} // Gọi hàm xử lý khi nhấn nút
            style={{
              width: '100%',
              height: 60,
              backgroundColor: '#E53935',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30,
              marginBottom: height * 0.05,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Xác nhận</Text>
          </TouchableOpacity>

          {/* Đã có tài khoản */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#000', fontSize: 14 }}>Chưa có tài khoản? </Text>
            <TouchableOpacity>
              <Text
                onPress={() => navigation.navigate('SignUp')}
                style={{ color: '#E53935', fontSize: 14, fontWeight: 'bold' }}>Đăng ký</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
