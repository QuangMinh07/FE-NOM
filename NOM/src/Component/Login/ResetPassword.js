import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

export default function ResetPassword() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isRememberChecked, setRememberChecked] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>
      
      {/* Logo và Slogan */}
      <View style={{ alignItems: 'center', marginBottom: height * 0.05 }}>
        <Image 
          source={require('../../img/LOGOBLACK.png')} // Đường dẫn đúng đến logo của bạn
          style={{ width: width * 0.35, height: undefined, aspectRatio: 1, resizeMode: 'contain', marginBottom: height * 0.02 }}
        />
        <Text style={{ fontSize: 14, color: '#777', textAlign: 'center', marginBottom: height * 0.02 }}>
          Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
        </Text>
      </View>

      {/* Tiêu đề và trường Mật khẩu mới */}
      <View style={{ width: '100%', marginBottom: height * 0.03 }}>
        <Text style={{ color: '#000', fontSize: 14, marginBottom: 5 }}>Mật khẩu mới</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="Mật khẩu mới"
            secureTextEntry={!isPasswordVisible}
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

      {/* Tiêu đề và trường Nhập lại mật khẩu */}
      <View style={{ width: '100%', marginBottom: height * 0.03 }}>
        <Text style={{ color: '#000', fontSize: 14, marginBottom: 5 }}>Nhập lại mật khẩu</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="Nhập lại mật khẩu"
            secureTextEntry={!isConfirmPasswordVisible}
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

      {/* Ghi nhớ mật khẩu */}
      <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: height * 0.05 }}>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => setRememberChecked(!isRememberChecked)}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderColor: '#E53935',
              borderWidth: 1,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isRememberChecked ? '#E53935' : '#FFFFFF',
            }}
          >
            {isRememberChecked && (
              <Icon name="check" size={14} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>
        <Text style={{ color: '#000', fontSize: 14 }}>Ghi nhớ mật khẩu</Text>
      </View>

      {/* Nút xác nhận */}
      <TouchableOpacity
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
  );
}
