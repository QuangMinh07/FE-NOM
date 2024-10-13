import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";  // For settings icon
import { api, typeHTTP } from "../../utils/api"; // Import the API utility
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

export default function InformationUser() {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  // Function to fetch user profile
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
        {/* User Information */}
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

        {/* Settings Icon */}

      </View>

      {/* Body with Buttons */}
      <View style={{ padding: width * 0.05 }}>
        <TouchableOpacity
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
          onPress={() => navigation.navigate("Information")} // Navigate to the Information screen
        >
          <Text style={{ fontSize: height * 0.02 }}>Xem chi tiết</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={height * 0.03}
            color="#000"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            padding: height * 0.02,
            borderRadius: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={() => navigation.navigate("UpdateInformation")} // Navigate to the UpdateInformation screen
        >
          <Text style={{ fontSize: height * 0.02 }}>Cập nhật thông tin</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={height * 0.03}
            color="#000"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
