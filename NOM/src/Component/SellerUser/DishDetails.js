import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, Image, Switch, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Modal, Pressable, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { globalContext } from "../../context/globalContext";
import { api, typeHTTP } from "../../utils/api";
import * as ImagePicker from "expo-image-picker";

export default function DishDetails() {
  const navigation = useNavigation();
  const { globalData } = useContext(globalContext);
  const { selectedFoodId, storeData } = globalData;
  const [foodDetails, setFoodDetails] = useState(null);
  const [foodGroupName, setFoodGroupName] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State để kiểm soát chế độ chỉnh sửa
  const [updatedFood, setUpdatedFood] = useState({}); // State lưu trữ dữ liệu cập nhật
  const [image, setImage] = useState(null); // Lưu URI ảnh
  const [modalVisible, setModalVisible] = useState(false); // Quản lý modal chọn ảnh
  const [foodGroups, setFoodGroups] = useState([]); // Lưu danh sách nhóm món
  const [groupModalVisible, setGroupModalVisible] = useState(false); // Quản lý modal chọn nhóm
  const [isLoading, setIsLoading] = useState(false); // Quản lý trạng thái loading

  useEffect(() => {
    if (globalData.sellingTime) {
      setUpdatedFood((prev) => ({
        ...prev,
        sellingTime: globalData.sellingTime,
      }));
    }
  }, [globalData.sellingTime]);

  const getFoodGroups = async () => {
    if (!storeData?._id) return;

    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/foodgroup/getfood-groups/${storeData._id}`,
        sendToken: true,
      });

      if (response && response.foodGroups) {
        setFoodGroups(response.foodGroups);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhóm món:", error);
    }
  };

  useEffect(() => {
    getFoodGroups();
  }, [storeData]);

  const openImageLibrary = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        setImage(selectedImageUri);
        setModalVisible(false);
      } else {
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      setModalVisible(false);
    }
  };

  const fetchFoodGroup = async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/foodgroup/get-foods-by-group/${storeData._id}/${selectedFoodId}`,
        sendToken: true,
      });
      if (response) {
        setFoodDetails(response.foodDetails);
        setUpdatedFood(response.foodDetails);
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
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("foodName", updatedFood.foodName);
      formData.append("price", updatedFood.price);
      formData.append("description", updatedFood.description);
      formData.append("foodGroup", updatedFood.foodGroup || foodDetails.foodGroup);
      formData.append("isAvailable", updatedFood.isAvailable);

      if (updatedFood.sellingTime) {
        formData.append("sellingTime", JSON.stringify(updatedFood.sellingTime));
      }

      if (image) {
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "foodImage.jpg",
        });
      }

      const response = await api({
        method: typeHTTP.PUT,
        url: `/food/edit-food/${selectedFoodId}`,
        body: formData,
        sendToken: true,
        isMultipart: true,
      });

      if (response?.message === "Cập nhật món ăn thành công") {
        alert("Cập nhật món ăn thành công");
        setIsEditing(false);
        navigation.navigate("ListFood"); // Điều hướng đến màn hình ListFood
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật món ăn:", error);
      alert("Không thể cập nhật món ăn");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {isLoading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Tối màu nền nhưng vẫn hiển thị loading
                zIndex: 999, // Đảm bảo loading hiển thị trên cùng
              }}
            >
              <ActivityIndicator size="large" color="#E53935" />
            </View>
          )}
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
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={() => setModalVisible(true)} // Mở modal chọn ảnh
              >
                {image || foodDetails?.imageUrl ? <Image source={{ uri: image || foodDetails.imageUrl }} style={styles.image} /> : <Text style={{ color: "#ccc", fontSize: 16 }}>Chọn ảnh món ăn</Text>}
              </TouchableOpacity>
            </View>

            <Modal transparent={true} animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
              <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
                <Pressable style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Chọn ảnh</Text>
                  <TouchableOpacity onPress={openImageLibrary}>
                    <Text style={styles.modalOption}>Chọn ảnh từ thư viện</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            </Modal>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mô tả món ăn</Text>
              <TextInput style={[styles.input, { height: 80 }]} multiline value={isEditing ? updatedFood.description : foodDetails?.description || ""} editable={isEditing} onChangeText={(text) => setUpdatedFood((prev) => ({ ...prev, description: text }))} />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Nhóm món</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                  if (isEditing) {
                    setGroupModalVisible(true);
                  }
                }}
              >
                <Text>{foodGroupName || "Chọn nhóm món"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Còn món</Text>
              <Switch value={isEditing ? updatedFood.isAvailable : foodDetails?.isAvailable || false} disabled={!isEditing} onValueChange={(value) => setUpdatedFood((prev) => ({ ...prev, isAvailable: value }))} thumbColor={updatedFood.isAvailable ? "#fff" : "#fff"} trackColor={{ false: "#ccc", true: "red" }} />
            </View>

            <Modal transparent={true} animationType="slide" visible={groupModalVisible} onRequestClose={() => setGroupModalVisible(false)}>
              <Pressable style={styles.modalBackground} onPress={() => setGroupModalVisible(false)}>
                <Pressable style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Chọn nhóm món</Text>
                  {foodGroups.map((group, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setFoodGroupName(group.groupName);
                        setUpdatedFood((prev) => ({ ...prev, foodGroup: group._id }));
                        setGroupModalVisible(false);
                      }}
                      style={{ paddingVertical: 10 }}
                    >
                      <Text style={styles.modalOption}>{group.groupName}</Text>
                    </TouchableOpacity>
                  ))}
                </Pressable>
              </Pressable>
            </Modal>

            {/* Time Selling */}
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Thời gian bán</Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  if (isEditing) {
                    navigation.navigate("TimeScheduleSell"); // Điều hướng tới màn hình chọn thời gian
                  }
                }}
              >
                <Text style={{ fontSize: 16, marginRight: 10 }}>Tùy chỉnh</Text>
                <AntDesign name="right" size={16} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.timeSellingContainer}>
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
  },
  modalContent: {
    borderColor: "#f2f2f2", // Border color
    borderWidth: 5,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 18,
    marginVertical: 10,
  },
});
