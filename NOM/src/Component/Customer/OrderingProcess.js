import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, Modal, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native"; // Import useNavigation
import { api, typeHTTP } from "../../utils/api"; // Import API
import { globalContext } from "../../context/globalContext";

const { width, height } = Dimensions.get("window");

const OrderingProcess = () => {
  const [activeStep, setActiveStep] = useState(0); // Manage the active step
  const [modalVisible, setModalVisible] = useState(false); // Modal state
  const [cancelModalVisible, setCancelModalVisible] = useState(false); // Cancel modal state
  const [selectedReason, setSelectedReason] = useState(null); // Selected cancellation reason
  const navigation = useNavigation();
  const route = useRoute(); // Retrieve orderId from params
  const [orderDetails, setOrderDetails] = useState(null); // Order details data
  const { globalData } = useContext(globalContext);

  const userRole = globalData?.user?.roleId; // Lấy role từ dữ liệu global

  const { orderId } = route.params; // Extract orderId from route params
  const [foodModalVisible, setFoodModalVisible] = useState(false); // Modal for food list

  const steps = [
    { label: "Đang chờ duyệt", visible: true },
    { label: "Đã nhận đơn hàng", visible: false },
    { label: "Đang hoàn thành đơn hàng", visible: false },
    { label: "Đang giao tới bạn", visible: false },
    { label: "Giao hàng thành công", visible: false },
  ];

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    }).format(date);
  };

  // API call to get order details
  const fetchOrderDetails = async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/storeOrder/details/${orderId}`,
        sendToken: true, // If token is needed in the header
      });
      setOrderDetails(response.orderDetails); // Save order details in state
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails(); // Call fetchOrderDetails when screen opens
  }, []);

  const handleCancelOrder = async () => {
    if (!selectedReason) {
      Alert.alert("Lý do hủy", "Vui lòng chọn lý do hủy đơn hàng.");
      return;
    }

    try {
      // Call the API to cancel the order using the order ID and user ID
      const response = await api({
        method: typeHTTP.POST,
        url: `/OrderCancellation/cancel/${orderDetails.user.userId}/${orderId}`, // Assuming this is the API format
        body: { reason: selectedReason },
        sendToken: true,
      });

      if (response.message) {
        Alert.alert("Thành công", response.message);
        setCancelModalVisible(false); // Close modal after successful cancellation
        navigation.goBack(); // Navigate back after cancellation
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      Alert.alert("Lỗi", "Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    // Handle activeStep based on order status
    if (orderDetails) {
      switch (orderDetails.orderStatus) {
        case "Pending":
          setActiveStep(0); // "Đang chờ duyệt"
          break;
        case "Shipped":
          setActiveStep(1); // "Đã nhận đơn hàng"
          break;
        case "Completed":
          setActiveStep(2); // "Đang hoàn thành đơn hàng"
          break;
        case "Received":
          setActiveStep(3); // "Đang giao tới bạn"
          break;
        case "Delivered":
          setActiveStep(4); // "Giao hàng thành công"
          break;
        default:
          setActiveStep(0); // Default to "Đang chờ duyệt"
          break;
      }
    }
  }, [orderDetails]);

  // Handle selecting a step and hiding others
  const handleStepSelect = (index) => {
    setActiveStep(index);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openCancelModal = () => {
    setCancelModalVisible(true);
  };

  const closeCancelModal = () => {
    setCancelModalVisible(false);
  };

  const selectReason = (reason) => {
    setSelectedReason(reason);
    closeCancelModal();
    navigation.goBack(); // Navigate back after selecting a reason
  };

  const openFoodModal = () => {
    setFoodModalVisible(true);
  };

  const closeFoodModal = () => {
    setFoodModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View contentContainerStyle={{ flex: 1, paddingHorizontal: width * 0.05, paddingTop: height * 0.02 }}>
        {/* App Logo */}
        <View style={{ alignItems: "center", marginBottom: height * 0.02 }}>
          <Image source={require("../../img/LOGOBLACK.png")} style={{ width: width * 0.3, height: height * 0.15 }} />
        </View>
        {/* Progress bar */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: height * 0.02, paddingHorizontal: width * 0.05 }}>
          {steps.map((step, index) => (
            <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: activeStep >= index ? "#E53935" : "white",
                  borderWidth: 2,
                  borderColor: "#E53935",
                }}
              />
              {index < steps.length - 1 && <View style={{ width: width * 0.18, height: 2, backgroundColor: activeStep > index ? "#E53935" : "#E53935" }} />}
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: height * 0.02, paddingHorizontal: width * 0.05 }}>
          {steps.map((step, index) => (
            <Text
              key={index}
              style={{
                fontSize: width * 0.035,
                color: activeStep === index ? "#E53935" : "gray",
                textAlign: "center",
                flex: 1,
                fontWeight: "bold",
                display: activeStep === index ? "flex" : "none", // Only display the selected step
              }}
            >
              {step.label}
            </Text>
          ))}
        </View>
        {/* Order time info */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: height * 0.03, paddingHorizontal: width * 0.05 }}>
          <Text style={{ fontSize: width * 0.04, fontWeight: "bold" }}>Thời gian đặt hàng:</Text>
          <Text style={{ fontSize: width * 0.04 }}>{orderDetails ? formatDateTime(orderDetails.orderDate) : "Đang tải..."}</Text>
        </View>
        {/* Store address */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: width * 0.03,
            borderRadius: 10,
            marginBottom: height * 0.02,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
            paddingHorizontal: width * 0.05,
          }}
        >
          <MaterialIcons name="location-on" size={24} color="green" />
          <View>
            <Text style={{ fontSize: width * 0.045, fontWeight: "bold", marginLeft: 10 }}>{orderDetails ? orderDetails.store.storeName : "Đang tải..."}</Text>
            <Text style={{ fontSize: width * 0.04, color: "#A9A9A9", marginLeft: 10 }}>{orderDetails ? orderDetails.store.storeAddress : "Đang tải..."}</Text>
          </View>
        </View>
        {/* Customer address */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: width * 0.03,
            borderRadius: 10,
            marginBottom: height * 0.02,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
            paddingHorizontal: width * 0.05,
          }}
        >
          <MaterialIcons name="location-on" size={24} color="#E53935" />
          <View style={{}}>
            <Text style={{ fontSize: width * 0.045, fontWeight: "bold", marginLeft: 10 }}>{orderDetails ? orderDetails.user.fullName : "Đang tải..."}</Text>
            <Text style={{ fontSize: width * 0.04, color: "#A9A9A9", marginLeft: 10 }}>{orderDetails ? orderDetails.cartSnapshot.deliveryAddress : "Đang tải..."}</Text>
          </View>
        </View>
        <ScrollView style={{ marginBottom: height * 0.03 }} contentContainerStyle={{ paddingBottom: height * 0.03 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onLongPress={openFoodModal}>
            <View
              style={{
                maxHeight: height * 0.1,
                paddingHorizontal: width * 0.05,
              }}
            >
              {/* Check if orderDetails and items exist */}
              {orderDetails && orderDetails.cartSnapshot && orderDetails.cartSnapshot.items ? (
                orderDetails.cartSnapshot.items.map((item, index) => (
                  <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: height * 0.01 }}>
                    {/* Display quantity and food name */}
                    <Text style={{ fontSize: width * 0.04 }}>
                      {item.quantity}x {item.foodName}
                    </Text>
                    {/* Display food price */}
                    <Text style={{ fontSize: width * 0.04 }}>{item.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
                  </View>
                ))
              ) : (
                <Text>Đang tải danh sách món ăn...</Text> // Display if data is still loading
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Food modal */}
        <Modal animationType="slide" transparent={true} visible={foodModalVisible} onRequestClose={closeFoodModal}>
          <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0)", shadowOffset: { width: 0, height: 10 }, elevation: 3, shadowRadius: 10, shadowOpacity: 0.7, shadowColor: "#000" }} onPress={closeFoodModal} activeOpacity={1}>
            <Pressable style={{ width: width * 0.8, backgroundColor: "#fff", padding: 20, borderRadius: 10 }} onPress={(e) => e.stopPropagation()}>
              <Text style={{ fontSize: width * 0.05, fontWeight: "bold", marginBottom: height * 0.02 }}>Danh sách món ăn</Text>
              <ScrollView>
                {orderDetails && orderDetails.cartSnapshot && orderDetails.cartSnapshot.items ? (
                  orderDetails.cartSnapshot.items.map((item, index) => (
                    <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: height * 0.01 }}>
                      {/* Display quantity and food name */}
                      <Text style={{ fontSize: width * 0.04 }}>
                        {item.quantity}x {item.foodName}
                      </Text>
                      {/* Display food price */}
                      <Text style={{ fontSize: width * 0.04 }}>{item.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
                    </View>
                  ))
                ) : (
                  <Text>Đang tải danh sách món ăn...</Text> // Display if data is still loading
                )}
              </ScrollView>
            </Pressable>
          </TouchableOpacity>
        </Modal>

        {/* Order info (e.g., utensils and payment method) */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: height * 0.02, paddingHorizontal: width * 0.05 }}>
          <Text style={{ fontSize: width * 0.04 }}>Dụng cụ ăn uống</Text>
          <Text style={{ fontSize: width * 0.04, fontWeight: "bold" }}>Có</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: height * 0.02, paddingHorizontal: width * 0.05 }}>
          <Text style={{ fontSize: width * 0.04 }}>Phương thức thanh toán</Text>
          <Text style={{ fontSize: width * 0.04, fontWeight: "bold" }}>{orderDetails ? (orderDetails.paymentMethod === "Cash" ? "Tiền mặt" : orderDetails.paymentMethod) : "Đang tải..."}</Text>
        </View>
        {/* Conditional rendering based on the active step */}
        {activeStep === 0 ? (
          // Display 'Hủy đơn hàng' button only for step 1 (tap 1)
          <TouchableOpacity onPress={openCancelModal}>
            <View style={{ backgroundColor: "#E53935", paddingVertical: height * 0.02, borderRadius: 1, alignItems: "center", marginTop: height * 0.03 }}>
              <Text style={{ color: "#FFFFFF", fontSize: width * 0.05 }}>Hủy đơn hàng</Text>
            </View>
          </TouchableOpacity>
        ) : (
          // Display 'Thông tin tài xế' for steps 2, 3, 4, and 5
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: width * 0.03, backgroundColor: "#FFFFFF", borderRadius: 10 }}>
            <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>Thông tin tài xế</Text>
            <TouchableOpacity onPress={openModal}>
              <Text style={{ fontSize: width * 0.045, color: "#E53935", fontWeight: "bold" }}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cancel order modal */}
        <Modal animationType="slide" transparent={true} visible={cancelModalVisible} onRequestClose={closeCancelModal}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0)", // Dimmed background effect
            }}
            onPress={closeCancelModal} // Close modal when clicking outside
          >
            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: "#fff",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: height * 0.03,
                borderColor: "#D3D3D3", // Light gray border
                borderWidth: 1,
              }}
              onPress={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
              <Text
                style={{
                  fontSize: height * 0.025,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#E53935",
                  marginBottom: height * 0.02,
                }}
              >
                Lý do hủy đơn hàng
              </Text>
              <View style={{ marginBottom: height * 0.015 }}>
                <TouchableOpacity
                  onPress={() => setSelectedReason("Thay đổi phương thức thanh toán")}
                  style={{
                    padding: height * 0.02,
                    backgroundColor: selectedReason === "Thay đổi phương thức thanh toán" ? "#E0E0E0" : "#F5F5F5",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: height * 0.02, color: "#555" }}>Thay đổi phương thức thanh toán</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedReason("Thay đổi địa chỉ")}
                  style={{
                    padding: height * 0.02,
                    backgroundColor: selectedReason === "Thay đổi địa chỉ" ? "#E0E0E0" : "#F5F5F5",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: height * 0.02, color: "#555" }}>Thay đổi địa chỉ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedReason("Đặt thêm món ăn")}
                  style={{
                    padding: height * 0.02,
                    backgroundColor: selectedReason === "Đặt thêm món ăn" ? "#E0E0E0" : "#F5F5F5",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: height * 0.02, color: "#555" }}>Đặt thêm món ăn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedReason("Lý do khác")}
                  style={{
                    padding: height * 0.02,
                    backgroundColor: selectedReason === "Lý do khác" ? "#E0E0E0" : "#F5F5F5",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: height * 0.02, color: "#555" }}>Lý do khác...</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleCancelOrder}>
                <View style={{ backgroundColor: "#E53935", paddingVertical: height * 0.02, borderRadius: 5, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontSize: width * 0.04 }}>Xác nhận hủy</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Driver info modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <Pressable
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0)", // Highlight modal with background opacity
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -3 }, // Top shadow
              shadowOpacity: 0.1, // Adjust shadow visibility
              shadowRadius: 20, // Soften shadow
              elevation: 20,
            }}
            onPress={closeModal} // Close modal when clicking outside content
          >
            {orderDetails && orderDetails.shipper ? (
              <Pressable
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: height * 0.03,
                  borderColor: "#fff", // Light gray for border
                  borderWidth: 1, // Border width
                }}
                onPress={(e) => e.stopPropagation()} // Prevent modal close on inside click
              >
                {/* Title */}
                <Text
                  style={{
                    fontSize: height * 0.02,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: height * 0.03,
                  }}
                >
                  Thông tin tài xế
                </Text>
                <View style={{ marginBottom: height * 0.02 }}>
                  {/* Avatar, Name, Rating, and Vehicle Info */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Avatar Placeholder */}
                    <View
                      style={{
                        width: height * 0.06, // Circle size
                        height: height * 0.06,
                        borderRadius: (height * 0.06) / 2, // Circle shape
                        borderWidth: 2,
                        borderColor: "#E53935", // Red border
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 15,
                      }}
                    >
                      {/* Avatar Icon */}
                      <FontAwesome
                        name="user" // User icon for avatar
                        size={height * 0.03} // Icon size
                        color="#E53935" // Icon color
                      />
                    </View>
                    {/* Name and Rating */}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontSize: height * 0.02, fontWeight: "bold", color: "#E53935", marginRight: 10 }}>{orderDetails ? orderDetails.shipper.fullName : "Đang tải..."}</Text>
                        {/* Rating Section */}
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ fontSize: height * 0.016, color: "#333", marginRight: 5 }}>4.5</Text>
                          <Text style={{ fontSize: height * 0.015, color: "#f39c12" }}>⭐</Text>
                          <Text style={{ fontSize: height * 0.012, color: "#333", marginLeft: 5 }}>(25+)</Text>
                        </View>
                      </View>
                      {/* Vehicle Information */}
                      <Text style={{ fontSize: height * 0.018, color: "#555", marginTop: 5 }}>{orderDetails ? orderDetails.shipper.vehicleNumber : "Đang tải..."}</Text>
                    </View>
                  </View>
                </View>
                {/* Contact Info */}
                <Pressable
                  onPress={() => {
                    closeModal();
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
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: height * 0.02,
                    borderTopWidth: 2,
                    borderTopColor: "#eee",
                    paddingTop: height * 0.01,
                  }}
                >
                  <FontAwesome name="comments" size={height * 0.025} color="#E53935" style={{ marginLeft: 20 }} />
                  <Text style={{ fontSize: height * 0.02, color: "black", marginLeft: 10, fontWeight: "bold" }}>Liên hệ với tài xế</Text>
                </Pressable>
              </Pressable>
            ) : null}
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default OrderingProcess;
