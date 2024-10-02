import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CustomerNotice() {
  const [selectedTab, setSelectedTab] = useState('Trò chuyện'); // Quản lý tab được chọn
  const navigation = useNavigation(); // Để điều hướng

  const chatData = [
    { id: '1', name: 'Jhon Abraham', message: 'Trò chuyện', date: '01/10/2024', avatar: null }, // Không có avatar
  ];

  const notificationData = [
    { id: '1', title: 'Đánh giá trải nghiệm của bạn', description: 'Cửa hàng Cơm Tấm', date: '01/11/2024' },
    { id: '2', title: 'Cửa hàng', description: 'Cửa hàng', date: '01/11/2024' },
  ];

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={() => navigation.navigate('CustomerChat')} // Điều hướng tới màn hình CustomerChat
    >
      {/* Khung tròn màu đỏ */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: '#E53935',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
        }}
      >
        {item.avatar ? (
          <Image
            source={{ uri: item.avatar }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
            }}
          />
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ fontSize: 14, color: '#777' }}>{item.message}</Text>
      </View>
      {/* Ngày ở góc trên phải */}
      <Text style={{ fontSize: 12, color: '#999', position: 'absolute', right: 10, top: 10 }}>{item.date}</Text>
    </TouchableOpacity>
  );

  const renderNotificationItem = ({ item }) => (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {/* Khung tròn màu đỏ với chữ 'NOM' */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#E53935',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>NOM</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: '#777' }}>{item.description}</Text>
      </View>
      {/* Ngày ở góc trên phải */}
      <Text style={{ fontSize: 12, color: '#999', position: 'absolute', right: 10, top: 10 }}>{item.date}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Phần tiêu đề */}
      <View style={{ backgroundColor: '#E53935', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 140 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Thông báo</Text>
        {/* Thêm icon hoặc ảnh người dùng nếu cần */}
      </View>

      {/* Chọn tab */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        <TouchableOpacity onPress={() => setSelectedTab('Trò chuyện')}>
          <Text style={{ fontSize: 16, color: selectedTab === 'Trò chuyện' ? '#E53935' : '#000', fontWeight: selectedTab === 'Trò chuyện' ? 'bold' : 'normal' }}>
            Trò chuyện
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Thông báo')}>
          <Text style={{ fontSize: 16, color: selectedTab === 'Thông báo' ? '#E53935' : '#000', fontWeight: selectedTab === 'Thông báo' ? 'bold' : 'normal' }}>
            Thông báo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách trò chuyện hoặc thông báo */}
      {selectedTab === 'Trò chuyện' ? (
        <FlatList
          data={chatData}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <FlatList
          data={notificationData}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}
