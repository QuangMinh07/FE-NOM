import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons
import { useNavigation } from '@react-navigation/native'; // For navigation

export default function Orderfood() {
  const [quantity, setQuantity] = useState(2);
  const [price, setPrice] = useState(95000); // base price in VND
  const [selectedOptions, setSelectedOptions] = useState([]); // state to store selected options (array for multiple)

  const navigation = useNavigation(); // Access navigation prop

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
    setPrice(prevPrice => prevPrice + 95000); // assuming each item is 95,000 VND
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
      setPrice(prevPrice => prevPrice - 95000);
    }
  };

  const handleOptionSelect = (index, optionPrice) => {
    if (selectedOptions.includes(index)) {
      setSelectedOptions(prevOptions => prevOptions.filter(option => option !== index));
      setPrice(prevPrice => prevPrice - optionPrice);
    } else {
      setSelectedOptions(prevOptions => [...prevOptions, index]);
      setPrice(prevPrice => prevPrice + optionPrice);
    }
  };

  const options = [
    { name: 'Tiêu thái lát', price: 23000 },
    { name: 'Hành tây', price: 23000 },
    { name: 'Ớt chuông', price: 23000 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top section for the image */}
      <View style={{ height: 300, backgroundColor: '#E53935' }}>
        <Image
          source={{ uri: 'https://your-image-url-here' }} // Replace with actual image URL
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {/* Floating title and quantity box */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 16,
          right: 16,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 10,
          borderRadius: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Cơm tấm sườn bì</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Text style={{ fontSize: 16, color: '#ddd' }}>⭐ 4.5 (30+) • </Text>
              <TouchableOpacity onPress={() => navigation.navigate('ReviewFood')}>
                <Text style={{ fontSize: 16, color: '#ddd', textDecorationLine: 'underline' }}>
                  Xem đánh giá
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Quantity Selector */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={decrementQuantity} style={{ padding: 10 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 20, color: '#E53935' }}>-</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, paddingHorizontal: 10, color: '#fff' }}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQuantity} style={{ padding: 10 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 20, color: '#E53935' }}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Product details */}
      <ScrollView style={{ flex: 1, padding: 16, marginTop: 10 }}>
        {/* Price section aligned to the right */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#E53935' }}>
            {price.toLocaleString('vi-VN')} VND
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Mô tả</Text>
          <Text style={{ fontSize: 16, color: '#666', marginTop: 5 }}>
            Thịt bò xay ngon hơn. Thịt bò nạc xay – Tôi thích dùng thịt bò angus nạc 85%.
            Tỏi – dùng tươi băm nhuyễn. Gia vị – bột ớt, cumin, bột hành.
          </Text>
        </View>

        {/* Additional options (Thêm) */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Thêm</Text>
          {/* Loop through options */}
          {options.map((option, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontSize: 16 }}>{option.name}</Text>
              <Text style={{ marginLeft: 'auto', fontSize: 16 }}>+ {option.price.toLocaleString('vi-VN')} VND</Text>
              <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handleOptionSelect(index, option.price)}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: selectedOptions.includes(index) ? '#E53935' : '#ccc',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {selectedOptions.includes(index) && (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#E53935',
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom button section */}
      <View style={{ backgroundColor: '#fff', padding: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: '#E53935',
            paddingVertical: 15,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '48%',
          }}
          onPress={() => navigation.navigate('Shopping')} // Navigate to Shopping screen
        >
          <Ionicons name="cart-outline" size={24} color="#E53935" />
          <Text style={{ color: '#E53935', fontSize: 18, fontWeight: 'bold', marginLeft: 5 }}>Giỏ hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#E53935',
            paddingVertical: 15,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '48%',
          }}
          onPress={() => navigation.navigate('Shopping')} // Navigate to Shopping screen
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
