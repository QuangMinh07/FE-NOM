import { View, Text, FlatList } from 'react-native';
import React from 'react';

const orderHistory = [
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
  {
    id: '4',
    name: 'Nguyễn Thị Kiều Nghi',
    time: '10:00, 06/09/2024',
    address: '123 Nguyễn Trãi, TPHCM',
    amount: '80.000.000 VNĐ',
    restaurant: 'Quán cơm tấm sườn',
    dish: 'Phở, bún,...',
  },
];

export default function HistoryScreenSP() {
  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: '#f9f9f9',
        
        padding: 15,
        marginHorizontal: 16,
        marginTop: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'column' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{item.name}</Text>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>{item.restaurant}</Text>
        <Text style={{ fontSize: 14, color: '#333' }}>{item.dish}</Text>
      </View>
      <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
        <Text>{item.time}</Text>
        <Text>{item.address}</Text>
        <Text style={{ fontSize: 16, color: '#E53935', fontWeight: 'bold' }}>{item.amount}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
            width: '100%',
          height: '15%',
          backgroundColor: '#E53935',
          padding: 20,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold',marginTop:40 }}>Lịch sử đơn hàng</Text>
      </View>

      {/* Danh sách lịch sử đơn hàng */}
      <FlatList
        data={orderHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
