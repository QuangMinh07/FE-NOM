import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Sử dụng expo-image-picker
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";

const { width, height } = Dimensions.get("window");

// Hàm định dạng ngày theo DD/MM/YYYY
const formatDate = (date) => {
  const d = new Date(date);
  const day = `0${d.getDate()}`.slice(-2);
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Hàm chuyển đổi ngày từ định dạng DD/MM/YYYY thành Date object
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return new Date(`${year}-${month}-${day}`);
};

export default function UpdateInformation() {
  const { globalData } = useContext(globalContext);
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    state: "",
    profilePictureURL: null, // Để lưu URL ảnh sau khi tải lên thành công
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null); // Để lưu ảnh tạm trước khi tải lên

  useEffect(() => {
    fetchUserProfile();
    fetchUserPersonalInfo();
  }, []);

  // Hàm lấy dữ liệu hồ sơ người dùng
  const fetchUserProfile = async () => {
    try {
      const profileResponse = await api({
        method: typeHTTP.GET,
        url: "/user/profile",
        sendToken: true,
      });

      const userProfile = profileResponse.user;

      if (userProfile) {
        // Cập nhật dữ liệu profile người dùng
        setFormData((prevState) => ({
          ...prevState,
          fullName: userProfile.fullName || "",
          phone: userProfile.phoneNumber || "",
          email: userProfile.email || "",
        }));
      }
    } catch (error) {
      // Xử lý lỗi nếu cần, không cần hiện thông báo
    }
  };

  // Hàm lấy dữ liệu cá nhân của người dùng
  const fetchUserPersonalInfo = async () => {
    try {
      const personalInfoResponse = await api({
        method: typeHTTP.GET,
        url: "/userPersonal/personal-info",
        sendToken: true,
      });

      const userPersonalInfo = personalInfoResponse.userPersonalInfo;

      if (userPersonalInfo) {
        // Cập nhật dữ liệu cá nhân của người dùng
        setFormData((prevState) => ({
          ...prevState,
          dateOfBirth: formatDate(userPersonalInfo.dateOfBirth) || "",
          gender: userPersonalInfo.gender || "",
          state: userPersonalInfo.state || "",
          profilePictureURL: userPersonalInfo.profilePictureURL || null,
        }));
      }
    } catch (error) {
      // Xử lý lỗi nếu cần, không cần hiện thông báo
    }
  };

  const uploadImage = async (base64Image) => {
    try {
      const userId = globalData.user?.id;
      if (!userId) {
        Alert.alert("Lỗi", "Không tìm thấy userId.");
        return null;
      }

      if (!base64Image) {
        Alert.alert("Lỗi", "Dữ liệu Base64 của ảnh bị thiếu.");
        return null;
      }

      // Khởi tạo fullBase64Image với MIME type của ảnh
      const fullBase64Image = `data:image/png;base64,${base64Image}`; // Đảm bảo đúng định dạng

      // Gửi request POST đến API server
      const response = await api({
        method: typeHTTP.POST,
        url: `/upload/uploadBase64`,
        data: { imageBase64: fullBase64Image }, // Gửi đúng định dạng Base64
        sendToken: true,
      });

      if (response.success) {
        return response.url;
      } else {
        Alert.alert("Lỗi", "Tải lên ảnh thất bại.");
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải ảnh.");
      return null;
    }
  };

  // Chọn ảnh từ thư viện
  const openImageLibrary = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
        base64: true, // Lấy Base64 của ảnh
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageBase64 = result.assets[0].base64; // Lấy dữ liệu Base64 của ảnh
        console.log("Base64 from library:", selectedImageBase64); // Log Base64
        if (selectedImageBase64) {
          const uploadedImageUrl = await uploadImage(selectedImageBase64); // Upload ảnh base64
          if (uploadedImageUrl) {
            setFormData({ ...formData, profilePictureURL: uploadedImageUrl });
          } else {
            Alert.alert("Lỗi", "Tải lên ảnh thất bại.");
          }
        } else {
          Alert.alert("Lỗi", "Không thể lấy dữ liệu ảnh.");
        }
      } else {
        Alert.alert("Lỗi", "Không thể chọn ảnh.");
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn ảnh.");
    }
  };

  // Hàm để mở modal chọn ảnh hoặc camera
  const toggleModal = () => {
    setModalVisible((prev) => !prev); // Chỉ thay đổi trạng thái của modal khi người dùng tương tác
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.profilePictureURL;

      // Nếu có ảnh mới, tải ảnh lên trước
      if (image) {
        imageUrl = await uploadImage(image);
        if (!imageUrl) {
          Alert.alert("Lỗi", "Tải lên ảnh thất bại. Vui lòng thử lại.");
          return;
        }
      }

      // Cập nhật thông tin người dùng
      await api({
        method: typeHTTP.PUT,
        url: "/user/update",
        body: {
          phone: formData.phone,
          email: formData.email,
          fullName: formData.fullName,
        },
        sendToken: true,
      });

      // Cập nhật thông tin cá nhân
      await api({
        method: typeHTTP.PUT,
        url: "/userPersonal/update-personal-info",
        body: {
          dateOfBirth: parseDate(formData.dateOfBirth),
          gender: formData.gender,
          state: formData.state,
          profilePictureURL: imageUrl || "https://example.com/random-image.jpg",
        },
        sendToken: true,
      });

      Alert.alert("Thành công", "Cập nhật thông tin thành công!");
      navigation.navigate("InformationUser");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      Alert.alert("Lỗi", "Cập nhật thông tin thất bại.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{
              backgroundColor: "#E53935",
              height: height * 0.2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                position: "absolute",
                top: height * 0.15,
                width: width,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  borderRadius: (width * 0.2) / 2,
                  borderColor: "#E53935",
                  borderWidth: 2,
                  backgroundColor: "#fff",
                }}
              >
                {formData.profilePictureURL ? ( // Ưu tiên hiển thị ảnh đã tải lên từ profilePictureURL
                  <Image
                    source={{ uri: formData.profilePictureURL }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: (width * 0.2) / 2,
                    }}
                  />
                ) : image ? ( // Nếu không có URL, hiển thị ảnh từ state image
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: (width * 0.2) / 2,
                    }}
                  />
                ) : (
                  // Nếu không có ảnh nào, hiển thị chữ Avatar
                  <Text style={{ textAlign: "center", marginTop: 40 }}>
                    Avatar
                  </Text>
                )}

                <TouchableOpacity
                  style={{ position: "absolute", bottom: -10, right: -10 }}
                  onPress={toggleModal}
                >
                  <Text>🖼️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Modal để chọn tải ảnh hoặc chụp ảnh */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal} // Chỉ đóng modal khi người dùng yêu cầu
          >
            <Pressable
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền tối cho modal
              }}
              onPress={toggleModal} // Đóng modal khi bấm ra ngoài
            >
              <Pressable
                style={{
                  width: width * 0.8,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 20,
                  alignItems: "center",
                }}
                onPress={(e) => e.stopPropagation()} // Ngăn không cho đóng modal khi bấm vào bên trong modal
              >
                <Text style={{ fontSize: 18, marginBottom: 20 }}>
                  Chọn ảnh đại diện
                </Text>
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
                    openCamera(); // Mở camera
                    toggleModal(); // Đóng modal sau khi camera được mở
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>Chụp ảnh</Text>
                </TouchableOpacity>

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
                    openImageLibrary(); // Mở thư viện ảnh
                    toggleModal(); // Đóng modal sau khi thư viện ảnh được mở
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    Chọn từ thư viện
                  </Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>

          {/* Form nhập thông tin */}
          <View
            style={{
              padding: width * 0.05,
              marginTop: height * 0.05,
            }}
          >
            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>
              Tên người dùng
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E53935",
                padding: 10,
                borderRadius: 8,
                marginBottom: 15,
              }}
              value={formData.fullName}
              onChangeText={(value) => handleInputChange("fullName", value)}
            />

            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>
              Số điện thoại
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E53935",
                padding: 10,
                borderRadius: 8,
                marginBottom: 15,
              }}
              value={formData.phone}
              keyboardType="phone-pad"
              onChangeText={(value) => handleInputChange("phone", value)}
            />

            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>
              Email
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E53935",
                padding: 10,
                borderRadius: 8,
                marginBottom: 15,
              }}
              value={formData.email}
              keyboardType="email-address"
              onChangeText={(value) => handleInputChange("email", value)}
            />

            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>
              Ngày sinh
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E53935",
                padding: 10,
                borderRadius: 8,
                marginBottom: 15,
              }}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange("dateOfBirth", value)}
            />

            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>
              Giới tính
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E53935",
                padding: 10,
                borderRadius: 8,
                marginBottom: 15,
              }}
              value={formData.gender}
              onChangeText={(value) => handleInputChange("gender", value)}
            />

            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>
              Trạng thái
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E53935",
                padding: 10,
                borderRadius: 8,
                marginBottom: 15,
              }}
              value={formData.state}
              onChangeText={(value) => handleInputChange("state", value)}
            />

            <TouchableOpacity
              style={{
                backgroundColor: "#E53935",
                padding: 15,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 20,
              }}
              onPress={handleSubmit}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
