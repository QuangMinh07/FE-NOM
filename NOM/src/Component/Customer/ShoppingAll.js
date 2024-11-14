import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// Dữ liệu giả lập cho danh sách mục trong giỏ hàng
let shoppingData = [
  { id: 1, name: "Xôi Mặn - Bánh Bao - Long Duyên", items: 1, time: "50.000", distance: "cơm tấm, sườn, cafe", image: require("../../img/Menu1.png") },
  { id: 2, name: "Xôi Mặn - Bánh Bao Hoa Hoa", items: 2, time: "50.000", distance: "cơm tấm, sườn, cafe", image: require("../../img/Menu2.png") },
  { id: 3, name: "XÔI CẬU BẢO - XÔI BA RỌI, XÔI G...", items: 1, time: "50.000", distance: "cơm tấm, sườn, cafe", image: require("../../img/Menu3.png") },
  // Thêm dữ liệu khác nếu cần
];

export default function ShoppingAll() {
  const [selectedItems, setSelectedItems] = useState([]); // Lưu trữ các mục đã chọn
  const [isManaging, setIsManaging] = useState(false); // Xác định trạng thái Quản lý

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDeleteSelected = () => {
    // Xóa các mục đã chọn
    shoppingData = shoppingData.filter(item => !selectedItems.includes(item.id));
    setSelectedItems([]); // Xóa danh sách các mục đã chọn
    setIsManaging(false); // Thoát khỏi chế độ Quản lý
  };

  const renderShoppingItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <TouchableOpacity 
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          backgroundColor: isSelected ? '#FFEBEE' : '#fff', // Nền đỏ nhạt khi được chọn
          borderRadius: 10
        }}
        onPress={() => handleSelectItem(item.id)}
        disabled={!isManaging} // Chỉ cho phép chọn khi ở chế độ Quản lý
      >
        {/* Icon đánh dấu khi mục được chọn */}
        {isSelected && <Ionicons name="checkmark-circle" size={24} color="#E53935" style={{ marginRight: 10 }} />}
        
        <View style={{ flex: 1 }}>
          <Text 
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333'
            }} 
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {item.items} món • {item.time} • {item.distance}
          </Text>
        </View>
        <Image 
          source={item.image} 
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            marginLeft: 10
          }} 
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Phần tiêu đề */}
      <View 
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0'
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Giỏ hàng của tôi</Text>
        <TouchableOpacity onPress={() => setIsManaging(!isManaging)}>
          <Text style={{ fontSize: 16, color: '#E53935' }}>{isManaging ? "Hủy" : "Quản lý"}</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách giỏ hàng */}
      {shoppingData.length > 0 ? (
        <FlatList
          data={shoppingData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderShoppingItem}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#666' }}>Giỏ hàng trống</Text>




        </View>
      )}

      {/* Chọn tất cả và nút Xóa */}
      {isManaging && selectedItems.length > 0 && (
        <View 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0'
          }}
        >
          <TouchableOpacity onPress={() => setSelectedItems(shoppingData.map(item => item.id))}>
            <Text>Chọn tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{
              backgroundColor: '#e0e0e0',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 5
            }}
            onPress={handleDeleteSelected}
          >
            <Text style={{ color: '#E53935', fontWeight: 'bold' }}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
