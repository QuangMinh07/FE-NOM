import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Dimensions, Platform, StatusBar, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Swipeable } from "react-native-gesture-handler";
import { api, typeHTTP } from "../../utils/api"; // Import API module
import { globalContext } from "../../context/globalContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const ChatSellerScreen = () => {
  const [branches, setBranches] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mainStore, setMainStore] = useState(null);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { globalData } = useContext(globalContext);
  const navigation = useNavigation(); // Use navigation for navigating to HomeSeller

  const storeId = globalData.storeData?._id;

  const checkStoreStatus = useCallback(async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/store/check-store-open/${storeId}`,
        sendToken: true,
      });

      console.log("Response check-store-open:", response);

      if (response && response.isOpen !== undefined) {
        setIsOpen(response.isOpen); // true nếu cửa hàng đang mở, false nếu đã đóng
      }
    } catch (error) {
      // console.error("Lỗi khi kiểm tra trạng thái cửa hàng:", error);
    }
  }, [globalData.storeData?._id]);

  // Hàm lấy thông tin cửa hàng từ API
  const fetchStoreData = async () => {
    try {
      // Lấy thông tin cửa hàng chính
      const response = await api({
        method: typeHTTP.GET,
        url: `/store/get-store/${storeId}`, // Endpoint để lấy thông tin cửa hàng theo storeId
        sendToken: true,
      });
      console.log("MainStore", response.data);

      if (response && response.data) {
        setMainStore(response.data);
        checkStoreStatus();
      } else {
        console.error("Không có dữ liệu cửa hàng chính.");
      }
      // Chỉ gọi fetchBranches sau khi setMainStore xong
      if (response.data && response.data._id) {
        await fetchBranches();
      }
    } catch (error) {
      // console.error("Lỗi khi lấy dữ liệu cửa hàng:", error.message);
    }
  };

  // Gọi API khi màn hình load
  useEffect(() => {
    if (!storeId) {
      console.error("Không có storeId. Đảm bảo globalData đã được cập nhật.");
      return;
    }
    fetchStoreData();
  }, [storeId]); // Chỉ gọi fetchStoreData khi storeId đã được cập nhật

  // Hàm tạo cửa hàng chi nhánh mới
  const createNewBranch = async () => {
    if (!mainStore || !mainStore._id) {
      alert("Không tìm thấy thông tin cửa hàng chính. Vui lòng thử lại.");
      return;
    }

    if (branches.length >= 3) {
      alert("Bạn chỉ được tạo tối đa 3 cửa hàng chi nhánh!");
      return;
    }

    if (!newBranchName.trim() || !newBranchAddress.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      console.log("Parent Store ID:", mainStore?._id); // Debug ID của cửa hàng cha
      // Gọi API để tạo chi nhánh
      const response = await api({
        method: typeHTTP.POST,
        url: "/store/create-store", // Endpoint tạo chi nhánh
        body: {
          parentStoreId: mainStore._id, // ID cửa hàng cha
          branchName: newBranchName.trim(),
          branchAddress: newBranchAddress.trim(),
        },
        sendToken: true, // Đảm bảo gửi token xác thực nếu cần
      });

      console.log("API Response:", response); // Log phản hồi từ API

      // Kiểm tra đúng đối tượng `response.data.branch`
      if (response && response.branch) {
        console.log("Branch creation successful");
        setNewBranchName("");
        setNewBranchAddress("");
        setIsModalVisible(false);
        alert("Chi nhánh mới đã được tạo thành công!");

        await fetchBranches();
      } else {
        // console.error("Phản hồi không chứa dữ liệu chi nhánh hợp lệ:", response);
        alert(response.message || "Không thể tạo chi nhánh. Vui lòng thử lại.");
      }
    } catch (error) {
      // console.error("Lỗi khi tạo chi nhánh:", error.message || error);
      alert(error?.response?.data?.message || "Đã xảy ra lỗi khi tạo chi nhánh. Vui lòng thử lại.");
    }
  };

  const fetchBranches = useCallback(async () => {
    if (!mainStore || !mainStore._id) {
      // console.error("Không tìm thấy thông tin cửa hàng chính.");
      return; // Ngừng hàm nếu không có mainStore
    }

    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/store/get-branch/${mainStore._id}`, // Endpoint để lấy danh sách chi nhánh
        sendToken: true,
      });

      console.log("Full API Response:", response); // Log toàn bộ phản hồi từ API

      if (response && response.branches) {
        console.log("Fetched Branches:", response.branches);
        setBranches(response.branches); // Cập nhật danh sách chi nhánh
      } else {
        console.error("API không trả về danh sách chi nhánh.");
      }
    } catch (error) {
      // console.error("Lỗi khi lấy danh sách chi nhánh:", error.message || error);
    }
  }, [mainStore?._id]); // Phụ thuộc vào `mainStore._id` để đảm bảo hàm được gọi lại khi thay đổi

  useFocusEffect(
    useCallback(() => {
      fetchBranches(); // Gọi kiểm tra ngay khi màn hình được focus
    }, [fetchBranches])
  );

  // Dùng useFocusEffect để kiểm tra trạng thái khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      checkStoreStatus(); // Gọi kiểm tra ngay khi màn hình được focus
    }, [checkStoreStatus])
  );

  useEffect(() => {
    if (mainStore) {
      fetchBranches();
    }
  }, [mainStore]); // Gọi `fetchBranches` chỉ khi `mainStore` đã được cập nhật

  // Hàm xóa cửa hàng chi nhánh
  const deleteBranch = async (id) => {
    try {
      const response = await api({
        method: typeHTTP.DELETE,
        url: `/store/delete-branch/${mainStore._id}/${id}`, // Gọi API xóa cửa hàng con
        sendToken: true, // Gửi token xác thực
      });

      // Kiểm tra phản hồi và cập nhật lại danh sách chi nhánh sau khi xóa
      if (response.success) {
        // Cập nhật lại danh sách chi nhánh
        const filteredBranches = branches.filter((branch) => branch._id !== id);
        setBranches(filteredBranches); // Cập nhật state branches
        alert("Chi nhánh đã được xóa thành công!");
      } else {
        alert("Không thể xóa chi nhánh. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa cửa hàng chi nhánh:", error.message);
      alert("Đã xảy ra lỗi khi xóa chi nhánh. Vui lòng thử lại.");
    }
  };

  // const navigateToBranch = (branch) => {
  //   console.log("Navigating to HomeSeller with branch:", branch);
  //   navigation.push("HomeSeller", { selectedBranch: branch }); // Đổi key thành selectedBranch
  // };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#E53935",
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          height: height * 0.17,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Quản lý chi nhánh
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            if (branches.length > 3) {
              alert("Bạn chỉ được tạo tối đa 3 cửa hàng chi nhánh!");
            } else {
              setIsModalVisible(true);
            }
          }}
        >
          <Ionicons name="add" size={18} color="#E53935" />
        </TouchableOpacity>
      </View>
      {/* Cửa hàng chính */}
      {mainStore && (
        <View
          style={{
            backgroundColor: "#fff",
            marginHorizontal: 20,
            padding: 15,
            borderRadius: 10,
            marginTop: -20,
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 }}>{mainStore.storeName}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "#666" }}>Địa chỉ:</Text>
            <Text style={{ fontSize: 14, color: "#333", textAlign: "right", flex: 1 }}>{mainStore.storeAddress}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
            <Text style={{ fontSize: 14, color: "#666" }}>Đánh giá:</Text>
            <Text style={{ fontSize: 14, color: "#333", textAlign: "right", flex: 1 }}>{mainStore.averageRating} ⭐</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
            <Text style={{ fontSize: 14, color: "#666" }}>Trạng thái:</Text>
            <Text
              style={{
                fontSize: 14,
                color: isOpen ? "#4CAF50" : "#F44336",
                textAlign: "right",
                flex: 1,
              }}
            >
              {isOpen ? "Hoạt động" : "Đã đóng"}
            </Text>
          </View>
        </View>
      )}
      {/* Danh sách chi nhánh */}
      <FlatList
        data={branches} // Hiển thị danh sách chi nhánh từ trạng thái
        keyExtractor={(item) => item._id.toString()} // Sử dụng _id làm key
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <TouchableOpacity
                style={{
                  backgroundColor: "#F44336",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 90,
                  height: "92%",
                  borderRadius: 5,
                }}
                onPress={() => {
                  Alert.alert("Xác nhận xóa", `Bạn có chắc muốn xóa ${item.storeName}?`, [
                    { text: "Hủy", style: "cancel" },
                    { text: "Xóa", onPress: () => deleteBranch(item._id) }, // Gọi hàm deleteBranch khi nhấn Xóa
                  ]);
                }}
              >
                <Ionicons name="trash-outline" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          >
            <View
              style={{
                backgroundColor: "#fff",
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#ddd",
                marginHorizontal: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 }}>{item.storeName}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "#666" }}>Địa chỉ:</Text>
                <Text style={{ fontSize: 14, color: "#333", textAlign: "right", flex: 1 }}>{item.storeAddress}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                <Text style={{ fontSize: 14, color: "#666" }}>Đánh giá:</Text>
                <Text style={{ fontSize: 14, color: "#333", textAlign: "right", flex: 1 }}>{item.averageRating || "Chưa có"} ⭐</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                <Text style={{ fontSize: 14, color: "#666" }}>Trạng thái:</Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: item.isOpen ? "#4CAF50" : "#F44336",
                    textAlign: "right",
                    flex: 1,
                  }}
                >
                  {item.isOpen ? "Hoạt động" : "Đã đóng"}
                </Text>
              </View>
            </View>
          </Swipeable>
        )}
        contentContainerStyle={{ paddingTop: 10 }}
      />

      {/* Modal thêm cửa hàng */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsModalVisible(false);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={{
                  width: "90%",
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Thêm chi nhánh mới</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 10,
                    backgroundColor: "#fff",
                  }}
                  placeholder="Tên chi nhánh"
                  value={newBranchName}
                  onChangeText={setNewBranchName}
                />
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 10,
                    backgroundColor: "#fff",
                  }}
                  placeholder="Địa chỉ chi nhánh"
                  value={newBranchAddress}
                  onChangeText={setNewBranchAddress}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#E53935",
                    paddingVertical: 15,
                    borderRadius: 10,
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  onPress={createNewBranch}
                >
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ChatSellerScreen;
