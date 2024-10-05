import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Import API utilities
import { globalContext } from "../../context/globalContext";
import { Swipeable } from "react-native-gesture-handler"; // Import Swipeable component

const { width } = Dimensions.get("window");

export default function Shopping() {
  const navigation = useNavigation();
  const { globalData, globalHandler } = useContext(globalContext); // Sử dụng useContext để lấy globalData
  const userId = globalData?.user?.id; // Lấy userId từ globalData nếu có
  const cart = globalData.cart || []; // Lấy cart từ globalData

  const [orderItems, setOrderItems] = useState(cart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(""); // State để lưu địa chỉ giao hàng

  // Hàm lấy giỏ hàng từ API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await api({
        method: typeHTTP.GET,
        url: `/cart/get-cart/${userId}`,
        sendToken: true,
      });

      if (data.cart.items.length === 0) {
        setOrderItems([]); // Nếu giỏ hàng rỗng, cập nhật giỏ hàng thành mảng rỗng
      } else {
        setOrderItems(data.cart.items); // Cập nhật orderItems từ dữ liệu giỏ hàng trả về
      }

      setDeliveryAddress(data.cart.deliveryAddress); // Cập nhật địa chỉ giao hàng từ dữ liệu giỏ hàng
      setLoading(false);
    } catch (error) {
      setOrderItems([]); // Nếu có lỗi, đặt giỏ hàng rỗng và không cần log lỗi
      setLoading(false);
    }
  };

  // Gọi hàm lấy giỏ hàng khi component mount
  useEffect(() => {
    if (userId) {
      fetchCart();
    } else {
      setError("Không tìm thấy người dùng.");
    }
  }, [userId]);

  // Function to remove item from cart
  const removeItem = async (foodId) => {
    try {
      console.log("Removing foodId:", foodId); // Debug log để kiểm tra foodId có được truyền đúng không

      // Gọi API để xóa món ăn theo foodId
      await api({
        method: typeHTTP.DELETE,
        url: `/cart/remove/${userId}/${foodId}`, // Gửi foodId thay vì foodName
        sendToken: true,
      });

      // Xóa món ăn khỏi giỏ hàng trong state
      const updatedCart = orderItems.filter((item) => item.foodId !== foodId);

      // Cập nhật lại giỏ hàng trong globalData
      globalHandler.setCart(updatedCart);
      setOrderItems(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Lỗi khi xóa món ăn.");
    }
  };

  // Function to handle increasing the quantity
  const increaseQuantity = (index) => {
    setOrderItems((prevItems) => prevItems.map((item, i) => (i === index ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  // Function to handle decreasing the quantity
  const decreaseQuantity = (index) => {
    setOrderItems((prevItems) => prevItems.map((item, i) => (i === index && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)).filter((item) => item.quantity > 0));
  };

  // Tính tổng giá
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  // Swipeable render right actions (delete button)
  const renderRightActions = (foodId) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#E53935",
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        height: "100%",
        borderRadius: 10,
      }}
      onPress={() => removeItem(foodId)} // Đảm bảo foodId được truyền vào đây
    >
      <Icon name="delete" size={24} color="#fff" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  if (orderItems.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, color: "#333" }}>Không có thức ăn trong giỏ hàng</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          paddingVertical: 15,
          backgroundColor: "#fff",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          marginTop: 50,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>Chi tiết HÓA ĐƠN</Text>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        {/* Floating Address Section */}
        <View
          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
            marginBottom: 20,
            marginTop: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>Địa chỉ nhận món</Text>
            <TouchableOpacity onPress={() => navigation.navigate("EditAddress")}>
              <Icon name="edit" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
          {/* Hiển thị địa chỉ nhận món động */}
          <Text style={{ fontSize: 14, color: "#333" }}>{deliveryAddress || "Không có địa chỉ"}</Text>
        </View>

        {/* Order Details */}
        <View style={{ marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>Đơn hàng</Text>
            <TouchableOpacity onPress={() => navigation.navigate("StoreKH")}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginLeft: 5, fontSize: 16, color: "#E53935" }}>Thêm món</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Render each order item */}
          {orderItems.map((item, index) => {
            console.log("Current item:", item); // Ghi log để kiểm tra dữ liệu của từng item
            return (
              <Swipeable key={index} renderRightActions={() => renderRightActions(item.foodId)}>
                <TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      padding: 10,
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      borderColor: "#eee",
                      borderWidth: 1,
                    }}
                  >
                    <Text style={{ fontSize: 14, color: "#333" }}>{item.foodName || "Món ăn không tồn tại"}</Text>
                    <Text style={{ fontSize: 14, color: "#333" }}>{(item.price * item.quantity).toLocaleString()} VND</Text>

                    {/* Các nút tăng giảm số lượng */}
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <TouchableOpacity onPress={() => decreaseQuantity(index)}>
                        <Icon name="remove-circle-outline" size={24} color="#E53935" />
                      </TouchableOpacity>
                      <Text style={{ marginHorizontal: 10, fontSize: 14 }}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => increaseQuantity(index)}>
                        <Icon name="add-circle-outline" size={24} color="#E53935" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            );
          })}
        </View>

        {/* Payment Breakdown */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
            <Text style={{ fontSize: 14, color: "#666" }}>Thành tiền</Text>
            <Text style={{ fontSize: 14, color: "#333" }}>{calculateTotal().toLocaleString()} VND</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
            <Text style={{ fontSize: 14, color: "#666" }}>Phí vận chuyển</Text>
            <Text style={{ fontSize: 14, color: "#333" }}>0.000 VND</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ fontSize: 14, color: "#666" }}>Ưu đãi</Text>
            <Text style={{ fontSize: 14, color: "#333" }}>0.000 VND</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>Thành tiền</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#E53935" }}>{calculateTotal().toLocaleString()} VND</Text>
          </View>
        </View>

        {/* Payment Method Selection */}
        <TouchableOpacity onPress={() => navigation.navigate("Select")} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 16, color: "#666" }}>Phương thức thanh toán</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: "#E53935", marginRight: 10 }}>Chọn phương thức</Text>
            <Icon name="arrow-forward-ios" size={16} color="#E53935" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 35,
          left: 10,
          right: 0,
          backgroundColor: "#E53935",
          padding: 15,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          margin: 10,
          width: width * 0.9,
          alignSelf: "center",
        }}
        onPress={() => console.log("Thanh toán")}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
}
