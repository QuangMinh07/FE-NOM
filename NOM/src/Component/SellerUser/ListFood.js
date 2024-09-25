import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler"; // Import Swipeable
import { AntDesign } from "@expo/vector-icons"; // Import AntDesign
import { globalContext } from "../../context/globalContext"; // Đảm bảo import đúng đường dẫn
import { api, typeHTTP } from "../../utils/api"; // Đảm bảo import đúng API
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListFood({ navigation }) {
  const { globalData, globalHandler } = useContext(globalContext); // Truy cập globalData từ GlobalContext
  const { foods } = globalData; // Lấy danh sách món ăn từ globalData

  useEffect(() => {
    console.log("Foods:", foods); // Kiểm tra danh sách món ăn
  }, [foods]);

  const [selectedTab, setSelectedTab] = useState("Món");
  const [modalVisible, setModalVisible] = useState(false); // State cho modal thêm nhóm món
  const [newGroupName, setNewGroupName] = useState(""); // State cho nhóm món mới

  // Nhóm món ăn theo foodGroup và sắp xếp thứ tự
  const groupFoodsByCategory = (foods) => {
    const groupOrder = ["Món chính", "Canh", "Tráng miệng", "Nước", "Khác"];

    // Nhóm món ăn
    const groupedFoods = foods.reduce((groupedFoods, food) => {
      const group = food.foodGroup || "Khác";
      if (!groupedFoods[group]) {
        groupedFoods[group] = [];
      }
      groupedFoods[group].push(food);
      return groupedFoods;
    }, {});

    // Sắp xếp nhóm món theo thứ tự ưu tiên
    return Object.keys(groupedFoods)
      .sort((a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b))
      .reduce((sortedGroupedFoods, key) => {
        sortedGroupedFoods[key] = groupedFoods[key];
        return sortedGroupedFoods;
      }, {});
  };

  const groupedFoods = groupFoodsByCategory(foods);

  const handleAddButtonPress = () => {
    if (selectedTab === "Nhóm món") {
      setModalVisible(true); // Hiển thị modal khi chọn tab 'Nhóm món'
    } else {
      navigation.navigate("AddEat");
    }
  };

  // Hàm lấy chi tiết món ăn từ API
  const fetchFoodById = async (foodId) => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/food/get-food/${foodId}`,
        sendToken: true, // Gửi token để xác thực
      });

      // Log chi tiết phản hồi từ API
      console.log("Response from API:", response);

      // Nếu phản hồi thành công
      if (response.status === 200 && response.data) {
        console.log("Thông tin món ăn:", response.data.food);
        return response.data.food;
      }

      // Nếu có lỗi không tìm thấy món ăn (404)
      if (response.status === 404) {
        console.error("Lỗi 404: Không tìm thấy món ăn", response.data.message);
      }
    } catch (error) {
      // Xử lý lỗi từ server và kiểm tra mã lỗi HTTP
      if (error.response) {
        if (error.response.status === 404) {
          console.error("Lỗi 404: Món ăn không tồn tại", error.response.data.message);
        } else if (error.response.status === 500) {
          console.error("Lỗi 500: Lỗi server khi lấy món ăn", error.response.data.message);
        } else {
          console.error(`Lỗi ${error.response.status}:`, error.response.data.message);
        }
      } else {
        console.error("Lỗi không xác định:", error.message);
      }
    }
  };

  const handleDeleteFood = async (foodId) => {
    try {
      await api({
        method: typeHTTP.DELETE,
        url: `/food/delete/${foodId}`,
        sendToken: true,
      });

      const updatedFoods = foods.filter((food) => food._id !== foodId);
      await AsyncStorage.setItem("foods", JSON.stringify(updatedFoods));
      globalHandler.setFoods(updatedFoods);

      // Hiển thị thông báo thành công
      Alert.alert(
        "Xóa thành công",
        "Món ăn đã được xóa khỏi danh sách.",
        [{ text: "OK" }] // Nút xác nhận
      );

      console.log("Đã xóa món ăn và cập nhật dữ liệu.");
    } catch (error) {
      console.error("Lỗi khi xóa món ăn:", error);
    }
  };

  // Khi người dùng bấm vào món ăn
  const handleDishClick = async (foodId) => {
    const foodDetails = await fetchFoodById(foodId);
    if (foodDetails) {
      navigation.navigate("DishDetails", { food: foodDetails }); // Điều hướng sang màn hình chi tiết món ăn
    }
  };

  const renderLeftActions = (foodId) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteFood(foodId)} // Sử dụng foodId
      >
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text style={{ color: "#fff" }}>Xóa</Text>
      </TouchableOpacity>
    );
  };

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
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Danh sách thực đơn</Text>
        <TouchableOpacity onPress={handleAddButtonPress}>
          <AntDesign name="pluscircleo" size={30} color="#fff" />
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
        <TextInput placeholder="Tìm kiếm" style={{ padding: 10, fontSize: 16 }} />
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#fff",
          paddingVertical: 10,
        }}
      >
        {["Món", "Nhóm món"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={{
              borderBottomWidth: selectedTab === tab ? 2 : 0,
              borderBottomColor: "#E53935",
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                color: selectedTab === tab ? "#E53935" : "#6B7280",
                fontSize: 16,
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List of Food */}
      {selectedTab === "Món" && (
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          {Object.keys(groupedFoods).map((groupName) => (
            <View key={groupName} style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#E53935" }}>{groupName}</Text>
              </View>
              {groupedFoods[groupName].map((item, index) => (
                <Swipeable key={index} renderLeftActions={() => renderLeftActions(item._id, () => {})}>
                  <TouchableOpacity
                    onPress={() => handleDishClick(item._id)} // Gọi hàm khi nhấn vào món ăn
                    style={styles.foodItem}
                  >
                    <View>
                      <Text style={styles.foodName}>{item.foodName}</Text>
                      <Text style={styles.foodPrice}>{item.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {selectedTab === "Nhóm món" && (
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          {Object.keys(groupedFoods).map((groupName) => (
            <View key={groupName} style={{ marginBottom: 20 }}>
              <View style={styles.foodItem}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#E53935" }}>{groupName}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal for adding new group */}
      <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tên Nhóm món</Text>
            <TextInput style={styles.modalInput} value={newGroupName} onChangeText={setNewGroupName} placeholder="Nhập tên nhóm món" />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  // Handle confirmation
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  foodItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  foodPrice: {
    fontSize: 14,
    color: "#6B7280",
  },
  deleteButton: {
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "88%",
    borderRadius: 10,
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E53935",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
    elevation: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
