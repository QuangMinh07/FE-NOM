import { View, Text, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const { width, height } = Dimensions.get('window');

const Log = () => {
  const images = [
    require('../../img/Login-Sing-up1.png'),
    require('../../img/Login-Sing-up2.png'),
    require('../../img/Login-Sing-up3.png'),
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();  // Sử dụng useNavigation

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }) => (
    <Image 
      source={item} 
      style={{
        width: width * 0.8,
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain',
        marginHorizontal: (width * 0.1),
      }} 
    />
  );

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentImageIndex(index);
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingVertical: height * 0.19,
    }}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onScroll={handleScroll}
        snapToAlignment="center"
        snapToInterval={width}
        decelerationRate="fast"
        contentContainerStyle={{
          alignItems: 'center',
        }}
        style={{ marginBottom: height * 0.02 }}
      />

      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: height * 0.02,
      }}>
        {images.map((_, index) => (
          <View
            key={index}
            style={{
              width: width * 0.05,   // Chiều rộng của hình bình hành
              height: 10,            // Chiều cao của hình bình hành
              backgroundColor: index === currentImageIndex ? '#E53935' : '#CCCCCC',
              marginHorizontal: width * 0.01,
              borderTopWidth: 0,
              borderBottomWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              transform: [{ skewX: '-30deg' }],
              
            }}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}  // Điều hướng tới trang SignUp
        style={{
          backgroundColor: '#E53935',
          borderRadius: 30,
          paddingVertical: height * 0.022,
          paddingHorizontal: width * 0.25,
          marginBottom: height * 0.015,
          marginTop: height * 0.015,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
        }}
      >
        <Text style={{
          fontSize: 18,
          color: '#FFFFFF',
          fontWeight: 'bold',
        }}>Đăng nhập</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}  // Điều hướng tới trang Login
        style={{
          borderColor: '#E53935',
          borderWidth: 2,
          borderRadius: 30,
          paddingVertical: height * 0.02,
          paddingHorizontal: width * 0.27,
          marginTop: height * 0.015,
        }}
      >
        <Text style={{
          fontSize: 18,
          color: '#E53935',
          fontWeight: 'bold',
        }}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Log;
