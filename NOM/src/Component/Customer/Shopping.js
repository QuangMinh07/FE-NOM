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
  const storeId = route.params?.storeId;

  useFocusEffect(
    useCallback(() => {
      if (route.params?.paymentMethod) {
        setSelectedPaymentMethod(route.params.paymentMethod);
      }

      if (userId && storeId) {
        // Kiểm tra xem storeId có tồn tại
        fetchStoreCartItems();
      } else {
        setError("Không tìm thấy người dùng hoặc cửa hàng.");
      }
    }, [userId, storeId, route.params?.paymentMethod])
  );

  const fetchStoreCartItems = useCallback(async () => {
    console.log("Fetching cart for userId:", userId, "and storeId:", storeId);

    if (!storeId || storeId === "undefined") {
      console.error("Invalid storeId:", storeId);
      setError("Không tìm thấy cửa hàng hợp lệ.");
      return;
    }

    try {
      setLoading(true);
      const response = await api({
        method: typeHTTP.GET,
        url: `/cart/getcart/${userId}/${storeId}`, // Ensure storeId is valid
        sendToken: true,
      });

      console.log("API Response:", JSON.stringify(response, null, 2));

      const cartData = response.data ? response.data.cart : response.cart;

      if (cartData) {
        const storeItems = Array.isArray(cartData.items) ? cartData.items.filter((item) => item.store === storeId) : [];

        // Chắc chắn rằng `orderItems` chỉ được cập nhật với dữ liệu từ API
        setOrderItems(storeItems);
        setDeliveryAddress(cartData.deliveryAddress || "");
        setError(null);

        // Save the cartId to global context or state
        globalHandler.setCart({ ...cartData, _id: cartData.cartId }); // Ensure cartId is saved in globalData
      } else {
        setOrderItems([]); // If no cart, return an empty array
        setError("Không có món ăn nào trong giỏ hàng từ cửa hàng này.");
      }
    } catch (error) {
      setOrderItems([]); // Return an empty array on error to avoid issues with map
      setError("Lỗi khi lấy giỏ hàng từ cửa hàng.");
    } finally {
      setLoading(false);
    }
  }, [userId, storeId]);

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

  const removeItem = async (foodId) => {
    try {
      console.log("Attempting to remove item from cart. UserId:", userId, "FoodId:", foodId); // Log userId and foodId

      const response = await api({
        method: typeHTTP.DELETE,
        url: `/cart/remove/${userId}/${foodId}`,
        sendToken: true,
      });

      console.log("API Response:", response); // Log the response from the API

      const updatedCart = orderItems.filter((item) => item.food._id !== foodId);
      globalHandler.setCart(updatedCart);
      setOrderItems(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error); // Log the error details
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
    const total = orderItems.reduce((accumulator, item) => {
      return accumulator + item.price; // Không nhân với item.quantity vì item.price đã bao gồm giá trị này
    }, 0);
    console.log("Total calculated:", total); // Log để kiểm tra
    return total;
  };

  const handlePayment = async () => {
    try {
      const cartId = globalData.cart?._id; // Make sure you retrieve the cartId from global state

      if (!cartId) {
        Alert.alert("Lỗi", "Giỏ hàng không tồn tại.");
        return;
      }

      const response = await api({
        method: typeHTTP.POST,
        url: `/storeOrder/create/${cartId}`, // Pass the correct cartId
        sendToken: true,
      });

      if (response?.orderDetails) {
        const newOrder = response.orderDetails;
        await globalHandler.addOrder(newOrder);
        globalHandler.setCart([]); // Clear the cart after successful payment
        setOrderItems([]); // Clear local order items
        Alert.alert("Thành công", "Đơn hàng đã được tạo thành công.");
        navigation.navigate("OrderingProcess", { orderId: newOrder.orderId });
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
            <TouchableOpacity onPress={() => navigation.navigate("EditAddress", { storeId })}>
              <Icon name="edit" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 14, color: "#333" }}>{deliveryAddress || "Không có địa chỉ"}</Text>
        </View>

        {/* Order Details */}
        <View style={styles.orderDetailsSection}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Đơn hàng</Text>
            <TouchableOpacity onPress={() => navigation.navigate("StoreKH", { storeId })}>
              <View style={styles.addMore}>
                <Text style={styles.addMoreText}>Thêm món</Text>
              </View>
            </TouchableOpacity>
          </View>
          {orderItems.map((item, index) => (
            <Swipeable
              key={index}
              renderRightActions={() => (
                <TouchableOpacity style={styles.swipeableDeleteButton} onPress={() => removeItem(item.food._id)}>
                  <Icon name="delete" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            >
              <View style={styles.orderItemContainer}>
                <Text style={styles.orderItemText}>{item.food ? item.food.foodName : "Món ăn không tồn tại"}</Text>
                <Text style={styles.priceText}>{item.price.toLocaleString()} VND</Text>
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
              // Gọi API để lấy giỏ hàng theo userId và storeId
              const data = await api({
                method: typeHTTP.GET,
                url: `/cart/getcart/${userId}/${storeId}`, // Sử dụng API lấy giỏ hàng theo storeId
                sendToken: true,
              });

              // Kiểm tra dữ liệu trả về từ API
              if (data.cart && data.cart.cartId) {
                console.log("Navigating to Select screen with cartId:", data.cart.cartId, "and storeId:", storeId);
                // Điều hướng tới trang Select với cartId và storeId
                navigation.navigate("Select", { cartId: data.cart.cartId, storeId });
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
