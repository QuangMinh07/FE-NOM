import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { globalContext } from "../../context/globalContext";
import { api, typeHTTP } from "../../utils/api";
import styles from "./SignUpSellerStyles";

export default function SignUpSeller() {
  const [currentStep, setCurrentStep] = useState(1); // Quản lý bước hiện tại
  const [shopRepresentative, setShopRepresentative] = useState("");
  const [cccd, setCCCD] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [businessType, setBusinessType] = useState(""); // Loại hình kinh doanh
  const [shopName, setShopName] = useState("");
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]); // Lưu loại món ăn đã chọn
  const [bankAccount, setBankAccount] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal trạng thái cho Loại kinh doanh
  const [isFoodModalVisible, setIsFoodModalVisible] = useState(false); // Modal trạng thái cho Loại món ăn
  const navigation = useNavigation();

  const { globalData } = useContext(globalContext);

  const businessTypes = [
    { id: "1", label: "Hộ kinh doanh/cá nhân" },
    { id: "2", label: "Công ty trách nhiệm hữu hạn" },
    { id: "3", label: "Công ty cổ phần" },
    { id: "4", label: "Doanh nghiệp tư nhân" },
  ];

  const foodTypes = [
    { id: "1", label: "Món chính" },
    { id: "2", label: "Ăn kèm" },
    { id: "3", label: "Đồ uống" },
    { id: "4", label: "Tráng miệng" },
    { id: "5", label: "Món chay" },
    { id: "6", label: "Combo" },
  ];

  // Hàm chọn loại hình kinh doanh và đóng Modal
  const handleSelectBusinessType = (type) => {
    setBusinessType(type); // Cập nhật loại kinh doanh đã chọn
    setIsModalVisible(false); // Đóng Modal
  };

  // Hàm chọn hoặc bỏ chọn loại món ăn và đóng Modal
  const handleSelectFoodType = (type) => {
    if (selectedFoodTypes.includes(type)) {
      setSelectedFoodTypes(selectedFoodTypes.filter((item) => item !== type)); // Bỏ chọn món
    } else {
      setSelectedFoodTypes([...selectedFoodTypes, type]); // Chọn thêm món
    }
  };

  // Kiểm tra dữ liệu của bước hiện tại
  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return shopRepresentative && cccd && storeAddress && businessType;
    } else if (currentStep === 2) {
      return shopName && selectedFoodTypes.length > 0 && bankAccount;
    }
    return true;
  };

  // Hàm để chuyển sang bước tiếp theo
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Vui lòng nhập đầy đủ thông tin.");
    }
  };

  const handleRegisterSeller = async () => {
    if (!isChecked) {
      alert("Vui lòng chấp nhận điều khoản trước khi tiếp tục.");
      return;
    }

    try {
      const body = {
        userId: globalData.user?.id,
        representativeName: shopRepresentative,
        cccd,
        storeName: shopName,
        foodType: selectedFoodTypes.join(", "), // Gửi danh sách món ăn đã chọn
        businessType,
        bankAccount,
        storeAddress,
        idImage: null,
      };

      console.log("User ID:", globalData.user?.id);
      console.log("Request body:", body);

      const response = await api({
        method: typeHTTP.POST,
        url: "/user/register-seller",
        body,
        sendToken: true,
      });

      if (response) {
        alert("Đăng ký người bán thành công, chờ admin duyệt");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký người bán:", error);

      // Trích xuất thông báo lỗi từ phản hồi của backend
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.");
      }
    }
  };

  // Hàm để render từng bước
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

  // Bước 1
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Thông tin cửa hàng</Text>

      <Text style={styles.label}>Tên người đại diện</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên người đại diện"
        value={shopRepresentative}
        onChangeText={setShopRepresentative}
      />

      <Text style={styles.label}>CCCD/CMND</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập CCCD/CMND"
        value={cccd}
        onChangeText={setCCCD}
      />

      <Text style={styles.label}>Địa chỉ cửa hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ cửa hàng"
        value={storeAddress}
        onChangeText={setStoreAddress}
      />

      <Text style={styles.label}>Loại kinh doanh</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsModalVisible(true)}
      >
        <Text>{businessType || "Chọn loại kinh doanh"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleNextStep}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

      {/* Modal chọn loại kinh doanh */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn loại kinh doanh</Text>
            <FlatList
              data={businessTypes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectBusinessType(item.label)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );

  // Bước 2
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Thông tin cửa hàng</Text>

      <Text style={styles.label}>Tên cửa hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên cửa hàng"
        value={shopName}
        onChangeText={setShopName}
      />

      <Text style={styles.label}>Loại món ăn</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsFoodModalVisible(true)}
      >
        <Text>
          {selectedFoodTypes.length > 0
            ? selectedFoodTypes.join(", ")
            : "Chọn loại món ăn"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Tài khoản ngân hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tài khoản ngân hàng"
        value={bankAccount}
        onChangeText={setBankAccount}
      />

      <TouchableOpacity style={styles.button} onPress={handleNextStep}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>

      {/* Modal chọn loại món ăn */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFoodModalVisible}
        onRequestClose={() => setIsFoodModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setIsFoodModalVisible(false)} // Đóng modal khi nhấn bên ngoài
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn loại món ăn</Text>
            <FlatList
              data={foodTypes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectFoodType(item.label)}
                >
                  <Text
                    style={{
                      color: selectedFoodTypes.includes(item.label)
                        ? "red"
                        : "black",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  // Bước 3: Điều khoản sử dụng
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Điều khoản và Điều kiện Sử dụng</Text>

      <View style={styles.viewTerms3}>
        <TouchableOpacity onPress={() => navigation.navigate("TermsDetails")}>
          <Text style={styles.linkText3}>Xem chi tiết điều khoản</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.termsBox3}>
        <Text style={styles.termsText3}>1. Chấp nhận Điều khoản</Text>
        <Text style={styles.termsText3}>2. Điều kiện Sử dụng</Text>
        <Text style={styles.termsText3}>
          3. Quyền và Trách nhiệm của Người dùng
        </Text>
        <Text style={styles.termsText3}>4. Bảo mật Thông tin</Text>
        <Text style={styles.termsText3}>5. Sử dụng Dịch vụ</Text>
        <Text style={styles.termsText3}>6. Thanh toán và Phí Dịch vụ</Text>
        <Text style={styles.termsText3}>7. Chính sách Hoàn tiền</Text>
        <Text style={styles.termsText3}>8. Giới hạn Trách nhiệm</Text>
        <Text style={[styles.termsText3, { fontWeight: "bold" }]}>
          11. Đồng ý và Tiếp tục
        </Text>
      </View>

      {/* Checkbox điều khoản */}
      <View style={styles.checkboxContainer3}>
        <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
          <Icon
            name={isChecked ? "check-box" : "check-box-outline-blank"}
            size={24}
            color="#E53935"
          />
        </TouchableOpacity>
        <Text style={styles.checkboxLabel3}>
          Tôi đã đọc và đồng ý với điều khoản của NOM
        </Text>
      </View>

      {/* Nút Đăng ký */}
      <TouchableOpacity
        style={[styles.button3]}
        onPress={handleRegisterSeller}
        disabled={!isChecked}
      >
        <Text style={styles.buttonText3}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSelectStep = (step) => {
    setCurrentStep(step);
  };

  const renderProgressBar = () => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBar}>
        <TouchableOpacity onPress={() => handleSelectStep(1)}>
          <View
            style={[styles.progressDot, currentStep >= 1 && styles.activeDot]}
          />
        </TouchableOpacity>
        <View
          style={[styles.progressLine, currentStep >= 2 && styles.activeLine]}
        />
        <TouchableOpacity onPress={() => handleSelectStep(2)}>
          <View
            style={[styles.progressDot, currentStep >= 2 && styles.activeDot]}
          />
        </TouchableOpacity>
        <View
          style={[styles.progressLine, currentStep >= 3 && styles.activeLine]}
        />
        <TouchableOpacity onPress={() => handleSelectStep(3)}>
          <View
            style={[styles.progressDot, currentStep >= 3 && styles.activeDot]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image
          source={require("../../img/LOGOBLACK.png")}
          style={styles.logo}
        />

        {renderProgressBar()}

        {renderStep()}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
