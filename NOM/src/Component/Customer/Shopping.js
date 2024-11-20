import React, { useState, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image, Switch } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Import API utilities
import { globalContext } from "../../context/globalContext";
import { Swipeable } from "react-native-gesture-handler"; // Import Swipeable component
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

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
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho trạng thái tải
  const [error, setError] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [userProfile, setUserProfile] = useState(null); // State lưu thông tin người dùng
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false); // State quản lý trạng thái bật/tắt
  const [totalAmount, setTotalAmount] = useState(0);
  const storeId = route.params?.storeId;
  console.log("cart", cart);

  const updateCartItemOnServer = async (userId, cartId, foodId, quantity) => {
    if (!userId || !cartId || !foodId || quantity <= 0) {
      console.error("Invalid parameters for updateCartItemOnServer:", { userId, cartId, foodId, quantity });
      return;
    }

    try {
      console.log("Updating cart item on server:", { userId, cartId, foodId, quantity });

      const response = await api({
        method: typeHTTP.PUT,
        url: `/cart/update-item/${userId}/${cartId}/${foodId}`, // Thêm cartId vào URL
        body: { quantity },
        sendToken: true,
      });

      if (response.message) {
        console.log("Cập nhật món ăn thành công:", response.message);
      } else {
        console.error("Không thể cập nhật món ăn:", response.error);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật món ăn trên server:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setTotalAmount(calculateTotal()); // Gọi calculateTotal để tính lại
    }, [orderItems, useLoyaltyPoints, userProfile])
  );

  // Hàm lấy thông tin người dùng từ API `getProfile`
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/user/profile`, // Gọi API getProfile
        sendToken: true,
      });

      if (response.success) {
        setUserProfile(response.user); // Lưu thông tin người dùng vào state
        console.log("Thông tin người dùng:", response.user);
      } else {
        console.error("Không thể lấy thông tin người dùng.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.paymentMethod) {
        setSelectedPaymentMethod(route.params.paymentMethod);
      }

      if (userId && storeId) {
        // Kiểm tra xem storeId có tồn tại
        fetchUserProfile();
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
      const cartId = globalData.cart?._id; // Lấy cartId từ globalData
      if (!cartId) {
        console.error("Cart ID is undefined. Cannot proceed.");
        setError("Giỏ hàng không hợp lệ.");
        return;
      }

      if (!foodId) {
        console.error("Food ID is undefined. Cannot proceed.");
        setError("Món ăn không hợp lệ.");
        return;
      }

      console.log("Attempting to remove item from cart. UserId:", userId, "CartId:", cartId, "FoodId:", foodId);

      const response = await api({
        method: typeHTTP.DELETE,
        url: `/cart/remove/${userId}/${cartId}/${foodId}`,
        sendToken: true,
      });

      console.log("API Response:", response);

      if (response.cart === null) {
        // Giỏ hàng đã bị xóa do không còn món nào
        console.log("Cart has been deleted as it is now empty.");
        globalHandler.setCart(null); // Xóa giỏ hàng khỏi globalData
        setOrderItems([]); // Dọn danh sách món ăn trong giao diện
        return;
      }

      const updatedCart = response.cart;
      if (updatedCart) {
        // Đảm bảo phản hồi từ API chứa đầy đủ thông tin
        if (!updatedCart.items || updatedCart.items.some((item) => !item.food)) {
          console.error("API response is missing item or food data.");
          setError("Dữ liệu trả về không hợp lệ.");
          return;
        }

        globalHandler.setCart(updatedCart);
        setOrderItems(updatedCart.items);
        await fetchStoreCartItems(); // Gọi lại để cập nhật giỏ hàng từ server
        console.log("Order items after update:", updatedCart.items);
      } else {
        console.error("API response does not contain updated cart.");
        setError("Không thể cập nhật giỏ hàng sau khi xóa món ăn.");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Lỗi khi xóa món ăn.");
    }
  };

  const increaseQuantity = async (index) => {
    setOrderItems((prevItems) => {
      const updatedItems = [...prevItems];
      const item = updatedItems[index];

      console.log("Item being updated:", item); // Log dữ liệu của item

      if (item.food && item.food._id) {
        item.quantity += 1;
        item.price = item.food.price * item.quantity; // Tính lại giá

        // Gọi API cập nhật số lượng trên server
        const cartId = globalData.cart._id; // Lấy cartId từ globalData
        updateCartItemOnServer(userId, cartId, item.food._id, item.quantity); // Truyền đúng tham số

        setTotalAmount(calculateTotal(updatedItems)); // Tính lại tổng tiền
      } else {
        console.error("Item does not have a valid food ID:", item);
      }
      return updatedItems;
    });
  };

  const decreaseQuantity = async (index) => {
    setOrderItems((prevItems) => {
      const updatedItems = [...prevItems];
      const item = updatedItems[index];

      console.log("Item being updated:", item); // Log dữ liệu của item

      if (item.food && item.food._id && item.quantity > 1) {
        item.quantity -= 1;
        item.price = item.food.price * item.quantity; // Tính lại giá

        // Gọi API cập nhật số lượng trên server
        const cartId = globalData.cart._id; // Lấy cartId từ globalData
        updateCartItemOnServer(userId, cartId, item.food._id, item.quantity); // Truyền đúng tham số

        setTotalAmount(calculateTotal(updatedItems)); // Tính lại tổng tiền
      } else {
        console.error("Item does not have a valid food ID or quantity <= 1:", item);
      }
      return updatedItems;
    });
  };

  const calculateTotal = useCallback(() => {
    const total = Array.isArray(orderItems)
      ? orderItems.reduce((accumulator, item) => {
        const foodPrice = item.price; // Giá món chính
        const comboPrice = item.combos?.totalPrice || 0; // Giá của combos nếu có
        return accumulator + foodPrice + comboPrice; // Cộng giá món chính và combo
      }, 0)
      : 0;

    let discount = 0;
    if (useLoyaltyPoints && userProfile?.loyaltyPoints > 0) {
      discount = Math.min(userProfile.loyaltyPoints, total);
      console.log("Discount applied:", discount);
    }

    console.log("Total calculated:", total - discount);
    return total - discount;
  }, [orderItems, useLoyaltyPoints, userProfile]);

  const toggleUseLoyaltyPoints = () => {
    if (!useLoyaltyPoints && userProfile?.loyaltyPoints < 200) {
      Alert.alert("Thông báo", "Bạn không đủ điểm để sử dụng tích lũy.");
      return;
    }
    setUseLoyaltyPoints((prev) => !prev);
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true); // Hiển thị vòng tròn loading khi bắt đầu submit
      const cartId = globalData.cart?._id; // Make sure you retrieve the cartId from global state

      if (!cartId) {
        Alert.alert("Lỗi", "Giỏ hàng không tồn tại.");
        return;
      }
      console.log("Sending useLoyaltyPoints:", useLoyaltyPoints); // Log giá trị gửi đi

      const response = await api({
        method: typeHTTP.POST,
        url: `/storeOrder/create/${cartId}`, // Pass the correct cartId
        body: { useLoyaltyPoints }, // Gửi trạng thái sử dụng điểm tích lũy
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
    } finally {
      setIsLoading(false); // Tắt vòng tròn loading sau khi xử lý xong
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
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Image
            source={require("../../img/LOGOBLACK.png")}
            style={{
              width: 180,
              height: 180,
              resizeMode: "contain",
              marginBottom: 30,
            }}
          />

          <Image
            source={require("../../img/giohangtrong.png")}
            style={{
              width: 180,
              height: 180,
              resizeMode: "contain",
              marginBottom: 30,
            }}
          />

          <Text style={{ fontSize: 18, color: "#333" }}>Không có thức ăn trong giỏ hàng</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
              <View style={{ flexDirection: "column", marginBottom: 10, padding: 10, backgroundColor: "#fff", borderRadius: 10, borderColor: "#eee", borderWidth: 1 }}>
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

                {/* Display Combo Foods and Total Price */}
                {item.combos && item.combos.foods.length > 0 && (
                  <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                    {/* Section Title */}
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: "#E53935", marginBottom: 5 }}>
                      Các món trong Combo
                    </Text>

                    {/* Combo Foods List */}
                    {item.combos.foods.map((comboFood, comboIndex) => (
                      <View
                        key={comboIndex}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                          padding: 5,
                          borderBottomWidth: 1,
                          borderBottomColor: "#ddd",
                        }}
                      >
                        {/* Food Name */}
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#333",
                            width: "65%", // Restrict width for long names
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail" // Truncate text if too long
                        >
                          {comboFood.foodName || "Món không xác định"}
                        </Text>

                        {/* Price */}
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#555", // Light gray for price
                          }}
                        >
                          + {comboFood.price ? comboFood.price.toLocaleString("vi-VN") : "N/A"} VND
                        </Text>
                      </View>
                    ))}

                    {/* Total Price */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                        paddingVertical: 10,
                        borderTopWidth: 1,
                        borderTopColor: "#ddd",
                      }}
                    >
                      {/* Main Dish Name */}
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        Tổng cộng
                      </Text>

                      {/* Total Price Calculation */}
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#E53935",
                        }}
                      >
                        {(item.price + item.combos.foods.reduce((sum, food) => sum + (food.price || 0), 0)).toLocaleString("vi-VN")} VND
                      </Text>
                    </View>
                  </View>
                )}

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
            <Text style={styles.totalAmountText}>{totalAmount.toLocaleString()} VND</Text>
          </View>
          {userProfile && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.totalBreakdownText}>Tích điểm:</Text>
                <View style={{ paddingLeft: 5 }}>
                  <FontAwesome6 name="coins" size={15} color="#FFC529" />
                </View>
                <Text style={{ fontSize: 14, color: "#666", paddingLeft: 5 }}>{userProfile.loyaltyPoints || "Không có tích điểm"}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Switch trackColor={{ false: "#ccc", true: "#E53935" }} thumbColor={useLoyaltyPoints ? "#fff" : "#fff"} value={useLoyaltyPoints} onValueChange={toggleUseLoyaltyPoints} />
              </View>
            </View>
          )}
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
                navigation.navigate("Select", { cartId: data.cart.cartId, storeId, useLoyaltyPoints });
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
