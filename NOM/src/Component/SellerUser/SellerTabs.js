import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OrderManagementScreen,SellerProfileScreen,ChatSellerScreen } from '../SellerUser';
import HomeSeller from '../SellerUser/HomeSeller'; 


const Tab = createBottomTabNavigator();

// Tạo cấu hình Tab cho Seller
function SellerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: 80,
          backgroundColor: "#fff",
        },
        tabBarIcon: ({ focused }) => {
          let iconComponent;
          let labelComponent;

          if (route.name === "Trang Chủ Seller") {
            iconComponent = (
              <View style={{ marginTop: 6 }}>
                <Ionicons
                  name="home-outline"
                  size={24}
                  color={focused ? '#B91C1C' : '#6B7280'}
                  style={{ width: 30 }}
                />
              </View>
            );
            labelComponent = (
              <Text style={{ marginTop: 4, color: focused ? "#B91C1C" : "#6B7280" }}>
                Trang Chủ
              </Text>
            );
          } else if (route.name === "Quản lý Đơn Hàng") {
            iconComponent = (
              <View style={{ marginTop: 6 }}>
                <Ionicons
                  name="file-tray-outline"
                  size={24}
                  color={focused ? '#B91C1C' : '#6B7280'}
                  style={{ width: 30 }}
                />
              </View>
            );
            labelComponent = (
              <Text style={{ color: focused ? "#B91C1C" : "#6B7280", marginTop: 4 }}>
                Đơn Hàng
              </Text>
            );
          } else if (route.name === "Chat Seller") {
            iconComponent = (
              <View style={{ marginTop: 6 }}>
                <Ionicons
                  name="chatbubble-outline"
                  size={24}
                  color={focused ? '#B91C1C' : '#6B7280'}
                  style={{ width: 30 }}
                />
              </View>
            );
            labelComponent = (
              <Text style={{ color: focused ? "#B91C1C" : "#6B7280", marginTop: 4 }}>
                Tin Nhắn
              </Text>
            );
          } else if (route.name === "Hồ sơ Seller") {
            iconComponent = (
              <View style={{ marginTop: 6 }}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={focused ? '#B91C1C' : '#6B7280'}
                  style={{ width: 30 }}
                />
              </View>
            );
            labelComponent = (
              <Text style={{ marginTop: 4, color: focused ? "#B91C1C" : "#6B7280" }}>
                Hồ Sơ
              </Text>
            );
          }

          return (
            <View style={{ alignItems: "center", justifyContent: "center", width: 80 }}>
              {iconComponent}
              {labelComponent}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Trang Chủ Seller" component={HomeSeller} />
      {/* Thay đổi các component dưới đây với tên trang mới */}
      <Tab.Screen name="Quản lý Đơn Hàng" component={OrderManagementScreen} />
      <Tab.Screen name="Chat Seller" component={ChatSellerScreen} />
      <Tab.Screen name="Hồ sơ Seller" component={SellerProfileScreen} />
    </Tab.Navigator>
  );
}

export default SellerTabs;
