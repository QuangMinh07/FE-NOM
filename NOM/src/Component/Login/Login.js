import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [isPasswordVisible, setPasswordVisible] = useState(false); // State to manage password visibility
  const [isRememberMeChecked, setRememberMeChecked] = useState(false); // State to manage remember me checkbox
  const navigation = useNavigation();  // Sử dụng useNavigation

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>
      
      {/* Logo và Slogan */}
      <View style={{ alignItems: 'center', marginBottom: height * 0.05 }}>
        <Image 
          source={require('../../img/LOGOBLACK.png')} // Thay bằng đường dẫn đúng đến logo của bạn
          style={{ width: width * 0.4, height: undefined, aspectRatio: 1, resizeMode: 'contain', marginBottom: 10 }}
        />
        <Text style={{ fontSize: 16, color: '#777', textAlign: 'center', marginBottom: 5 }}>
          Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
        </Text>
      </View>

      {/* Form đăng nhập */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>
          Số điện thoại
        </Text>
        <View style={{ position: 'relative', marginBottom: 20 }}>
          <TextInput
            placeholder="Số điện thoại"
            style={{
              width: '100%',
              height: 50,
              borderColor: '#E53935',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 15,
              backgroundColor: '#FFFFFF',
            }}
            keyboardType="phone-pad"
            defaultValue="0356653539" // Example default value
          />
        </View>
        
        <Text style={{ fontSize: 14,  color: '#000', marginBottom: 5 }}>
          Mật khẩu
        </Text>
        <View style={{ position: 'relative', marginBottom: 10 }}>
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
            defaultValue="0356653539" // Example default value
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 15, top: 15 }}
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            <Icon name={isPasswordVisible ? "visibility" : "visibility-off"} size={20} color="#E53935" />
          </TouchableOpacity>
        </View>

 
      </View>

      {/* Ghi nhớ mật khẩu - căn trái */}
      <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 30 }}>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => setRememberMeChecked(!isRememberMeChecked)}
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
              backgroundColor: isRememberMeChecked ? '#E53935' : '#FFFFFF',
            }}
          >
            {isRememberMeChecked && (
              <Icon name="check" size={14} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>
        <Text style={{ color: '#000', fontSize: 14 }}>Ghi nhớ mật khẩu</Text>
      </View>

      {/* Nút đăng nhập */}
      <TouchableOpacity
                onPress={() => navigation.navigate('HomeKH')} 
        style={{
          width: '100%',
          height: 60,
          backgroundColor: '#E53935',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
          marginBottom: 20, // Điều chỉnh khoảng cách giữa nút đăng nhập và Quên mật khẩu
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Đăng nhập</Text>
      </TouchableOpacity>
       {/* Quên mật khẩu - Căn phải gần hơn với nút Đăng nhập */}
       <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
          <Text 
          onPress={() => navigation.navigate('ForgotPassword')} 
          style={{ color: '#E53935', fontSize: 14 }}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      {/* Đăng nhập với */}
      <Text style={{ color: '#777', fontSize: 16, marginBottom: 20 }}>Đăng nhập với</Text>

      {/* Đăng nhập với Facebook và Google */}
      <View style={{ flexDirection: 'row', marginBottom: 30, justifyContent: 'space-between', width: '60%' }}>
        <TouchableOpacity>
          <Image 
            source={require('../../img/logos_facebook.png')} // Thay bằng đường dẫn đúng đến logo Facebook
            style={{ width: 50, height: 50, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image 
            source={require('../../img/flat-color-icons_google.png')} // Thay bằng đường dẫn đúng đến logo Google
            style={{ width: 50, height: 50, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      </View>

      {/* Đăng ký tài khoản */}
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
