import React, { useState, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Alert, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { globalContext } from "../../context/globalContext";
import { api, typeHTTP } from "../../utils/api";
import { useFocusEffect } from "@react-navigation/native";

export default function Offers({ navigation }) {
  const { globalData, globalHandler } = useContext(globalContext);
  const [foodList, setFoodList] = useState([]);
  const [groupedFoods, setGroupedFoods] = useState({});
  const [foodGroups, setFoodGroups] = useState([]); // Store food group names from API.
  const [selectedFoods, setSelectedFoods] = useState([]); // For selecting dishes
  const [modalVisible, setModalVisible] = useState(false); // Modal for entering new price
  const [newPrice, setNewPrice] = useState(""); // New price input

  // Fetch food group names
  const fetchFoodGroups = useCallback(async () => {
    try {
      const storeId = globalData.storeData?._id;
      if (!storeId) return;

      const response = await api({
        method: typeHTTP.GET,
        url: `/foodgroup/getfood-groups/${storeId}`,
        sendToken: true,
      });

      if (response?.foodGroups) {
        setFoodGroups(response.foodGroups);
      }
    } catch (error) {
      console.error("Error fetching food groups:", error);
    }
  }, [globalData.storeData?._id]);

  // Fetch food list
  const fetchFoodsByStoreId = useCallback(async () => {
    try {
      const storeId = globalData.storeData?._id;
      if (!storeId) return;

      const response = await api({
        method: typeHTTP.GET,
        url: `/food/get-foodstore/${storeId}`,
        sendToken: true,
      });

      if (response?.foods) {
        setFoodList(response.foods);

        // Group foods by category
        const grouped = response.foods.reduce((acc, food) => {
          const groupName =
            foodGroups.find((group) => group._id === food.foodGroup)?.groupName || "Khác";

          if (!acc[groupName]) acc[groupName] = [];
          acc[groupName].push(food);
          return acc;
        }, {});

        setGroupedFoods(grouped);
      } else {
        setFoodList([]);
      }
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  }, [globalData.storeData?._id, foodGroups]);

  useFocusEffect(
    useCallback(() => {
      fetchFoodGroups();
      fetchFoodsByStoreId();
    }, [fetchFoodGroups, fetchFoodsByStoreId])
  );

  // Handle selecting food for discount
  const handleSelectFood = (foodId) => {
    setSelectedFoods((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  // Handle applying discount
  const handleApplyDiscount = () => {
    if (!newPrice) {
      Alert.alert("Lỗi", "Vui lòng nhập giá mới.");
      return;
    }

    const updatedFoodList = foodList.map((food) =>
      selectedFoods.includes(food._id)
        ? { ...food, newPrice: parseFloat(newPrice) }
        : food
    );

    setFoodList(updatedFoodList);
    setSelectedFoods([]);
    setNewPrice("");
    setModalVisible(false);
  };

  // Handle toggling the active state with Switch
  const toggleSwitch = (foodId) => {
    setFoodList((prev) =>
      prev.map((food) =>
        food._id === foodId ? { ...food, isActive: !food.isActive } : food
      )
    );
  };

  // Handle delete food
  const handleDeleteFood = async (foodId) => {
    try {
      await api({
        method: typeHTTP.DELETE,
        url: `/food/delete/${foodId}`,
        sendToken: true,
      });

      const updatedFoodList = foodList.filter((food) => food._id !== foodId);
      setFoodList(updatedFoodList);
      Alert.alert("Thành công", "Món ăn đã được xóa.");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa món ăn.");
    }
  };

  // Render swipeable delete action
  const renderLeftActions = (foodId) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#E53935",
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        height: "88%",
        borderRadius: 10,
        padding: 10,
      }}
      onPress={() => handleDeleteFood(foodId)}
    >
      <Ionicons name="trash-outline" size={22} color="#fff" />
      <Text style={{ color: "#fff" }}>Xóa</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#E53935",
          padding: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 140,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Giảm giá món</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="pricetag-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View
        style={{
          padding: 10,
          marginHorizontal: 15,
          marginTop: -30,
          backgroundColor: "#fff",
          borderRadius: 10,
          elevation: 5,
        }}
      >
        <TextInput
          placeholder="Tìm kiếm"
          style={{ padding: 10, fontSize: 16 }}
        />
      </View>

      {/* Food List */}
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {Object.keys(groupedFoods).map((groupName) => (
          <View key={groupName} style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#E53935",
                marginBottom: 10,
              }}
            >
              {groupName}
            </Text>
            {groupedFoods[groupName].map((item) => (
              <Swipeable
                key={item._id}
                renderLeftActions={() => renderLeftActions(item._id)}
              >
                <TouchableOpacity
                  onPress={() => handleSelectFood(item._id)}
                  style={{
                    backgroundColor: selectedFoods.includes(item._id) ? "#FFEBEE" : "#fff",
                    borderRadius: 10,
                    padding: 15,
                    marginBottom: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: item.newPrice ? "#999" : "#333",
                        textDecorationLine: item.newPrice ? "line-through" : "none",
                      }}
                    >
                      {item.foodName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: item.newPrice ? "#4CAF50" : "#6B7280",
                        marginTop: 5,
                      }}
                    >
                      {item.newPrice
                        ? `${item.newPrice.toLocaleString("vi-VN").replace(/\./g, ",")} VND`
                        : `${item.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND`}
                    </Text>
                  </View>
                  <Switch
                    value={item.isActive || false}
                    onValueChange={() => toggleSwitch(item._id)}
                    thumbColor={item.isActive ? "#E53935" : "#ccc"}
                    trackColor={{ false: "#ccc", true: "#E53935" }}
                  />
                </TouchableOpacity>
              </Swipeable>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Modal for entering discount */}
      <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 20,
              width: "80%",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>Giá mới</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E53935",
                borderRadius: 10,
                padding: 10,
                width: "100%",
                marginBottom: 20,
              }}
              value={newPrice}
              onChangeText={setNewPrice}
              placeholder="Nhập giá mới"
              keyboardType="numeric"
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#E53935",
                  padding: 10,
                  borderRadius: 10,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={handleApplyDiscount}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#ccc",
                  padding: 10,
                  borderRadius: 10,
                  width: "45%",
                  alignItems: "center",
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#333", fontWeight: "bold" }}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}