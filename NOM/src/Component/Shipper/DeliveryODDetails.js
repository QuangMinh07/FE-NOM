import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native'; // Lấy orderId từ route
import { api, typeHTTP } from '../../utils/api'; // Giả định API gọi từ đây

export default function DeliveryODDetails() {
  const [isPickedUp, setIsPickedUp] = useState(false); // Trạng thái lấy món ăn
  const [orderDetails, setOrderDetails] = useState(null); // Chi tiết đơn hàng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const route = useRoute(); // Lấy thông tin route
  const { orderId } = route.params; // Lấy orderId từ route

  // Gọi API lấy chi tiết đơn hàng
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api({
          method: typeHTTP.GET,
          url: `/storeOrder/details/${orderId}`,
          sendToken: true,
        });

        if (response.orderDetails) {
          setOrderDetails(response.orderDetails);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handlePickedUp = () => {
    setIsPickedUp(true); // Cập nhật trạng thái khi nhấn "Đã lấy món ăn"
  };

  const handleDelivered = () => {
    console.log('Giao hàng thành công');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

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
        <Text style={{ fontSize: 16, color: '#fff', marginTop: 15 }}>
          {new Date(orderDetails.orderDate).toLocaleDateString()}
        </Text>
      </View>

      {/* Thời gian */}
      <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thời gian đặt hàng:</Text>
          <Text style={{ fontSize: 16 }}>{new Date(orderDetails.orderDate).toLocaleTimeString()}</Text>
        </View>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thời gian nhận hàng:</Text>
          <Text style={{ fontSize: 16 }}>Đang cập nhật</Text>
        </View> */}
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
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>{orderDetails.store.storeName}</Text>
          </View>
        </View>
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
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>{orderDetails.user.fullName}</Text>
          </View>
        </View>
      </View>

      {/* Chi tiết đơn hàng */}
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
      <View style={{ paddingHorizontal: 16 }}>
        {orderDetails.foods.map((food, index) => (
          <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 16 }}>{food.quantity}x {food.foodName}</Text>
            <Text style={{ fontSize: 16 }}>{food.price} VND</Text>
          </View>
        ))}
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
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#E53935' }}>
          {orderDetails.totalAmount} VND
        </Text>
      </View>

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
