import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Dimensions, SafeAreaView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { globalContext } from "../../context/globalContext";
import { api, typeHTTP } from "../../utils/api";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // Import thư viện mới
import styles from "./StyleSignUpShiper"; // Import styles từ file styles.js

export default function SignUpShiper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [shopRepresentative, setShopRepresentative] = useState("");
  const [cccd, setCCCD] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [temporaryAddress, setTemporaryAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const navigation = useNavigation();
  const { globalData } = useContext(globalContext);

  const handlePickAvatar = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri); // Lưu URI của ảnh đã chọn vào state
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      alert("Đã xảy ra lỗi khi chọn ảnh.");
    }
  };

  const uploadProfilePicture = async (userId, uri) => {
    const formData = new FormData();
    formData.append("image", {
      uri,
      type: "image/jpeg", // Hoặc image/png tùy vào định dạng ảnh
      name: "profilePicture.jpg", // Tên ảnh
    });

    try {
      const response = await api({
        method: typeHTTP.POST,
        url: `/upload/uploadProfilePicture/${userId}`, // Đường dẫn API để upload ảnh
        body: formData,
        sendToken: true, // Gửi token nếu cần
        isMultipart: true, // Multipart để gửi FormData
      });

      if (response && response.profilePictureURL) {
        return response.profilePictureURL; // Trả về URL ảnh đã upload
      } else {
        throw new Error("Upload ảnh thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      alert("Đã xảy ra lỗi khi upload ảnh.");
      throw error;
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (selectedDate) => {
    setDateOfBirth(selectedDate);
    hideDatePicker();
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return shopRepresentative && cccd && permanentAddress && temporaryAddress;
    } else if (currentStep === 2) {
      return dateOfBirth && vehicleNumber && bankAccount;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Vui lòng nhập đầy đủ thông tin.");
    }
  };

  const handleRegisterShipper = async () => {
    if (!isChecked) {
      alert("Vui lòng chấp nhận điều khoản trước khi tiếp tục.");
      return;
    }

    try {
      let imageUrl = avatar; // Lưu URL ảnh từ state `avatar`

      // Nếu người dùng chọn ảnh, upload ảnh trước khi đăng ký
      if (avatar) {
        imageUrl = await uploadProfilePicture(globalData.user?.id, avatar); // Gọi hàm upload ảnh
      }

      // Tạo body để gửi request API
      const body = {
        userId: globalData.user?.id, // Lấy userId từ globalContext
        fullName: shopRepresentative, // Họ và tên đại diện
        cccd, // CCCD/CMND
        address: permanentAddress, // Địa chỉ thường trú
        dateOfBirth: dateOfBirth, // Ngày sinh
        temporaryAddress, // Địa chỉ tạm trú
        bankAccount, // Số tài khoản ngân hàng
        vehicleNumber, // Mã số xe của shipper
        profilePictureURL: imageUrl, // URL ảnh đã upload
      };

      // Gọi API đăng ký Shipper
      const response = await api({
        method: typeHTTP.POST,
        url: "/user/register-shipper", // Endpoint của API backend
        body, // Body chứa thông tin từ form nhập liệu
        sendToken: true, // Gửi token nếu cần xác thực
      });

      if (response) {
        alert("Đăng ký Shipper thành công, chờ admin duyệt.");
        navigation.navigate("Login"); // Điều hướng về trang đăng nhập sau khi thành công
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký Shipper:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.");
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Thông tin cá nhân</Text>

      <Text style={styles.label}>Họ và Tên</Text>
      <TextInput style={styles.input} placeholder="Nhập họ và tên" value={shopRepresentative} onChangeText={setShopRepresentative} />

      <Text style={styles.label}>CCCD/CMND</Text>
      <TextInput style={styles.input} placeholder="Nhập CCCD/CMND" value={cccd} onChangeText={setCCCD} />

      <Text style={styles.label}>Địa chỉ thường trú</Text>
      <TextInput style={styles.input} placeholder="Nhập địa chỉ thường trú" value={permanentAddress} onChangeText={setPermanentAddress} />

      <Text style={styles.label}>Địa chỉ tạm trú</Text>
      <TextInput style={styles.input} placeholder="Nhập địa chỉ tạm trú" value={temporaryAddress} onChangeText={setTemporaryAddress} />

      <TouchableOpacity style={styles.button} onPress={handleNextStep}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Thông tin cá nhân</Text>

      {/* Ngày Tháng Năm Sinh */}
      <Text style={styles.label}>Ngày tháng năm sinh</Text>
      <View style={styles.dateRow}>
        <TextInput style={styles.dateInputField} placeholder="dd/mm/yyyy" value={dateOfBirth.toLocaleDateString("vi-VN")} editable={false} />
        <TouchableOpacity onPress={showDatePicker}>
          <View style={styles.iconContainer}>
            <Icon name="calendar-today" size={24} color="#E53935" />
          </View>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleDateConfirm} onCancel={hideDatePicker} confirmTextIOS="Xác nhận" cancelTextIOS="Hủy" />

      {/* Số Tài Khoản */}
      <Text style={styles.label}>Số Tài Khoản</Text>
      <TextInput style={styles.input} placeholder="Nhập số tài khoản" value={bankAccount} onChangeText={setBankAccount} />

      {/* Mã Số Xe */}
      <Text style={styles.label}>Mã số xe</Text>
      <TextInput style={styles.input} placeholder="Nhập mã số xe" value={vehicleNumber} onChangeText={setVehicleNumber} />

      {/* Ảnh Đại Diện */}
      <Text style={styles.label}>Ảnh đại diện</Text>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} resizeMode="cover" />
      ) : (
        <TouchableOpacity style={styles.avatarButton} onPress={handlePickAvatar}>
          <Text style={styles.buttonText}>Chọn ảnh đại diện</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={handleNextStep}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Điều khoản và Điều kiện Sử dụng</Text>

      <View style={styles.viewTerms}>
        <TouchableOpacity onPress={() => navigation.navigate("TermsDetails")}>
          <Text style={styles.linkText}>Xem chi tiết điều khoản</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.termsBox}>
        <Text style={styles.termsText}>1. Chấp nhận Điều khoản</Text>
        <Text style={styles.termsText}>2. Điều kiện Sử dụng</Text>
        <Text style={styles.termsText}>3. Quyền và Trách nhiệm của Người dùng</Text>
        <Text style={styles.termsText}>4. Bảo mật Thông tin</Text>
        <Text style={styles.termsText}>5. Sử dụng Dịch vụ</Text>
        <Text style={styles.termsText}>6. Thanh toán và Phí Dịch vụ</Text>
        <Text style={styles.termsText}>7. Chính sách Hoàn tiền</Text>
        <Text style={styles.termsText}>8. Giới hạn Trách nhiệm</Text>
        <Text style={[styles.termsText, { fontWeight: "bold" }]}>11. Đồng ý và Tiếp tục</Text>
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
          <Icon name={isChecked ? "check-box" : "check-box-outline-blank"} size={24} color="#E53935" />
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Tôi đã đọc và đồng ý với điều khoản của ứng dụng</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegisterShipper} disabled={!isChecked}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProgressBar = () => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBar}>
        <TouchableOpacity onPress={() => setCurrentStep(1)}>
          <View style={[styles.progressDot, currentStep >= 1 && styles.activeDot]} />
        </TouchableOpacity>
        <View style={[styles.progressLine, currentStep >= 2 && styles.activeLine]} />
        <TouchableOpacity onPress={() => setCurrentStep(2)}>
          <View style={[styles.progressDot, currentStep >= 2 && styles.activeDot]} />
        </TouchableOpacity>
        <View style={[styles.progressLine, currentStep >= 3 && styles.activeLine]} />
        <TouchableOpacity onPress={() => setCurrentStep(3)}>
          <View style={[styles.progressDot, currentStep >= 3 && styles.activeDot]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          //   keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Điều chỉnh offset cho iOS
        >
          {/* Sử dụng thêm KeyboardAwareScrollView để đảm bảo cuộn hợp lý */}
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            // extraScrollHeight={Platform.OS === "android" ? 60 : 20}  // Điều chỉnh độ cuộn khi bàn phím hiện
          >
            <Image source={require("../../img/LOGOBLACK.png")} style={styles.banner} />
            {renderProgressBar()}
            {renderStep()}
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
