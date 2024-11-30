// import React, { useState } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Swipeable } from 'react-native-gesture-handler';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const { width, height } = Dimensions.get('window'); // Lấy kích thước màn hình

// export default function FavoriteFood() {
//   const insets = useSafeAreaInsets();
//   const [thucAn, setThucAn] = useState([
//     {
//       id: '1',
//       ten: 'Phở Bò',
//       moTa: 'Món phở truyền thống với nước dùng thơm ngon.',
//       hinhAnh: 'https://example.com/pho-bo.jpg',
//     },
//     {
//       id: '2',
//       ten: 'Bún Chả',
//       moTa: 'Bún chả Hà Nội với chả nướng thơm lừng.',
//       hinhAnh: 'https://example.com/bun-cha.jpg',
//     },
//     {
//       id: '3',
//       ten: 'Cơm Tấm',
//       moTa: 'Cơm tấm sườn bì với trứng ốp la.',
//       hinhAnh: 'https://example.com/com-tam.jpg',
//     },
//   ]);

//   const loaiBoThucAn = (id) => {
//     const duLieuMoi = thucAn.filter((monAn) => monAn.id !== id);
//     setThucAn(duLieuMoi);
//   };

//   const renderRightActions = (id) => (
//     <TouchableOpacity
//       style={{
//         backgroundColor: '#E53935',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: 80,
//         borderRadius: 10,
//         marginBottom: 10,
//       }}
//       onPress={() => loaiBoThucAn(id)}
//     >
//       <Icon name="trash-outline" size={30} color="#fff" />
//       <Text style={{ color: '#fff', fontSize: 12, marginTop: 5 }}>Xóa</Text>
//     </TouchableOpacity>
//   );

//   const hienThiMonAn = ({ item }) => (
//     <Swipeable renderRightActions={() => renderRightActions(item.id)} overshootRight={false}>
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           backgroundColor: '#f9f9f9',
//           padding: 15,
//           borderRadius: 12,
//           marginBottom: 15,
//           elevation: 3,
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.25,
//           shadowRadius: 3.84,
//         }}
//       >
//         <Image
//           source={{ uri: item.hinhAnh }}
//           style={{
//             width: 70,
//             height: 70,
//             borderRadius: 12,
//             marginRight: 15,
//           }}
//         />
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{item.ten}</Text>
//           <Text style={{ fontSize: 14, color: '#666', marginTop: 6 }}>{item.moTa}</Text>
//         </View>
//       </View>
//     </Swipeable>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//       {/* Header Full Màn Hình */}
//       <View
//         style={{
//           backgroundColor: '#E53935',
//           height: height * 0.15, // Chiều cao header
//           width: '100%', // Full chiều ngang
//           paddingTop: insets.top + 10, // Đệm trên cho notch
//           paddingHorizontal: 20, // Khoảng cách 2 bên
//           position: 'absolute', // Đảm bảo chiếm toàn bộ chiều ngang
//           top: 0, // Căn sát đỉnh màn hình
//           left: 0, // Căn sát mép trái
//         }}
//       >

//         <Text
//           style={{
//             color: '#fff',
//             fontWeight: 'bold',
//             fontSize: 20,
//             marginTop: 20, // Thêm khoảng cách giữa icon và tiêu đề
//           }}
//         >
//           Thức Ăn Yêu Thích
//         </Text>
//       </View>

//       {/* Danh sách thức ăn */}
//       {thucAn.length > 0 ? (
//         <FlatList
//           data={thucAn}
//           renderItem={hienThiMonAn}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{
//             paddingHorizontal: 15, // Lề hai bên
//             paddingBottom: insets.bottom + 30, // Khoảng cách phía dưới
//             paddingTop: height * 0.15 + 10, // Đặt khoảng cách bằng chiều cao của header

//           }}
//         />
//       ) : (
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//         >
//           <Text style={{ fontSize: 18, color: '#999' }}>Bạn chưa có món ăn yêu thích nào.</Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function FavoriteFood({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Logo */}
      <Image
        source={require('../../img/LOGONOM.png')} // Điều chỉnh đường dẫn nếu cần
        style={{
          width: width * 0.6,
          height: width * 0.6,
          resizeMode: 'contain',
          marginBottom: 20,
        }}
      />

      {/* Thông báo */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        Tính năng đang được phát triển
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
          marginBottom: 30,
        }}
      >
        Xin lỗi đã làm gián đoạn trải nghiệm của bạn. Chúng tôi đang nỗ lực để hoàn thiện tính năng này.
      </Text>

      {/* Nút Go Back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          backgroundColor: '#E53935',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Icon name="arrow-back" size={20} color="#fff" style={{ marginRight: 10 }} />
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Quay Lại</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
