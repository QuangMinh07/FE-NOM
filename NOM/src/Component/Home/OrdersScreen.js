import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Alert, Modal, TextInput, Button } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Gọi API

const { width } = Dimensions.get("window");

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState("Đang đặt");
  const [orders, setOrders] = useState({
    ongoing: [],
    history: [],
    pendingPayment: [],
  }); // Chứa các đơn hàng được phân loại theo tab
  const [modalVisible, setModalVisible] = useState(false); // State để quản lý modal
  const [cancelReason, setCancelReason] = useState(""); // State để lưu lý do hủy
  const [currentOrder, setCurrentOrder] = useState(null); // State để lưu đơn hàng hiện tại khi nhấn hủy
  const navigation = useNavigation();

  const tabs = ["Đang đặt", "Lịch sử", "Chờ thanh toán"];

  // Hàm gọi API để lấy tất cả các đơn hàng
  const fetchAllOrders = useCallback(async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: "/storeOrder/get-all-orders", // Endpoint lấy tất cả đơn hàng
        sendToken: true,
      });
      const { allOrdersDetails } = response;

      // Phân loại đơn hàng theo trạng thái
      const ongoing = allOrdersDetails.filter((order) => order.orderStatus === "Pending" || order.orderStatus === "Processing" || order.orderStatus === "Shipped");
      const history = allOrdersDetails.filter((order) => order.paymentStatus === "Paid" || order.orderStatus === "Cancelled");

      // Sửa lại điều kiện lọc cho tab "Chờ thanh toán"
      const pendingPayment = allOrdersDetails.filter((order) => order.paymentStatus === "Pending" && order.orderStatus !== "Cancelled");

      // Cập nhật đơn hàng phân loại vào state
      setOrders({ ongoing, history, pendingPayment });
    } catch (error) {
      console.error("Lỗi khi gọi API lấy tất cả đơn hàng:", error);
    }
  }, []); // `useCallback` chỉ gọi lại khi không có dependency hoặc khi có dependency thay đổi

  // Gọi API khi component được render
  useFocusEffect(
    useCallback(() => {
      fetchAllOrders(); // Gọi kiểm tra ngay khi màn hình được focus
    }, [fetchAllOrders])
  );
  // Hàm để hiển thị trạng thái đơn hàng theo điều kiện
  const getOrderStatusDisplay = (status) => {
    switch (status) {
      case "Pending":
        return "Đang xử lý";
      case "Processing":
        return "Đang chuẩn bị";
      case "Shipped":
        return "Đang giao";
      case "Delivered":
        return "Đã giao";
      case "Cancelled": // Trạng thái đã hủy
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Hàm để hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!cancelReason) {
      Alert.alert("Lý do hủy", "Vui lòng nhập lý do hủy đơn hàng.");
      return;
    }

    try {
      // Cập nhật URL để truyền userId và orderId qua params
      const response = await api({
        method: typeHTTP.POST,
        url: `/OrderCancellation/cancel/${currentOrder.user.userId}/${currentOrder.orderId}`, // Sử dụng params trong URL
        body: { reason: cancelReason }, // Truyền lý do vào body
        sendToken: true,
      });

      if (response.message) {
        Alert.alert("Thành công", response.message);
        setModalVisible(false); // Đóng modal sau khi hủy thành công
        fetchAllOrders(); // Cập nhật lại danh sách đơn hàng
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
  };

  // Hàm để mở modal nhập lý do khi nhấn nút hủy đơn
  const openCancelModal = (order) => {
    setCurrentOrder(order); // Lưu đơn hàng hiện tại
    setModalVisible(true); // Mở modal
  };

  // Hàm render đơn hàng dựa trên tab đã chọn
  const renderOrders = (orderList, tab) => {
    return (
      <View style={{ paddingHorizontal: width * 0.05 }}>
        {orderList.map((order, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{order.store.storeName}</Text>
              {/* Hiển thị trạng thái tương ứng theo tab */}
              <Text style={{ fontSize: 14, color: order.orderStatus === "Cancelled" ? "#E53935" : "#666" }}>{getOrderStatusDisplay(order.orderStatus)}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <Text style={{ fontSize: 14, color: "#666" }}>{order.foods.map((food) => food.foodName).join(", ")}</Text>
              <Text style={{ fontSize: 14, color: "#666" }}>{order.foods.length} món</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <Text style={{ fontSize: 14, color: "#666" }}>{new Date(order.orderDate).toLocaleString()}</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{order.totalAmount.toLocaleString()} VND</Text>
            </View>

            {/* Chỉ hiển thị nút hủy khi trạng thái đơn hàng là Pending */}
            {order.orderStatus === "Pending" && (
              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => openCancelModal(order)}
                  style={{
                    backgroundColor: "#E53935",
                    borderRadius: 5,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 120, // Đặt chiều rộng nhỏ hơn vừa đủ cho nút
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold", textAlign: "center" }}>Hủy đơn hàng</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#E53935", padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 140 }}>
        {/* Thông tin người dùng */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#fff", fontSize: 22, marginLeft: 10, fontWeight: "bold" }}>Đơn hàng</Text>
        </View>
        {/* Icons */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Icon giỏ hàng */}
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons onPress={() => navigation.navigate("Shopping")} name="cart-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", backgroundColor: "#fff", paddingVertical: 10 }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={{
              borderBottomWidth: selectedTab === tab ? 2 : 0,
              borderBottomColor: "#E53935",
              paddingBottom: 10,
            }}
          >
            <Text style={{ color: selectedTab === tab ? "#E53935" : "#6B7280", fontSize: 16 }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {selectedTab === "Đang đặt" && renderOrders(orders.ongoing, "Đang đặt")}
        {selectedTab === "Lịch sử" && renderOrders(orders.history, "Lịch sử")}
        {selectedTab === "Chờ thanh toán" && renderOrders(orders.pendingPayment, "Chờ thanh toán")}
      </ScrollView>

      {/* Modal nhập lý do hủy đơn hàng */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, width: width * 0.8 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Nhập lý do hủy đơn hàng</Text>
            <TextInput
              placeholder="Lý do hủy đơn hàng"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
                width: "100%",
              }}
              value={cancelReason}
              onChangeText={setCancelReason}
            />
            <Button title="Xác nhận hủy" onPress={handleCancelOrder} />
            <Button title="Hủy" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
