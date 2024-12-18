import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Modal, Pressable, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Alert, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Sử dụng expo-image-picker
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";

const { width, height } = Dimensions.get("window");
const statusOptions = ["Kết Hôn", "Chưa Kết Hôn", "Khác"]; // Các tùy chọn cho trạng thái

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
  const isFocused = useIsFocused(); // Sử dụng useIsFocused để theo dõi trạng thái focus của màn hình
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
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho trạng thái tải
  const [isStatusModalVisible, setStatusModalVisible] = useState(false); // State để kiểm soát modal trạng thái

  // Hàm mở modal trạng thái
  const toggleStatusModal = () => {
    setStatusModalVisible((prev) => !prev);
  };

  const handleStatusSelect = (selectedStatus) => {
    setFormData({ ...formData, state: selectedStatus });
    toggleStatusModal(); // Đóng modal sau khi chọn
  };

  useEffect(() => {
    if (isFocused) {
      // Chỉ fetch dữ liệu khi màn hình được focus
      fetchUserProfile();
      fetchUserPersonalInfo();
    }
  }, [isFocused]); // Lắng nghe thay đổi của isFocused
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
        quality: 0.5, // Điều chỉnh chất lượng ảnh
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri; // Lấy URI của ảnh
        console.log("Image URI:", selectedImageUri);

        setImage(selectedImageUri); // Lưu URI ảnh vào state để hiển thị
      } else {
        Alert.alert("Lỗi", "Không thể chọn ảnh.");
      }
      toggleModal(); // Đóng modal sau khi chọn ảnh xong
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn ảnh.");
    }
  };

  const uploadProfilePicture = async (userId, uri) => {
    const formData = new FormData();
    formData.append("image", {
      uri,
      type: "image/jpeg", // hoặc image/png
      name: "profilePicture.jpg",
    });

    try {
      // Sử dụng hàm `api` để gọi API upload ảnh
      const response = await api({
        method: typeHTTP.POST,
        url: `/upload/uploadProfilePicture/${userId}`, // Endpoint API
        body: formData, // Gửi FormData
        sendToken: true, // Nếu cần gửi token trong header
        isMultipart: true, // Bật multipart để gửi FormData
      });

      if (response && response.profilePictureURL) {
        return response; // Trả về URL từ Cloudinary
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      // console.error("Lỗi khi upload ảnh:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi upload ảnh.");
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      // Kiểm tra tất cả các trường trước khi cập nhật
      if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.dateOfBirth.trim() || !formData.gender.trim() || !formData.state.trim()) {
        Alert.alert("Lỗi", "Tất cả các trường không được bỏ trống!");
        return;
      }

      setIsLoading(true); // Hiển thị vòng tròn loading khi bắt đầu submit
      let imageUrl = formData.profilePictureURL;

      if (image) {
        const uploadResult = await uploadProfilePicture(globalData.user.id, image);
        imageUrl = uploadResult.profilePictureURL;
      }

      await api({
        method: typeHTTP.PUT,
        url: "/user/update",
        body: {
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          fullName: formData.fullName.trim(),
        },
        sendToken: true,
      });

      await api({
        method: typeHTTP.PUT,
        url: "/userPersonal/update-personal-info",
        body: {
          dateOfBirth: parseDate(formData.dateOfBirth.trim()),
          gender: formData.gender.trim(),
          state: formData.state.trim(),
          profilePictureURL: imageUrl,
        },
        sendToken: true,
      });

      Alert.alert("Thành công", "Cập nhật thông tin thành công!");
      navigation.navigate("InformationUser");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || "Cập nhật thông tin thất bại.";
        // console.error("Lỗi từ backend:", error.response.data); // Log chi tiết
        Alert.alert("Lỗi", errorMessage); // Hiển thị Alert
      } else if (error.request) {
        // console.error("Lỗi từ yêu cầu gửi:", error.request); // Log lỗi request
        Alert.alert("Lỗi", "Không thể kết nối tới server.");
      } else {
        // console.error("Lỗi không xác định:", error.message); // Log lỗi không xác định
        Alert.alert("Lỗi", "Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setIsLoading(false); // Tắt vòng tròn loading sau khi xử lý xong
    }
  };

  // Hàm để mở modal chọn ảnh hoặc camera
  const toggleModal = () => {
    setModalVisible((prev) => !prev); // Chỉ thay đổi trạng thái của modal khi người dùng tương tác
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Hiển thị vòng tròn loading khi isLoading là true */}
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
                {image ? ( // Ưu tiên hiển thị ảnh từ URI đã chọn
                  <Image
                    source={{ uri: image }} // Sử dụng URI của ảnh đã chọn
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: (width * 0.2) / 2,
                    }}
                  />
                ) : formData.profilePictureURL ? ( // Nếu không có ảnh mới, hiển thị ảnh từ profilePictureURL
                  <Image
                    source={{ uri: formData.profilePictureURL }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: (width * 0.2) / 2,
                    }}
                  />
                ) : (
                  <Text style={{ textAlign: "center", marginTop: 40 }}>Avatar</Text>
                )}

                <TouchableOpacity style={{ position: "absolute", bottom: -10, right: -10 }} onPress={toggleModal}>
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
                    openImageLibrary(); // Mở thư viện ảnh
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>Chọn từ thư viện</Text>
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
            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>Tên người dùng</Text>
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

            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>Số điện thoại</Text>
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

            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>Email</Text>
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

            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>Ngày sinh</Text>
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

            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>Giới tính</Text>
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

            <Text style={{ fontSize: 16, color: "#333", marginBottom: 5 }}>Trạng thái</Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#E53935",
                padding: 10,
                borderRadius: 8,
                marginBottom: 15,
              }}
              onPress={toggleStatusModal}
            >
              <Text>{formData.state || "Chọn trạng thái"}</Text>
            </TouchableOpacity>

            {/* Modal chọn trạng thái */}
            <Modal visible={isStatusModalVisible} transparent animationType="slide" onRequestClose={toggleStatusModal}>
              <Pressable
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                onPress={toggleStatusModal}
              >
                <View
                  style={{
                    width: width * 0.8,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 20,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 20 }}>Chọn trạng thái</Text>
                  {statusOptions.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={{
                        padding: 10,
                        width: "100%",
                        alignItems: "center",
                        borderBottomWidth: 1,
                        borderBottomColor: "#ccc",
                      }}
                      onPress={() => handleStatusSelect(status)}
                    >
                      <Text style={{ fontSize: 16 }}>{status}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Pressable>
            </Modal>

            {/* Nút xác nhận */}
            <TouchableOpacity
              style={{
                backgroundColor: "#E53935",
                padding: 15,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 20,
              }}
              onPress={handleSubmit}
              disabled={isLoading} // Vô hiệu hóa nút khi đang tải
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
