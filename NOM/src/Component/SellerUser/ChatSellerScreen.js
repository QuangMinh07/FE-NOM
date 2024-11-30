import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Swipeable } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const ChatSellerScreen = () => {
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "Cơm tấm Tài",
      address: "123 Đường A, Quận 1",
      rating: 4.5,
      status: "Hoạt động",
    },
  ]);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hàm tạo cửa hàng chi nhánh mới
  const createNewBranch = () => {
    if (branches.length > 3) {
      alert("Bạn chỉ được tạo tối đa 3 cửa hàng chi nhánh!");
      return;
    }

    if (!newBranchName.trim() || !newBranchAddress.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newBranch = {
      id: branches.length + 1,
      // Thêm cấu trúc Tên cửa hàng chính + Tên chi nhánh mới
      name: `${branches[0].name} - ${newBranchName.trim()}`,
      address: newBranchAddress.trim(),
      rating: 0, // Không có đánh giá cho chi nhánh mới
      status: "Chưa hoạt động",
    };

    setBranches([...branches, newBranch]);
    setNewBranchName("");
    setNewBranchAddress("");
    setIsModalVisible(false); // Đóng modal sau khi tạo xong
  };

  // Hàm xóa cửa hàng chi nhánh
  const deleteBranch = (id) => {
    const filteredBranches = branches.filter((branch) => branch.id !== id);
    setBranches(filteredBranches);
  };

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
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 }}>
          {branches[0].name}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14, color: "#666" }}>Địa chỉ:</Text>
          <Text style={{ fontSize: 14, color: "#333", textAlign: "right", flex: 1 }}>
            {branches[0].address}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
          <Text style={{ fontSize: 14, color: "#666" }}>Đánh giá:</Text>
          <Text style={{ fontSize: 14, color: "#333", textAlign: "right", flex: 1 }}>
            {branches[0].rating} ⭐
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
          <Text style={{ fontSize: 14, color: "#666" }}>Trạng thái:</Text>
          <Text
            style={{
              fontSize: 14,
              color: branches[0].status === "Hoạt động" ? "#4CAF50" : "#F44336",
              textAlign: "right",
              flex: 1,
            }}
          >
            {branches[0].status}
          </Text>
        </View>
      </View>

      {/* Danh sách chi nhánh */}
      <FlatList
        data={branches.slice(1)} // Hiển thị các chi nhánh, không bao gồm cửa hàng chính
        keyExtractor={(item) => item.id.toString()}
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
                  Alert.alert(
                    "Xác nhận xóa",
                    `Bạn có chắc muốn xóa ${item.name}?`,
                    [
                      { text: "Hủy", style: "cancel" },
                      { text: "Xóa", onPress: () => deleteBranch(item.id) },
                    ]
                  );
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
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 }}>
                {item.name}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, color: "#666" }}>Địa chỉ:</Text>
                <Text style={{ fontSize: 14, color: "#333", textAlign: "right", flex: 1 }}>
                  {item.address}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                <Text style={{ fontSize: 14, color: "#666" }}>Đánh giá:</Text>
                <Text style={{ fontSize: 14, color: "#333", textAlign: "right", flex: 1 }}>
                  {item.rating || "Chưa có"} ⭐
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                <Text style={{ fontSize: 14, color: "#666" }}>Trạng thái:</Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: item.status === "Hoạt động" ? "#4CAF50" : "#F44336",
                    textAlign: "right",
                    flex: 1,
                  }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </Swipeable>
        )}
        contentContainerStyle={{ paddingTop: 10 }}
      />

      {/* Modal thêm cửa hàng */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
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
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                  Thêm chi nhánh mới
                </Text>
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
