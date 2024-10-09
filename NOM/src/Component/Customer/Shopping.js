import React, { useState, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Import API utilities
import { globalContext } from "../../context/globalContext";
import { Swipeable } from "react-native-gesture-handler"; // Import Swipeable component

// Import styles
import { styles } from "./StyleShopping";

export default function Shopping({ route }) {
  const navigation = useNavigation();
  const { globalData, globalHandler } = useContext(globalContext);
  const userId = globalData?.user?.id;
  const cart = globalData.cart || [];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [orderItems, setOrderItems] = useState(cart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const getDisplayPaymentMethod = (method) => {
    switch (method) {
      case "Cash":
        return "Tiền mặt";
      case "BankCard":
        return "Thẻ ngân hàng";
      case "Momo":
        return "Momo";
      case "VNPay":
        return "VNPay";
      default:
        return "Chọn phương thức";
    }
  };

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api({
        method: typeHTTP.GET,
        url: `/cart/get-cart/${userId}`,
        sendToken: true,
      });

      if (data.cart) {
        globalHandler.setCart(data.cart);
        setOrderItems(data.cart.items || []);
        setDeliveryAddress(data.cart.deliveryAddress);
      } else {
        setOrderItems([]);
      }
      setLoading(false);
    } catch (error) {
      setOrderItems([]);
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.paymentMethod) {
        setSelectedPaymentMethod(route.params.paymentMethod);
      }

      if (userId) {
        fetchCart();
      } else {
        setError("Không tìm thấy người dùng.");
      }
    }, [userId, fetchCart, route.params?.paymentMethod])
  );

  const removeItem = async (foodId) => {
    try {
      await api({
        method: typeHTTP.DELETE,
        url: `/cart/remove/${userId}/${foodId}`,
        sendToken: true,
      });

      const updatedCart = orderItems.filter((item) => item.foodId !== foodId);
      globalHandler.setCart(updatedCart);
      setOrderItems(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Lỗi khi xóa món ăn.");
    }
  };

  const increaseQuantity = (index) => {
    setOrderItems((prevItems) => prevItems.map((item, i) => (i === index ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decreaseQuantity = (index) => {
    setOrderItems((prevItems) => prevItems.map((item, i) => (i === index && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  };

  const handlePayment = async () => {
    try {
      const cartId = globalData.cart?._id; // Lấy cartId từ giỏ hàng hiện tại

      if (!cartId) {
        Alert.alert("Lỗi", "Giỏ hàng không tồn tại.");
        return;
      }

      // Gọi API để tạo đơn hàng từ giỏ hàng hiện tại
      const response = await api({
        method: typeHTTP.POST,
        url: `/storeOrder/create/${cartId}`,
        sendToken: true,
      });

      if (response?.orderDetails) {
        // Lưu đơn hàng vào globalData
        const newOrder = response.orderDetails; // Giả sử `orderDetails` chứa thông tin đơn hàng mới
        console.log("New order details:", newOrder); // Log chi tiết đơn hàng mới

        await globalHandler.addOrder(newOrder); // Lưu đơn hàng vào globalData
        console.log("Updated globalData orders:", globalData.orders); // Log lại `globalData.orders` sau khi thêm

        // Xóa giỏ hàng chỉ trên frontend
        globalHandler.setCart([]); // Làm trống giỏ hàng trên frontend
        setOrderItems([]); // Cập nhật danh sách món ăn trống

        Alert.alert("Thành công", "Đơn hàng đã được tạo thành công.");

        // Điều hướng người dùng về trang chính hoặc lịch sử đơn hàng
        navigation.navigate("HomeKH");
      } else {
        Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra trong quá trình thanh toán.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  if (orderItems.length === 0) {
    return (
      <View style={styles.containergiohang}>
        <Text style={{ fontSize: 18, color: "#333" }}>Không có thức ăn trong giỏ hàng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Chi tiết HÓA ĐƠN</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressText}>Địa chỉ nhận món</Text>
            <TouchableOpacity onPress={() => navigation.navigate("EditAddress")}>
              <Icon name="edit" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 14, color: "#333" }}>{deliveryAddress || "Không có địa chỉ"}</Text>
        </View>

        {/* Order Details */}
        <View style={styles.orderDetailsSection}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Đơn hàng</Text>
            <TouchableOpacity onPress={() => navigation.navigate("StoreKH")}>
              <View style={styles.addMore}>
                <Text style={styles.addMoreText}>Thêm món</Text>
              </View>
            </TouchableOpacity>
          </View>
          {orderItems.map((item, index) => (
            <Swipeable
              key={index}
              renderRightActions={() => (
                <TouchableOpacity style={styles.swipeableDeleteButton} onPress={() => removeItem(item.foodId)}>
                  <Icon name="delete" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            >
              <View style={styles.orderItemContainer}>
                <Text style={styles.orderItemText}>{item.foodName || "Món ăn không tồn tại"}</Text>
                <Text style={styles.priceText}>{(item.price * item.quantity).toLocaleString()} VND</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => decreaseQuantity(index)}>
                    <Icon name="remove-circle-outline" size={24} color="#E53935" />
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(index)}>
                    <Icon name="add-circle-outline" size={24} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>
            </Swipeable>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalBreakdown}>
            <Text style={styles.totalBreakdownText}>Thành tiền</Text>
            <Text style={styles.totalBreakdownText}>{calculateTotal().toLocaleString()} VND</Text>
          </View>

          <View style={styles.totalBreakdown}>
            <Text style={styles.totalBreakdownText}>Phí vận chuyển</Text>
            <Text style={styles.totalBreakdownText}>0.000 VND</Text>
          </View>

          <View style={styles.totalBreakdown}>
            <Text style={styles.totalBreakdownText}>Ưu đãi</Text>
            <Text style={styles.totalBreakdownText}>0.000 VND</Text>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalAmountText}>Thành tiền</Text>
            <Text style={styles.totalAmountText}>{calculateTotal().toLocaleString()} VND</Text>
          </View>
        </View>

        {/* Payment Method Selection */}
        <TouchableOpacity
          style={styles.paymentSection}
          onPress={async () => {
            try {
              const data = await api({
                method: typeHTTP.GET,
                url: `/cart/get-cart/${userId}`,
                sendToken: true,
              });
              if (data.cart && data.cart._id) {
                navigation.navigate("Select", { cartId: data.cart._id });
              } else {
                Alert.alert("Lỗi", "Giỏ hàng không tồn tại.");
              }
            } catch (error) {
              Alert.alert("Lỗi", "Không thể lấy giỏ hàng.");
            }
          }}
        >
          <Text style={{ fontSize: 16, color: "#666" }}>Phương thức thanh toán</Text>
          <View style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>{getDisplayPaymentMethod(selectedPaymentMethod)}</Text>
            <Icon name="arrow-forward-ios" size={16} color="#E53935" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Button */}
      <TouchableOpacity style={styles.footerButton} onPress={handlePayment}>
        <Text style={styles.footerButtonText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
}
