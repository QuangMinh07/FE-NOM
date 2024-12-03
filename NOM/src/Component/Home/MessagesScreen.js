import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";

export default function MessagesScreen() {
  const [selectedTab, setSelectedTab] = useState("Trò chuyện"); // Quản lý tab được chọn
  const [chatData, setChatData] = useState([]); // State để lưu dữ liệu trò chuyện từ API
  const [ordersWithoutReview, setOrdersWithoutReview] = useState([]); // Đơn hàng chưa được đánh giá
  const navigation = useNavigation(); // Để điều hướng
  const { globalData } = useContext(globalContext);

  useEffect(() => {
    if (selectedTab === "Trò chuyện") {
      fetchChatRooms();
    } else if (selectedTab === "Thông báo") {
      fetchOrdersWithoutReview();
    }
  }, [selectedTab, chatData, ordersWithoutReview]); // thêm chatData vào dependencies

  const fetchOrdersWithoutReview = async () => {
    try {
      // Lấy tất cả các đơn hàng
      const response = await api({
        method: typeHTTP.GET,
        url: `/storeOrder/get-all-orders`,
        sendToken: true,
      });

      const orders = response.allOrdersDetails || [];

      const validOrders = orders.filter((order) => order.orderStatus !== "Cancelled");
      const ordersToCheck = [];

      // Kiểm tra từng đơn hàng
      for (const order of validOrders) {
        const reviewCheck = await api({
          method: typeHTTP.GET,
          url: `/orderReview/check/${order.orderId}`,
          sendToken: true,
        });

        // Nếu đơn hàng chưa được đánh giá, thêm vào danh sách
        if (!reviewCheck.exists) {
          ordersToCheck.push(order);
        }
      }

      setOrdersWithoutReview(ordersToCheck); // Lưu danh sách đơn hàng chưa có đánh giá
    } catch (error) {
      // console.error("Lỗi khi kiểm tra đánh giá đơn hàng:", error);
    }
  };

  const fetchChatRooms = async () => {
    try {
      const userId = globalData.user?.id;

      const response = await api({
        method: typeHTTP.GET,
        url: `/chat/chat-room/${userId}`,
        sendToken: true,
      });

      const formattedChatData = response.chatRooms.map((room) => {
        // Lấy tin nhắn gần nhất (có thời gian gần với hiện tại nhất)
        const recentMessage = room.messages.reduce((latest, current) => (new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current), room.messages[0]); // Khởi tạo với tin nhắn đầu tiên nếu có

        return {
          id: room.roomId,
          roomId: room.roomId,
          userId: room.userId,
          shipperId: room.shipperId,
          name: room.shipperFullName || `Phòng ${room.shipperId}`,
          message: recentMessage ? recentMessage.text : "Chưa có tin nhắn",
          date: recentMessage ? new Date(recentMessage.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          avatar: room.profilePictureURL || null,
        };
      });

      setChatData(formattedChatData);
    } catch (error) {
      // console.error("Lỗi khi lấy danh sách phòng chat:", error);
    }
  };

  const renderChatItem = ({ item }) => {
    const userRole = item.userId === globalData.user.id ? "customer" : "shipper";

    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#fff",
          padding: 15,
          marginVertical: 8,
          marginHorizontal: 10,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 5,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          console.log("Navigating to CustomerChat with:", {
            orderId: item.roomId,
            userId: item.userId,
            shipperId: item.shipperId,
            userRole,
          });
          navigation.navigate("CustomerChat", {
            orderId: item.roomId,
            userId: item.userId,
            shipperId: item.shipperId,
            userRole,
          });
        }}
      >
        {/* Khung tròn màu đỏ */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "#E53935",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          {item.avatar ? (
            <Image
              source={{ uri: item.avatar }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
              }}
            />
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
          <Text style={{ fontSize: 14, color: "#777" }}>{item.message}</Text>
        </View>
        {/* Ngày ở góc trên phải */}
        <Text style={{ fontSize: 12, color: "#999", position: "absolute", right: 10, top: 10 }}>
          {new Date(item.date).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() => {
        console.log("Navigating to RatingScreen with orderId:", item.orderId, "and userId:", item.user.userId);
        navigation.navigate("RatingScreen", { orderId: item.orderId, userId: item.user.userId });
      }}
    >
      {/* Khung tròn màu đỏ với chữ 'NOM' */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#E53935",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>NOM</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", width: 180 }}>{item.store.storeName}</Text>
        <Text style={{ fontSize: 14, color: "#777", width: 150 }}>
          {item.foods.map((food) => food.foodName).join(", ").length > 25
            ? item.foods
                .map((food) => food.foodName)
                .join(", ")
                .slice(0, 25) + "..."
            : item.foods.map((food) => food.foodName).join(", ")}
        </Text>
      </View>
      {/* Ngày ở góc trên phải */}
      <Text style={{ fontSize: 12, color: "#999", position: "absolute", right: 10, top: 10 }}>
        {new Date(item.orderDate).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Phần tiêu đề */}
      <View style={{ backgroundColor: "#E53935", padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 140 }}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Tin Nhắn</Text>
        {/* Thêm icon hoặc ảnh người dùng nếu cần */}
      </View>

      {/* Chọn tab */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 10 }}>
        <TouchableOpacity onPress={() => setSelectedTab("Trò chuyện")}>
          <Text style={{ fontSize: 16, color: selectedTab === "Trò chuyện" ? "#E53935" : "#000", fontWeight: selectedTab === "Trò chuyện" ? "bold" : "normal" }}>Trò chuyện</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab("Thông báo")}>
          <Text style={{ fontSize: 16, color: selectedTab === "Thông báo" ? "#E53935" : "#000", fontWeight: selectedTab === "Thông báo" ? "bold" : "normal" }}>Thông báo</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách trò chuyện hoặc thông báo */}
      {selectedTab === "Trò chuyện" ? (
        chatData.length > 0 ? (
          <FlatList data={chatData} renderItem={renderChatItem} keyExtractor={(item) => item.id || item.roomId} />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Image
              source={require("../../img/giohangtrong.png")}
              style={{
                width: 180,
                height: 180,
                resizeMode: "contain",
                marginBottom: 30,
              }}
            />
            <Text style={{ fontSize: 18, color: "#333", textAlign: "center", fontWeight: "bold" }}>Xem cuộc trò chuyện của bạn với nhân viên hỗ trợ tại đây!</Text>
            <Text style={{ fontSize: 18, color: "#333", textAlign: "center", marginTop: 20 }}>
              Bạn cũng có thể yêu cầu hỗ trợ thông qua <Text style={{ fontSize: 18, color: "#333", textAlign: "center", marginTop: 20, color: "#32CD32", fontWeight: "bold" }}>Trung tâm trợ giúp</Text>
            </Text>
          </View>
        )
      ) : (
        <FlatList data={ordersWithoutReview} renderItem={renderNotificationItem} keyExtractor={(item) => item.orderId} />
      )}
    </View>
  );
}
