import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api";

const { width, height } = Dimensions.get("window");

export default function ProfileShipper() {
  const [showMore, setShowMore] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái chờ

  // Hàm định dạng ngày theo DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "Không có thông tin";
    const d = new Date(date);
    const day = `0${d.getDate()}`.slice(-2);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Hàm lấy thông tin người dùng từ API
  const getUserProfile = async () => {
    let profileData = {};
    let personalInfoData = {};

    try {
      // Gọi API lấy thông tin người dùng
      const profileResponse = await api({
        method: typeHTTP.GET,
        url: "/user/profile",
        sendToken: true,
      });

      if (profileResponse.success) {
        profileData = profileResponse.user; // Lưu thông tin người dùng vào biến profileData
      }
    } catch (error) {
      // Không log lỗi, chỉ để yên
    }

    try {
      // Gọi API lấy thông tin cá nhân người dùng
      const personalInfoResponse = await api({
        method: typeHTTP.GET,
        url: "/userPersonal/personal-info",
        sendToken: true,
      });

      if (personalInfoResponse.success) {
        personalInfoData = personalInfoResponse.userPersonalInfo; // Lưu thông tin cá nhân vào biến personalInfoData
      }
    } catch (error) {
      // Không log lỗi, chỉ để yên
    }

    // Kết hợp cả hai dữ liệu profile và personal info
    const combinedUserData = { ...profileData, ...personalInfoData };
    setUserData(combinedUserData); // Cập nhật state với dữ liệu kết hợp
    setLoading(false); // Tắt trạng thái chờ
  };

  useFocusEffect(
    useCallback(() => {
      getUserProfile();
    }, [])
  );

  if (loading) {
    // Hiển thị thông báo chờ khi dữ liệu đang tải
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header with avatar */}
      <View
        style={{
          backgroundColor: "#E53935",
          height: height * 0.2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: height * 0.15,
            width: width,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: width * 0.2,
              height: width * 0.2,
              borderRadius: (width * 0.2) / 2,
              borderColor: "#E53935",
              borderWidth: 2,
              backgroundColor: "#fff",
              overflow: "hidden", // Đảm bảo ảnh nằm gọn trong khung tròn
            }}
          >
            {userData?.profilePictureURL ? (
              <Image
                source={{ uri: userData.profilePictureURL }} // Hiển thị ảnh từ URL
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: (width * 0.2) / 2, // Đảm bảo ảnh được bo tròn
                }}
              />
            ) : (
              <Text style={{ textAlign: "center", marginTop: 40 }}>Avatar</Text> // Hiển thị văn bản nếu không có ảnh
            )}
          </View>
        </View>
      </View>

      {/* User Information */}
      <View
        style={{
          padding: width * 0.05,
          marginTop: height * 0.05,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#333",
            marginBottom: 5,
          }}
        >
          Tên người dùng
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 15,
            marginLeft: 30,
            marginTop: 20,
          }}
        >
          {userData?.fullName ? userData.fullName : "Không có thông tin"}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#333",
            marginBottom: 5,
          }}
        >
          Số điện thoại
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 15,
            marginLeft: 30,
            marginTop: 20,
          }}
        >
          {userData?.phoneNumber ? userData.phoneNumber : "Không có thông tin"}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#333",
            marginBottom: 5,
          }}
        >
          Gmail
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 15,
            marginLeft: 30,
            marginTop: 20,
          }}
        >
          {userData?.email ? userData.email : "Không có thông tin"}
        </Text>

        {/* See more button */}
        <TouchableOpacity onPress={() => setShowMore(!showMore)}>
          <Text
            style={{
              color: "#E53935",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            {showMore ? "Ẩn bớt" : "Xem thêm"}
          </Text>
        </TouchableOpacity>

        {showMore && (
          <>
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 5,
              }}
            >
              Ngày sinh
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 15,
                marginLeft: 30,
                marginTop: 20,
              }}
            >
              {formatDate(userData?.dateOfBirth)}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 5,
              }}
            >
              Giới tính
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 15,
                marginLeft: 30,
                marginTop: 20,
              }}
            >
              {userData?.gender ? userData.gender : "Không có thông tin"}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 5,
              }}
            >
              Tình trạng
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 15,
                marginLeft: 30,
                marginTop: 20,
              }}
            >
              {userData?.state ? userData.state : "Không có thông tin"}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
