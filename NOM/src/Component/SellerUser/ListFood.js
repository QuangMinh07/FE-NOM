import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, TextInput, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign

export default function ListFood({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('Món');
  const [switchStates, setSwitchStates] = useState({
    "Cơm tấm sườn bì chả": false,
    "Cơm tấm sườn ốp la": true,
    "Canh khổ qua": true,
    "Canh rong biển": false,
    "Canh mướp": true,
  });

  // Danh sách món ăn
  const [comTamGroup, setComTamGroup] = useState(["Cơm tấm sườn bì chả", "Cơm tấm sườn ốp la"]);
  const [canhGroup, setCanhGroup] = useState(["Canh khổ qua", "Canh rong biển", "Canh mướp"]);

  // State cho modal thêm nhóm món
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleSwitchChange = (foodName) => {
    setSwitchStates(prevState => ({
      ...prevState,
      [foodName]: !prevState[foodName]
    }));
  };

  const handleAddButtonPress = () => {
    if (selectedTab === 'Nhóm món') {
      setModalVisible(true); // Hiển thị modal khi chọn tab 'Nhóm món'
    } else {
      navigation.navigate('AddEat');
    }
  };

  // Xử lý xóa món ăn
  const handleDeleteFood = (setGroup, foodName) => {
    setGroup(prevGroup => prevGroup.filter(item => item !== foodName));
  };

  // Tính tổng số nút bật trong mỗi nhóm
  const calculateSwitchCount = (group) => {
    return group.filter(item => switchStates[item]).length;
  };

  const renderLeftActions = (foodName, setGroup) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteFood(setGroup, foodName)}
      >
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text style={{ color: '#fff' }}>Xóa</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#E53935', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 140 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Danh sách thực đơn</Text>
        <TouchableOpacity onPress={handleAddButtonPress}>
          <AntDesign name="pluscircleo" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={{ padding: 10, marginHorizontal: 15, marginTop: -30, backgroundColor: '#fff', borderRadius: 10, elevation: 5 }}>
        <TextInput
          placeholder="Tìm kiếm"
          style={{ padding: 10, fontSize: 16 }}
        />
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 10 }}>
        {['Món', 'Nhóm món'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={{
              borderBottomWidth: selectedTab === tab ? 2 : 0,
              borderBottomColor: '#E53935',
              paddingBottom: 10,
            }}
          >
            <Text style={{ color: selectedTab === tab ? '#E53935' : '#6B7280', fontSize: 16 }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List of Food */}
      {selectedTab === 'Món' && (
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#E53935' }}>Cơm tấm</Text>
              <Text style={{ fontSize: 16, color: '#E53935' }}>{calculateSwitchCount(comTamGroup)}/{comTamGroup.length}</Text>
            </View>
            {comTamGroup.map((item, index) => (
              <Swipeable
                key={index}
                renderLeftActions={() => renderLeftActions(item, setComTamGroup)}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('DishDetails', { dishName: item })}
                  style={styles.foodItem}
                >
                  <View>
                    <Text style={styles.foodName}>{item}</Text>
                    <Text style={styles.foodPrice}>45,000 VND</Text>
                  </View>
                  <Switch
                    value={switchStates[item]}
                    onValueChange={() => handleSwitchChange(item)}
                    thumbColor={switchStates[item] ? '#fff' : '#fff'}
                    trackColor={{ false: '#fff', true: '#E53935' }}
                  />
                </TouchableOpacity>
              </Swipeable>
            ))}
          </View>

          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#E53935' }}>Canh</Text>
              <Text style={{ fontSize: 16, color: '#E53935' }}>{calculateSwitchCount(canhGroup)}/{canhGroup.length}</Text>
            </View>
            {canhGroup.map((item, index) => (
              <Swipeable
                key={index}
                renderLeftActions={() => renderLeftActions(item, setCanhGroup)}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('DishDetails', { dishName: item })}
                  style={styles.foodItem}
                >
                  <View>
                    <Text style={styles.foodName}>{item}</Text>
                    <Text style={styles.foodPrice}>45,000 VND</Text>
                  </View>
                  <Switch
                    value={switchStates[item]}
                    onValueChange={() => handleSwitchChange(item)}
                    thumbColor={switchStates[item] ? '#fff' : '#fff'}
                    trackColor={{ false: '#fff', true: '#E53935' }}
                  />
                </TouchableOpacity>
              </Swipeable>
            ))}
          </View>
        </ScrollView>
      )}

      {/* List of Food Groups */}
      {selectedTab === 'Nhóm món' && (
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          {[...comTamGroup, ...canhGroup].map((item, index) => (
            <Swipeable
              key={index}
              renderLeftActions={() => renderLeftActions(item, () => { })}
            >
              <View style={styles.foodItem}>
                <Text style={{ fontSize: 16 }}>{item}</Text>
              </View>
            </Swipeable>
          ))}
        </ScrollView>
      )}

      {/* Modal for adding new group */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tên Nhóm món</Text>
            <TextInput
              style={styles.modalInput}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="Nhập tên nhóm món"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  // Handle confirmation
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  foodItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  foodPrice: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '88%',
    borderRadius: 10,
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 20,
    width: '45%',
    alignItems: 'center',
    elevation: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
