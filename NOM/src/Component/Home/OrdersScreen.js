import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState('Đang đặt');

  const tabs = ['Đang đặt', 'Lịch sử', 'Chờ thanh toán'];

  const renderOrders = () => {
    switch (selectedTab) {
      case 'Đang đặt':
        return (
          <View style={{ paddingHorizontal: width * 0.05 }}>
            {/* Đơn hàng mẫu 1 */}
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
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>123 Nguyễn Trãi, TP.HCM</Text>
                <Text style={{ fontSize: 14, color: '#E53935' }}>Đang giao</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>Phở bò, Trà sữa</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>2 món</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>14:30 12/09/2024</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>150,000 VND</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#E53935' }}>Đánh giá: 4.5/5</Text>
              </View>
            </View>
            {/* Đơn hàng mẫu 2 */}
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
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>456 Lê Lợi, TP.HCM</Text>
                <Text style={{ fontSize: 14, color: '#E53935' }}>Đang chuẩn bị</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>Bún thịt nướng</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>1 món</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>12:00 11/09/2024</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>80,000 VND</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#E53935' }}>Đánh giá: 4.0/5</Text>
              </View>
            </View>
          </View>
        );
      case 'Lịch sử':
        return (
          <View style={{ paddingHorizontal: width * 0.05 }}>
            {/* Lịch sử đơn hàng mẫu */}
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
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>789 Lý Tự Trọng, TP.HCM</Text>
                <Text style={{ fontSize: 14, color: '#E53935' }}>Đã giao</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>Cơm tấm</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>1 món</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>10:45 10/09/2024</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>70,000 VND</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#E53935' }}>Đánh giá: 4.8/5</Text>
                <TouchableOpacity style={{
                  backgroundColor: '#E53935',
                  borderRadius: 5,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  alignItems: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Đặt lại</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case 'Chờ thanh toán':
        return (
          <View style={{ paddingHorizontal: width * 0.05 }}>
            {/* Đơn hàng chờ thanh toán mẫu */}
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
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>987 Hàm Nghi, TP.HCM</Text>
                <Text style={{ fontSize: 14, color: '#E53935' }}>Chưa thanh toán</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>Bánh mì thịt</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>1 món</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>08:00 12/09/2024</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>30,000 VND</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#E53935' }}>Chưa thanh toán</Text>
                <TouchableOpacity style={{
                  backgroundColor: '#E53935',
                  borderRadius: 5,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  alignItems: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Thanh toán</Text>
                </TouchableOpacity>
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
      <View style={{ backgroundColor: '#E53935', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 140 }}>
        {/* Thông tin người dùng */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 22, marginLeft: 10, fontWeight: 'bold' }}>Đơn hàng</Text>
        </View>
        {/* Icons */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Icon giỏ hàng */}
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="cart-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 10 }}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={{
              borderBottomWidth: selectedTab === tab ? 2 : 0,
              borderBottomColor: '#E53935',
              paddingBottom: 10,
            }}
          >
            <Text style={{ color: selectedTab === tab ? '#E53935' : '#6B7280', fontSize: 16 }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {renderOrders()}
      </ScrollView>
    </View>
  );
}
