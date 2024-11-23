import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useOrder } from "./useOrder"; // Import hook useOrder
import { globalContext } from "../../context/globalContext"; // Import globalContext

const { width, height } = Dimensions.get("window"); // Screen dimensions

export default function Orderfood() {
  const navigation = useNavigation();
  const route = useRoute();
  const { foodId, storeId } = route.params;

  const { globalData } = useContext(globalContext);
  const userId = globalData.user?.id;

  const { quantity, price, foodData, loading, comboFoods, incrementQuantity, decrementQuantity, addToCart } = useOrder(foodId);
  const [selectedCombos, setSelectedCombos] = useState([]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const toggleComboSelection = (comboFood) => {
    setSelectedCombos((prevSelectedCombos) =>
      prevSelectedCombos.includes(comboFood._id)
        ? prevSelectedCombos.filter((id) => id !== comboFood._id)
        : [...prevSelectedCombos, comboFood._id]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Food Image and Quantity */}
      <View style={{ height: height * 0.4, backgroundColor: "#E53935" }}>
        <Image
          source={{ uri: foodData?.imageUrl || "https://your-default-image-url" }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: width * 0.04,
            right: width * 0.04,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: height * 0.02,
            borderRadius: width * 0.03,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: width * 0.05, // Default font size
                fontWeight: "bold",
                color: "#fff",
                maxWidth: width * 0.6,
                lineHeight: width * 0.07, // Adjust line height for better readability
              }}
              numberOfLines={2} // Maximum 2 lines to prevent layout distortion
              ellipsizeMode="tail" // Adds "..." if text exceeds allowed lines
            >
              {foodData?.foodName.length > 25
                ? `${foodData?.foodName.substring(0, 25)}...` // Truncate and add "..." if text exceeds 25 characters
                : foodData?.foodName}
            </Text>




          </View>

          {/* Quantity Controls */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={decrementQuantity} style={{ padding: width * 0.02 }}>
              <View
                style={{
                  width: width * 0.07,
                  height: width * 0.07,
                  borderRadius: width * 0.04,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: width * 0.05, color: "#E53935" }}>-</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: width * 0.045, paddingHorizontal: width * 0.03, color: "#fff" }}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQuantity} style={{ padding: width * 0.02 }}>
              <View
                style={{
                  width: width * 0.07,
                  height: width * 0.07,
                  borderRadius: width * 0.04,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: width * 0.05, color: "#E53935" }}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
      </View>

      {/* Food Description and Price */}
      <ScrollView style={{ flex: 1, padding: width * 0.04, marginTop: height * 0.01 }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginVertical: height * 0.01 }}>
          <Text style={{ fontSize: width * 0.06, fontWeight: "bold", color: "#E53935" }}>{price.toLocaleString("vi-VN")} VND</Text>
        </View>

        <View style={{}}>
          <Text style={{ fontSize: width * 0.05, fontWeight: "bold" }}>Mô tả</Text>
          <Text style={{ fontSize: width * 0.045, color: "#666", marginTop: height * 0.01 }}>{foodData?.description}</Text>
        </View>

        {/* Combo Section */}
        {comboFoods.length > 0 && (
          <View style={{ marginTop: height * 0.03 }}>
            <Text style={{ fontSize: width * 0.05, fontWeight: "bold", color: "black", marginBottom: height * 0.01 }}>
              Tên nhóm
            </Text>
            {comboFoods.map((comboFood) => (
              <View
                key={comboFood._id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#ddd",
                  paddingVertical: height * 0.015,
                }}
              >
                {/* Checkbox and Food Name */}
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                  onPress={() => toggleComboSelection(comboFood)}
                >
                  <View
                    style={{
                      width: width * 0.06,
                      height: width * 0.06,
                      borderWidth: 2,
                      borderColor: "#E53935",
                      borderRadius: width * 0.02,
                      marginRight: width * 0.03,
                      backgroundColor: selectedCombos.includes(comboFood._id) ? "#E53935" : "#fff",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedCombos.includes(comboFood._id) && <Ionicons name="checkmark" size={width * 0.04} color="#fff" />}
                  </View>
                  <Text
                    style={{ fontSize: width * 0.04, color: "#333" }}
                    numberOfLines={1} // Limit text to 1 line
                    ellipsizeMode="tail" // Add "..." at the end of truncated text
                  >
                    {comboFood.foodName}
                  </Text>
                </TouchableOpacity>

                {/* Price */}
                <Text style={{ fontSize: width * 0.04, fontWeight: "bold", color: "black" }}>+{comboFood.price.toLocaleString("vi-VN")} VND</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={{ backgroundColor: "#fff", padding: width * 0.04, flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            borderWidth: 2,
            borderColor: "#E53935",
            paddingVertical: height * 0.02,
            borderRadius: width * 0.02,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
          onPress={async () => {
            await addToCart(userId, storeId, selectedCombos);
            navigation.navigate("Shopping", { storeId, userId, foodId });
          }}
        >
          <Ionicons name="cart-outline" size={width * 0.06} color="#E53935" />
          <Text style={{ color: "#E53935", fontSize: width * 0.045, fontWeight: "bold", marginLeft: width * 0.02 }}>Giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
