import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator, Image, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api";

const { width, height } = Dimensions.get("window");

export default function ProfileShipper() {
  const [showMore, setShowMore] = useState(false); // State to toggle the visibility of additional information
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for API data
  const [shipperInfo, setShipperInfo] = useState(null); // State to store shipperInfo data

  // Function to format date as DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "Không có thông tin";
    const d = new Date(date);
    const day = `0${d.getDate()}`.slice(-2);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to fetch user profile data from the API
  const getUserProfile = async () => {
    let profileData = {};
    let personalInfoData = {};
    let shipperInfoData = {}; // Thêm biến cho thông tin shipper

    try {
      const profileResponse = await api({
        method: typeHTTP.GET,
        url: "/user/profile",
        sendToken: true,
      });

      if (profileResponse.success) {
        profileData = profileResponse.user;
        setShipperInfo(profileResponse.shipperInfo); // Set shipperInfo data

      }
    } catch (error) {
      // Handle error (log or ignore as needed)
    } finally {
      setLoading(false); // Turn off loading state once data is fetched
    }
  
    try {
      const personalInfoResponse = await api({
        method: typeHTTP.GET,
        url: "/userPersonal/personal-info",
        sendToken: true,
      });

      if (personalInfoResponse.success) {
        personalInfoData = personalInfoResponse.userPersonalInfo;
      }
    } catch (error) {
      // Handle error (log or ignore as needed)
    }

    // Combine both profile and personal info data into one object
    const combinedUserData = { ...profileData, ...personalInfoData };
    setUserData(combinedUserData);
    setLoading(false); // Turn off loading state once data is fetched
  };

  useFocusEffect(
    useCallback(() => {
      getUserProfile();
    }, [])
  );

  if (loading) {
    // Display loading spinner while data is being fetched
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
              overflow: "hidden",
            }}
          >
            {userData?.profilePictureURL ? (
              <Image
                source={{ uri: userData.profilePictureURL }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: (width * 0.2) / 2,
                }}
              />
            ) : (
              <Text style={{ textAlign: "center", marginTop: 40 }}>Avatar</Text>
            )}
          </View>
        </View>
      </View>

      {/* User Information */}
      <ScrollView
        style={{
          padding: width * 0.05,
          marginTop: height * 0.05,
        }}
      >
        {/* Show the first three fields (Name, Phone, and Email) */}
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
            marginTop: 10,
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

        {/* Show more fields when the button is pressed */}
        {showMore && (
          <>
             <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 5,
              }}
            >
              Số CCCD/CMND
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
              {userData?.cccd ? userData.cccd : "Không có thông tin"}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 5,
              }}
            >
              Bảng số xe
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
              {shipperInfo?.vehicleNumber ? shipperInfo.vehicleNumber : "Không có thông tin"}
            </Text>


            <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 5,
              }}
            >
              Tài khoản ngân hàng
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
              {shipperInfo?.bankAccount ? shipperInfo.bankAccount : "Không có thông tin"}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 5,
              }}
            >
              Địa chỉ thường trú
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
              {userData?.address ? userData.address : "Không có thông tin"}
            </Text>

            {/* Địa chỉ tạm trú */}
           
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 5,
              }}
            >
              Địa chỉ tạm trú
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
              {shipperInfo?.temporaryAddress ? shipperInfo.temporaryAddress : "Không có thông tin"}
            </Text>

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
      </ScrollView>
    </View>
  );
}
