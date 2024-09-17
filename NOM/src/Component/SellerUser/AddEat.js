import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Image, Switch, TouchableOpacity, Modal, Pressable, StyleSheet, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { AntDesign } from '@expo/vector-icons';  // Import icon library
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api";  // Import API functions
import { globalContext } from "../../context/globalContext"; // Import GlobalContext

export default function AddEat() {
  const [foodName, setFoodName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(''); // Lưu trữ nhóm món đã chọn
  const navigation = useNavigation();

  const { globalData } = useContext(globalContext); // Lấy dữ liệu từ GlobalContext

  // Lấy storeId từ globalData
  const storeId = globalData.storeData?._id; // Lấy storeId từ GlobalContext

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

  const foodGroups = ['Canh', 'Tráng miệng', 'Món chính', 'Nước']; // Danh sách nhóm món ăn

  // Hàm gọi API thêm món ăn mới
  const addFoodItem = async () => {
    if (!storeId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin cửa hàng");
      return;
    }

    try {
      const body = {
        storeId, // Sử dụng storeId từ GlobalContext
        foodName,
        price: parseFloat(price), // Chuyển giá thành số
        description,
        imageUrl: image || null,  // Nếu không có ảnh thì truyền null
        foodGroup: selectedGroup,
        isAvailable,
        sellingTime: "08:00 - 20:00", // Bạn có thể tùy chỉnh thời gian bán
      };

      const response = await api({
        method: typeHTTP.POST,
        url: "/food/add-food",  // URL của API thêm món ăn
        body,
        sendToken: true, // Gửi token trong header
      });

      if (response) {
        Alert.alert("Thành công", "Món ăn đã được thêm!");
        navigation.navigate("ListFood");  // Điều hướng về danh sách món ăn
      } else {
        Alert.alert("Lỗi", "Không thể thêm món ăn.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra trong quá trình thêm món ăn.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding" // Tự động đẩy nội dung lên khi bàn phím mở
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate("ListFood")} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="arrowleft" size={24} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.headerText}>Thêm món ăn</Text>
            </TouchableOpacity>
          </View>

          {/* Food Name and Price */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên món</Text>
            <TextInput
              style={styles.input}
              placeholder="Cơm tấm sườn"
              value={foodName}
              onChangeText={setFoodName}
            />

            <Text style={[styles.label, { marginTop: 10 }]}>Giá món ăn</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập giá"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric" // Chỉ cho phép nhập số
            />

            <Text style={[styles.label, { marginTop: 10 }]}>Ảnh món ăn</Text>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={() => setModalVisible(true)}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <Text style={{ color: '#ccc', fontSize: 16 }}>Chọn ảnh món ăn</Text>
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
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Group and Availability */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Nhóm món</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setGroupModalVisible(true)} // Hiển thị modal chọn nhóm
            >
              <Text>{selectedGroup || 'Chọn'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Còn món</Text>
            <Switch value={isAvailable} onValueChange={setIsAvailable} />
          </View>

          {/* Time Selling */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Thời gian bán</Text>
            <TouchableOpacity onPress={() => navigation.navigate("TimeScheduleSell")} style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                onPress={() => { }} // Prevent closing when tapping inside
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
                onPress={() => { }} // Prevent closing when tapping inside
              >
                <Text style={styles.modalTitle}>Chọn nhóm món</Text>
                {foodGroups.map((group, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedGroup(group);
                      setGroupModalVisible(false); // Close modal after selecting group
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
    backgroundColor: '#E53935',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 140,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 15,  // Giảm khoảng cách giữa các thành phần
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    width: '100%',
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,  // Giảm khoảng cách giữa các phần tử
    paddingHorizontal: 20,
  },
  selectButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 120,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,  // Giảm khoảng cách giữa các nút
    paddingHorizontal: 20,
  },
  deleteButton: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 20,  // Thiết kế bo tròn giống như hình
    width: 100,
    alignItems: 'center',
    elevation: 5,  // Bóng đổ để tạo chiều sâu
  },
  saveButton: {
    backgroundColor: '#E53935',  // Màu đỏ cho cả hai nút
    padding: 10,
    borderRadius: 20,  // Thiết kế bo tròn giống như hình
    width: 100,
    alignItems: 'center',
    elevation: 5,  // Bóng đổ
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 18,
    marginVertical: 10,
  },
});
