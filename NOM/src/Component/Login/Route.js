import { View, Text, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Import thư viện icon

const { width, height } = Dimensions.get('window');

const Route = () => {
  const images = [
    require('../../img/Login-Sing-up1.png'),
    require('../../img/Login-Sing-up2.png'),
    require('../../img/Login-Sing-up3.png'),
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);  // State để theo dõi nút được chọn
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
      paddingVertical: height * 0.1,
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
              width: width * 0.05,
              height: 10,
              backgroundColor: index === currentImageIndex ? '#E53935' : '#CCCCCC',
              marginHorizontal: width * 0.01,
              transform: [{ skewX: '-30deg' }],
            }}
          />
        ))}
      </View>

      {/* Nút cho Khách hàng */}
      <TouchableOpacity
        onPress={() => {
          setSelectedRole('customer');
          navigation.navigate('SignUp');
        }}  // Điều hướng tới trang đăng ký Khách hàng và chọn nút
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: selectedRole === 'customer' ? '#E53935' : '#FFFFFF',  // Chọn màu nền dựa trên trạng thái
          paddingVertical: 15,
          paddingHorizontal: 15,
          borderRadius: 10,
          borderColor: '#ffff', 
          borderWidth: 1,
          shadowColor: '#555',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 10,
          marginBottom: height * 0.02,
          width: '80%',
        }}
      >
        <Text style={{
          fontSize: 16,
          color: selectedRole === 'customer' ? '#FFFFFF' : '#000',  // Đổi màu chữ khi được chọn
        }}>Khách hàng</Text>
        <Icon name="chevron-right" size={24} color={selectedRole === 'customer' ? '#FFFFFF' : '#E53935'} />
      </TouchableOpacity>

      {/* Nút cho Đối tác */}
      <TouchableOpacity
        onPress={() => {
          setSelectedRole('seller');
          navigation.navigate('SignUpSeller');
        }}  // Điều hướng tới trang đăng ký Đối tác và chọn nút
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: selectedRole === 'seller' ? '#E53935' : '#FFFFFF',  // Chọn màu nền dựa trên trạng thái
          paddingVertical: 15,
          paddingHorizontal: 15,
          borderRadius: 10,
          borderColor: '#ffff', 
          borderWidth: 1,
          shadowColor: '#555',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 10,
          marginBottom: height * 0.02,
          width: '80%',
        }}
      >
        <Text style={{
          fontSize: 16,
          color: selectedRole === 'seller' ? '#FFFFFF' : '#000',  // Đổi màu chữ khi được chọn
        }}>Đối tác</Text>
        <Icon name="chevron-right" size={24} color={selectedRole === 'seller' ? '#FFFFFF' : '#E53935'} />
      </TouchableOpacity>

      {/* Nút cho Giao hàng */}
      <TouchableOpacity
        onPress={() => {
          setSelectedRole('shipper');
          navigation.navigate('SignUpShiper');
        }}  // Điều hướng tới trang đăng ký Giao hàng và chọn nút
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: selectedRole === 'shipper' ? '#E53935' : '#FFFFFF',  // Chọn màu nền dựa trên trạng thái
          paddingVertical: 15,
          paddingHorizontal: 15,
          borderRadius: 10,
          borderColor: '#ffff', 
          borderWidth: 1,
          shadowColor: '#E53935',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 10,
          marginBottom: height * 0.02,
          width: '80%',
        }}
      >
        <Text style={{
          fontSize: 16,
          color: selectedRole === 'shipper' ? '#FFFFFF' : '#000',  // Đổi màu chữ khi được chọn
        }}>Giao hàng</Text>
        <Icon name="chevron-right" size={24} color={selectedRole === 'shipper' ? '#FFFFFF' : '#E53935'} />
      </TouchableOpacity>
    </View>
  );
};

export default Route;
