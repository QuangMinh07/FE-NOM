import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { api, typeHTTP } from "../../utils/api"; // Import hàm api của bạn
import { useRoute } from "@react-navigation/native"; // Để lấy orderId từ params

export default function DeliveryODDetails() {
  const [orderDetails, setOrderDetails] = useState(null); // Dữ liệu đơn hàng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [isPickedUp, setIsPickedUp] = useState(false); // Trạng thái để theo dõi việc lấy món ăn

  const route = useRoute(); // Sử dụng useRoute để lấy orderId từ params
  const { orderId } = route.params; // Lấy orderId từ params được truyền từ màn hình trước

  useEffect(() => {
    // Gọi API để lấy chi tiết đơn hàng khi component được mount
    const fetchOrderDetails = async () => {
      try {
        const response = await api({
          method: typeHTTP.GET,
          url: `/storeOrder/details/${orderId}`, // API chi tiết đơn hàng
          sendToken: true,
        });
        setOrderDetails(response.orderDetails); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Hàm xử lý nút "Đã lấy món ăn"
  const handlePickedUp = () => {
    setIsPickedUp(true);
    // Gọi API hoặc xử lý logic thêm tại đây nếu cần
  };

  // Hàm xử lý nút "Đã giao thành công"
  const handleDelivered = () => {
    console.log("Giao hàng thành công");
    // Gọi API hoặc xử lý logic thêm tại đây nếu cần
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  // Kiểm tra nếu không có dữ liệu orderDetails
  if (!orderDetails) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy chi tiết đơn hàng</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#E53935",
          padding: 24,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          width: "100%",
          height: "20%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 22, color: "#fff", fontWeight: "bold", marginTop: 15 }}>Chi tiết đơn hàng</Text>
        <Text style={{ fontSize: 16, color: "#fff", marginTop: 15 }}>{new Date(orderDetails.orderDate).toLocaleDateString()}</Text>
      </View>

      {/* Thời gian */}
      <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Thời gian đặt hàng:</Text>
          <Text style={{ fontSize: 16 }}>{new Date(orderDetails.orderDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
        </View>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thời gian nhận hàng:</Text>
          <Text style={{ fontSize: 16 }}>09:10 PM</Text> 
        </View> */}
      </View>

      {/* Thông tin cửa hàng */}
      <View
        style={{
          backgroundColor: "#f9f9f9",
          padding: 16,
          borderRadius: 8,
          marginVertical: 8,
          marginHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="location-outline" size={16} color="#4CAF50" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 8 }}>{orderDetails.store.storeName}</Text>
          </View>
          <Text style={{ fontSize: 14, color: "#E53935" }}>4.5 ⭐ (25+)</Text>
        </View>
        <Text style={{ fontSize: 14, color: "#333" }}>{orderDetails.store.storeAddress}</Text>
      </View>

      {/* Thông tin người nhận */}
      <View
        style={{
          backgroundColor: "#f9f9f9",
          padding: 16,
          borderRadius: 8,
          marginVertical: 8,
          marginHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="person-outline" size={16} color="#E53935" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 8 }}>{orderDetails.user.fullName}</Text>
          </View>
          <Text style={{ fontSize: 14, color: "#E53935" }}>4.5 ⭐ (25+)</Text>
        </View>
        <Text style={{ fontSize: 14, color: "#333" }}>{orderDetails.cartSnapshot.deliveryAddress}</Text>
        <Text style={{ fontSize: 14, color: "#333", marginTop: 4 }}>Số điện thoại: {orderDetails.cartSnapshot.receiverPhone}</Text>
        {/* <Text style={{ fontSize: 14, color: "#333", marginTop: 4 }}>Mô tả: Không</Text> */}
      </View>

      {/* Tiêu đề "Chi tiết đơn hàng" */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginHorizontal: 16,
          marginTop: 25,
          marginBottom: 8,
        }}
      >
        Chi tiết đơn hàng
      </Text>

      {/* Chi tiết đơn hàng */}
      <View style={{ paddingHorizontal: 16 }}>
        {orderDetails.foods.map((food, index) => (
          <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 16 }}>
              {food.quantity}x {food.foodName}
            </Text>
            <Text style={{ fontSize: 16 }}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
          </View>
        ))}
      </View>

      {/* Tổng hóa đơn */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderTopWidth: 1,
          borderColor: "#ddd",
          marginTop: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Tổng hóa đơn</Text>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#E53935" }}>{orderDetails.totalAmount.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
      </View>

      {/* Liên hệ khách hàng */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 12,
          borderTopWidth: 1,
          borderColor: "#ddd",
          paddingHorizontal: 16,
          marginHorizontal: 16,
          marginTop: 16,
        }}
        onPress={() => {
          // Thêm logic liên hệ khách hàng tại đây
        }}
      >
        <Icon name="chatbubble-ellipses-outline" size={20} color="#E53935" style={{ marginRight: 8 }} />
        <Text style={{ color: "#E53935", fontSize: 16 }}>Liên hệ với Khách hàng</Text>
      </TouchableOpacity>

      {/* Nút hành động */}
      {orderDetails.orderStatus === "Received" &&
        (!isPickedUp ? (
          <TouchableOpacity
            style={{
              backgroundColor: "#E53935",
              paddingVertical: 16,
              borderRadius: 8,
              marginHorizontal: 16,
              marginTop: 24,
              marginBottom: 24,
            }}
            onPress={handlePickedUp}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Đã lấy món ăn</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "#E53935",
              paddingVertical: 16,
              borderRadius: 8,
              marginHorizontal: 16,
              marginTop: 24,
              marginBottom: 24,
            }}
            onPress={handleDelivered}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Đã giao thành công</Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}
