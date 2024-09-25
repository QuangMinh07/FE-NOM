import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, Image, Switch, TouchableOpacity, Modal, Pressable, StyleSheet, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons"; // Import icon library
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Import API functions
import { globalContext } from "../../context/globalContext"; // Import GlobalContext

export default function DishDetails() {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(""); // Lưu trữ nhóm món đã chọn
  const [isEditMode, setIsEditMode] = useState(false); // Trạng thái chỉnh sửa
  const [sellingTime, setSellingTime] = useState("08:00 - 20:00"); // Thời gian bán
  const navigation = useNavigation();
  const route = useRoute();
  const { foodId } = route.params || {}; // Đảm bảo nhận được foodId từ route params
  console.log("Received foodId:", foodId); // Kiểm tra giá trị foodId

  const [foodDetails, setFoodDetails] = useState(null); // State để lưu thông tin món ăn

  const { globalData } = useContext(globalContext); // Lấy dữ liệu từ GlobalContext
  const storeId = globalData.storeData?._id; // Lấy storeId từ GlobalContext

  // Hàm lấy thông tin món ăn từ API
  const getFoodDetails = async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/food/get-food/${foodId}`, // Gọi API với foodId
        sendToken: true,
      });
      console.log("Food details response:", response); // Kiểm tra phản hồi API

      if (response && response.data && response.data.food) {
        setFoodDetails(response.data.food); // Lưu chi tiết món ăn vào state
      } else {
        Alert.alert("Lỗi", "Không thể lấy thông tin món ăn.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy thông tin món ăn.");
    }
  };

  // Gọi hàm getFoodDetails khi component được mount
  useEffect(() => {
    getFoodDetails(); // Lấy chi tiết món ăn khi nhận được foodId
  }, [foodId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
    setModalVisible(false);
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
    setModalVisible(false);
  };

  const foodGroups = ["Canh", "Tráng miệng", "Món chính", "Nước"]; // Danh sách nhóm món ăn

  // Hàm gọi API thêm món ăn mới
  const addFoodItem = async () => {
    if (!storeId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin cửa hàng");
      return;
    }

    try {
      const body = {
        storeId,
        foodName,
        price: parseFloat(price),
        description,
        imageUrl: image || null,
        foodGroup: selectedGroup,
        isAvailable,
        sellingTime, // Lưu thời gian bán
      };

      const response = await api({
        method: typeHTTP.POST,
        url: "/food/add-food",
        body,
        sendToken: true,
      });

      if (response) {
        Alert.alert("Thành công", "Món ăn đã được thêm!");
        navigation.navigate("ListFood");
      } else {
        Alert.alert("Lỗi", "Không thể thêm món ăn.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra trong quá trình thêm món ăn.");
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
            <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
              <Feather name="edit" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Food Name and Price */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên món</Text>
            <TextInput
              style={styles.input}
              placeholder="Cơm tấm sườn"
              value={foodDetails ? foodDetails.foodName : ""}
              onChangeText={setFoodName}
              editable={isEditMode}
            />

            <Text style={[styles.label, { marginTop: 10 }]}>Giá món ăn</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập giá"
              value={foodDetails ? foodDetails.price.toString() : ""}
              onChangeText={setPrice}
              keyboardType="numeric"
              editable={isEditMode}
            />

            <Text style={[styles.label, { marginTop: 10 }]}>Ảnh món ăn</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={() => isEditMode && setModalVisible(true)}>
              {foodDetails && foodDetails.imageUrl ? (
                <Image source={{ uri: foodDetails.imageUrl }} style={styles.image} />
              ) : (
                <Text style={{ color: "#ccc", fontSize: 16 }}>Chọn ảnh món ăn</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mô tả món ăn</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              placeholder="Mô tả món ăn"
              value={foodDetails ? foodDetails.description : ""}
              onChangeText={setDescription}
              editable={isEditMode}
            />
          </View>

          {/* Group and Availability */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Nhóm món</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => isEditMode && setGroupModalVisible(true)}
            >
              <Text>{selectedGroup || "Chọn"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Còn món</Text>
            <Switch
              value={foodDetails ? foodDetails.isAvailable : false}
              onValueChange={setIsAvailable}
              thumbColor={isAvailable ? "#ffff" : "#ffff"}
              trackColor={{ false: "#ffff", true: "#E53935" }}
              disabled={!isEditMode}
            />
          </View>

          {/* Time Selling */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Thời gian bán</Text>
            <TouchableOpacity onPress={() => isEditMode && navigation.navigate("TimeScheduleSell")} style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>
                {foodDetails && foodDetails.sellingTime
                  ? foodDetails.sellingTime.map((timeSlot, index) => (
                      <Text key={index}>{`${timeSlot.start} - ${timeSlot.end}`}</Text>
                    ))
                  : "Chưa có thời gian bán"}
              </Text>
              {isEditMode && <AntDesign name="right" size={16} color="black" style={{ marginLeft: 5 }} />}
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          {isEditMode && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.buttonText}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addFoodItem}>
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Modal for Image Upload */}
          <Modal transparent={true} animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
              <Pressable style={styles.modalContent} onPress={() => {}}>
                <Text style={styles.modalTitle}>Chọn ảnh</Text>
                <TouchableOpacity onPress={pickImage}>
                  <Text style={styles.modalOption}>Chọn ảnh từ thư viện</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto}>
                  <Text style={styles.modalOption}>Chụp ảnh</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>

          {/* Modal for Group Selection */}
          <Modal transparent={true} animationType="slide" visible={groupModalVisible} onRequestClose={() => setGroupModalVisible(false)}>
            <Pressable style={styles.modalBackground} onPress={() => setGroupModalVisible(false)}>
              <Pressable style={styles.modalContent} onPress={() => {}}>
                <Text style={styles.modalTitle}>Chọn nhóm món</Text>
                {foodGroups.map((group, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedGroup(group);
                      setGroupModalVisible(false);
                    }}
                    style={{ paddingVertical: 10 }}
                  >
                    <Text style={styles.modalOption}>{group}</Text>
                  </TouchableOpacity>
                ))}
              </Pressable>
            </Pressable>
          </Modal>
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
    width: "100%",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 20,
    width: 100,
    alignItems: "center",
    elevation: 5,
  },
  saveButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 20,
    width: 100,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
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
