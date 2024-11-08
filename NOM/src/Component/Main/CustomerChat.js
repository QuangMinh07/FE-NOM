import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Icon library
import { useRoute } from "@react-navigation/native"; // Để lấy tham số route
import { api, typeHTTP, baseURLOrigin } from "../../utils/api"; // Import API từ file bạn đã định nghĩa
import styles from "./CustomerChatStyles"; // Import styles từ file tách riêng
import { io } from "socket.io-client";

export default function CustomerChat() {
  const socket = io.connect(baseURLOrigin);
  const [message, setMessage] = useState(""); // State để quản lý tin nhắn nhập vào
  const [messages, setMessages] = useState([]); // State để quản lý danh sách tin nhắn
  const [roomId, setRoomId] = useState(null); // State để lưu roomId
  const [keyboardHeight, setKeyboardHeight] = useState(0); // State để lưu chiều cao bàn phím
  const route = useRoute();
  const { orderId, userId, shipperId, userRole } = route.params; // Nhận tham số từ route
  const flatListRef = useRef(); // Tạo ref cho FlatList
  const [displayName, setDisplayName] = useState(""); // State để lưu tên hiển thị

  // Lắng nghe sự kiện mở/đóng bàn phím
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height); // Lưu chiều cao bàn phím khi mở
      scrollToEnd(); // Tự động cuộn xuống khi mở bàn phím
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0); // Đặt chiều cao bàn phím về 0 khi đóng
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Hàm để cuộn xuống cuối danh sách tin nhắn
  const scrollToEnd = () => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 200); // Delay để đảm bảo danh sách đã được render hoàn toàn
    }
  };

  // Tự động cuộn xuống cuối danh sách khi có tin nhắn mới hoặc khi tin nhắn được tải
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      scrollToEnd();
    }
  }, [messages]);

  useEffect(() => {
    const getProfileName = async () => {
      try {
        console.log("UserRole:", userRole);
        console.log("UserId:", userId, "ShipperId:", shipperId);
  
        // Xác định ID cần lấy dựa trên vai trò
        const idToFetch = userRole === "shipper" ? userId : shipperId;
        console.log("Fetching profile for ID:", idToFetch);
  
        console.log("Calling API...");
        const response = await api({
          method: typeHTTP.GET,
          url: `/user/profile/${idToFetch}`, // Truyền ID cụ thể vào endpoint
          sendToken: true,
        });
        console.log("API called successfully");
  
        console.log("API Response:", response);
  
        if (response && response.user) {
          const name = response.user.fullName;
          setDisplayName(name); // Gán fullName vào displayName
          console.log(`Fetched name for ${userRole === "shipper" ? "customer" : "shipper"}:`, name);
        } else {
          console.error("User not found or API response is incorrect:", response);
        }
      } catch (error) {
        console.error("Error during API call:", error);
      }
    };
  
    getProfileName();
  }, [userRole, userId, shipperId]);
  
  
  
  useEffect(() => {
    // Gọi API để tạo phòng chat trước khi tham gia phòng
    const createChatRoom = async () => {
      try {
        const response = await api({
          method: typeHTTP.POST,
          url: `/chat/create-room/${orderId}`, // Gọi API tạo phòng chat
        });

        const createdRoomId = response?.roomId;
        if (createdRoomId) {
          setRoomId(createdRoomId); // Lưu roomId sau khi tạo phòng thành công

          // Gọi API để lấy tin nhắn hiện có trong phòng chat
          const messagesResponse = await api({
            method: typeHTTP.GET,
            url: `/chat/get-message/${createdRoomId}`,
          });

          if (messagesResponse?.messages) {
            setMessages(messagesResponse.messages); // Cập nhật danh sách tin nhắn
            scrollToEnd(); // Cuộn xuống cuối ngay khi tin nhắn được tải
          } else {
            console.error("Không tìm thấy tin nhắn trong phản hồi API:", messagesResponse);
          }
        } else {
          console.error("Room ID không tồn tại trong phản hồi API:", response);
        }
      } catch (error) {
        console.error("Lỗi khi tạo phòng chat hoặc lấy tin nhắn:", error);
      }
    };

    createChatRoom();
  }, [orderId]);

  // Kết nối với phòng chat qua socket
  useEffect(() => {
    if (roomId) {
      socket.emit("joinRoom", { roomId }); // Tham gia phòng chat khi đã có roomId
    }

    // Lắng nghe sự kiện tin nhắn mới từ server
    socket.on("message", (newMessage) => {
      console.log("Tin nhắn mới từ socket:", newMessage); // Kiểm tra xem có nhận được tin nhắn không
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Cập nhật danh sách tin nhắn khi nhận được tin nhắn mới
      scrollToEnd(); // Cuộn xuống cuối khi có tin nhắn mới
    });

    return () => {
      socket.off("message"); // Hủy lắng nghe sự kiện khi component bị hủy
    };
  }, [roomId]);

  const handleSend = async () => {
    if (message.trim().length > 0) {
      let newMessage;
      if (userRole === "customer") {
        newMessage = {
          roomId: orderId,
          senderId: userId,
          receiverId: shipperId,
          text: message,
        };
      } else if (userRole === "shipper") {
        newMessage = {
          roomId: orderId,
          senderId: shipperId,
          receiverId: userId,
          text: message,
        };
      }

      try {
        const response = await api({
          method: typeHTTP.POST,
          url: `/chat/send-message`,
          body: newMessage,
        });
        console.log("Tin nhắn đã được gửi:", response.newMessage);

        // Gửi tin nhắn qua socket cho các thành viên khác trong phòng
        socket.emit("sendMessage", newMessage);

        // Xóa nội dung trong ô nhập sau khi gửi
        setMessage("");

        // Đóng bàn phím sau khi gửi tin nhắn
        Keyboard.dismiss();
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      }
    }
  };

  // Hàm render mỗi tin nhắn
  const renderMessageItem = ({ item }) => {
    let isCurrentUser = false;

    // Nếu vai trò của người dùng hiện tại là customer
    if (userRole === "customer") {
      // Nếu người gửi tin nhắn là khách hàng (userId), thì hiển thị bên phải
      isCurrentUser = item.senderId === userId;
    }
    // Nếu vai trò của người dùng hiện tại là shipper
    else if (userRole === "shipper") {
      // Nếu người gửi tin nhắn là shipper (shipperId), thì hiển thị bên phải
      isCurrentUser = item.senderId === shipperId;
    }

    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.messageRight : styles.messageLeft]}>
        <View style={[styles.messageBubble, isCurrentUser ? styles.bubbleRight : styles.bubbleLeft]}>
          <Text style={isCurrentUser ? styles.messageTextRight : styles.messageTextLeft}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={[styles.container, { paddingBottom: keyboardHeight }]} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 1 : 1}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                /* Handle back action */
              }}
            >
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Image source={{ uri: "https://example.com/jhon-abraham.jpg" }} style={styles.headerImage} />
            <View style={styles.headerTitle}>
              <Text style={styles.headerName}>{displayName}</Text>
              {/* <Text style={styles.headerStatus}>Active now</Text> */}
            </View>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="call" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="videocam" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Hiển thị danh sách tin nhắn */}
          <FlatList ref={flatListRef} data={messages} renderItem={renderMessageItem} keyExtractor={(item, index) => index.toString()} contentContainerStyle={styles.messagesContainer} onContentSizeChange={scrollToEnd} />

          {/* Thanh nhập tin nhắn */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Icon name="attach" size={24} color="#000" />
            </TouchableOpacity>
            <TextInput style={styles.textInput} placeholder="Nhập tin nhắn..." value={message} onChangeText={setMessage} multiline />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Icon name="send" size={24} color="#E53935" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
