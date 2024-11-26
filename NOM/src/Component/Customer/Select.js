import React, { useState, useCallback } from "react";
import { View, Linking, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Alert, ActivityIndicator, Image, Modal } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MomoIcon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native"; // Thêm useRoute để lấy params
import { api, typeHTTP } from "../../utils/api"; // Import API utilities
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

export default function Select() {
  const navigation = useNavigation();
  const route = useRoute(); // Lấy route để truy cập params
  const cartId = route.params?.cartId; // Lấy cartId từ params
  const storeId = route.params?.storeId;
  const useLoyaltyPoints = route.params?.useLoyaltyPoints; // Nhận useLoyaltyPoints từ params

  console.log(cartId); // Kiểm tra giá trị cartId
  console.log(storeId); // Kiểm tra giá trị cartId

  // State để lưu thông tin thẻ và phương thức thanh toán
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // Lưu phương thức thanh toán đã chọn
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(""); // URL thanh toán từ API
  const [modalVisible, setModalVisible] = useState(false); // Điều khiển hiển thị Modal

  // Hàm kiểm tra dữ liệu hợp lệ
  // const validatePaymentDetails = () => {
  //   if (selectedPaymentMethod === "BankCard") {
  //     if (!cardNumber || !expiryDate || !cvv) {
  //       alert("Vui lòng nhập đầy đủ thông tin thẻ");
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  // Hàm xử lý xác nhận thanh toán và gọi API
  const handleConfirmPayment = useCallback(async () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Lỗi", "Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      setIsLoading(true);

      // Gọi API tạo giao dịch thanh toán
      const response = await api({
        method: typeHTTP.POST,
        url: `/PaymentTransaction/create-payment/${cartId}/${storeId}`,
        body: {
          paymentMethod: selectedPaymentMethod, // Truyền phương thức thanh toán (Cash hoặc PayOS)
          useLoyaltyPoints,
        },
        sendToken: true,
      });

      if (response?.transaction) {
        if (selectedPaymentMethod === "Cash") {
          // Điều hướng về màn hình Shopping sau khi tạo giao dịch thành công
          navigation.navigate("Shopping", { paymentMethod: selectedPaymentMethod, storeId });
          Alert.alert("Thành công", "Phương thức thanh toán tiền mặt đã được xác nhận!");
        } else if (selectedPaymentMethod === "PayOS") {
          // // Hiển thị QR code cho PayOS
          // setQrCodeValue(response.qrCode);
          // Alert.alert("Thông báo", "Quét mã QR để hoàn tất thanh toán. Đơn hàng sẽ được xử lý tự động sau khi thanh toán thành công.");
          if (response?.paymentLink) {
            setPaymentUrl(response.paymentLink); // Lưu URL thanh toán vào state
            setModalVisible(true); // Mở Modal khi nhận được paymentUrl
          } else {
            Alert.alert("Lỗi", "Không nhận được liên kết thanh toán từ máy chủ.");
          }
        }
      } else {
        Alert.alert("Lỗi", "Không thể xử lý thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra trong quá trình xử lý.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPaymentMethod, cartId, storeId, useLoyaltyPoints, navigation]);

  // Hàm lắng nghe sự kiện sau khi thanh toán hoàn tất
  const handleNavigationStateChange = (navState) => {
    if (navState.url.includes("payment-success")) {
      const urlParams = new URLSearchParams(navState.url.split("?")[1]);
      const status = urlParams.get("status");

      if (status === "PAID" || status === "SUCCESS") {
        navigation.navigate("HomeKH");
        Alert.alert("Thanh toán thành công!", "Cảm ơn bạn đã sử dụng dịch vụ.");
        setModalVisible(false); // Đóng Modal sau khi thanh toán thành công
      } else {
        Alert.alert("Thanh toán không thành công", "Vui lòng thử lại.");
        setModalVisible(false); // Đóng Modal nếu thanh toán thất bại
      }
    }
  };

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
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>Chọn Phương Thức Thanh Toán</Text>
      </View>

      {isLoading && <ActivityIndicator size="large" color="#E53935" style={{ position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -20 }, { translateY: -20 }] }} />}

      {/* Payment Methods and Bank Card Input */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
          flexGrow: 1,
        }}
      >
        {/* Bank Card Payment Option */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: selectedPaymentMethod === "BankCard" ? "#E53935" : "#fff",
            borderColor: "#eee",
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
            marginVertical: 10,
          }}
          onPress={() => setSelectedPaymentMethod("BankCard")}
        >
          <Icon name="credit-card" size={30} color={selectedPaymentMethod === "BankCard" ? "#fff" : "#E53935"} />
          <Text style={{ marginLeft: 10, fontSize: 16, color: selectedPaymentMethod === "BankCard" ? "#fff" : "#333" }}>Thẻ ngân hàng</Text>
        </TouchableOpacity>

        {/* Bank Card Inputs */}
        {selectedPaymentMethod === "BankCard" && (
          <View>
            <TextInput
              style={{
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                marginTop: 10,
              }}
              placeholder="Số thẻ"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              <TextInput
                style={{
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  width: "48%",
                }}
                placeholder="Ngày hết hạn (MM/YY)"
                keyboardType="numeric"
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
              <TextInput
                style={{
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  width: "48%",
                }}
                placeholder="CVV"
                secureTextEntry
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
              />
            </View>
          </View>
        )}

        {/* Momo Payment Option */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: selectedPaymentMethod === "Momo" ? "#E53935" : "#fff",
            borderColor: "#eee",
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
            marginVertical: 10,
          }}
          onPress={() => setSelectedPaymentMethod("Momo")}
        >
          <MomoIcon name="mobile" size={30} color={selectedPaymentMethod === "Momo" ? "#fff" : "#E53935"} />
          <Text style={{ marginLeft: 10, fontSize: 16, color: selectedPaymentMethod === "Momo" ? "#fff" : "#333" }}>Momo</Text>
        </TouchableOpacity>

        {/* VNPay Payment Option */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: selectedPaymentMethod === "PayOS" ? "#E53935" : "#fff",
            borderColor: "#eee",
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
            marginVertical: 10,
          }}
          onPress={() => setSelectedPaymentMethod("PayOS")}
        >
          <Icon name="credit-card" size={30} color={selectedPaymentMethod === "PayOS" ? "#fff" : "#E53935"} />
          <Text style={{ marginLeft: 10, fontSize: 16, color: selectedPaymentMethod === "PayOS" ? "#fff" : "#333" }}>PayOS</Text>
        </TouchableOpacity>

        {/* Cash Payment Option */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: selectedPaymentMethod === "Cash" ? "#E53935" : "#fff",
            borderColor: "#eee",
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
            marginVertical: 10,
          }}
          onPress={() => setSelectedPaymentMethod("Cash")}
        >
          <Icon name="attach-money" size={30} color={selectedPaymentMethod === "Cash" ? "#fff" : "#E53935"} />
          <Text style={{ marginLeft: 10, fontSize: 16, color: selectedPaymentMethod === "Cash" ? "#fff" : "#333" }}>Thanh toán tiền mặt</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Button to Confirm Payment Method */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: selectedPaymentMethod ? "#E53935" : "#aaa",
          padding: 15,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          margin: 20,
          width: width * 0.9,
          alignSelf: "center",
        }}
        onPress={handleConfirmPayment} // Gọi API khi bấm nút xác nhận
        disabled={!selectedPaymentMethod} // Disable button nếu chưa chọn phương thức thanh toán
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Xác nhận</Text>
      </TouchableOpacity>

      {/* Modal để hiển thị WebView khi thanh toán */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Đóng Modal khi nhấn nút quay lại
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: width * 0.9, height: height * 0.8 }}>
            <WebView source={{ uri: paymentUrl }} style={{ flex: 1 }} onNavigationStateChange={handleNavigationStateChange} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
