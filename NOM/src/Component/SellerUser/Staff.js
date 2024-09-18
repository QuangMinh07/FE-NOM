import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons'; // Import icon library

export default function Staff() {
  // Dữ liệu nhân viên
  const [staffList, setStaffList] = useState([
    { name: 'Lê Quang Minh', phone: '0396356806', isActive: true },
    { name: 'Nguyễn Thị Kiều Nghi', phone: '0979476768', isActive: false }
  ]);

  const [modalVisible, setModalVisible] = useState(false); // Trạng thái mở/đóng modal
  const [editMode, setEditMode] = useState(false); // Chế độ chỉnh sửa
  const [selectedStaff, setSelectedStaff] = useState(null); // Nhân viên được chọn

  // Hàm chuyển đổi trạng thái nhân viên
  const toggleSwitch = (index) => {
    setStaffList((prevStaffList) => {
      const updatedList = [...prevStaffList];
      updatedList[index].isActive = !updatedList[index].isActive;
      return updatedList;
    });
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách nhân viên</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
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
          <TouchableOpacity key={index} onPress={() => { setSelectedStaff(staff); setModalVisible(true); }}>
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
        ))}
      </ScrollView>

      {/* Modal hiển thị thông tin nhân viên */}
      {selectedStaff && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)} // Đóng modal khi bấm nút back Android
        >
          <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
            <Pressable style={styles.modalContainer} onPress={() => {}}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Thông tin nhân viên</Text>
                {editMode ? (
                  <TouchableOpacity onPress={saveStaffInfo}>
                    <Feather name="save" size={24} color="#E53935" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setEditMode(true)}>
                    <Feather name="edit" size={24} color="#E53935" />
                  </TouchableOpacity>
                )}
              </View>
              
              <TextInput
                placeholder="Họ và tên"
                style={styles.modalInput}
                value={selectedStaff.name}
                onChangeText={(text) => setSelectedStaff({ ...selectedStaff, name: text })}
                editable={editMode} // Chỉ chỉnh sửa khi ở chế độ edit
              />
              <TextInput
                placeholder="Số điện thoại"
                style={styles.modalInput}
                value={selectedStaff.phone}
                onChangeText={(text) => setSelectedStaff({ ...selectedStaff, phone: text })}
                editable={editMode} // Chỉ chỉnh sửa khi ở chế độ edit
                keyboardType="phone-pad"
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
