import React, { useState, useContext, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image, Switch, Linking } from "react-native";
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
  const foodId = route.params?.foodId;

  const [loadingItems, setLoadingItems] = useState({}); // Loading cục bộ cho từng mục

  useEffect(() => {
    const handleDeepLink = (event) => {
      const { url } = event;
      console.log("Deep Link URL:", url);

      // Điều hướng dựa trên URL
      if (url.includes("payment-success")) {
        navigation.navigate("HomeKH"); // Điều hướng tới màn hình Shopping
      } else if (url.includes("payment-failed")) {
        navigation.navigate("PaymentFailed"); // Điều hướng tới màn hình thất bại
      }
    };

    // Lắng nghe URL deep link
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Kiểm tra nếu ứng dụng mở từ URL
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.paymentMethod) {
        setSelectedPaymentMethod(route.params.paymentMethod);
      }

      if (route.params?.storeId) {
        console.log("Received storeId from Select:", route.params.storeId);
      }

      if (userId && storeId) {
        fetchUserProfile();
        fetchStoreCartItems();
      } else {
        setError("Không tìm thấy người dùng hoặc cửa hàng.");
      }
    }, [userId, storeId, route.params?.paymentMethod])
  );

  const updateCartItemOnServer = async (userId, cartId, foodId, quantity, combos = []) => {
    if (!userId || !cartId || !foodId || quantity <= 0) {
      // console.error("Invalid parameters for updateCartItemOnServer:", { userId, cartId, foodId, quantity, combos });
      return;
    }

    setLoadingItems(true);
    try {
      console.log("Updating cart item on server:", { userId, cartId, foodId, quantity, combos });

      const response = await api({
        method: typeHTTP.PUT,
        url: `/cart/update-item/${userId}/${cartId}/${foodId}`,
        body: { quantity, combos },
        sendToken: true,
      });

      if (response?.cart) {
        console.log("Cập nhật món ăn thành công, đồng bộ lại dữ liệu giỏ hàng:", response.cart);
        setOrderItems(response.cart.items); // Cập nhật lại toàn bộ danh sách món từ server
        setTotalAmount(response.cart.totalPrice); // Cập nhật tổng tiền từ server
      } else {
        console.error("Không thể cập nhật món ăn:", response.error);
      }
    } catch (error) {
      // console.error("Lỗi khi cập nhật món ăn trên server:", error);
    } finally {
      setLoadingItems(false); // Tắt loading cho mục này
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
      case "PayOS":
        return "PayOS";
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

      console.log("Increasing quantity for:", { index, item });

      if (item.food && item.food._id) {
        // Tăng số lượng món chính
        item.quantity += 1;

        // Tính lại giá món chính (ưu tiên giá giảm nếu có)
        const foodPrice = item.food.discountedPrice ? item.food.discountedPrice : item.food.price;
        item.price = foodPrice * item.quantity;

        // Đồng bộ số lượng món trong combo (nếu có)
        if (item.combos && item.combos.foods.length > 0) {
          item.combos.foods = item.combos.foods.map((comboFood) => {
            // Cập nhật số lượng comboFood
            const updatedComboFood = {
              ...comboFood,
              quantity: item.quantity, // Đồng bộ số lượng combo với món chính
            };
            console.log(`Updated combo food quantity:`, updatedComboFood);
            return updatedComboFood;
          });

          // Cập nhật giá combo
          item.combos.totalPrice = item.combos.foods.reduce((total, comboFood) => total + comboFood.price * comboFood.quantity, 0);
        }

        // Cập nhật tổng giá trị (món chính + combo)
        item.totalPrice = item.price + (item.combos?.totalPrice || 0);

        // Gọi API để đồng bộ dữ liệu
        const cartId = globalData.cart?._id;
        updateCartItemOnServer(userId, cartId, item.food._id, item.quantity, item.combos?.foods || [])
          .then(() => fetchStoreCartItems()) // Đồng bộ lại toàn bộ giỏ hàng
          .catch((error) => console.error("Error syncing cart:", error));

        setTotalAmount(calculateTotal(updatedItems)); // Cập nhật tổng tiền
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

      console.log("Decreasing quantity for:", { index, item });

      if (item.food && item.food._id) {
        if (item.quantity === 1) {
          // Hiển thị thông báo nếu số lượng món giảm về 0
          Alert.alert(
            "Xác nhận",
            `Bạn có chắc muốn xóa món "${item.food.foodName}" khỏi giỏ hàng không?`,
            [
              {
                text: "Hủy",
                onPress: () => console.log("Hủy xóa món"),
                style: "cancel",
              },
              {
                text: "Đồng ý",
                onPress: () => {
                  const cartId = globalData.cart?._id;
                  removeItem(item.food._id); // Gọi hàm xóa món
                  updateCartItemOnServer(userId, cartId, item.food._id, 0); // Đồng bộ với server
                },
              },
            ],
            { cancelable: true }
          );
        } else {
          // Giảm số lượng món chính
          item.quantity -= 1;

          // Tính lại giá món chính (ưu tiên giá giảm nếu có)
          const foodPrice = item.food.discountedPrice ? item.food.discountedPrice : item.food.price;
          item.price = foodPrice * item.quantity;

          // Đồng bộ số lượng món trong combo (nếu có)
          if (item.combos && item.combos.foods.length > 0) {
            item.combos.foods = item.combos.foods.map((comboFood) => {
              // Cập nhật số lượng comboFood
              const updatedComboFood = {
                ...comboFood,
                quantity: item.quantity, // Đồng bộ số lượng combo với món chính
              };
              return updatedComboFood;
            });

            // Cập nhật giá combo
            item.combos.totalPrice = item.combos.foods.reduce((total, comboFood) => total + comboFood.price * comboFood.quantity, 0);
          }

          // Cập nhật tổng giá trị (món chính + combo)
          item.totalPrice = item.price + (item.combos?.totalPrice || 0);

          // Gọi API để đồng bộ dữ liệu
          const cartId = globalData.cart?._id;
          updateCartItemOnServer(userId, cartId, item.food._id, item.quantity, item.combos?.foods || [])
            .then(() => fetchStoreCartItems()) // Đồng bộ lại toàn bộ giỏ hàng
            .catch((error) => console.error("Error syncing cart:", error));

          setTotalAmount(calculateTotal(updatedItems)); // Cập nhật tổng tiền
        }
      } else {
        // console.error("Item does not have a valid food ID:", item);
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

  const handleCreatePaymentMethod = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán trước khi tiếp tục.");
      return;
    }

    if (!deliveryAddress) {
      Alert.alert("Thông báo", "Vui lòng nhập địa chỉ giao hàng trước khi tiếp tục.");
      return;
    }

    try {
      setIsLoading(true); // Hiển thị vòng tròn loading khi bắt đầu xử lý
      const cartId = globalData.cart?._id; // Lấy cartId từ global state

      if (!cartId) {
        Alert.alert("Lỗi", "Giỏ hàng không tồn tại.");
        return;
      }

      console.log("Tạo phương thức thanh toán:", selectedPaymentMethod);

      const response = await api({
        method: typeHTTP.POST,
        url: `/PaymentTransaction/create-payment/${cartId}/${storeId}`,
        body: {
          paymentMethod: selectedPaymentMethod, // Phương thức thanh toán
          useLoyaltyPoints, // Điểm tích lũy nếu có
        },
        sendToken: true,
      });

      if (response?.transaction) {
        if (selectedPaymentMethod === "Cash") {
          // Gọi hàm tạo đơn hàng nếu thanh toán bằng tiền mặt
          console.log("Tạo đơn hàng do phương thức là tiền mặt...");
          await handlePayment(); // Gọi hàm tạo đơn hàng
        } else if (selectedPaymentMethod === "PayOS" && response.paymentLink) {
          Linking.openURL(response.paymentLink).catch((err) => {
            console.error("Lỗi khi mở liên kết thanh toán:", err);
            Alert.alert("Lỗi", "Không thể mở liên kết thanh toán.");
          });
        } else {
          Alert.alert("Thành công", "Phương thức thanh toán đã được tạo.");
        }
      } else {
        Alert.alert("Lỗi", "Không thể tạo phương thức thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo phương thức thanh toán:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra trong quá trình tạo phương thức thanh toán.");
    } finally {
      setIsLoading(false); // Tắt loading sau khi xử lý xong
    }
  };

  const handlePayment = async () => {
    // if (!selectedPaymentMethod) {
    //   Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán trước khi tiếp tục.");
    //   return;
    // }

    // if (!deliveryAddress) {
    //   Alert.alert("Thông báo", "Vui lòng nhập địa chỉ giao hàng trước khi tiếp tục.");
    //   return;
    // }

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
          {/* Nút Go Back */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#E53935',
              paddingVertical: 15,
              paddingHorizontal: 40,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop:40
            }}
          >
            <Icon name="arrow-back" size={20} color="#fff" style={{ marginRight: 10 }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Quay Lại</Text>
          </TouchableOpacity>
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('StoreKH', { storeId })}
          >
            <Icon
              name="arrow-back" // Icon mũi tên quay lại
              size={24}
              color="black"
              style={{ marginRight: 10 }}
            />

          </TouchableOpacity>

          {/* Tiêu đề */}
          <Text style={styles.headerText}>Chi tiết HÓA ĐƠN</Text>
        </View>
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
              <View
                // onPress={() => navigation.navigate("Orderfood", {foodId,storeId})}

                style={{ flexDirection: "column", marginBottom: 10, padding: 10, backgroundColor: "#fff", borderRadius: 10, borderColor: "#eee", borderWidth: 1 }}
              >
                <View style={styles.orderItemContainer}>
                  <Text style={styles.orderItemText}>{item.food ? item.food.foodName : "Món ăn không tồn tại"}</Text>
                  {/* <Text style={styles.priceText}>{item.price.toLocaleString()} VND</Text> */}
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => decreaseQuantity(index)}>
                      <Icon name="remove-circle-outline" size={24} color="#E53935" />
                    </TouchableOpacity>
                    {loadingItems[index] ? <ActivityIndicator size="small" color="#E53935" style={{ marginHorizontal: 10 }} /> : <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>}
                    <TouchableOpacity onPress={() => increaseQuantity(index)}>
                      <Icon name="add-circle-outline" size={24} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* đơn hàng*/}
                {item.combos && item.combos.foods.length > 0 && (
                  <View style={{ paddingHorizontal: 10 }}>
                    {/* Section Title */}
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: "#E53935", marginBottom: 5 }}>Các món trong Combo</Text>
                    {console.log("Combo data:", item.combos)}

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
                          + {comboFood.price * comboFood.quantity.toLocaleString("vi-VN")} VND
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
                          fontSize: 14,
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        Giá
                      </Text>

                      {/* Total Price Calculation */}
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#E53935",
                        }}
                      >
                        {item.totalPrice.toLocaleString("vi-VN")} VND
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
            <Text style={styles.totalBreakdownText}>Tổng giá tiền</Text>
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
              if (!storeId) {
                Alert.alert("Lỗi", "Không tìm thấy ID cửa hàng. Vui lòng thử lại.");
                return;
              }
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
      <TouchableOpacity style={styles.footerButton} onPress={handleCreatePaymentMethod}>
        <Text style={styles.footerButtonText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
}
