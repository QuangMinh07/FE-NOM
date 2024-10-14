import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, Pressable, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { api, typeHTTP } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalContext } from "../../context/globalContext";

// Hàm để định dạng ngày giờ
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Sử dụng định dạng 24 giờ
  }).format(date);
};

// Hàm để hiện tối đa 2 món ăn và thêm dấu ba chấm nếu có nhiều hơn
const renderFoodNames = (foods) => {
  if (foods.length <= 2) {
    return foods.map(food => food.foodName).join(', ');
  }
  return `${foods[0].foodName}, ${foods[1].foodName}...`; // Hiển thị 2 tên món ăn và dấu 3 chấm
};

export default function HomeShiper() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedOrderId, setAcceptedOrderId] = useState(null);
  const [acceptedOrder, setAcceptedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Quản lý trạng thái của modal
  const navigation = useNavigation();
  const { globalData } = useContext(globalContext);

  // Gọi API để lấy tất cả đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api({
          method: typeHTTP.GET,
          url: '/storeOrder/get-all-orders',
          sendToken: true,
        });

        // Lọc những đơn hàng có trạng thái "Processing", "Shipped", "Completed", "Received"
        const filteredOrders = response.allOrdersDetails.filter(order =>
          ["Processing", "Shipped", "Completed", "Received"].includes(order.orderStatus)
        );

        setOrders(filteredOrders); // Lưu trữ các đơn hàng đã được lọc

        // Tìm đơn hàng nào có trạng thái "Shipped" để hiển thị đúng trạng thái "Đã chấp nhận"
        const shippedOrder = filteredOrders.find(order => order.orderStatus === "Shipped");
        if (shippedOrder) {
          setAcceptedOrderId(shippedOrder.orderId); // Đánh dấu đơn hàng đã được chấp nhận
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    if (acceptedOrderId === null) {
      try {
        // Lấy đơn hàng đang được chọn
        const order = orders.find(order => order.orderId === orderId);

        // Lấy storeId từ đơn hàng đã chọn
        const storeId = order.store?.storeId;

        const userId = globalData.user?.id; // Lấy userId từ globalData

        // Gọi API để cập nhật trạng thái đơn hàng thành "Shipped"
        const response = await api({
          method: typeHTTP.PUT,
          url: `/storeOrder/update-status/${storeId}/${userId}`,
          body: { orderId: orderId }, // Truyền orderId
          sendToken: true,
        });

        if (response.message) {
          // Cập nhật trạng thái đơn hàng thành "Shipped" trong danh sách orders
          const updatedOrders = orders.map((o) =>
            o.orderId === orderId ? { ...o, orderStatus: "Shipped" } : o
          );

          setOrders(updatedOrders); // Cập nhật danh sách đơn hàng
          setAcceptedOrderId(orderId); // Đánh dấu đơn hàng đã chấp nhận
          setAcceptedOrder(order); // Cập nhật đơn hàng đã chấp nhận
          navigation.navigate('DeliveryODDetails', { order });
        } else {
          Alert.alert("Lỗi", "Cập nhật trạng thái đơn hàng thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi chấp nhận đơn hàng:", error);
        Alert.alert("Lỗi", "Không thể chấp nhận đơn hàng. Vui lòng thử lại.");
      }
    }
  };

  const handleSelectedOrderPress = () => {
    if (acceptedOrder) {
      navigation.navigate('DeliveryODDetails', { order: acceptedOrder });
    }
  };

  const handleLogout = async () => {
    try {
      await api({
        method: typeHTTP.PUT,
        url: "/user/setOnlineStatus",
        body: { isOnline: false },
        sendToken: true,
      });

      await AsyncStorage.removeItem("auth_token");
      setModalVisible(false);
      Alert.alert("Đăng xuất thành công!");
      navigation.navigate("WelcomeScreen");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      Alert.alert("Lỗi", "Đăng xuất không thành công. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ backgroundColor: '#E53935', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 140 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)} // Mở modal khi nhấn vào avatar
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10
          }}
        >
          <Icon name="person" size={24} color="#E53935" />
        </TouchableOpacity>
        <View>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Nguyễn Thị Kiều Nghi</Text>
          <Text style={{ color: '#fff', fontSize: 16 }}>4.5 ⭐ (25)</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreenSP')}>
            <Icon name="notifications" size={24} color="#fff" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HistoryScreenSP')}>
            <Icon name="hourglass" size={24} color="#fff" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Đơn hàng mới</Text>

        <FlatList
          data={orders}
          keyExtractor={item => item.orderId}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => (acceptedOrderId === item.orderId ? handleSelectedOrderPress() : handleAcceptOrder(item.orderId))}
              disabled={acceptedOrderId !== null && acceptedOrderId !== item.orderId}
            >
              <View style={{ backgroundColor: '#f9f9f9', padding: 15, marginBottom: 10, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.user.fullName}</Text>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>{item.store.storeName}</Text>
                    <Text style={{ fontSize: 14, color: 'black', marginTop: 5 }}>{renderFoodNames(item.foods)}</Text>
                  </View>
                  <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Text>{formatDateTime(item.orderDate)}</Text>
                    <Text>{item.store.storeName}</Text>
                    <Text style={{ fontSize: 16, color: '#E53935', fontWeight: 'bold' }}>{item.totalAmount} VND</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => { navigation.navigate("DeliveryODDetails") }}
                  style={{
                    marginTop: 10,
                    backgroundColor: acceptedOrderId === item.orderId || item.orderStatus === 'Shipped' ? '#ccc' : '#E53935',
                    paddingVertical: 10,
                    borderRadius: 5
                  }}
                  disabled={acceptedOrderId !== null && acceptedOrderId !== item.orderId || item.orderStatus === 'Shipped'}
                >
                  <Text onPress={() => handleAcceptOrder(item.orderId)} style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                    {acceptedOrderId === item.orderId || item.orderStatus === 'Shipped' ? "Đã chấp nhận" : "Chấp nhận"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Modal Đăng xuất */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: "#E53935",
                paddingVertical: 15,
                paddingHorizontal: 40,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: 20
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Đăng xuất</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

