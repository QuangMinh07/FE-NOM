import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Modal, Pressable, Alert } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons"; // Import icon library
import { Swipeable } from "react-native-gesture-handler";
import { api, typeHTTP } from "../../utils/api"; // Import API module
import { globalContext } from "../../context/globalContext";

export default function Staff() {
  const { globalData } = useContext(globalContext); // Sử dụng useContext để lấy globalData

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  const [modalVisible, setModalVisible] = useState(false); // Trạng thái mở/đóng modal
  const [editMode, setEditMode] = useState(false); // Chế độ chỉnh sửa
  const [selectedStaff, setSelectedStaff] = useState(null); // Nhân viên được chọn để chỉnh sửa
  const [newStaffName, setNewStaffName] = useState(""); // Lưu thông tin tên nhân viên mới
  const [newStaffPhone, setNewStaffPhone] = useState(""); // Lưu thông tin số điện thoại nhân viên mới
  const [swipeOpen, setSwipeOpen] = useState(false); // Trạng thái xem có đang vuốt không

  // Lấy storeId từ globalData
  const storeId = globalData?.storeData?._id;

  // Hàm gọi API lấy danh sách nhân viên
  const fetchStaffList = async () => {
    if (!storeId) {
      Alert.alert("Lỗi", "Không tìm thấy storeId");
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/staff/get-staff?storeId=${storeId}`, // Truyền storeId trong query params
        sendToken: true,
      });

      if (response && response.staff) {
        setStaffList(response.staff); // Cập nhật danh sách nhân viên vào state
      } else {
        Alert.alert("Lỗi", response.message);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách nhân viên.");
    } finally {
      setLoading(false); // Dừng trạng thái loading sau khi gọi API xong
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchStaffList(); // Gọi API để lấy danh sách nhân viên
  }, [storeId]);

  // Hàm chuyển đổi trạng thái nhân viên
  const toggleSwitch = async (index) => {
    const staff = staffList[index];
    const updatedIsActive = !staff.isActive;

    try {
      // Gọi API để cập nhật trạng thái isActive
      const response = await api({
        method: typeHTTP.PUT,
        url: `/staff/update-staff/${staff._id}`, // Gọi API cập nhật thông tin nhân viên
        body: {
          isActive: updatedIsActive, // Cập nhật trạng thái isActive
        },
        sendToken: true, // Nếu cần gửi token
      });

      if (response) {
        // Cập nhật danh sách nhân viên sau khi chỉnh sửa trạng thái
        setStaffList((prevStaffList) => {
          const updatedList = [...prevStaffList];
          updatedList[index].isActive = updatedIsActive; // Cập nhật trạng thái isActive trong danh sách
          return updatedList;
        });
      } else {
        Alert.alert("Lỗi", response.message);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái nhân viên.");
    }
  };

  // Hàm thêm nhân viên mới với gọi API
  const addNewStaff = async () => {
    if (newStaffName && newStaffPhone) {
      if (!storeId) {
        Alert.alert("Lỗi", "Không tìm thấy storeId");
        return;
      }

      try {
        // Gọi API để thêm nhân viên mới
        const response = await api({
          method: typeHTTP.POST,
          url: "/staff/add-staff", // Endpoint thêm nhân viên
          body: {
            phone: newStaffPhone,
            name: newStaffName,
            storeId, // Truyền storeId từ globalData
          },
          sendToken: true, // Nếu cần gửi token
        });

        // Nếu thêm thành công, cập nhật danh sách nhân viên trong state
        if (response) {
          const newStaff = response.staff;
          setStaffList([...staffList, newStaff]);
          setNewStaffName("");
          setNewStaffPhone("");
          setModalVisible(false);
        } else {
          Alert.alert("Lỗi", response.message);
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể thêm nhân viên. Vui lòng thử lại sau.");
      }
    } else {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin nhân viên");
    }
  };

  // Hàm xóa nhân viên
  const deleteStaff = (index) => {
    const updatedList = staffList.filter((_, i) => i !== index);
    setStaffList(updatedList);
  };

  // Hàm lưu thông tin sau khi sửa
  const saveStaffInfo = async () => {
    if (selectedStaff && newStaffName && newStaffPhone) {
      try {
        // Gọi API để cập nhật thông tin nhân viên
        const response = await api({
          method: typeHTTP.PUT,
          url: `/staff/update-staff/${selectedStaff._id}`, // Endpoint cập nhật thông tin nhân viên theo staffId
          body: {
            phone: newStaffPhone,
            name: newStaffName,
          },
          sendToken: true, // Nếu cần gửi token
        });

        if (response) {
          // Cập nhật danh sách nhân viên sau khi chỉnh sửa
          const updatedStaffList = staffList.map((staff) => (staff._id === selectedStaff._id ? { ...staff, name: newStaffName, phone: newStaffPhone } : staff));
          setStaffList(updatedStaffList);
          setModalVisible(false);
          setEditMode(false); // Đóng chế độ chỉnh sửa sau khi lưu
          Alert.alert("Thành công", "Cập nhật thông tin nhân viên thành công.");
        } else {
          Alert.alert("Lỗi", response.message);
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể cập nhật thông tin nhân viên.");
      }
    } else {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin nhân viên.");
    }
  };

  // Hiển thị nút xóa khi vuốt từ trái sang phải
  const renderLeftActions = (index) => {
    return (
      <TouchableOpacity onPress={() => deleteStaff(index)} style={styles.deleteButton}>
        <Feather name="trash" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  // Hiển thị modal chỉnh sửa khi nhấn vào một nhân viên
  const openEditModal = (staff) => {
    if (!swipeOpen) {
      // Chỉ mở modal khi không có vuốt đang mở
      setSelectedStaff(staff); // Lưu lại thông tin nhân viên được chọn
      setEditMode(true); // Chuyển sang chế độ chỉnh sửa
      setNewStaffName(staff.name);
      setNewStaffPhone(staff.phone);
      setModalVisible(true); // Hiển thị modal
    }
  };

  // Hiển thị modal thêm nhân viên khi nhấn vào nút +
  const openAddModal = () => {
    setSelectedStaff(null); // Không có nhân viên nào được chọn
    setEditMode(false); // Chuyển sang chế độ thêm mới
    setNewStaffName(""); // Đặt lại tên nhân viên mới
    setNewStaffPhone(""); // Đặt lại số điện thoại nhân viên mới
    setModalVisible(true); // Hiển thị modal thêm
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách nhân viên</Text>
        <TouchableOpacity onPress={openAddModal}>
          <AntDesign name="pluscircleo" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="Tìm kiếm" style={styles.searchInput} />
      </View>

      {/* Danh sách nhân viên */}
      <ScrollView>
        {staffList.map((staff, index) => (
          <Swipeable
            key={index}
            renderLeftActions={() => renderLeftActions(index)} // Vuốt từ trái sang phải để hiển thị nút Xóa
            onSwipeableOpen={() => setSwipeOpen(true)} // Đặt trạng thái swipeOpen khi vuốt mở
            onSwipeableClose={() => setSwipeOpen(false)} // Đặt lại trạng thái swipeOpen khi vuốt đóng
          >
            <TouchableOpacity onPress={() => openEditModal(staff)}>
              <View style={styles.staffCard}>
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{staff.name}</Text>
                  <Text style={styles.staffPhone}>{staff.phone}</Text>
                </View>
                <Switch value={staff.isActive} onValueChange={() => toggleSwitch(index)} thumbColor={staff.isActive ? "#fff" : "#fff"} trackColor={{ false: "#E5E7EB", true: "#E53935" }} />
              </View>
            </TouchableOpacity>
          </Swipeable>
        ))}
      </ScrollView>

      {/* Modal thêm mới hoặc chỉnh sửa nhân viên */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)} // Đóng modal khi bấm nút back Android
      >
        <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContainer} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</Text>
              <TouchableOpacity onPress={editMode ? saveStaffInfo : addNewStaff}>
                <Feather name="save" size={24} color="#E53935" />
              </TouchableOpacity>
            </View>
            <TextInput placeholder="Họ và tên" style={styles.modalInput} value={newStaffName} onChangeText={(text) => setNewStaffName(text)} />
            <TextInput placeholder="Số điện thoại" style={styles.modalInput} value={newStaffPhone} onChangeText={(text) => setNewStaffPhone(text)} keyboardType="phone-pad" />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#E53935",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 140,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 10,
    marginHorizontal: 15,
    marginTop: -30,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  searchInput: {
    padding: 10,
    fontSize: 16,
  },
  staffCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    elevation: 2,
  },
  staffInfo: {
    flexDirection: "column",
  },
  staffName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E53935",
  },

  staffPhone: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "87%", // Đảm bảo nút có chiều cao bằng với phần tử cha
    borderRadius: 5, // Đặt bo tròn giống như phần tử tên nhân viên
    marginTop: 10, // Đảm bảo không có khoảng cách phía trên
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Màu nền mờ cho modal
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginBottom: 15,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
