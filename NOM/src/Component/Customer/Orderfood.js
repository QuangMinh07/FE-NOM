import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useOrder } from "./useOrder"; // Import hook useOrder
import { globalContext } from "../../context/globalContext"; // Import globalContext

export default function Orderfood() {
  const navigation = useNavigation();
  const route = useRoute();
  const { foodId, storeId } = route.params;
  console.log("storeId in Orderfood:", storeId);
  console.log("foodId in Orderfood:", foodId);

  const { globalData } = useContext(globalContext);
  const userId = globalData.user?.id;

  const { quantity, price, foodData, loading, comboFoods, incrementQuantity, decrementQuantity, addToCart } = useOrder(foodId); // Sử dụng hook useOrder
  const [selectedCombos, setSelectedCombos] = useState([]); // Trạng thái lưu các combo được chọn

  if (loading) {
    return <Text>Loading...</Text>;
  }

  // Xử lý chọn/hủy chọn combo
  const toggleComboSelection = (comboFood) => {
    setSelectedCombos((prevSelectedCombos) => {
      if (prevSelectedCombos.includes(comboFood._id)) {
        return prevSelectedCombos.filter((id) => id !== comboFood._id); // Hủy chọn nếu đã được chọn
      } else {
        return [...prevSelectedCombos, comboFood._id]; // Chọn combo
      }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ height: 300, backgroundColor: "#E53935" }}>
        <Image source={{ uri: foodData?.imageUrl || "https://your-default-image-url" }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 16,
            right: 16,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: 10,
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff", width: 230 }}>{foodData?.foodName}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={decrementQuantity} style={{ padding: 10 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, color: "#E53935" }}>-</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, paddingHorizontal: 10, color: "#fff" }}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQuantity} style={{ padding: 10 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, color: "#E53935" }}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16, marginTop: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginVertical: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#E53935" }}>{price.toLocaleString("vi-VN")} VND</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Mô tả</Text>
          <Text style={{ fontSize: 16, color: "#666", marginTop: 5 }}>{foodData?.description}</Text>
        </View>
      </ScrollView>

      {/* Combo Group Section */}
      {comboFoods.length > 0 && (
        <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#E53935", marginBottom: 10 }}>Món ăn trong Combo Nhóm</Text>
          {comboFoods.map((comboFood) => (
            <View
              key={comboFood._id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
                paddingVertical: 10,
              }}
            >
              {/* Checkbox and Food Name */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                }}
                onPress={() => toggleComboSelection(comboFood)}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 2,
                    borderColor: "#E53935",
                    borderRadius: 4,
                    marginRight: 10,
                    backgroundColor: selectedCombos.includes(comboFood._id) ? "#E53935" : "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedCombos.includes(comboFood._id) && <Ionicons name="checkmark" size={18} color="#fff" />}
                </View>
                <Text style={{ fontSize: 16, color: "#333" }}>{comboFood.foodName}</Text>
              </TouchableOpacity>

              {/* Price */}
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#E53935" }}>+{comboFood.price.toLocaleString("vi-VN")} VND</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ backgroundColor: "#fff", padding: 16, flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            borderWidth: 2,
            borderColor: "#E53935",
            paddingVertical: 15,
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "98%",
          }}
          onPress={async () => {
            console.log("userId:", userId, "foodId:", foodId, "storeId:", storeId);
            await addToCart(userId, storeId, selectedCombos);
            navigation.navigate("Shopping", { storeId, userId, foodId });
          }}
        >
          <Ionicons name="cart-outline" size={24} color="#E53935" />
          <Text style={{ color: "#E53935", fontSize: 18, fontWeight: "bold", marginLeft: 5 }}>Giỏ hàng</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={{
            backgroundColor: "#E53935",
            paddingVertical: 15,
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "48%",
          }}
          onPress={() => addToCart(userId)} // Thêm món ăn vào giỏ hàng
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Mua ngay</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
