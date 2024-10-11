import { View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Swipeable } from "react-native-gesture-handler"; // Import Swipeable
import { api, typeHTTP } from "../../utils/api"; // Import API
import { globalContext } from "../../context/globalContext";
import { styles } from "./OrderManagementStyles"; // Import style từ file đã tách

const { width } = Dimensions.get("window");

export default function OrderManagementScreen() {
  const [selectedTab, setSelectedTab] = useState("Mới");
  const [newOrders, setNewOrders] = useState([]); // Lưu trữ danh sách đơn hàng mới
  const [receivedOrders, setReceivedOrders] = useState([]); // Lưu trữ danh sách đơn hàng đã nhận
  const { globalData } = useContext(globalContext);

  const storeId = globalData.storeData?._id;

  const tabs = ["Mới", "Đã Nhận", "Lịch sử"];

  const fetchOrders = async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: "/storeOrder/get-all-orders",
        sendToken: true,
      });

      const { allOrdersDetails } = response;

      const newOrdersData = allOrdersDetails.filter((order) => order.orderStatus === "Pending");
      const receivedOrdersData = allOrdersDetails.filter((order) => order.orderStatus === "Processing");

      setNewOrders(newOrdersData);
      setReceivedOrders(receivedOrdersData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmOrder = async (orderId) => {
    console.log("ID đơn hàng cần xác nhận:", orderId); // Log lại để kiểm tra
    console.log("Store ID:", storeId); // Log lại Store ID để kiểm tra

    console.log("Request Body:", { orderId });
    console.log("Request URL:", `/storeOrder/update-status/${storeId}`);

    try {
      const response = await api({
        method: typeHTTP.PUT,
        url: `/storeOrder/update-status/${storeId}`,
        sendToken: true,
        body: { orderId: orderId }, // Gửi orderId vào body của request
      });

      console.log("Kết quả trả về từ API:", response); // Log kết quả trả về từ API

      alert(`Đơn hàng đã được cập nhật trạng thái.`);
      fetchOrders(); // Cập nhật lại danh sách đơn hàng sau khi thành công
    } catch (error) {
      console.error("Lỗi xảy ra:", error);

      if (error.response) {
        console.error("Lỗi từ phía server:", error.response.data);
        alert(`Lỗi: ${error.response.data.message || "Không thể cập nhật trạng thái đơn hàng."}`);
      } else if (error.request) {
        console.error("Không có phản hồi từ server:", error.request);
        alert("Không có phản hồi từ server. Vui lòng kiểm tra kết nối mạng.");
      } else {
        console.error("Lỗi khi gửi yêu cầu:", error.message);
        alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
      }
    }
  };

  // Hàm render đơn hàng mới (Pending)
  const renderNewOrders = () => {
    if (newOrders.length === 0) {
      return (
        <View style={{ paddingHorizontal: width * 0.05 }}>
          <Text>Không có đơn hàng mới.</Text>
        </View>
      );
    }

    return newOrders.map((order, index) => (
      <Swipeable key={index}>
        <View style={styles.container}>
          <Text style={styles.orderDateText}>{new Date(order.orderDate).toLocaleDateString()}</Text>
          <View style={styles.row}>
            <View style={styles.itemCountContainer}>
              <Text style={styles.itemCountText}>{order.foods.length}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{order.user.fullName}</Text>
              <View style={styles.infoContainer}>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <Text style={styles.infoText}>Đặt đơn</Text>
                  <Text style={styles.boldText}>{new Date(order.orderDate).toLocaleTimeString()}</Text>
                </View>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <Text style={styles.infoText}>Món</Text>
                  <Text style={styles.boldText}>{order.foods.length}</Text>
                </View>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <Text style={styles.infoText}>Giá đơn hàng</Text>
                  <Text style={styles.boldText}>{order.totalAmount.toLocaleString()} VND</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Nút xác nhận */}
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
            <TouchableOpacity onPress={() => handleConfirmOrder(order.orderId)} style={styles.button}>
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
    ));
  };

  // Hàm render đơn hàng đã nhận (Processing)
  const renderReceivedOrders = () => {
    if (receivedOrders.length === 0) {
      return (
        <View style={{ paddingHorizontal: width * 0.05 }}>
          <Text>Không có đơn hàng đã nhận.</Text>
        </View>
      );
    }

    return receivedOrders.map((order, index) => (
      <Swipeable key={index}>
        <View style={styles.container}>
          <Text style={styles.orderDateText}>{new Date(order.orderDate).toLocaleDateString()}</Text>
          <View style={styles.row}>
            <View style={styles.itemCountContainer}>
              <Text style={styles.itemCountText}>{order.foods.length}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{order.user.fullName}</Text>
              <View style={styles.infoContainer}>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <Text style={styles.infoText}>Đặt đơn</Text>
                  <Text style={styles.boldText}>{new Date(order.orderDate).toLocaleTimeString()}</Text>
                </View>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <Text style={styles.infoText}>Món</Text>
                  <Text style={styles.boldText}>{order.foods.length}</Text>
                </View>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <Text style={styles.infoText}>Giá đơn hàng</Text>
                  <Text style={styles.boldText}>{order.totalAmount.toLocaleString()} VND</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Nút "Đã hoàn thành" */}
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
            <View style={styles.completedButton}>
              <Text style={styles.buttonText}>Đã Nhận</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    ));
  };

  const renderOrders = () => {
    switch (selectedTab) {
      case "Mới":
        return <View style={{ paddingHorizontal: width * 0.05 }}>{renderNewOrders()}</View>;
      case "Đã Nhận":
        return <View style={{ paddingHorizontal: width * 0.05 }}>{renderReceivedOrders()}</View>;
      case "Lịch sử":
        return (
          <View style={{ paddingHorizontal: width * 0.05 }}>
            <Text>Đang xử lý...</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Đơn hàng</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={20} color="#E53935" />
        <TextInput placeholder="Tìm kiếm" style={styles.searchInput} />
      </View>

      {/* Tabs */}
      <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-around", backgroundColor: "#fff", paddingVertical: 20 }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)} style={{ paddingBottom: 10, borderBottomWidth: selectedTab === tab ? 4 : 0, borderBottomColor: "#E53935" }}>
            <Text style={{ color: selectedTab === tab ? "#E53935" : "#6B7280", fontSize: selectedTab === tab ? 18 : 16, fontWeight: selectedTab === tab ? "bold" : "normal" }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}>{renderOrders()}</ScrollView>
    </View>
  );
}
