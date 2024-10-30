import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Modal, Pressable, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  const getUserProfile = async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: "/user/profile",
        sendToken: true,
      });

      if (response && response.success) {
        setUserData(response.user);
        console.log("Thông tin người dùng:", response.user);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUserProfile();
    }, [])
  );

  const handleLogout = async () => {
    try {
      // Gọi API để cập nhật trạng thái isOnline về false
      await api({
        method: typeHTTP.PUT,
        url: "/user/setOnlineStatus",
        body: { isOnline: false },
        sendToken: true,
      });

      // Xóa token khỏi AsyncStorage
      await AsyncStorage.removeItem("auth_token");
      setModalVisible(false); // Đóng modal trước khi chuyển màn hình

      Alert.alert("Đăng xuất thành công!");
      navigation.navigate("WelcomeScreen");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      Alert.alert("Lỗi", "Đăng xuất không thành công. Vui lòng thử lại.");
    }
  };

  const handleForgotPassword = () => {
    setModalVisible(false);

    // Ensure userData is defined and has a valid userId
    if (userData && userData._id) {
      navigation.navigate("UpdateAccount", { userId: userData._id }); // Pass only the serializable userId
    } else {
      Alert.alert("Lỗi", "Không tìm thấy ID người dùng.");
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
            <Text style={{ fontSize: height * 0.025, fontWeight: "bold" }}>{userData ? (userData.fullName || userData.userName).charAt(0) : "N"} </Text>
          </View>
          <Text
            style={{
              color: "#fff",
              fontSize: height * 0.022,
              marginLeft: width * 0.03,
            }}
          >
            {userData ? userData.fullName || userData.userName : ""}
          </Text>
        </View>

        {/* Icon Cài đặt */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="settings-outline" size={height * 0.04} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{ padding: width * 0.05 }}>
        {["Thông tin cá nhân", "Chuyển đổi tài khoản", "Ngân hàng liên kết", "Ngôn ngữ", "Nhận xét đánh giá"].map((item, index) => (
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
              switch (item) {
                case "Thông tin cá nhân":
                  navigation.navigate("InformationUser");
                  break;
                case "Chuyển đổi tài khoản":
                  navigation.navigate("Route");
                  break;
                case "Ngân hàng liên kết":
                  // navigation.navigate("OrderingProcess");
                  break;
                case "Ngôn ngữ":
                  // navigation.navigate("InvoiceDetails");
                  break;
                case "Nhận xét đánh giá":
                  navigation.navigate("ReviewsScreen");
                  break;
                default:
                  console.log("No action assigned for this item");
              }
            }}
          >
            <Text style={{ fontSize: height * 0.02 }}>{item}</Text>
            <Ionicons name="chevron-forward-outline" size={height * 0.03} color="#000" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal Cài đặt */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          onPress={() => setModalVisible(false)} // Đóng modal khi nhấn ra ngoài
        >
          <Pressable
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: height * 0.03,
            }}
            onPress={(e) => e.stopPropagation()} // Ngăn modal đóng khi nhấn vào nội dung bên trong
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

            {/* Nút Quên mật khẩu */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={{
                backgroundColor: "#ffa500",
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
                Đổi mật khẩu
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
