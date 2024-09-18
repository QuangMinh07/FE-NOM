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
    { id: "6", label: "Ăn vặt" },
    { id: "7", label: "Combo" },
    { id: "8", label: "Khác" },
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
        alert("Đăng ký người bán thành công!");
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#fff",
  },
  stepContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    color: "black",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E53935",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: "#E53935",
  },
  activeLine: {
    backgroundColor: "#E53935",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  viewTerms3: {
    marginVertical: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between", // Căn hai đầu cho text và icon
    paddingHorizontal: 20,
  },
  linkText3: {
    fontSize: 16,
    color: "#E53935",
    fontWeight: "bold", // Tăng độ đậm của chữ
    marginLeft: 150,
  },
  termsBox3: {
    padding: 20,
    borderColor: "#E53935", // Đường viền đỏ
    borderWidth: 2, // Độ dày đường viền
    backgroundColor: "#fff", // Nền trắng
    borderRadius: 10, // Bo tròn góc
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, // Tạo đổ bóng cho hộp
    shadowRadius: 5,
    elevation: 5, // Đổ bóng cho Android
  },
  termsText3: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18, // Giãn dòng cho dễ đọc
    marginBottom: 8,
  },
  checkboxContainer3: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20, // Căn chỉnh khoảng cách hai bên
  },
  checkboxLabel3: {
    fontSize: 14,
    marginLeft: 8,
    color: "#333",
    fontWeight: "600", // Tăng độ đậm cho text checkbox
  },
  button3: {
    backgroundColor: "#E53935",
    paddingVertical: 18,
    paddingHorizontal: 80, // Độ rộng nút lớn hơn
    borderRadius: 30, // Bo tròn nhiều hơn cho nút
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText3: {
    color: "#fff",
    fontSize: 20, // Tăng kích thước chữ của nút
    fontWeight: "bold",
  },
});
