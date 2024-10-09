import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MomoIcon from "react-native-vector-icons/FontAwesome";
import VnpayIcon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native"; // Thêm useRoute để lấy params
import { api, typeHTTP } from "../../utils/api"; // Import API utilities
import { globalContext } from "../../context/globalContext"; // Import globalContext

const { width } = Dimensions.get("window");

export default function Select() {
  const navigation = useNavigation();
  const route = useRoute(); // Lấy route để truy cập params
  const cartId = route.params?.cartId; // Lấy cartId từ params

  console.log(cartId); // Kiểm tra giá trị cartId

  const { globalData } = useContext(globalContext); // Lấy globalData từ context

  // State để lưu thông tin thẻ và phương thức thanh toán
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // Lưu phương thức thanh toán đã chọn

  // Hàm kiểm tra dữ liệu hợp lệ
  const validatePaymentDetails = () => {
    if (selectedPaymentMethod === "BankCard") {
      if (!cardNumber || !expiryDate || !cvv) {
        alert("Vui lòng nhập đầy đủ thông tin thẻ");
        return false;
      }
    }
    return true;
  };

  // Hàm xử lý xác nhận thanh toán và gọi API
  const handleConfirmPayment = async () => {
    if (!validatePaymentDetails()) return;

    try {
      const transactionAmount = globalData.cart.totalPrice; // Lấy số tiền từ giỏ hàng
      const response = await api({
        method: typeHTTP.POST,
        url: `/PaymentTransaction/create-payment/${cartId}`, // Sử dụng cartId từ params
        body: {
          paymentMethod: selectedPaymentMethod,
          transactionAmount,
        },
        sendToken: true, // Gửi token xác thực
      });

      if (response && response.transaction) {
        // Điều hướng về màn hình Shopping với phương thức thanh toán đã chọn
        navigation.navigate("Shopping", { paymentMethod: selectedPaymentMethod });
        Alert.alert("Thành công", "Phương thức thanh toán đã được xác nhận!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo giao dịch thanh toán:", error);
      Alert.alert("Lỗi", "Không thể xử lý thanh toán.");
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
            backgroundColor: selectedPaymentMethod === "VNPay" ? "#E53935" : "#fff",
            borderColor: "#eee",
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
            marginVertical: 10,
          }}
          onPress={() => setSelectedPaymentMethod("VNPay")}
        >
          <VnpayIcon name="credit-card" size={30} color={selectedPaymentMethod === "VNPay" ? "#fff" : "#E53935"} />
          <Text style={{ marginLeft: 10, fontSize: 16, color: selectedPaymentMethod === "VNPay" ? "#fff" : "#333" }}>VNPay</Text>
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
    </View>
  );
}
