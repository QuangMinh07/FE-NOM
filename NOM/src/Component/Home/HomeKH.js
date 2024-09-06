import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import icons

const { width } = Dimensions.get('window'); // Lấy kích thước chiều rộng của màn hình

const HomeKH = () => {
  const categories = [
    { id: 1, name: 'Món chính', image: require('../../img/Menu1.png') },
    { id: 2, name: 'Ăn kèm', image: require('../../img/Menu2.png') },
    { id: 3, name: 'Đồ uống', image: require('../../img/Menu3.png') },
    { id: 4, name: 'Tráng miệng', image: require('../../img/Menu4.png') },
    { id: 5, name: 'Món chay', image: require('../../img/Menu5.png') },
    { id: 6, name: 'Combo', image: require('../../img/Menu6.png') },
  ];

  const banners = [
    { id: 1, name: 'TIMMON1', image: require('../../img/TIMMON1.png') }, 
    { id: 2, name: 'TIMMON2', image: require('../../img/TIMMON2.png') }, 
    { id: 3, name: 'TIMMON3', image: require('../../img/TIMMON3.png') },
    { id: 4, name: 'TIMMON4', image: require('../../img/TIMMON4.png') },
    { id: 5, name: 'TIMMON5', image: require('../../img/TIMMON5.png') },
    { id: 6, name: 'TIMMON6', image: require('../../img/TIMMON6.png') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#E53935', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 140 }}>
        {/* Thông tin người dùng */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 50, height: 50, backgroundColor: '#fff', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>N</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 18, marginLeft: 10 }}>Nguyễn Thị Kiều Nghi</Text>
        </View>

        {/* Icons */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Icon giỏ hàng */}
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="cart-outline" size={30} color="#fff" />
          </TouchableOpacity>
          {/* Icon thông báo */}
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Thanh tìm kiếm và trái tim */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginTop: -30, alignItems: 'center' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, height:50 }}>
          {/* Icon tìm kiếm */}
          <Ionicons name="search-outline" size={25} color="#E53935" />
          <TextInput placeholder="Tìm kiếm" style={{ marginLeft: 10, flex: 1 }} />
        </View>
        {/* Icon trái tim */}
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <View style={{ backgroundColor: '#fff', width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 25 }}>
            <Ionicons name="heart-outline" size={25} color="#E53935" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Danh mục sản phẩm */}
      <View style={{ marginTop: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10 }}>
          {categories.map(category => (
            <TouchableOpacity key={category.id} style={{ alignItems: 'center', marginHorizontal: 15 }}>
              <Image source={category.image} style={{ width: 50, height: 50, borderRadius: 25 }} />
              <Text style={{ marginTop: 10, fontWeight: 'bold' }}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Hiển thị danh sách sản phẩm */}
      <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Tìm món ngon</Text>
        <TouchableOpacity>
          <Text style={{ color: '#E53935', fontSize: 16 }}>Xem thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Banner danh sách */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 15 }}>
        {banners.map(banner => (
          <TouchableOpacity key={banner.id} style={{ marginRight: 10 }}>
            <Image 
              source={banner.image} 
              style={{ 
                width: width * 0.8,  // Chiều rộng của banner bằng 80% màn hình
                height: undefined,   // Tự động tính chiều cao dựa trên aspectRatio
                aspectRatio: 4.8 /2,  // Tỷ lệ khung hình 2:1 (Chiều rộng:Chiều cao)
                borderRadius: 10 
              }} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeKH;
