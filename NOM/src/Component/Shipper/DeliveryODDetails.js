import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DeliveryODDetails() {
  const [isPickedUp, setIsPickedUp] = useState(false); // Trạng thái để theo dõi việc lấy món ăn

  const handlePickedUp = () => {
    setIsPickedUp(true); // Cập nhật trạng thái khi người dùng nhấn nút "Đã lấy món ăn"
  };

  const handleDelivered = () => {
    // Xử lý logic khi nhấn nút "Đã giao thành công"
    console.log('Giao hàng thành công');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#E53935',
          padding: 24,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          width: '100%',
          height: '15%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold', marginTop: 15 }}>
          Chi tiết đơn hàng
        </Text>
        <Text style={{ fontSize: 16, color: '#fff', marginTop: 15 }}>12/08/2024</Text>
      </View>

      {/* Thời gian */}
      <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thời gian đặt hàng:</Text>
          <Text style={{ fontSize: 16 }}>09:00 PM</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thời gian nhận hàng:</Text>
          <Text style={{ fontSize: 16 }}>09:10 PM</Text>
        </View>
      </View>

      {/* Thông tin cửa hàng */}
      <View
        style={{
          backgroundColor: '#f9f9f9',
          padding: 16,
          borderRadius: 8,
          marginVertical: 8,
          marginHorizontal: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="location-outline" size={16} color="#4CAF50" />
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>Cơm tấm sườn bì</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#E53935' }}>4.5 ⭐ (25+)</Text>
        </View>
        <Text style={{ fontSize: 14, color: '#333' }}>72, phường 5, Nguyễn Thái Sơn, Gò Vấp</Text>
      </View>

      {/* Thông tin người nhận */}
      <View
        style={{
          backgroundColor: '#f9f9f9',
          padding: 16,
          borderRadius: 8,
          marginVertical: 8,
          marginHorizontal: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="person-outline" size={16} color="#E53935" />
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>Nguyễn Thị Kiều Nghi</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#E53935' }}>4.5 ⭐ (25+)</Text>
        </View>
        <Text style={{ fontSize: 14, color: '#333' }}>72, phường 5, Nguyễn Thái Sơn, Gò Vấp</Text>
        <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>Số điện thoại: 0999999999</Text>
        <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>Mô tả: Không</Text>
      </View>

      {/* Tiêu đề "Chi tiết đơn hàng" */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginHorizontal: 16,
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        Chi tiết đơn hàng
      </Text>

      {/* Chi tiết đơn hàng */}
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 16 }}>1x Cơm tấm sườn bì</Text>
          <Text style={{ fontSize: 16 }}>20.000 VND</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 16 }}>3x Cơm tấm sườn bì</Text>
          <Text style={{ fontSize: 16 }}>60.000 VND</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 16 }}>Dụng cụ ăn uống</Text>
          <Text style={{ fontSize: 16 }}>Có</Text>
        </View>
      </View>

      {/* Tổng hóa đơn */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderTopWidth: 1,
          borderColor: '#ddd',
          marginTop: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tổng hóa đơn</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#E53935' }}>80.000 VND</Text>
      </View>

      {/* Liên hệ khách hàng */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
          borderTopWidth: 1,
          borderColor: '#ddd',
          paddingHorizontal: 16,
          marginHorizontal: 16,
          marginTop: 16,
        }}
        onPress={() => {
          // Thêm logic liên hệ khách hàng tại đây, ví dụ mở số điện thoại hoặc gửi tin nhắn
        }}
      >
        <Icon name="chatbubble-ellipses-outline" size={20} color="#E53935" style={{ marginRight: 8 }} />
        <Text style={{ color: '#E53935', fontSize: 16 }}>Liên hệ với Khách hàng</Text>
      </TouchableOpacity>

      {/* Nút hành động */}
      {!isPickedUp ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#E53935',
            paddingVertical: 16,
            borderRadius: 8,
            marginHorizontal: 16,
            marginTop: 24,
            marginBottom: 24,
          }}
          onPress={handlePickedUp}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
            Đã lấy món ăn
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: '#E53935',
            paddingVertical: 16,
            borderRadius: 8,
            marginHorizontal: 16,
            marginTop: 24,
            marginBottom: 24,
          }}
          onPress={handleDelivered}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
            Đã giao thành công
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
