import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Shopping() {
  const navigation = useNavigation();

  const [orderItems, setOrderItems] = useState([
    { id: 1, name: 'Cơm tấm sườn bì', price: 20000, quantity: 2 },
    { id: 2, name: 'Cơm tấm sườn bì', price: 20000, quantity: 2 },
  ]);

  // Function to handle increasing the quantity
  const increaseQuantity = (itemId) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Function to handle decreasing the quantity
  const decreaseQuantity = (itemId) => {
    setOrderItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Automatically remove if quantity reaches 0
    );
  };

  // Calculate total price
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          paddingVertical: 15,
          backgroundColor: '#fff',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          marginTop: 50,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Chi tiết HÓA ĐƠN</Text>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100, // To make sure footer button is not overlapped
          justifyContent: 'space-between', // Push content down
          flexGrow: 1, // Ensure the content expands to the full height
        }}
      >
        {/* Floating Address Section */}
        <View
          style={{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            elevation: 5, // For Android shadow
            shadowColor: '#000', // For iOS shadow
            shadowOpacity: 0.2,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
            marginBottom: 20,
            marginTop: 30, // Raise the position to give it a floating feel
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Địa chỉ nhận món</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditAddress')}>
              <Icon name="edit" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 14, color: '#333' }}>72, phường 5, Nguyễn Thái Sơn, Gò Vấp</Text>
        </View>

        {/* Order Details */}
        <View style={{ marginBottom: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Đơn hàng</Text>
            {/* Add Food Icon with "Thêm món" text */}
            <TouchableOpacity onPress={() => navigation.navigate('StoreKH')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text
                  style={{ marginLeft: 5, fontSize: 16, color: '#E53935' }}>Thêm món</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Render each order item */}
          {orderItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate('Orderfood')} // Navigate to OrderFood page without passing item
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  padding: 10,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  borderColor: '#eee',
                  borderWidth: 1,
                }}
              >
                <Text style={{ fontSize: 14, color: '#333' }}>{item.name}</Text>
                <Text style={{ fontSize: 14, color: '#333' }}>{(item.price * item.quantity).toLocaleString()} VND</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                    <Icon name="remove-circle-outline" size={24} color="#E53935" />
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 10, fontSize: 14 }}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                    <Icon name="add-circle-outline" size={24} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Breakdown */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Thành tiền</Text>
            <Text style={{ fontSize: 14, color: '#333' }}>{calculateTotal().toLocaleString()} VND</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Phí vận chuyển</Text>
            <Text style={{ fontSize: 14, color: '#333' }}>0.000 VND</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Ưu đãi</Text>
            <Text style={{ fontSize: 14, color: '#333' }}>0.000 VND</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Thành tiền</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#E53935' }}>{calculateTotal().toLocaleString()} VND</Text>
          </View>
        </View>

        {/* Payment Method Selection */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Select')}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}
        >
          <Text style={{ fontSize: 16, color: '#666' }}>Phương thức thanh toán</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#E53935', marginRight: 10 }}>Chọn phương thức</Text>
            <Icon name="arrow-forward-ios" size={16} color="#E53935" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 35,
          left: 10,
          right: 0,
          backgroundColor: '#E53935',
          padding: 15,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          margin: 10,
          width: width * 0.9,
          alignSelf: 'center',
        }}
        onPress={() => console.log('Thanh toán')}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
}
