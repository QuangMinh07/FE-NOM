import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";

export default function MessagesScreen() {
  const [selectedTab, setSelectedTab] = useState("Trò chuyện"); // Quản lý tab được chọn
  const [chatData, setChatData] = useState([]); // State để lưu dữ liệu trò chuyện từ API
  const navigation = useNavigation(); // Để điều hướng
  const { globalData } = useContext(globalContext);

  useEffect(() => {
    if (selectedTab === "Trò chuyện") {
      fetchChatRooms();
    }
  }, [selectedTab, chatData]); // thêm chatData vào dependencies

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

  const notificationData = [
    { id: "1", title: "Đánh giá trải nghiệm của bạn", description: "Cửa hàng Cơm Tấm", date: "01/11/2024" },
    { id: "2", title: "Cửa hàng", description: "Cửa hàng", date: "01/11/2024" },
  ];

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
        <Text style={{ fontSize: 12, color: "#999", position: "absolute", right: 10, top: 10 }}>{item.date}</Text>
      </TouchableOpacity>
    );
  };

  const renderNotificationItem = ({ item }) => (
    <View
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
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: "#777" }}>{item.description}</Text>
      </View>
      {/* Ngày ở góc trên phải */}
      <Text style={{ fontSize: 12, color: "#999", position: "absolute", right: 10, top: 10 }}>{item.date}</Text>
    </View>
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
          <FlatList data={chatData} renderItem={renderChatItem} keyExtractor={(item) => item.id} />
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
        <FlatList data={notificationData} renderItem={renderNotificationItem} keyExtractor={(item) => item.id} />
      )}
    </View>
  );
}
