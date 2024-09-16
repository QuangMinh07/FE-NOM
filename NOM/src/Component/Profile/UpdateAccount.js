import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { api, typeHTTP } from '../../utils/api'; // Import the API helper

const { width, height } = Dimensions.get('window');

export default function UpdateAccount({ route, navigation }) {
  const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { userId } = route.params; // Get the serializable userId from params

  useEffect(() => {
    console.log('User ID:', userId); // You can now use the userId for API requests or other logic
  }, [userId]);

  const handleUpdatePassword = async () => {
    // Kiểm tra nếu các trường chưa được nhập
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ các trường.");
      return;
    }

    // Kiểm tra nếu mật khẩu mới và nhập lại mật khẩu không giống nhau
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      const body = {
        currentPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      };

      const response = await api({
        method: typeHTTP.PUT,
        url: `/user/changePassword/${userId}`, // Thay thế userId bằng ID người dùng thực tế
        body: body,
        sendToken: true, // Gửi token xác thực
      });

      // Nếu backend trả về phản hồi có thông báo
      if (response && response.msg) {
        Alert.alert("Thành công", response.msg);
        navigation.navigate("Login");
      } else {
        Alert.alert("Lỗi", "Không thể cập nhật mật khẩu.");
      }
    } catch (error) {
      // Lấy thông báo lỗi cụ thể từ backend
      const backendErrorMsg = error.response?.data?.msg || "Lỗi server, vui lòng thử lại sau.";
      Alert.alert("Lỗi", backendErrorMsg); // Hiển thị thông báo lỗi từ backend
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: height * 0.05 }}>
            <Image
              source={require('../../img/LOGOBLACK.png')}
              style={{ width: width * 0.35, height: undefined, aspectRatio: 1, resizeMode: 'contain', marginBottom: height * 0.02 }}
            />
            <Text style={{ fontSize: 14, color: '#777', textAlign: 'center', marginBottom: height * 0.02 }}>
              Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
            </Text>
          </View>

          {/* Mật khẩu cũ */}
          <View style={{ width: '100%', marginBottom: height * 0.03 }}>
            <Text style={{ color: '#000', fontSize: 14, marginBottom: 5 }}>Mật khẩu cũ</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                placeholder="Mật khẩu cũ"
                secureTextEntry={!isOldPasswordVisible}
                value={oldPassword}
                onChangeText={setOldPassword}
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
                onPress={() => setOldPasswordVisible(!isOldPasswordVisible)}
              >
                <Icon name={isOldPasswordVisible ? "visibility" : "visibility-off"} size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
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

          {/* Nhập lại mật khẩu mới */}
          <View style={{ width: '100%', marginBottom: height * 0.03 }}>
            <Text style={{ color: '#000', fontSize: 14, marginBottom: 5 }}>Nhập lại mật khẩu mới</Text>
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
            onPress={handleUpdatePassword} // Gọi hàm xử lý khi nhấn nút
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
