import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Thêm điều hướng

const initialOrders = [
  {
    id: '1',
    name: 'Nguyễn Thị Kiều Nghi',
    time: '10:00, 06/09/2024',
    address: '123 Nguyễn Trãi, TPHCM',
    amount: '80.000.000 VNĐ',
    restaurant: 'Quán cơm tấm sườn',
    dish: 'Phở, bún,...',
  },
  {
    id: '2',
    name: 'Nguyễn Thị Kiều Nghi',
    time: '10:00, 06/09/2024',
    address: '123 Nguyễn Trãi, TPHCM',
    amount: '80.000.000 VNĐ',
    restaurant: 'Quán cơm tấm sườn',
    dish: 'Phở, bún,...',
  },
  {
    id: '3',
    name: 'Nguyễn Thị Kiều Nghi',
    time: '10:00, 06/09/2024',
    address: '123 Nguyễn Trãi, TPHCM',
    amount: '80.000.000 VNĐ',
    restaurant: 'Quán cơm tấm sườn',
    dish: 'Phở, bún,...',
  },
];

export default function HomeShiper() {
  const [acceptedOrderId, setAcceptedOrderId] = useState(null);
  const [acceptedOrder, setAcceptedOrder] = useState(null); // Lưu trữ đơn hàng đã chọn
  const navigation = useNavigation(); // Sử dụng điều hướng

  const handleAcceptOrder = (id) => {
    if (acceptedOrderId === null) {
      const order = initialOrders.find(order => order.id === id);
      setAcceptedOrderId(id);
      setAcceptedOrder(order);
      navigation.navigate('DeliveryODDetails', { order }); // Chuyển hướng tới trang chi tiết đơn hàng
    }
  };

  // Hàm xử lý khi nhấn vào đơn hàng đã chọn
  const handleSelectedOrderPress = () => {
    if (acceptedOrder) {
      navigation.navigate('DeliveryODDetails', { order: acceptedOrder });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ backgroundColor: '#E53935', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 140 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10
          }}>
            <Icon name="person" size={24} color="#E53935" />
          </View>
          <View>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Nguyễn Thị Kiều Nghi</Text>
            <Text style={{ color: '#fff', fontSize: 16 }}>4.5 ⭐ (25)</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreenSP')}>
            <Icon name="notifications" size={24} color="#fff" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HistoryScreenSP')}>
            <Icon name="hourglass" size={24} color="#fff" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ padding: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>DOANH THU HÔM NAY</Text>
          <Text style={{ fontSize: 18, color: 'red', marginBottom: 10 }}>45.000 VND</Text>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Đơn hàng mới</Text>

        <FlatList
          data={initialOrders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => (acceptedOrderId === item.id ? handleSelectedOrderPress() : handleAcceptOrder(item.id))}
              disabled={acceptedOrderId !== null && acceptedOrderId !== item.id} // Disable nếu có đơn khác đã được chọn
            >
              <View style={{ backgroundColor: '#f9f9f9', padding: 15, marginBottom: 10, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>{item.restaurant}</Text>
                    <Text style={{ fontSize: 14, color: 'black', marginTop: 5 }}>{item.dish}</Text>
                  </View>
                  <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Text>{item.time}</Text>
                    <Text>{item.address}</Text>
                    <Text style={{ fontSize: 16, color: '#E53935', fontWeight: 'bold' }}>{item.amount}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleAcceptOrder(item.id)}
                  style={{
                    marginTop: 10,
                    backgroundColor: acceptedOrderId === item.id ? '#ccc' : '#E53935',
                    paddingVertical: 10,
                    borderRadius: 5
                  }}
                  disabled={acceptedOrderId !== null && acceptedOrderId !== item.id} // Disable nếu có đơn khác đã được chọn
                >
                  <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                    {acceptedOrderId === item.id ? "Đã chấp nhận" : "Chấp nhận"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
