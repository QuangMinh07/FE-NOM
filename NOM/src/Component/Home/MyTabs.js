import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HomeKH, OrdersScreen, MessagesScreen, ProfileScreen } from '../Home';

const Tab = createBottomTabNavigator();

function MyTabs() {
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

          if (route.name === "Trang Chủ") {
            iconComponent = (
              <View style={{ marginTop: 6 }}>
                <Ionicons
                  name="home-outline" // Icon cho Trang Chủ
                  size={24}
                  color={focused ? '#B91C1C' : '#6B7280'}
                  style={{ width: 30 }}
                />
              </View>
            );
            labelComponent = (
              <Text
                style={{
                  marginTop: 4,
                  color: focused ? "#B91C1C" : "#6B7280"
                }}
              >
                Trang Chủ
              </Text>
            );
          } else if (route.name === "Đơn Hàng") {
            iconComponent = (
              <View style={{ marginTop: 6 }}>
                <Ionicons
                  name="file-tray-outline" // Icon cho Đơn Hàng
                  size={24}
                  color={focused ? '#B91C1C' : '#6B7280'}
                  style={{ width: 30 }}
                />
              </View>
            );
            labelComponent = (
              <Text
                style={{
                  color: focused ? "#B91C1C" : "#6B7280",
                  marginTop: 4
                }}
              >
                Đơn Hàng
              </Text>
            );
          } else if (route.name === "Tin nhắn") {
            iconComponent = (
              <View style={{ marginTop: 6 }}>
                <Ionicons
                  name="chatbubble-outline" // Icon cho Tin nhắn
                  size={24}
                  color={focused ? '#B91C1C' : '#6B7280'}
                  style={{ width: 30 }}
                />
              </View>
            );
            labelComponent = (
              <Text
                style={{
                  color: focused ? "#B91C1C" : "#6B7280",
                  marginTop: 4
                }}
              >
                Tin Nhắn
              </Text>
            );
          } else if (route.name === "Người dùng") {
            iconComponent = (
              <View style={{ marginTop: 6 }}>
                <Ionicons
                  name="person-outline" // Icon cho Hồ sơ/Người dùng
                  size={24}
                  color={focused ? '#B91C1C' : '#6B7280'}
                  style={{ width: 30 }}
                />
              </View>
            );
            labelComponent = (
              <Text
                style={{
                  marginTop: 4, // Căn chỉnh khoảng cách giống các thành phần khác
                  color: focused ? "#B91C1C" : "#6B7280"
                }}
              >
                Hồ Sơ
              </Text>
            );
          }

          return (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 80
              }}
            >
              {iconComponent}
              {labelComponent}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Trang Chủ" component={HomeKH} />
      <Tab.Screen name="Đơn Hàng" component={OrdersScreen} />
      <Tab.Screen name="Tin nhắn" component={MessagesScreen} />
      <Tab.Screen name="Người dùng" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default MyTabs;
