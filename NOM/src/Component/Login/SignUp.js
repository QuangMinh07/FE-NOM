import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const { width, height } = Dimensions.get('window');

export default function SignUp() {
  const [isPasswordVisible, setPasswordVisible] = useState(false); // State to manage password visibility
  const navigation = useNavigation();  // Sử dụng useNavigation

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>
      
      {/* Logo và Slogan */}
      <View style={{ alignItems: 'center', marginBottom: height * 0.05 }}>
        <Image 
          source={require('../../img/LOGOBLACK.png')} // Thay bằng đường dẫn đúng đến logo của bạn
          style={{ width: width * 0.4, height: undefined, aspectRatio: 1, resizeMode: 'contain', marginBottom: 10 }}
        />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
          NOM - NGON ĐỒNG Ý
        </Text>
        <Text style={{ fontSize: 12, color: '#888888', textAlign: 'center' , marginTop:20}}>
          Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
        </Text>
      </View>

      {/* Form đăng ký */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 14,  color: '#000', marginBottom: 5 }}>Tên đăng nhập</Text>
        <TextInput
          placeholder="Tên đăng nhập"
          style={{
            width: '100%',
            height: 50,
            borderColor: '#E53935',
            borderWidth: 2,
            borderRadius: 10,
            paddingHorizontal: 15,
            marginBottom: 15,
            backgroundColor: '#FFFFFF',
          }}
        />

        <Text style={{ fontSize: 14,  color: '#000', marginBottom: 5 }}>Số điện thoại</Text>
        <TextInput
          placeholder="Số điện thoại"
          style={{
            width: '100%',
            height: 50,
            borderColor: '#E53935',
            borderWidth: 2,
            borderRadius: 10,
            paddingHorizontal: 15,
            marginBottom: 15,
            backgroundColor: '#FFFFFF',
          }}
          keyboardType="phone-pad"
        />

        <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Email</Text>
        <TextInput
          placeholder="Email"
          style={{
            width: '100%',
            height: 50,
            borderColor: '#E53935',
            borderWidth: 2,
            borderRadius: 10,
            paddingHorizontal: 15,
            marginBottom: 15,
            backgroundColor: '#FFFFFF',
          }}
          keyboardType="email-address"
        />

        <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Mật khẩu</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="Mật khẩu"
            secureTextEntry={!isPasswordVisible} // Control visibility of password
            style={{
              width: '100%',
              height: 50,
              borderColor: '#E53935',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 15,
              backgroundColor: '#FFFFFF',
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

      {/* Nút đăng ký */}
      <TouchableOpacity
       onPress={() => navigation.navigate('SignUpMailOrPhone')}
        style={{
          width: '100%',
          height: 60,
          backgroundColor: '#E53935',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Đăng ký</Text>
      </TouchableOpacity>

      {/* Đã có tài khoản */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#000', fontSize: 14 }}>Đã có tài khoản? </Text>
        <TouchableOpacity>
          <Text 
          onPress={() => navigation.navigate('Login')} 
          style={{ color: '#E53935', fontSize: 14, fontWeight: 'bold' }}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
