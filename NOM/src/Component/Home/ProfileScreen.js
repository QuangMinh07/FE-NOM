import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false); // Trạng thái để kiểm soát modal
  const navigation = useNavigation(); // Sử dụng useNavigation

  const [userData, setUserData] = useState(null); // Tạo state để lưu thông tin người dùng

  // Hàm lấy thông tin người dùng từ API
  const getUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token"); // Lấy token từ AsyncStorage
      if (!token) {
        console.log("Token không tồn tại");
        return;
      }

      const response = await axios.get(
        "http://192.168.1.21:5000/v1/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      );

      if (response.data.success) {
        setUserData(response.data.user); // Lưu thông tin người dùng vào state
        console.log("Thông tin người dùng:", response.data.user);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  // Gọi hàm lấy thông tin người dùng khi component được load
  useEffect(() => {
    getUserProfile();
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      console.log("Đang đăng xuất..."); // Log khi bắt đầu đăng xuất
      await AsyncStorage.removeItem("auth_token"); // Xóa token khỏi AsyncStorage
      console.log("Token đã được xóa khỏi AsyncStorage"); // Log khi token đã được xóa
      setModalVisible(false); // Đóng modal
      Alert.alert("Đăng xuất thành công!");
      navigation.navigate("WelcomeScreen"); // Điều hướng về màn hình đăng nhập
      console.log("Đã điều hướng về màn hình đăng nhập"); // Log khi đã điều hướng
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#E53935",
          padding: height * 0.02,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 140,
        }}
      >
        {/* Thông tin người dùng */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: width * 0.12,
              height: width * 0.12,
              backgroundColor: "#fff",
              borderRadius: (width * 0.12) / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: height * 0.025, fontWeight: "bold" }}>
              {userData ? userData.fullName.charAt(0) : "N"}
            </Text>
          </View>
          <Text
            style={{
              color: "#fff",
              fontSize: height * 0.022,
              marginLeft: width * 0.03,
            }}
          >
            {userData ? userData.fullName : "Nguyễn Thị Kiều Nghi"}
          </Text>
        </View>

        {/* Icon Cài đặt */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="settings-outline" size={height * 0.04} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{ padding: width * 0.05 }}>
        {/* Các mục thông tin */}
        {[
          "Thông tin cá nhân",
          "Nâng cấp tài khoản",
          "Ngân hàng liên kết",
          "Ngôn ngữ",
          "Nhận xét đánh giá",
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: "#fff",
              padding: height * 0.02,
              borderRadius: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: height * 0.015,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => {
              if (item === "Nâng cấp tài khoản") {
                navigation.navigate("UpdateAccount");
              }
            }}
          >
            <Text style={{ fontSize: height * 0.02 }}>{item}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={height * 0.03}
              color="#000"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal Cài đặt */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Đóng modal khi nhấn nút back
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end", // Đặt modal ở dưới cùng màn hình
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: height * 0.03,
            }}
          >
            {/* Nút Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: "#E53935",
                paddingVertical: height * 0.02,
                paddingHorizontal: width * 0.1,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: height * 0.02,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: height * 0.02,
                  fontWeight: "bold",
                }}
              >
                Đăng xuất
              </Text>
            </TouchableOpacity>

            {/* Nút Đóng Modal */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text
                style={{
                  color: "#000",
                  fontSize: height * 0.02,
                  textAlign: "center",
                }}
              >
                Đóng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
