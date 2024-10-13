import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const notifications = [
  {
    id: '1',
    name: 'Jhon Abraham',
    message: 'Tài xế',
    date: '9/11/2024',
  },
  {
    id: '2',
    name: 'Jhon Abraham',
    message: 'Tài xế',
    date: '9/11/2024',
  },
  {
    id: '3',
    name: 'Jhon Abraham',
    message: 'Tài xế',
    date: '9/11/2024',
  },
];

export default function NotificationsScreenSP() {
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal

  // Hàm để hiển thị modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Hàm để đóng modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {/* Khung tròn màu đỏ với tên viết tắt */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#E53935',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>JA</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ fontSize: 14, color: '#777' }}>{item.message}</Text>
      </View>
      {/* Ngày ở góc trên phải */}
      <Text style={{ fontSize: 12, color: '#999', position: 'absolute', right: 10, top: 10 }}>{item.date}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          width: '100%',
          height: '15%',
          backgroundColor: '#E53935',
          padding: 20,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 22, color: '#fff', fontWeight: 'bold' }}>Thông báo</Text>
        {/* Icon xóa - Khi nhấn vào sẽ mở modal */}
        <TouchableOpacity onPress={openModal}>
          <Icon name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Danh sách thông báo */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible} // Điều kiện hiển thị modal
        animationType="fade"
        onRequestClose={closeModal} // Đóng modal khi nhấn nút back
      >
        {/* Xử lý nhấn ra ngoài modal để đóng modal */}
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            {/* Nội dung modal */}
            <TouchableWithoutFeedback onPress={() => {}}>
              {/* Ngăn chặn modal đóng khi nhấn vào bên trong modal */}
              <View style={styles.modalContent}>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>Bạn có chắc chắn muốn xóa tất cả thông báo?</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={closeModal}
                  >
                    <Text style={{ color: '#fff' }}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#E53935' }]}
                    onPress={() => {
                      closeModal();
                      // Logic để xóa tất cả thông báo sẽ được thêm ở đây
                    }}
                  >
                    <Text style={{ color: '#fff' }}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền tối phía sau modal
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 5,
    marginHorizontal: 10,
  },
});
