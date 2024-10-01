import React, { useState, useContext } from "react";
import { View, TouchableOpacity, Image, Dimensions, Modal, Pressable, Alert, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalContext } from "../../context/globalContext";

const { width, height } = Dimensions.get("window");

export default function ImagePickerScreen({ selectedImage, setSelectedImage, storeId }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { globalData } = useContext(globalContext);

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
        setSelectedImage(selectedImageUri);

        // Gọi API upload ảnh sau khi chọn ảnh thành công
        await uploadImageToStore(selectedImageUri);
      } else {
        Alert.alert("Lỗi", "Không thể chọn ảnh.");
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn ảnh.");
    }
  };

  // Hàm upload ảnh lên server
  const uploadImageToStore = async (imageUri) => {
    try {
      const storeId = globalData.storeData?._id; // Lấy storeId từ globalData
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg", // hoặc "image/png" tùy thuộc vào loại ảnh
        name: "store_image.jpg",
      });

      const token = await AsyncStorage.getItem("auth_token");

      if (!token) {
        Alert.alert("Lỗi", "Token không tồn tại.");
        return;
      }

      const response = await axios.post(`http://192.168.1.213:5000/v1/upload/uploadStoreImage/${storeId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        Alert.alert("Thành công", "Upload ảnh cửa hàng thành công!");
      } else {
        Alert.alert("Lỗi", "Không thể upload ảnh.");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi upload ảnh.");
    }
  };

  const handleUploadPhoto = () => {
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ position: "relative" }}>
      {selectedImage ? (
        <Image
          source={{ uri: selectedImage }}
          style={{
            height: height * 0.25,
            borderRadius: 10,
            marginBottom: 10,
            width: "100%",
          }}
        />
      ) : (
        <View
          style={{
            backgroundColor: "#E53935",
            height: height * 0.25,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />
      )}

      {/* Nút tải ảnh lên */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 60,
          right: 30,
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 8,
          elevation: 5,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
        }}
        onPress={handleUploadPhoto}
      >
        <Icon name="cloud-upload" size={24} color="#E53935" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeEditModal}>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onPress={closeEditModal}
        >
          <Pressable
            style={{
              width: width * 0.8,
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Chọn ảnh đại diện</Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#E53935",
                padding: 10,
                borderRadius: 5,
                width: "100%",
                alignItems: "center",
                marginBottom: 10,
              }}
              onPress={() => {
                openImageLibrary();
                closeEditModal();
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Chọn từ thư viện</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
