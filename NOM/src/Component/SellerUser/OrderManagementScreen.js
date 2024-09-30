import { View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable

const { width } = Dimensions.get('window');

export default function OrderManagementScreen() {
  const [selectedTab, setSelectedTab] = useState('Mới');

  const tabs = ['Mới', 'Đã Nhận', 'Lịch sử'];

  const renderOrders = () => {
    switch (selectedTab) {
      case 'Mới':
        return (
          <View style={{ paddingHorizontal: width * 0.05 }}>
            {/* Đơn hàng mới */}
            <Swipeable>
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 15,
                marginBottom: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>12/08/2024</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    backgroundColor: '#E53935',
                    borderRadius: 20,
                    padding: 10,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 14 }}>03</Text>
                  </View>
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Nguyễn Thị Kiều Nghi</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>Đặt đơn</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>12:30</Text>
                      </View>
                      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>Món</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>1</Text>
                      </View>
                      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>Giá đơn hàng</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>20.000 VND</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Nút xác nhận */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                  <TouchableOpacity style={{
                    backgroundColor: '#E53935',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Xác nhận</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Swipeable>
          </View>
        );
      
      case 'Đã Nhận':
        return (
          <View style={{ paddingHorizontal: width * 0.05 }}>
            {/* Đơn hàng đã nhận */}
            <Swipeable>
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 15,
                marginBottom: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>12/08/2024</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    backgroundColor: '#E53935',
                    borderRadius: 20,
                    padding: 10,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 14 }}>03</Text>
                  </View>
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Nguyễn Thị Kiều Nghi</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>Đặt đơn</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>12:30</Text>
                      </View>
                      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>Món</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>1</Text>
                      </View>
                      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>Giá đơn hàng</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>20.000 VND</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Nút hoàn thành */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                  <TouchableOpacity style={{
                    backgroundColor: '#E53935',
                    borderRadius: 5,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Hoàn thành</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Swipeable>
          </View>
        );
        
      case 'Lịch sử':
        return (
          <View style={{ paddingHorizontal: width * 0.05 }}>
            {/* Lịch sử đơn hàng */}
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              position: 'relative' // Chỉnh vị trí cho trạng thái Đã giao
            }}>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>12/08/2024</Text>
              
              {/* Hiển thị trạng thái Đã giao ở góc trên bên phải */}
              <View style={{ position: 'absolute', top: 10, right: 10 }}>
                <Text style={{ color: '#E53935', fontSize: 14, fontWeight: 'bold' }}>Đã giao</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  backgroundColor: '#E53935',
                  borderRadius: 20,
                  padding: 10,
                }}>
                  <Text style={{ color: '#fff', fontSize: 14 }}>01</Text>
                </View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Nguyễn Thị Kiều Nghi</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, color: '#666' }}>Lấy đơn</Text>
                      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>12:30</Text>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, color: '#666' }}>Đã giao</Text>
                      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>12:50</Text>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, color: '#666' }}>Món</Text>
                      <Text style={{ fontSize: 14, color: '#E53935', fontWeight: 'bold' }}>1</Text>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, color: '#666' }}>Khoảng cách</Text>
                      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>2km</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#E53935',
        paddingTop: 50, // Để chữ "Đơn hàng" xuống dưới một chút
        height: 140,
      }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold',marginLeft:20 }}>Đơn hàng</Text>
      </View>

      {/* Search Bar */}
      <View style={{
        position: 'absolute',
        top: 110, // Để thanh tìm kiếm nằm đúng vị trí
        left: width * 0.05,
        right: width * 0.05,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 10, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        height:50
      }}>
        <Ionicons name="search-outline" size={20} color="#E53935" />
        <TextInput
          placeholder="Tìm kiếm"
          style={{ marginLeft: 10, fontSize: 16, color: '#000', flex: 1 }}
        />
      </View>

      {/* Tabs */}
      <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 20 }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={{
              paddingBottom: 10,
              borderBottomWidth: selectedTab === tab ? 4 : 0,
              borderBottomColor: '#E53935'
            }}
          >
            <Text
              style={{
                color: selectedTab === tab ? '#E53935' : '#6B7280',
                fontSize: selectedTab === tab ? 18 : 16,
                fontWeight: selectedTab === tab ? 'bold' : 'normal'
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}>
        {renderOrders()}
      </ScrollView>
    </View>
  );
}
