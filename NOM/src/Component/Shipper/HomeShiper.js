import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, Pressable, Alert, Image } from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalContext } from "../../context/globalContext";

// Hàm để định dạng ngày giờ
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Sử dụng định dạng 24 giờ
  }).format(date);
};

// Hàm để hiện tối đa 2 món ăn và thêm dấu ba chấm nếu có nhiều hơn
const renderFoodNames = (foods) => {
  if (foods.length <= 2) {
    return foods.map((food) => food.foodName).join(", ");
  }
  return `${foods[0].foodName}, ${foods[1].foodName}...`; // Hiển thị 2 tên món ăn và dấu 3 chấm
};

export default function HomeShiper() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedOrderId, setAcceptedOrderId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Quản lý trạng thái của modal
  const navigation = useNavigation();
  const { globalData } = useContext(globalContext);
  const [showAddress, setShowAddress] = useState(false);
  const [shipperInfo, setShipperInfo] = useState(null); // State to store shipperInfo data
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log("Orders fetched:", orders);
    console.log("Accepted Order ID:", acceptedOrderId);
  }, [orders, acceptedOrderId]);
  // Gọi API để lấy thông tin của shipper

  const fetchShipperInfo = useCallback(async () => {
    try {
      // Gọi API lấy thông tin user
      const profileResponse = await api({
        method: typeHTTP.GET,
        url: "/user/profile", // API lấy thông tin của người dùng
        sendToken: true,
      });

      // Lưu thông tin user và shipper
      setShipperInfo(profileResponse.shipperInfo);
      setUserData(profileResponse.user);

      // Gọi API lấy thông tin cá nhân (bao gồm cả ảnh)
      const personalInfoResponse = await api({
        method: typeHTTP.GET,
        url: "/userPersonal/personal-info", // API lấy thông tin cá nhân
        sendToken: true,
      });

      // Kết hợp dữ liệu cá nhân vào userData
      if (personalInfoResponse.success) {
        setUserData((prevData) => ({
          ...prevData,
          profilePictureURL: personalInfoResponse.userPersonalInfo.profilePictureURL || prevData.profilePictureURL,
        }));
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu shipper hoặc thông tin cá nhân:", error);
    }
  }, []);

  // Gọi API để lấy tất cả đơn hàng
  const fetchOrders = useCallback(async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: "/storeOrder/get-all-orders",
        sendToken: true,
      });
      const filteredOrders = response.allOrdersDetails.filter((order) => ["Processing", "Shipped", "Completed", "Received"].includes(order.orderStatus));

      setOrders(filteredOrders);

      // Khôi phục trạng thái `acceptedOrderId` từ AsyncStorage
      const savedOrderId = await AsyncStorage.getItem("acceptedOrderId");
      if (savedOrderId) {
        console.log("Saved Order ID:", savedOrderId); // Log để kiểm tra
        setAcceptedOrderId(savedOrderId);
      }
    } catch (error) {
      // console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sử dụng useFocusEffect để fetchOrders mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchOrders();
      fetchShipperInfo(); // Gọi API lấy thông tin shipper khi màn hình được focus
    }, [fetchOrders, fetchShipperInfo])
  );

  const handleAcceptOrder = async (orderId) => {
    if (acceptedOrderId === null) {
      try {
        const order = orders.find((order) => order.orderId === orderId);
        const storeId = order.store?.storeId;
        const userId = globalData.user?.id;

        const response = await api({
          method: typeHTTP.PUT,
          url: `/storeOrder/update-status/${storeId}/${userId}`,
          body: { orderId: orderId },
          sendToken: true,
        });

        if (response.message) {
          const updatedOrders = orders.map((o) => (o.orderId === orderId ? { ...o, orderStatus: "Shipped" } : o));

          setOrders(updatedOrders);
          setAcceptedOrderId(orderId);
          await AsyncStorage.setItem("acceptedOrderId", orderId); // Lưu trạng thái vào AsyncStorage
          navigation.navigate("DeliveryODDetails", { orderId });
        } else {
          Alert.alert("Lỗi", "Cập nhật trạng thái đơn hàng thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi chấp nhận đơn hàng:", error);
        Alert.alert("Lỗi", "Không thể chấp nhận đơn hàng. Vui lòng thử lại.");
      }
    }
  };

  const handleSelectedOrderPress = (item) => {
    console.log("Navigating to DeliveryODDetails with orderId:", item.orderId); // Log để kiểm tra điều hướng
    navigation.navigate("DeliveryODDetails", { orderId: item.orderId });
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ backgroundColor: "#E53935", padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 140 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 10,
            marginTop: 40,
            overflow: "hidden",
          }}
        >
          {userData?.profilePictureURL ? (
            <Image
              source={{ uri: userData.profilePictureURL }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
          ) : (
            <Icon name="person" size={24} color="#E53935" />
          )}
        </TouchableOpacity>

        <View style={{ padding: 10, marginRight: 50 }}>
          {/* Hiển thị tên và nút mũi tên */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>{userData?.fullName || "Chưa có thông tin"}</Text>
            <TouchableOpacity onPress={() => setShowAddress(!showAddress)}>
              <Icon name={showAddress ? "chevron-up-outline" : "chevron-down-outline"} size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Địa chỉ và đánh giá */}
          {showAddress && (
            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="location-outline" size={20} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 16, marginLeft: 5 }}>{shipperInfo?.temporaryAddress || "Chưa có thông tin "}</Text>
              </View>
              <Text style={{ color: "#fff", fontSize: 16, marginTop: 5 }}>4.5 ⭐ (25)</Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("NotificationsScreenSP")}>
            <Icon name="notifications" size={24} color="#fff" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("HistoryScreenSP")}>
            <Icon name="hourglass" size={24} color="#fff" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Đơn hàng mới</Text>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => (acceptedOrderId === item.orderId || item.orderStatus === "Shipped" ? handleSelectedOrderPress(item) : handleAcceptOrder(item.orderId))} disabled={acceptedOrderId !== null && acceptedOrderId !== item.orderId}>
              <View style={{ backgroundColor: "#f9f9f9", padding: 15, marginBottom: 10, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.user.fullName}</Text>
                    <Text style={{ color: "red", fontWeight: "bold" }}>{item.store.storeName}</Text>
                    <Text style={{ fontSize: 14, color: "black", marginTop: 5 }}>{renderFoodNames(item.foods)}</Text>
                  </View>
                  <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                    <Text>{formatDateTime(item.orderDate)}</Text>
                    <Text>{item.store.storeName}</Text>
                    <Text style={{ fontSize: 16, color: "#E53935", fontWeight: "bold" }}>{item.totalAmount} VND</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Button pressed!"); // Log để kiểm tra nút được nhấn
                    if (acceptedOrderId === item.orderId || item.orderStatus === "Shipped") {
                      handleSelectedOrderPress(item);
                    } else {
                      handleAcceptOrder(item.orderId);
                    }
                  }}
                  style={{
                    marginTop: 10,
                    backgroundColor: acceptedOrderId === item.orderId || item.orderStatus === "Shipped" ? "#ccc" : "#E53935",
                    paddingVertical: 10,
                    borderRadius: 5,
                  }}
                  disabled={(acceptedOrderId !== null && acceptedOrderId !== item.orderId) || item.orderStatus === "Shipped"}
                >
                  <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>{acceptedOrderId === item.orderId || item.orderStatus === "Shipped" ? "Đã chấp nhận" : "Chấp nhận"}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Modal Đăng xuất */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0)" }} onPress={() => setModalVisible(false)}>
          <Pressable
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Xem thông tin button */}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("ProfileShipper");
              }}
              style={{
                backgroundColor: "#ffa500",
                paddingVertical: 15,
                paddingHorizontal: 40,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: 20, // Provides space between buttons
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Xem thông tin</Text>
            </TouchableOpacity>

            {/* Đăng xuất button */}
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: "#E53935",
                paddingVertical: 15,
                paddingHorizontal: 40,
                borderRadius: 10,
                alignItems: "center",
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
