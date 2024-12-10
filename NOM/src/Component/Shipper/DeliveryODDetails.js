import { View, Text, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { api, typeHTTP } from "../../utils/api"; // Import hàm api của bạn
import { useRoute } from "@react-navigation/native"; // Để lấy orderId từ params
import { globalContext } from "../../context/globalContext";

const { width, height } = Dimensions.get("window");

export default function DeliveryODDetails({ navigation }) {
  const [orderDetails, setOrderDetails] = useState(null); // Dữ liệu đơn hàng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [isPickedUp, setIsPickedUp] = useState(false); // Trạng thái để theo dõi việc lấy món ăn
  const { globalData } = useContext(globalContext);
  const [storeDetails, setStoreDetails] = useState(null); // State để lưu thông tin cửa hàng
  const [reviewCount, setReviewCount] = useState(0); // State để lưu tổng số lượng đánh giá
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho trạng thái tải

  const userRole = globalData?.user?.roleId; // Lấy role từ dữ liệu global

  const route = useRoute(); // Sử dụng useRoute để lấy orderId từ params
  const { orderId } = route.params; // Lấy orderId từ params được truyền từ màn hình trước

  useEffect(() => {
    const fetchStoreReviews = async () => {
      try {
        if (orderDetails?.store?.storeId) {
          const response = await api({
            method: typeHTTP.GET,
            url: `/orderReview/store-reviews/${orderDetails.store.storeId}`, // Thay đổi endpoint API cho đúng
            sendToken: true,
          });
          setReviewCount(response.reviews?.length || 0); // Lưu tổng số lượng đánh giá
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      }
    };

    if (orderDetails) {
      fetchStoreReviews();
    }
  }, [orderDetails]);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        if (orderDetails?.store?.storeId) {
          const response = await api({
            method: typeHTTP.GET,
            url: `/store/get-store/${orderDetails.store.storeId}`, // Thay đổi URL theo API của bạn
            sendToken: true,
          });
          setStoreDetails(response.data); // Lưu thông tin cửa hàng vào state
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin cửa hàng:", error);
      }
    };

    if (orderDetails) {
      fetchStoreDetails();
    }
  }, [orderDetails]);

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

  const handleConfirmOrder = async (order) => {
    // Thay đổi từ _id sang storeId
    const storeId = orderDetails.store?.storeId; // Đảm bảo lấy đúng storeId từ orderDetails
    const userId = globalData.user?.id;

    // Log kiểm tra storeId và userId
    console.log("storeId:", storeId);
    console.log("userId:", userId);

    if (!storeId || !userId) {
      console.error("storeId hoặc userId không tồn tại.");
      return;
    }

    try {
      setIsLoading(true); // Hiển thị vòng tròn loading khi bắt đầu submit
      const response = await api({
        method: typeHTTP.PUT,
        url: `/storeOrder/update-status/${storeId}/${userId}`, // Sử dụng storeId từ orderDetails
        sendToken: true,
        body: {
          orderId: orderId, // Sử dụng orderId từ route.params
        },
      });

      alert(`Đơn hàng đã được cập nhật trạng thái: ${response.message}`);
      navigation.navigate("HomeShiper");
    } catch (error) {
      console.error("Lỗi xảy ra:", error);
    } finally {
      setIsLoading(false); // Tắt vòng tròn loading sau khi xử lý xong
    }
  };

  // Hàm xử lý nút "Đã lấy món ăn"
  const handlePickedUp = () => {
    handleConfirmOrder();
    setIsPickedUp(true);
    // Gọi API hoặc xử lý logic thêm tại đây nếu cần
  };

  // Hàm xử lý nút "Đã giao thành công"
  const handleDelivered = () => {
    handleConfirmOrder();
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
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Tối màu nền nhưng vẫn hiển thị loading
            zIndex: 999, // Đảm bảo loading hiển thị trên cùng
          }}
        >
          <ActivityIndicator size="large" color="#E53935" />
        </View>
      )}
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
          <Text style={{ fontSize: 14, color: "#E53935" }}>
            {" "}
            {storeDetails?.averageRating} ⭐ ({reviewCount}+)
          </Text>
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
          <Text style={{ fontSize: 14, color: "#E53935" }}>
            {storeDetails?.averageRating} ⭐ ({reviewCount}+)
          </Text>
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
      <ScrollView style={{ paddingHorizontal: 16 }}>
        {orderDetails && orderDetails.cartSnapshot && orderDetails.cartSnapshot.items ? (
          orderDetails.cartSnapshot.items.map((item, index) => (
            <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: width * 0.04, width: 230 }}>
                    {item.quantity}x {item.foodName}
                  </Text>
                  <Text style={{ fontSize: width * 0.04, paddingLeft: 30 }}>{item.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
                </View>

                {/* Hiển thị các món ăn trong combo */}
                {item.combos && item.combos.foods && item.combos.foods.length > 0 && (
                  <View style={{ marginLeft: width * 0.05, marginTop: height * 0.01 }}>
                    {item.combos.foods.map((comboFood, comboIndex) => (
                      <View key={comboIndex} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: height * 0.005 }}>
                        <Text style={{ fontSize: width * 0.035, color: "#666", width: 150 }}>{comboFood.foodName}</Text>
                        <Text style={{ fontSize: width * 0.035, color: "#666" }}>{comboFood.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text>Đang tải danh sách món ăn...</Text> // Display if data is still loading
        )}
      </ScrollView>

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
          // Điều hướng đến trang chat và truyền dữ liệu orderId, userId, shipperId
          const currentRole = userRole; // Hoặc có thể thay đổi nếu cần lấy từ đâu đó
          navigation.navigate("CustomerChat", {
            orderId: orderDetails.orderId, // Truyền orderId
            userId: orderDetails.user.userId, // Truyền userId của khách hàng
            shipperId: orderDetails.shipper.shipperId, // Truyền shipperId
            userRole: currentRole, // Truyền role hiện tại
          });
          console.log(orderDetails.orderId); // Đúng biến orderDetails để lấy orderId
          console.log(orderDetails.shipper.shipperId); // Lấy shipperId từ orderDetails
          console.log(orderDetails.user.userId); // Lấy userId từ orderDetails
          console.log("UserRole:", currentRole); // Log role đã truyền
        }}
      >
        <Icon name="chatbubble-ellipses-outline" size={20} color="#E53935" style={{ marginRight: 8 }} />
        <Text style={{ color: "#E53935", fontSize: 16 }}>Liên hệ với Khách hàng</Text>
      </TouchableOpacity>

      {/* Nút hành động */}
      {orderDetails.orderStatus === "Completed" && !isPickedUp ? (
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
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Đã lấy món ăn
          </Text>
        </TouchableOpacity>
      ) : orderDetails.orderStatus === "Received" ? (
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
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Đã giao thành công
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}
