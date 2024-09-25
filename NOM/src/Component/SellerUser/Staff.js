import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Modal, Pressable, Alert } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons'; // Import icon library
import { Swipeable } from 'react-native-gesture-handler';

export default function Staff() {
  const [staffList, setStaffList] = useState([
    { name: 'Lê Quang Minh', phone: '0396356806', isActive: true },
    { name: 'Nguyễn Thị Kiều Nghi', phone: '0979476768', isActive: false }
  ]);

  const [modalVisible, setModalVisible] = useState(false); // Trạng thái mở/đóng modal
  const [editMode, setEditMode] = useState(false); // Chế độ chỉnh sửa
  const [selectedStaff, setSelectedStaff] = useState(null); // Nhân viên được chọn để chỉnh sửa
  const [newStaffName, setNewStaffName] = useState(''); // Lưu thông tin tên nhân viên mới
  const [newStaffPhone, setNewStaffPhone] = useState(''); // Lưu thông tin số điện thoại nhân viên mới
  const [swipeOpen, setSwipeOpen] = useState(false); // Trạng thái xem có đang vuốt không

  // Hàm chuyển đổi trạng thái nhân viên
  const toggleSwitch = (index) => {
    setStaffList((prevStaffList) => {
      const updatedList = [...prevStaffList];
      updatedList[index].isActive = !updatedList[index].isActive;
      return updatedList;
    });
  };

  // Hàm thêm nhân viên mới
  const addNewStaff = () => {
    if (newStaffName && newStaffPhone) {
      const newStaff = { name: newStaffName, phone: newStaffPhone, isActive: true };
      setStaffList([...staffList, newStaff]);
      setNewStaffName('');
      setNewStaffPhone('');
      setModalVisible(false);
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin nhân viên');
    }
  };

  // Hàm xóa nhân viên
  const deleteStaff = (index) => {
    const updatedList = staffList.filter((_, i) => i !== index);
    setStaffList(updatedList);
  };

  // Hàm lưu thông tin sau khi sửa
  const saveStaffInfo = () => {
    const updatedStaffList = staffList.map((staff) =>
      staff === selectedStaff ? selectedStaff : staff
    );
    setStaffList(updatedStaffList);
    setModalVisible(false);
    setEditMode(false); // Đóng chế độ chỉnh sửa sau khi lưu
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
    if (!swipeOpen) { // Chỉ mở modal khi không có vuốt đang mở
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
    setNewStaffName(''); // Đặt lại tên nhân viên mới
    setNewStaffPhone(''); // Đặt lại số điện thoại nhân viên mới
    setModalVisible(true); // Hiển thị modal thêm
  };

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
        <TextInput
          placeholder="Tìm kiếm"
          style={styles.searchInput}
        />
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
                <Switch
                  value={staff.isActive}
                  onValueChange={() => toggleSwitch(index)}
                  thumbColor={staff.isActive ? '#fff' : '#fff'}
                  trackColor={{ false: '#E5E7EB', true: '#E53935' }}
                />
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
              <Text style={styles.modalTitle}>{editMode ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</Text>
              <TouchableOpacity onPress={editMode ? saveStaffInfo : addNewStaff}>
                <Feather name="save" size={24} color="#E53935" />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Họ và tên"
              style={styles.modalInput}
              value={newStaffName}
              onChangeText={(text) => setNewStaffName(text)}
            />
            <TextInput
              placeholder="Số điện thoại"
              style={styles.modalInput}
              value={newStaffPhone}
              onChangeText={(text) => setNewStaffPhone(text)}
              keyboardType="phone-pad"
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#E53935',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 140,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 10,
    marginHorizontal: 15,
    marginTop: -30,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  searchInput: {
    padding: 10,
    fontSize: 16,
  },
  staffCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    elevation: 2,
  },
  staffInfo: {
    flexDirection: 'column',
  },
  staffName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
  },

  staffPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '87%', // Đảm bảo nút có chiều cao bằng với phần tử cha
    borderRadius: 5, // Đặt bo tròn giống như phần tử tên nhân viên
    marginTop: 10, // Đảm bảo không có khoảng cách phía trên
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)', // Màu nền mờ cho modal
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 15,
    fontSize: 16,
  },
};
