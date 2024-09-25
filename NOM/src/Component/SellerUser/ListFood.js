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
  const { foods, storeData } = globalData; // Lấy danh sách món ăn và thông tin cửa hàng từ globalData
  const [filteredFoods, setFilteredFoods] = useState([]); // State để lưu món ăn đúng của cửa hàng hiện tại

  useEffect(() => {
    console.log("Foods in globalData:", foods); // Kiểm tra danh sách món ăn từ globalData
    console.log("StoreId from storeData:", storeData?._id); // Kiểm tra storeId từ storeData

    if (storeData && storeData._id && foods.length > 0) {
      // Lọc món ăn dựa trên storeId hiện tại
      const filtered = foods.filter((food) => food.store === storeData._id);
      console.log("Filtered Foods:", filtered); // Kiểm tra món ăn đã lọc
      setFilteredFoods(filtered);
    }
  }, [foods, storeData]); // Chỉ gọi lại khi foods hoặc storeData thay đổi

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

  const groupedFoods = groupFoodsByCategory(filteredFoods);

  const handleAddButtonPress = () => {
    if (selectedTab === "Nhóm món") {
      setModalVisible(true); // Hiển thị modal khi chọn tab 'Nhóm món'
    } else {
      navigation.navigate("AddEat");
    }
  };

  const getFoodsByStoreId = async () => {
    const storeId = storeData?._id; // Lấy storeId từ storeData
    console.log("StoreId: ", storeId); // Kiểm tra giá trị storeId

    if (!storeId) {
      console.error("storeId không tồn tại");
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/food/get-foodstore/${storeId}`, // Gọi API với storeId
        sendToken: true, // Gửi token để xác thực
      });

      console.log("Response from API:", response);

      if (response.status === 200 && response.data) {
        if (response.data.foods && response.data.foods.length > 0) {
          // Có món ăn trong cửa hàng
          console.log("Danh sách món ăn:", response.data.foods);
          globalHandler.setFoods(response.data.foods); // Cập nhật danh sách món ăn trong globalData
        } else {
          // Không có món ăn nào trong cửa hàng
          console.log("Chưa có món ăn nào được thêm.");
          globalHandler.setFoods([]); // Đảm bảo rằng foods được đặt thành mảng rỗng
        }
      } else if (response.status === 404) {
        console.error("Không tìm thấy cửa hàng hoặc món ăn", response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error(`Lỗi ${error.response.status}:`, error.response.data.message);
      } else {
        console.error("Lỗi không xác định:", error.message);
      }
    }
  };

  // Gọi hàm getFoodsByStoreId khi component được mount
  useEffect(() => {
    getFoodsByStoreId(); // Gọi API khi storeData đã được tải
  }, [storeData]); // Chỉ gọi khi storeData thay đổi

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
  const handleDishClick = (foodId) => {
    console.log("Navigating to DishDetails with foodId:", foodId); // Kiểm tra giá trị foodId trước khi navigate
    navigation.navigate("DishDetails", { foodId }); // Truyền foodId qua navigation
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

      {/* Kiểm tra nếu không có món ăn */}
      {selectedTab === "Món" &&
        (filteredFoods.length === 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Text style={{ fontSize: 18, color: "#999" }}>Không có món ăn nào</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 15 }}>
            {Object.keys(groupedFoods).map((groupName) => (
              <View key={groupName} style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#E53935" }}>{groupName}</Text>
                </View>
                {groupedFoods[groupName].map((item, index) => (
                  <Swipeable key={index} renderLeftActions={() => renderLeftActions(item._id)}>
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
        ))}

      {/* Tab nhóm món */}
      {selectedTab === "Nhóm món" &&
        (Object.keys(groupedFoods).length === 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Text style={{ fontSize: 18, color: "#999" }}>Không có nhóm món nào</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 15 }}>
            {Object.keys(groupedFoods).map((groupName) => (
              <View key={groupName} style={{ marginBottom: 20 }}>
                <View style={styles.foodItem}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#E53935" }}>{groupName}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ))}

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
