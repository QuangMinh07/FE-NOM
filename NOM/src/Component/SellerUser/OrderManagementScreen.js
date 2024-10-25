import { View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput, Modal, Alert, Button } from "react-native";
import React, { useState, useContext, useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Swipeable } from "react-native-gesture-handler"; // Import Swipeable
import { api, typeHTTP } from "../../utils/api"; // Import API
import { globalContext } from "../../context/globalContext";
import { styles } from "./OrderManagementStyles"; // Import style từ file đã tách
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function OrderManagementScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("Mới");
  const [newOrders, setNewOrders] = useState([]); // Lưu trữ danh sách đơn hàng mới
  const [receivedOrders, setReceivedOrders] = useState([]); // Lưu trữ danh sách đơn hàng đã nhận
  const { globalData } = useContext(globalContext);
  const [modalVisible, setModalVisible] = useState(false); // Quản lý modal
  const [cancelReason, setCancelReason] = useState(""); // Lý do hủy đơn
  const [currentOrder, setCurrentOrder] = useState(null); // Đơn hàng đang hủy
  const [historyOrders, setHistoryOrders] = useState([]); // Lưu trữ danh sách đơn hàng lịch sử (đã hủy)

  const storeId = globalData.storeData?._id;
  const userId = globalData.user?.id;
  console.log(storeId);

  const tabs = ["Mới", "Đã Nhận", "Lịch sử"];

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/storeOrder/get-orders/${storeId}`, // URL mới lấy đơn hàng theo storeId
        sendToken: true,
      });

      const { storeOrdersDetails } = response; // Thay đổi response từ storeOrdersDetails

      // Lọc đơn hàng theo trạng thái: Mới, Đã nhận và Đã hủy
      const newOrdersData = storeOrdersDetails.filter((order) => order.orderStatus === "Pending");
      const receivedOrdersData = storeOrdersDetails.filter((order) => order.orderStatus === "Shipped");
      const historyOrdersData = storeOrdersDetails.filter((order) => order.orderStatus === "Cancelled");

      setNewOrders(newOrdersData);
      setReceivedOrders(receivedOrdersData);
      setHistoryOrders(historyOrdersData);
    } catch (error) {
      // console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  }, [storeId]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders(); // Gọi kiểm tra ngay khi màn hình được focus
    }, [fetchOrders])
  );

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await api({
        method: typeHTTP.PUT,
        url: `/storeOrder/update-status/${storeId}/${userId}`, // Cập nhật URL API để truyền storeId và userId
        sendToken: true,
        body: {
          orderId: orderId, // Gửi orderId vào body của request
        },
      });

      // Hiển thị thông báo và cập nhật danh sách đơn hàng sau khi thành công
      alert(`Đơn hàng đã được cập nhật trạng thái: ${response.message}`);
      fetchOrders(); // Cập nhật lại danh sách đơn hàng
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

  // Hàm để mở modal nhập lý do hủy
  const openCancelModal = (order) => {
    setCurrentOrder(order);
    setModalVisible(true);
  };

  // Hàm để hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!cancelReason) {
      Alert.alert("Lý do hủy", "Vui lòng nhập lý do hủy đơn hàng.");
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.POST,
        url: `/OrderCancellation/cancel/${currentOrder.user.userId}/${currentOrder.orderId}`,
        sendToken: true,
        body: { reason: cancelReason },
      });

      if (response.message) {
        Alert.alert("Thành công", response.message);
        setModalVisible(false);
        fetchOrders();
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
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
          {/* Nút hủy */}
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
            <TouchableOpacity onPress={() => openCancelModal(order)} style={styles.button}>
              <Text style={styles.buttonText}>Hủy đơn hàng</Text>
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
        <TouchableOpacity
          onPress={() => {
            console.log("Navigating to InvoiceDetails with orderId:", order.orderId);
            navigation.navigate("InvoiceDetails", { orderId: order.orderId });
          }}
        >
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
        </TouchableOpacity>
      </Swipeable>
    ));
  };

  // Hàm render đơn hàng lịch sử (Cancelled)
  const renderHistoryOrders = () => {
    if (historyOrders.length === 0) {
      return (
        <View style={{ paddingHorizontal: width * 0.05 }}>
          <Text>Không có lịch sử.</Text>
        </View>
      );
    }

    return historyOrders.map((order, index) => (
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

          {/* Hiển thị trạng thái "Đã hủy" */}
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
            <View style={styles.completedButton}>
              <Text style={[styles.buttonText, { color: "#E53935" }]}>Đã hủy</Text>
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
        return <View style={{ paddingHorizontal: width * 0.05 }}>{renderHistoryOrders()}</View>;
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

      {/* Modal để nhập lý do hủy đơn hàng */}
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

      {/* Orders */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}>{renderOrders()}</ScrollView>
    </View>
  );
}
