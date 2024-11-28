import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MomoIcon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native"; // Lấy route để truy cập params

const { width } = Dimensions.get("window");

export default function Select() {
  const navigation = useNavigation();
  const route = useRoute(); // Lấy route để truy cập params
  const cartId = route.params?.cartId; // Lấy cartId từ params
  const storeId = route.params?.storeId;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // Lưu phương thức thanh toán đã chọn

  // Hàm điều hướng đến màn hình Shopping sau khi chọn phương thức thanh toán
  const handleConfirmPayment = () => {
    if (!selectedPaymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    // Điều hướng đến Shopping với phương thức thanh toán đã chọn
    navigation.navigate("Shopping", { paymentMethod: selectedPaymentMethod, storeId });
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

      {/* Payment Methods */}
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

        {/* PayOS Payment Option */}
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
    </View>
  );
}
