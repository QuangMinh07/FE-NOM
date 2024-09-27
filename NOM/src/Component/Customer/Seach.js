import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window'); // Get device dimensions

const Seach = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const navigation = useNavigation();

  // Extended list of foods
  const foodList = [
    { id: 1, name: 'Cơm gà xối mỡ', restaurant: 'Nhà Nghi', rating: '4.5', reviews: '25+' },
    { id: 2, name: 'Phở bò', restaurant: 'Nhà Nghỉ', rating: '4.5', reviews: '30+' },
    { id: 3, name: 'Bún chả Hà Nội', restaurant: 'Nhà Nghi', rating: '4.7', reviews: '20+' },
    { id: 4, name: 'Bánh mì Sài Gòn', restaurant: 'Nhà Nghi', rating: '4.6', reviews: '50+' },
    { id: 5, name: 'Mì Quảng', restaurant: 'Nhà Nghi', rating: '4.4', reviews: '15+' },
    { id: 6, name: 'Bún Bò Huế', restaurant: 'Nhà Nghi', rating: '4.5', reviews: '40+' },
    { id: 7, name: 'Bánh Canh Cua', restaurant: 'Nhà Nghi', rating: '4.8', reviews: '35+' },
    { id: 8, name: 'Gỏi cuốn', restaurant: 'Nhà Nghi', rating: '4.3', reviews: '20+' },
    { id: 9, name: 'Lẩu Thái', restaurant: 'Nhà Nghi', rating: '4.6', reviews: '45+' },
  ];

  // Navigate to StoreKH screen when a food item is selected
  const handleFoodPress = (foodId) => {
    navigation.navigate('StoreKH', { foodId }); // Passing foodId as a parameter
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
      {/* Search Bar */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginTop: height * 0.05, alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            height: height * 0.08, // Height relative to screen height
          }}>
            <Ionicons
              name="search-outline"
              size={28} // Slightly larger icon
              color="#E53935"
            />
            <TextInput
              placeholder="Tìm kiếm"
              style={{ marginLeft: 10, flex: 1, fontSize: width * 0.04 }} // Responsive font size
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)} // Update search query
            />
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: height * 0.02, marginBottom: height * 0.02 }}>
        <TouchableOpacity style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: '#E53935', fontWeight: 'bold', fontSize: width * 0.04 }}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: '#333', fontSize: width * 0.04 }}>Gần nhất</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: '#333', fontSize: width * 0.04 }}>Đánh giá</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: '#333', fontSize: width * 0.04 }}>Ưu đãi</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Food List */}
      <ScrollView style={{ paddingHorizontal: width * 0.05 }}>
        {foodList.map((food) => (
          <TouchableOpacity key={food.id} onPress={() => handleFoodPress(food.id)}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: height * 0.02, // Responsive padding
                marginBottom: height * 0.02, // Responsive margin
                borderRadius: 10,
                borderColor: '#f1f1f1', // Light gray border
                borderWidth: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
                flexDirection: 'row',
                alignItems: 'center', // Center content vertically
              }}
            >
              {/* Food Image Placeholder */}
              <View
                style={{
                  backgroundColor: '#f5f5f5',
                  height: height * 0.12, // Responsive image height
                  width: height * 0.12, // Keep image width proportional to height
                  borderRadius: 10,
                  marginRight: width * 0.05, // Responsive spacing between image and text
                }}
              />

              {/* Food Details */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: width * 0.045, fontWeight: 'bold', color: '#333' }}>{food.restaurant}</Text>
                <Text style={{ fontSize: width * 0.04, color: '#333', marginTop: 5 }}>{food.name}</Text>
                <Text style={{ fontSize: width * 0.04, color: '#E53935', marginTop: 5 }}>{food.rating} ⭐ ({food.reviews})</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Seach;
