import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const { width, height } = Dimensions.get('window'); // Lấy chiều rộng và chiều cao của màn hình

export default function ProfileScreen() {

  const navigation = useNavigation();  // Sử dụng useNavigation

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#E53935',
        padding: height * 0.02, // Sử dụng phần trăm chiều cao màn hình để padding động
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 140, // Chiều cao của header tính theo tỷ lệ chiều cao màn hình
      }}>
        {/* Thông tin người dùng */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: width * 0.12, // Đặt kích thước theo phần trăm chiều rộng màn hình
            height: width * 0.12,
            backgroundColor: '#fff',
            borderRadius: (width * 0.12) / 2,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: height * 0.025, fontWeight: 'bold' }}>N</Text>
          </View>
          <Text style={{
            color: '#fff',
            fontSize: height * 0.022, // Sử dụng kích thước chữ theo chiều cao màn hình
            marginLeft: width * 0.03
          }}>Nguyễn Thị Kiều Nghi</Text>
        </View>

        {/* Icon Cài đặt */}
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={height * 0.04} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{ padding: width * 0.05 }}>
        {/* Các mục thông tin */}
        {[
          'Thông tin cá nhân',
          'Nâng cấp tài khoản',
          'Ngân hàng liên kết',
          'Ngôn ngữ',
          'Nhận xét đánh giá',
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: '#fff',
              padding: height * 0.02,
              borderRadius: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: height * 0.015, // Khoảng cách giữa các phần tử
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => {
              if (item === 'Nâng cấp tài khoản') {
                navigation.navigate('UpdateAccount'); // Điều hướng khi chọn Nâng cấp tài khoản
              }
            }}
          >
            <Text style={{ fontSize: height * 0.02 }}>{item}</Text>
            <Ionicons name="chevron-forward-outline" size={height * 0.03} color="#000" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
