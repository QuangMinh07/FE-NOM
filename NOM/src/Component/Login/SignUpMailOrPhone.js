import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const { width, height } = Dimensions.get('window');

export default function SignUpMailOrPhone() {
    const navigation = useNavigation();  // Sử dụng useNavigation

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>
      
      {/* Logo và Slogan */}
      <View style={{ alignItems: 'center', marginBottom: height * 0.03 }}>
        <Image 
          source={require('../../img/LOGOBLACK.png')} // Đường dẫn đúng đến logo của bạn
          style={{ width: width * 0.3, height: undefined, aspectRatio: 1, resizeMode: 'contain', marginBottom: height * 0.02 }}
        />
        <Text style={{ fontSize: 14, color: '#777', textAlign: 'center', marginBottom: height * 0.02 }}>
          Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#E53935', textAlign: 'center', marginBottom: height * 0.03 }}>
          Nhận mã xác minh qua
        </Text>
      </View>

      {/* Các lựa chọn Email OTP và Số điện thoại OTP */}
      <View style={{ width: '100%', marginBottom: height * 0.05 }}>
        <TouchableOpacity 
        onPress={() => navigation.navigate('OTPMail')}
        style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: '#FFFFFF', 
          paddingVertical: 15, 
          paddingHorizontal: 15, 
          borderRadius: 10, 
          marginBottom: height * 0.02, 
          borderColor: '#1111', 
          borderWidth: 1,
          shadowColor: '#555',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 10, // Tạo hiệu ứng nổi
        }}>
          <Text style={{ fontSize: 16, color: '#000' }}>Email OTP</Text>
          <Icon name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity 
        onPress={() => navigation.navigate('OTPPhone')}
        style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: '#FFFFFF', 
          paddingVertical: 15, 
          paddingHorizontal: 15, 
          borderRadius: 10, 
          borderColor: '#1111', 
          borderWidth: 1,
          shadowColor: '#555',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 10, // Tạo hiệu ứng nổi
        }}>
          <Text style={{ fontSize: 16, color: '#000' }}>Số điện thoại OTP</Text>
          <Icon name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Nút tiếp tục */}
      <TouchableOpacity
        style={{
          width: '100%',
          height: 60,
          backgroundColor: '#E53935',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
          marginBottom: height * 0.02, // Điều chỉnh khoảng cách từ nút tiếp tục đến phần tử cuối cùng phía trên
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Tiếp tục</Text>
      </TouchableOpacity>

    </View>
  );
}
