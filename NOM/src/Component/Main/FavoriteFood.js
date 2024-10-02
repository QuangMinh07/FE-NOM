import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Thư viện Icon
import { Swipeable } from 'react-native-gesture-handler'; // Thêm Swipeable
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Lấy kích thước màn hình để thiết kế đáp ứng
const { width } = Dimensions.get('window');

export default function FavoriteFood() {
  const [thucAn, setThucAn] = useState([
    {
      id: '1',
      ten: 'Phở Bò',
      moTa: 'Món phở truyền thống với nước dùng thơm ngon.',
      hinhAnh: 'https://example.com/pho-bo.jpg',
    },
    {
      id: '2',
      ten: 'Bún Chả',
      moTa: 'Bún chả Hà Nội với chả nướng thơm lừng.',
      hinhAnh: 'https://example.com/bun-cha.jpg',
    },
    {
      id: '3',
      ten: 'Cơm Tấm',
      moTa: 'Cơm tấm sườn bì với trứng ốp la.',
      hinhAnh: 'https://example.com/com-tam.jpg',
    },
    // Thêm các món ăn yêu thích khác ở đây
  ]);

  // Hàm để loại bỏ một món ăn khỏi danh sách yêu thích
  const loaiBoThucAn = (id) => {
    const duLieuMoi = thucAn.filter((monAn) => monAn.id !== id);
    setThucAn(duLieuMoi);
  };

  // Hàm để hiển thị nút xóa khi lướt
  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.actionXoa} onPress={() => loaiBoThucAn(id)}>
      <Icon name="trash-outline" size={30} color="#fff" />
      <Text style={styles.textActionXoa}>Xóa</Text>
    </TouchableOpacity>
  );

  // Hàm để hiển thị từng món ăn
  const hienThiMonAn = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
    >
      <View style={styles.containerMonAn}>
        <Image
          source={{ uri: item.hinhAnh }}
          style={styles.hinhAnhMonAn}
        />
        <View style={styles.thongTinMonAn}>
          <Text style={styles.tenMonAn}>{item.ten}</Text>
          <Text style={styles.moTaMonAn}>{item.moTa}</Text>
        </View>
        {/* Icon xóa không còn ở đây vì sẽ hiển thị qua swipe */}
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { /* Xử lý hành động quay lại */ }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.tenHeader}>Thức Ăn Yêu Thích</Text>
          {/* Có thể thêm các nút chức năng khác ở đây nếu cần */}
        </View>

        {/* Danh sách Thức Ăn Yêu Thích */}
        {thucAn.length > 0 ? (
          <FlatList
            data={thucAn}
            renderItem={hienThiMonAn}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.containerDanhSach}
          />
        ) : (
          <View style={styles.containerTrong}>
            <Text style={styles.textTrong}>Bạn chưa có món ăn yêu thích nào.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Định nghĩa các kiểu dáng bằng StyleSheet
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tenHeader: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
  },
  containerDanhSach: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  containerMonAn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2, // Đối với Android
    shadowColor: '#000', // Đối với iOS
    shadowOffset: { width: 0, height: 1 }, // Đối với iOS
    shadowOpacity: 0.2, // Đối với iOS
    shadowRadius: 1.41, // Đối với iOS
  },
  hinhAnhMonAn: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  thongTinMonAn: {
    flex: 1,
    justifyContent: 'center',
  },
  tenMonAn: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  moTaMonAn: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonXoa: {
    padding: 5,
  },
  containerTrong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTrong: {
    fontSize: 16,
    color: '#999',
  },
  // Styles cho Swipeable Action (Xóa)
  actionXoa: {
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  textActionXoa: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});
