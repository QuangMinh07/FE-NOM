import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Ensure you import your API utilities

const { width, height } = Dimensions.get("window"); // Get device dimensions

export default function StoreKH() {
  const route = useRoute(); // To get route params
  const [loading, setLoading] = useState(true); // Loading state
  const [store, setStore] = useState(null); // Store data state
  const { storeId } = route.params; // Retrieve storeId from navigation params
  const [error, setError] = useState(null); // Error state

  // Hàm xử lý hiển thị thời gian mở cửa từ dữ liệu
  const formatSellingTime = () => {
    if (!sellingTime.length) return "Không có dữ liệu thời gian";

    // Nhóm các ngày có cùng giờ mở cửa
    const groupedTime = {};

    sellingTime.forEach((day) => {
      const timeSlotString = day.timeSlots.map((slot) => `${slot.open}-${slot.close}`).join(", ");

      if (!groupedTime[timeSlotString]) {
        groupedTime[timeSlotString] = [];
      }

      groupedTime[timeSlotString].push(day.day);
    });

    // Tạo chuỗi hiển thị
    return Object.entries(groupedTime)
      .map(([timeSlotString, days]) => {
        return `${days.join(", ")} - ${timeSlotString.replace("-", " đến ")}`;
      })
      .join("\n"); // Hiển thị từng dòng cho mỗi nhóm thời gian
  };

  useEffect(() => {
    // Fetch store data by storeId
    const fetchStore = async () => {
      try {
        setLoading(true);
        const data = await api({
          method: typeHTTP.GET,
          url: `/store/get-store/${storeId}`, // API endpoint to get store by ID
          sendToken: true, // Send authentication token
        });
        setStore(data.data); // Set store data
      } catch (err) {
        console.error("Error fetching store:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStore(); // Fetch store data on component mount
    }
  }, [storeId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading store data: {error.message}</Text>
      </View>
    );
  }

  if (!store) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Store not found</Text>
      </View>
    );
  }

  const { storeName, storeAddress, isOpen, sellingTime } = store; // Destructure store data

  const navigation = useNavigation(); // To navigate between screens

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Content Area */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100, // Ensure there is space for the footer
        }}
      >
        {/* Header - Store Banner */}
        <View style={{ position: "relative" }}>
          <View
            style={{
              backgroundColor: "#E53935", // Red placeholder color
              height: height * 0.25, // Flexible height
              borderRadius: 10,
              marginBottom: 10,
            }}
          />

          {/* Cart Icon Replacing Upload Icon */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 60,
              right: 30,
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 8,
              elevation: 5,
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 2 },
            }}
            onPress={() => navigation.navigate("Shopping")} // Navigate to the Shopping screen
          >
            <Icon name="shopping-cart" size={24} color="#E53935" />
          </TouchableOpacity>

          {/* Store Info Floating Box */}
          <View
            style={{
              position: "absolute",
              bottom: -40,
              left: width * 0.05,
              right: width * 0.05,
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              elevation: 5,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000", width: 110 }}>{storeName}</Text>
              <Text style={{ fontSize: 12, color: "#333", marginTop: 4 }}>4.5 ⭐ (25+)</Text>
              <View
                style={{
                  backgroundColor: isOpen ? "#00a651" : "#E53935",
                  borderRadius: 3,
                  paddingHorizontal: 5,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>{isOpen ? "Đang mở cửa" : "Đã đóng cửa"}</Text>
              </View>
            </View>

            {/* Store Hours */}
            <View>
              <Text style={{ fontSize: 14, color: "#E53935", marginTop: 5 }}>Thời gian mở cửa:</Text>
              <Text style={{ paddingLeft: 20, fontSize: 14, color: "#E53935" }}>{formatSellingTime()}</Text>
            </View>

            <Text style={{ fontSize: 14, color: "#333", marginTop: 5 }}>{storeAddress}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer Section */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#E53935",
          padding: 15,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>20.000 VND</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "#E53935", fontSize: 16 }}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
