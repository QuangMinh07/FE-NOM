import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Image, Dimensions, Modal, Pressable, Alert, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { globalContext } from "../../context/globalContext";
import { api, typeHTTP } from "../../utils/api"; // Import API module

const { width, height } = Dimensions.get("window");

export default function ImagePickerScreen({ selectedImage, setSelectedImage }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { globalData } = useContext(globalContext); // Lấy storeId từ globalData

  useEffect(() => {
    const fetchStoreImage = async () => {
      const storeId = globalData.storeData?._id; // Lấy storeId từ globalData
      if (!storeId) {
        console.log("Không tìm thấy storeId trong globalData");
        return;
      }
      try {
        // Gọi API để lấy thông tin cửa hàng, bao gồm ảnh
        const response = await api({
          method: typeHTTP.GET,
          url: `/store/get-store/${storeId}`, // Đường dẫn đầy đủ tới API
          sendToken: true, // Gửi token để xác thực
        });

        // Truy cập đúng vào `imageURL` từ `response.data`
        const storeData = response.data;

        if (storeData && storeData.imageURL) {
          setSelectedImage(storeData.imageURL); // Lưu `imageURL` vào state để hiển thị ảnh
        } else {
          console.log("Không tìm thấy `imageURL` trong dữ liệu cửa hàng");
        }
      } catch (error) {
        // console.error("Lỗi khi lấy ảnh cửa hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    if (globalData.storeData?._id) {
      fetchStoreImage(); // Gọi API để lấy ảnh cửa hàng khi storeId thay đổi
    } else {
      setSelectedImage(null); // Reset ảnh khi không có storeId
      setLoading(false);
    }
  }, [globalData.storeData?._id]); // Theo dõi storeId để gọi lại API khi thay đổi

  const openImageLibrary = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
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
      closeEditModal();
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn ảnh.");
    } finally {
      // Đảm bảo modal luôn được đóng trong mọi trường hợp
      closeEditModal();
    }
  };

  // Hàm upload ảnh lên server
  const uploadImageToStore = async (imageUri) => {
    const storeId = globalData.storeData?._id; // Lấy storeId từ globalData
    if (!storeId) {
      Alert.alert("Lỗi", "storeId không tồn tại.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg", // hoặc "image/png" tùy thuộc vào loại ảnh
        name: "store_image.jpg",
      });

      // Gọi API để upload ảnh
      const response = await api({
        method: typeHTTP.POST,
        url: `/upload/uploadStoreImage/${storeId}`,
        body: formData,
        sendToken: true,
        isMultipart: true, // multipart yêu cầu cấu hình đặc biệt
      });

      if (response) {
        Alert.alert("Thành công", "Upload ảnh cửa hàng thành công!");
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
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            backgroundColor: "#E53935",
            height: height * 0.25,
            borderRadius: 10,
            marginBottom: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>Không có ảnh</Text>
        </View>
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

      {/* Modal chọn ảnh */}
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
