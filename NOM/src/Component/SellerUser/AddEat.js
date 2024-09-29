import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, Image, Switch, TouchableOpacity, Modal, Pressable, StyleSheet, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Import icon library
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Import API functions
import { globalContext } from "../../context/globalContext"; // Import GlobalContext

export default function AddEat() {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(""); // Lưu trữ nhóm món đã chọn
  const navigation = useNavigation();
  const [foodGroups, setFoodGroups] = useState([]); // State để lưu danh sách nhóm món

  const { globalData, globalHandler } = useContext(globalContext); // Lấy dữ liệu từ GlobalContext

  // Lấy storeId từ globalData
  const storeId = globalData.storeData?._id; // Lấy storeId từ GlobalContext

  const getFoodGroups = async () => {
    if (!storeId) {
      console.error("storeId không tồn tại");
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/foodgroup/getfood-groups/${storeId}`,
        sendToken: true, // Gửi token để xác thực
      });

      // Log toàn bộ phản hồi để kiểm tra cấu trúc
      console.log("Response from API:", response);

      // Kiểm tra nếu response và response.foodGroups tồn tại
      if (response && response.foodGroups) {
        console.log("Danh sách nhóm món từ MongoDB:", response.foodGroups);
        setFoodGroups(response.foodGroups); // Cập nhật state với danh sách nhóm món từ MongoDB
      } else {
        console.error("Không tìm thấy nhóm món hoặc dữ liệu không hợp lệ");
      }
    } catch (error) {
      // Kiểm tra xem error.response có tồn tại không
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
      } else {
        console.error("Lỗi không xác định:", error.message);
      }
    }
  };

  useEffect(() => {
    getFoodGroups(); // Lấy danh sách nhóm món khi component được mount
  }, [storeId]); // Chỉ gọi khi storeData thay đổi

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Thêm tùy chọn này để lấy base64 của ảnh
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      if (selectedImage.base64) {
        setImage(selectedImage.base64); // Lưu dữ liệu base64 của ảnh
      } else {
        setImage(selectedImage.uri); // Nếu không có base64, lưu URI
      }
    }
    setModalVisible(false);
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Thêm tùy chọn này để lấy base64 của ảnh
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      if (selectedImage.base64) {
        setImage(selectedImage.base64); // Lưu dữ liệu base64 của ảnh
      } else {
        setImage(selectedImage.uri); // Nếu không có base64, lưu URI
      }
    }
    setModalVisible(false);
  };

  // Hàm gọi API thêm món ăn mới
  const addFoodItem = async () => {
    console.log("Global Data:", globalData); // Kiểm tra toàn bộ dữ liệu từ context
    console.log("Store ID:", storeId); // Kiểm tra giá trị của storeId

    if (!selectedGroup._id) {
      Alert.alert("Lỗi", "Vui lòng chọn nhóm món.");
      return;
    }

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
        imageUrl: null, // Luôn gắn imageUrl là null
        foodGroup: selectedGroup._id, // Sử dụng _id của nhóm món
        isAvailable,
        sellingTime: globalData.sellingTime || [], // Sử dụng sellingTime từ context
      };

      const response = await api({
        method: typeHTTP.POST,
        url: "/food/add-food",
        body,
        sendToken: true,
      });

      console.log("API response:", response);

      // Kiểm tra phản hồi API
      if (response && response.message === "Thêm món ăn thành công") {
        Alert.alert("Thành công", "Món ăn đã được thêm!");

        const newFoodItem = response.food;
        const updatedFoods = globalData.foods ? [...globalData.foods, newFoodItem] : [newFoodItem];

        console.log("Updated Foods trước khi set:", updatedFoods);

        // Cập nhật foods trong GlobalContext
        await globalHandler.setFoods(updatedFoods);

        // Điều hướng tới màn hình hiển thị danh sách món ăn
        navigation.navigate("ListFood", { reload: true });
      } else {
        Alert.alert("Lỗi", response.message || "Không thể thêm món ăn.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm món ăn:", error);
      if (error.response && error.response.data) {
        Alert.alert("Lỗi", error.response.data.message || "Có lỗi xảy ra trong quá trình thêm món ăn.");
      } else {
        Alert.alert("Lỗi", "Có lỗi xảy ra trong quá trình thêm món ăn.");
      }
    }
  };

  // // Hàm upload ảnh Base64 lên server
  // const uploadImage = async (base64Image) => {
  //   try {
  //     // Gửi request POST đến API server
  //     const response = await api({
  //       method: typeHTTP.POST,
  //       url: `/upload/uploadBase64`,
  //       headers: {
  //         "Content-Type": "application/json", // Đảm bảo đúng định dạng
  //       },
  //       data: { imageBase64: base64Image }, // Gửi đúng định dạng Base64
  //       sendToken: true,
  //     });

  //     if (response && response.url) {
  //       return response.url;
  //     } else {
  //       Alert.alert("Lỗi", response.message || "Tải lên ảnh thất bại.");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi tải ảnh:", error);
  //     if (error.response && error.response.data) {
  //       Alert.alert(
  //         "Lỗi",
  //         error.response.data.message || "Đã xảy ra lỗi khi tải ảnh."
  //       );
  //     } else {
  //       Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải ảnh.");
  //     }
  //     return null;
  //   }
  // };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate("ListFood")} style={{ flexDirection: "row", alignItems: "center" }}>
              <AntDesign name="arrowleft" size={24} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.headerText}>Thêm món ăn</Text>
            </TouchableOpacity>
          </View>

          {/* Food Name and Price */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên món</Text>
            <TextInput style={styles.input} placeholder="Cơm tấm sườn" value={foodName} onChangeText={setFoodName} />

            <Text style={[styles.label, { marginTop: 10 }]}>Giá món ăn</Text>
            <TextInput style={styles.input} placeholder="Nhập giá" value={price} onChangeText={setPrice} keyboardType="numeric" />

            <Text style={[styles.label, { marginTop: 10 }]}>Ảnh món ăn</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={() => setModalVisible(true)}>
              {image ? <Image source={image.startsWith("data:image") ? { uri: `data:image/png;base64,${image}` } : { uri: `data:image/png;base64,${image}` }} style={styles.image} /> : <Text style={{ color: "#ccc", fontSize: 16 }}>Chọn ảnh món ăn</Text>}
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mô tả món ăn</Text>
            <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="Mô tả món ăn" value={description} onChangeText={setDescription} />
          </View>

          {/* Group and Availability */}
          {/* Group and Availability */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Nhóm món</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setGroupModalVisible(true)} // Hiển thị modal chọn nhóm
            >
              <Text>{selectedGroup?.groupName || "Chọn"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Còn món</Text>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              thumbColor={isAvailable ? "#ffff" : "#ffff"} // Set thumb color
              trackColor={{ false: "#ffff", true: "#E53935" }} // Set track color
            />
          </View>

          {/* Time Selling */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Thời gian bán</Text>
            <TouchableOpacity onPress={() => navigation.navigate("TimeScheduleSell")} style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 16 }}>Tùy chỉnh</Text>
              <AntDesign name="right" size={16} color="black" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={addFoodItem}>
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
          </View>

          {/* Modal for Image Upload */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)} // for Android back button
          >
            <Pressable
              style={styles.modalBackground}
              onPress={() => setModalVisible(false)} // Close modal when tapping outside
            >
              <Pressable
                style={styles.modalContent}
                onPress={() => {}} // Prevent closing when tapping inside
              >
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
          {/* Modal for Group Selection */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={groupModalVisible}
            onRequestClose={() => setGroupModalVisible(false)} // for Android back button
          >
            <Pressable
              style={styles.modalBackground}
              onPress={() => setGroupModalVisible(false)} // Close modal when tapping outside
            >
              <Pressable
                style={styles.modalContent}
                onPress={() => {}} // Prevent closing when tapping inside
              >
                <Text style={styles.modalTitle}>Chọn nhóm món</Text>
                {foodGroups.map((group, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedGroup(group); // Lưu lại nhóm món đã chọn
                      setGroupModalVisible(false); // Đóng modal
                    }}
                    style={{ paddingVertical: 10 }}
                  >
                    <Text style={styles.modalOption}>{group.groupName}</Text>
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
    marginTop: 15, // Giảm khoảng cách giữa các thành phần
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
    marginVertical: 8, // Giảm khoảng cách giữa các phần tử
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
    marginVertical: 15, // Giảm khoảng cách giữa các nút
    paddingHorizontal: 20,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 20, // Thiết kế bo tròn giống như hình
    width: 100,
    alignItems: "center",
    elevation: 5, // Bóng đổ để tạo chiều sâu
  },
  saveButton: {
    backgroundColor: "#E53935", // Màu đỏ cho cả hai nút
    padding: 10,
    borderRadius: 20, // Thiết kế bo tròn giống như hình
    width: 100,
    alignItems: "center",
    elevation: 5, // Bóng đổ
  },
  buttonText: {
    color: "#fff",
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
