import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window'); // Get device dimensions

export default function StoreKH() {
  const [foodList] = useState([
    { id: 1, name: 'Cơm gà xối mỡ', price: 20000, rating: 4.5 },
    { id: 2, name: 'Phở bò', price: 25000, rating: 4.7 },
    { id: 3, name: 'Bún chả Hà Nội', price: 30000, rating: 4.6 },
    { id: 4, name: 'Bánh mì Sài Gòn', price: 15000, rating: 4.3 },
    { id: 5, name: 'Mì Quảng', price: 35000, rating: 4.8 },
    { id: 6, name: 'Bún Bò Huế', price: 28000, rating: 4.4 },
    { id: 7, name: 'Bánh Canh Cua', price: 40000, rating: 4.9 },
    { id: 8, name: 'Gỏi cuốn', price: 12000, rating: 4.1 },
    { id: 9, name: 'Lẩu Thái', price: 50000, rating: 4.7 },
  ]); // Mock data for food list

  const storeName = 'Cơm Tấm Tài';
  const storeAddress = 'Số 5 đường Nguyễn Thị Minh Khai, TP.HCM';
  const isOpen = true; // Simulate store status

  const navigation = useNavigation(); // To navigate between screens

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Content Area */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100, // Ensure there is space for the footer
        }}
      >
        {/* Header - Store Banner */}
        <View style={{ position: 'relative' }}>
          <View style={{
            backgroundColor: '#E53935', // Red placeholder color
            height: height * 0.25, // Flexible height
            borderRadius: 10,
            marginBottom: 10,
          }} />

          {/* Cart Icon Replacing Upload Icon */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 60,
              right: 30,
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 8,
              elevation: 5,
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 2 },
            }}
            onPress={() => navigation.navigate('Shopping')} // Navigate to the Shopping screen
          >
            <Icon name="shopping-cart" size={24} color="#E53935" />
          </TouchableOpacity>

          {/* Store Info Floating Box */}
          <View style={{
            position: 'absolute',
            bottom: -40,
            left: width * 0.05,
            right: width * 0.05,
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>{storeName}</Text>
              <Text style={{ fontSize: 12, color: '#333', marginTop: 4 }}>4.5 ⭐ (25+)</Text>
              <View style={{
                backgroundColor: isOpen ? '#00a651' : '#E53935',
                borderRadius: 3,
                paddingHorizontal: 5,
                paddingVertical: 4,
              }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isOpen ? 'Đang mở cửa' : 'Đã đóng cửa'}</Text>
              </View>
            </View>

            {/* Store Hours */}
            <View>
              <Text style={{ fontSize: 14, color: '#E53935', marginTop: 5 }}>Thời gian mở cửa:</Text>
              <Text style={{ paddingLeft: 20, fontSize: 14, color: '#E53935' }}>7:00 AM - 10:00 PM</Text>
            </View>

            <Text style={{ fontSize: 14, color: '#333', marginTop: 5 }}>{storeAddress}</Text>
          </View>
        </View>

        {/* Food Categories */}
        <View style={{ paddingHorizontal: 15, marginBottom: 20, marginTop: 50 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {foodList.map((food) => (
              <TouchableOpacity
                key={food.id}
                style={{
                  backgroundColor: '#fff',
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#eee',
                  marginRight: 15,
                  width: width * 0.4,
                }}
              >
                {/* Placeholder for Image */}
                <View style={{
                  height: 80,
                  width: '100%',
                  backgroundColor: '#f0f0f0', // Placeholder color for the image
                  borderRadius: 10,
                }} />
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>{food.name}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>Nhà Nghỉ</Text>
                <Text style={{ fontSize: 12, color: '#E53935', marginTop: 5 }}>
                  {food.rating} ⭐ ({food.price.toLocaleString()} VND)
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Special Dish Section */}
        <View style={{ paddingHorizontal: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Món Đặc Biệt</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {foodList.map((food) => (
              <View
                key={food.id}
                style={{
                  backgroundColor: '#fff',
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#eee',
                  marginRight: 15,
                  width: width * 0.55,
                }}
              >
                {/* Placeholder for Image */}
                <View style={{
                  height: 120,
                  width: '100%',
                  backgroundColor: '#f0f0f0',
                  borderRadius: 10,
                }} />
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>{food.name}</Text>
                <Text style={{ fontSize: 12, color: '#E53935', marginTop: 5 }}>
                  {food.price.toLocaleString()} VND
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Dessert Section */}
        <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Tráng miệng</Text>
          {foodList.map((food) => (
            <View
              key={food.id}
              style={{
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#eee',
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {/* Placeholder for Image */}
              <View style={{
                height: 80,
                width: 80,
                backgroundColor: '#f0f0f0',
                borderRadius: 10,
                marginRight: 15,
              }} />
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{food.name}</Text>
                <Text style={{ fontSize: 12, color: '#E53935' }}>{food.price.toLocaleString()} VND</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Footer Section */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#E53935',
          padding: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>20.000 VND</Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: '#E53935', fontSize: 16 }}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
