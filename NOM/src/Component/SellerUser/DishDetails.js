import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, Image, Switch, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { globalContext } from "../../context/globalContext";
import { api, typeHTTP } from "../../utils/api";

export default function DishDetails() {
  const navigation = useNavigation();
  const { globalData } = useContext(globalContext);
  const { selectedFoodId, storeData } = globalData;
  const [foodDetails, setFoodDetails] = useState(null);
  const [foodGroupName, setFoodGroupName] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State để kiểm soát chế độ chỉnh sửa
  const [updatedFood, setUpdatedFood] = useState({}); // State lưu trữ dữ liệu cập nhật

  const fetchFoodGroup = async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/foodgroup/get-foods-by-group/${storeData._id}/${selectedFoodId}`,
        sendToken: true,
      });
      if (response) {
        setFoodDetails(response.foodDetails);
        setUpdatedFood(response.foodDetails); // Sao chép dữ liệu ban đầu vào state cập nhật
        setFoodGroupName(response.groupName);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    if (selectedFoodId && storeData?._id) {
      fetchFoodGroup();
    }
  }, [selectedFoodId, storeData]);

  const handleSave = async () => {
    try {
      const response = await api({
        method: typeHTTP.PUT,
        url: `/food/update/${selectedFoodId}`,
        body: {
          ...updatedFood,
          foodGroup: foodDetails.foodGroup,
          sellingTime: JSON.stringify(foodDetails.sellingTime), // Không cho phép chỉnh sửa thời gian
        },
        sendToken: true,
      });
      if (response && response.message === "Cập nhật món ăn thành công") {
        setIsEditing(false);
        setFoodDetails(updatedFood); // Cập nhật giao diện với dữ liệu đã lưu
        alert("Cập nhật món ăn thành công");
      } else {
        alert("Có lỗi xảy ra khi cập nhật món ăn");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật món ăn:", error);
      alert("Không thể cập nhật món ăn");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate("ListFood")} style={{ flexDirection: "row", alignItems: "center" }}>
              <AntDesign name="arrowleft" size={24} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.headerText}>Chi tiết món ăn</Text>
            </TouchableOpacity>
            {/* Edit Icon */}
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <AntDesign name="edit" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Main Content with ScrollView */}
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tên món</Text>
              <TextInput style={styles.input} value={isEditing ? updatedFood.foodName : foodDetails?.foodName || ""} editable={isEditing} onChangeText={(text) => setUpdatedFood((prev) => ({ ...prev, foodName: text }))} />

              <Text style={[styles.label, { marginTop: 10 }]}>Giá món ăn</Text>
              <TextInput style={styles.input} value={isEditing ? updatedFood.price?.toString() : foodDetails?.price?.toString() || ""} editable={isEditing} keyboardType="numeric" onChangeText={(text) => setUpdatedFood((prev) => ({ ...prev, price: parseFloat(text) }))} />

              <Text style={[styles.label, { marginTop: 10 }]}>Ảnh món ăn</Text>
              <TouchableOpacity style={styles.imagePicker}>{foodDetails?.imageUrl ? <Image source={{ uri: foodDetails.imageUrl }} style={styles.image} /> : <Text style={{ color: "#ccc", fontSize: 16 }}>Chưa có ảnh</Text>}</TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mô tả món ăn</Text>
              <TextInput style={[styles.input, { height: 80 }]} multiline value={isEditing ? updatedFood.description : foodDetails?.description || ""} editable={isEditing} onChangeText={(text) => setUpdatedFood((prev) => ({ ...prev, description: text }))} />
            </View>

            {/* Group and Availability */}
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Nhóm món</Text>
              <TouchableOpacity style={styles.selectButton} disabled>
                <Text>{foodGroupName || "Chưa có nhóm"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Còn món</Text>
              <Switch value={isEditing ? updatedFood.isAvailable : foodDetails?.isAvailable || false} disabled={!isEditing} onValueChange={(value) => setUpdatedFood((prev) => ({ ...prev, isAvailable: value }))} thumbColor={updatedFood.isAvailable ? "#fff" : "#fff"} trackColor={{ false: "#ccc", true: "red" }} />
            </View>

            {/* Time Selling */}
            <View style={styles.timeSellingContainer}>
              <Text style={styles.label}>Thời gian bán</Text>
              {foodDetails?.sellingTime?.map((dayItem, index) => (
                <View key={index} style={styles.timeRow}>
                  <Text style={styles.dayLabel}>{dayItem.day}:</Text>
                  {dayItem.timeSlots?.map((slot, slotIndex) => (
                    <Text key={slotIndex} style={styles.timeSlot}>
                      Mở: {slot.open} - Đóng: {slot.close}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {/* Cancel Button */}
            {isEditing && (
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa
                  setUpdatedFood(foodDetails); // Đặt lại các giá trị cập nhật về chi tiết món ban đầu
                }}
                style={[styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Xóa</Text>
              </TouchableOpacity>
            )}
            {/* Save Button */}
            {isEditing && (
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E53935",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 140,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollViewContainer: {
    paddingBottom: 100,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  selectButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: 120,
    alignItems: "center",
  },
  timeSellingContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  timeRow: {
    flexDirection: "column",
    marginVertical: 8,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timeSlot: {
    fontSize: 14,
    color: "#555",
    marginLeft: 20,
  },
  saveButton: {
    width: 150,
    backgroundColor: "#E53935",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    width: 150,
    backgroundColor: "#E53935",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
