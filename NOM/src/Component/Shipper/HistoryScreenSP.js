import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { globalContext } from "../../context/globalContext";
import { api, typeHTTP } from "../../utils/api";

// const orderHistory = [
//   {
//     id: "1",
//     name: "Nguyễn Thị Kiều Nghi",
//     time: "10:00, 06/09/2024",
//     address: "123 Nguyễn Trãi, TPHCM",
//     amount: "80.000.000 VNĐ",
//     restaurant: "Quán cơm tấm sườn",
//     dish: "Phở, bún,...",
//   },
//   {
//     id: "2",
//     name: "Nguyễn Thị Kiều Nghi",
//     time: "10:00, 06/09/2024",
//     address: "123 Nguyễn Trãi, TPHCM",
//     amount: "80.000.000 VNĐ",
//     restaurant: "Quán cơm tấm sườn",
//     dish: "Phở, bún,...",
//   },
//   {
//     id: "3",
//     name: "Nguyễn Thị Kiều Nghi",
//     time: "10:00, 06/09/2024",
//     address: "123 Nguyễn Trãi, TPHCM",
//     amount: "80.000.000 VNĐ",
//     restaurant: "Quán cơm tấm sườn",
//     dish: "Phở, bún,...",
//   },
//   {
//     id: "4",
//     name: "Nguyễn Thị Kiều Nghi",
//     time: "10:00, 06/09/2024",
//     address: "123 Nguyễn Trãi, TPHCM",
//     amount: "80.000.000 VNĐ",
//     restaurant: "Quán cơm tấm sườn",
//     dish: "Phở, bún,...",
//   },
// ];

export default function HistoryScreenSP() {
  const [shipperInfo, setShipperInfo] = useState(null); // Lưu thông tin shipper
  const [orderHistory, setOrderHistory] = useState([]); // Lưu lịch sử đơn hàng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const { globalData } = useContext(globalContext);

  useEffect(() => {
    const fetchShipperData = async () => {
      try {
        const userId = globalData.user?.id;

        // Lấy thông tin shipper
        const shipperResponse = await api({
          method: typeHTTP.GET,
          url: `/shipper/getshipper/${userId}`, // Gọi API getShipperInfo
          sendToken: true,
        });

        const shipperId = shipperResponse.data?._id; // Lấy shipperId từ kết quả API
        setShipperInfo(shipperResponse.data);

        if (!shipperId) {
          console.error("Không tìm thấy shipperId.");
          return;
        }

        // Lấy lịch sử đơn hàng đã giao
        const ordersResponse = await api({
          method: typeHTTP.GET,
          url: `/shipper/delivered-orders/${shipperId}`, // Gọi API getDeliveredOrdersByShipper với shipperId
          sendToken: true,
        });

        // Chuyển đổi dữ liệu API sang định dạng cần hiển thị
        const formattedOrders = ordersResponse.data.map((order) => ({
          id: order._id,
          name: order.cartSnapshot.receiverName, // Tên người nhận
          time: new Date(order.orderDate).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }), // Thời gian đặt hàng
          address: order.cartSnapshot.deliveryAddress, // Địa chỉ giao hàng
          amount: `${order.totalAmount.toLocaleString("vi-VN")} VNĐ`, // Tổng tiền
          restaurant: order.store.storeName, // Tên cửa hàng
          dish: order.cartSnapshot.items.map((item) => `${item.foodName} (${item.quantity})`).join(", "), // Món ăn
        }));

        setOrderHistory(formattedOrders);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchShipperData();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: "#f9f9f9",
        padding: 15,
        marginHorizontal: 16,
        marginTop: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "column" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>{item.name}</Text>
        <Text style={{ color: "red", fontWeight: "bold" }}>{item.restaurant}</Text>
        <Text style={{ fontSize: 14, color: "#333" }}>{item.dish}</Text>
      </View>
      <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
        <Text>{item.time}</Text>
        <Text>{item.address}</Text>
        <Text style={{ fontSize: 16, color: "#E53935", fontWeight: "bold" }}>{item.amount}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          width: "100%",
          height: "15%",
          backgroundColor: "#E53935",
          padding: 20,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Text style={{ fontSize: 22, color: "#fff", fontWeight: "bold", marginTop: 40 }}>Lịch sử đơn hàng</Text>
      </View>

      {/* Danh sách lịch sử đơn hàng */}
      <FlatList data={orderHistory} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 20 }} />
    </View>
  );
}
