import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const { width, height } = Dimensions.get('window');

export default function ForgotPassword() {
  const [isPasswordVisible, setPasswordVisible] = useState(false); // State để quản lý hiển thị mật khẩu
  const navigation = useNavigation();  // Sử dụng useNavigation

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>
      
      {/* Logo và Slogan */}
      <View style={{ alignItems: 'center', marginBottom: height * 0.04 }}>
        <Image 
          source={require('../../img/LOGOBLACK.png')} // Đường dẫn đúng đến logo của bạn
          style={{ width: width * 0.35, height: undefined, aspectRatio: 1, resizeMode: 'contain', marginBottom: height * 0.02 }}
        />
        <Text style={{ fontSize: 14, color: '#777', textAlign: 'center', marginBottom: height * 0.02 }}>
          Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#E53935', textAlign: 'center', marginBottom: height * 0.04 }}>
          Quên mật khẩu
        </Text>
      </View>

      {/* Form nhập Số điện thoại/gmail */}
      <View style={{ width: '100%', marginBottom: height * 0.05 }}>
        <Text style={{ color: '#000', fontSize: 14, marginBottom: 5 }}>Số điện thoại/Gmail</Text>

        <View style={{ position: 'relative', width: '100%' }}>
          <TextInput
            placeholder="Số điện thoại/gmail"
            style={{
              width: '100%',
              height: 50,
              borderColor: '#E53935',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingRight: 50, // Dự phòng cho biểu tượng mắt
              backgroundColor: '#FFFFFF',
              marginBottom: 10,
            }}
            keyboardType="default"
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 15, top: 15 }}
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            <Icon name={isPasswordVisible ? "visibility" : "visibility-off"} size={20} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Nút xác nhận */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ResetPassword')} 
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
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Tiếp tục</Text>
      </TouchableOpacity>

      {/* Đã có tài khoản */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#000', fontSize: 14 }}>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{ color: '#E53935', fontSize: 14, fontWeight: 'bold' }}>Đăng ký</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
