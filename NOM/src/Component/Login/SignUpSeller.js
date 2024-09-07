import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Modal, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function SignUpSeller() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [foodModalVisible, setFoodModalVisible] = useState(false);
  const [storeCount, setStoreCount] = useState(''); // Số lượng cửa hàng
  const [specificAddress, setSpecificAddress] = useState(''); // Địa chỉ cụ thể
  const [businessType, setBusinessType] = useState(''); // Loại/Hình thức kinh doanh
  const [businessModalVisible, setBusinessModalVisible] = useState(false); // Modal cho loại hình kinh doanh
  const navigation = useNavigation();

  // Danh sách các quận theo thành phố
  const districtOptions = {
    Hanoi: ['Quận Hoàn Kiếm', 'Quận Hai Bà Trưng', 'Quận Đống Đa', 'Quận Cầu Giấy'],
    HCM: ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7'],
  };

  // Danh sách các loại món ăn
  const foodTypes = ['Món chính', 'Ăn kèm', 'Đồ uống', 'Tráng miệng', 'Món chay', 'Combo'];

  // Danh sách các loại hình kinh doanh
  const businessTypes = [
    'Công ty 1 thành viên',
    'Công ty hợp danh',
    'Công ty tư nhân',
    'Công ty cổ phần',
    'Công ty quỹ từ thiện hiệp hội & CLB',
    'Cá nhân/Hộ kinh doanh'
  ];

  // Hàm xử lý chọn loại món ăn (cho phép nhiều loại món ăn)
  const toggleFoodTypeSelection = (foodType) => {
    if (selectedFoodTypes.includes(foodType)) {
      setSelectedFoodTypes(selectedFoodTypes.filter(item => item !== foodType));
    } else {
      setSelectedFoodTypes([...selectedFoodTypes, foodType]);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>

      {/* Logo và Slogan */}
      <View style={{ alignItems: 'center', marginBottom: height * 0.05 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
          NOM - NGON ĐỒNG Ý
        </Text>
        <Text style={{ fontSize: 12, color: '#888888', textAlign: 'center', marginTop: 20 }}>
          Đặt Ngay, Ăn Ngon, Hạnh Phúc Mỗi Ngày
        </Text>
      </View>

      {/* Form đăng ký */}
      <View style={{ width: '100%', marginBottom: 20 }}>
        {/* Tên nhà hàng và Tên người đại diện - Hàng ngang */}
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <View style={{ width: '48%' }}>
            <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Tên Nhà hàng</Text>
            <TextInput
              placeholder="Nhập tên nhà hàng"
              style={{
                width: '100%',
                height: 50,
                borderColor: '#E53935',
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 15,
                backgroundColor: '#FFFFFF',
              }}
            />
          </View>
          <View style={{ width: '48%' }}>
            <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Tên người đại diện</Text>
            <TextInput
              placeholder="Nhập tên người đại diện"
              style={{
                width: '100%',
                height: 50,
                borderColor: '#E53935',
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 15,
                backgroundColor: '#FFFFFF',
              }}
            />
          </View>
        </View>

        {/* Thành phố và Quận - Hàng ngang */}
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <View style={{ width: '48%' }}>
            <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Thành phố</Text>
            <TouchableOpacity onPress={() => setCityModalVisible(true)} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: 50,
              borderColor: '#E53935',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 15,
            }}>
              <Text>{selectedCity ? selectedCity : 'Chọn Thành phố'}</Text>
              <Icon name="arrow-drop-down" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Quận */}
          <View style={{ width: '48%' }}>
            <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Quận</Text>
            {selectedCity && (
              <TouchableOpacity onPress={() => setDistrictModalVisible(true)} style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                height: 50,
                borderColor: '#E53935',
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 15,
              }}>
                <Text>{selectedDistrict ? selectedDistrict : 'Chọn Quận'}</Text>
                <Icon name="arrow-drop-down" size={24} color="#000" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Số lượng cửa hàng và Địa chỉ cụ thể - Hàng ngang */}
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <View style={{ width: '48%' }}>
            <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Số lượng cửa hàng</Text>
            <TextInput
              placeholder="Nhập số lượng cửa hàng"
              value={storeCount}
              onChangeText={setStoreCount}
              style={{
                width: '100%',
                height: 50,
                borderColor: '#E53935',
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 15,
                backgroundColor: '#FFFFFF',
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={{ width: '48%' }}>
            <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Địa chỉ cụ thể</Text>
            <TextInput
              placeholder="Nhập địa chỉ cụ thể"
              value={specificAddress}
              onChangeText={setSpecificAddress}
              style={{
                width: '100%',
                height: 50,
                borderColor: '#E53935',
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 15,
                backgroundColor: '#FFFFFF',
              }}
            />
          </View>
        </View>

        {/* Email và Số điện thoại - Hàng ngang */}
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <View style={{ width: '48%' }}>
            <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Số điện thoại</Text>
            <TextInput
              placeholder="Nhập số điện thoại"
              style={{
                width: '100%',
                height: 50,
                borderColor: '#E53935',
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 15,
                backgroundColor: '#FFFFFF',
              }}
              keyboardType="phone-pad"
            />
          </View>
          <View style={{ width: '48%' }}>
            <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Email</Text>
            <TextInput
              placeholder="Nhập email"
              style={{
                width: '100%',
                height: 50,
                borderColor: '#E53935',
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 15,
                backgroundColor: '#FFFFFF',
              }}
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Loại món ăn */}
        <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Loại món ăn</Text>
        <TouchableOpacity onPress={() => setFoodModalVisible(true)} style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: 50,
          borderColor: '#E53935',
          borderWidth: 2,
          borderRadius: 10,
          paddingHorizontal: 15,
          marginBottom: 15,
        }}>
          <Text>{selectedFoodTypes.length > 0 ? selectedFoodTypes.join(', ') : 'Chọn Loại món ăn'}</Text>
          <Icon name="arrow-drop-down" size={24} color="#000" />
        </TouchableOpacity>

        {/* Loại hình kinh doanh */}
        <Text style={{ fontSize: 14, color: '#000', marginBottom: 5 }}>Loại hình kinh doanh</Text>
        <TouchableOpacity onPress={() => setBusinessModalVisible(true)} style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: 50,
          borderColor: '#E53935',
          borderWidth: 2,
          borderRadius: 10,
          paddingHorizontal: 15,
          marginBottom: 15,
        }}>
          <Text>{businessType ? businessType : 'Chọn loại hình kinh doanh'}</Text>
          <Icon name="arrow-drop-down" size={24} color="#000" />
        </TouchableOpacity>

      </View>

      {/* Nút đăng ký */}
      <TouchableOpacity
        onPress={() => navigation.navigate('SignUpMailOrPhone')}
        style={{
          width: '100%',
          height: 60,
          backgroundColor: '#E53935',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Đăng ký</Text>
      </TouchableOpacity>

      {/* Đã có tài khoản */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#000', fontSize: 14 }}>Đã có tài khoản? </Text>
        <TouchableOpacity>
          <Text
            onPress={() => navigation.navigate('Login')}
            style={{ color: '#E53935', fontSize: 14, fontWeight: 'bold' }}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for selecting city */}
      <Modal visible={cityModalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
            <FlatList
              data={Object.keys(districtOptions)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setSelectedCity(item); setCityModalVisible(false); }}>
                  <Text style={{ fontSize: 18, marginBottom: 15 }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal for selecting districts */}
      <Modal visible={districtModalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
            <FlatList
              data={districtOptions[selectedCity]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setSelectedDistrict(item); setDistrictModalVisible(false); }}>
                  <Text style={{ fontSize: 18, marginBottom: 15, color: selectedDistrict === item ? 'red' : 'black' }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setDistrictModalVisible(false)}>
              <Text style={{ color: 'blue', textAlign: 'right' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for selecting food types */}
      <Modal visible={foodModalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
            <FlatList
              data={foodTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleFoodTypeSelection(item)}>
                  <Text style={{ fontSize: 18, marginBottom: 15, color: selectedFoodTypes.includes(item) ? 'red' : 'black' }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setFoodModalVisible(false)}>
              <Text style={{ color: 'blue', textAlign: 'right' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for selecting business types */}
      <Modal visible={businessModalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
            <FlatList
              data={businessTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setBusinessType(item); setBusinessModalVisible(false); }}>
                  <Text style={{ fontSize: 18, marginBottom: 15, color: businessType === item ? 'red' : 'black' }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setBusinessModalVisible(false)}>
              <Text style={{ color: 'blue', textAlign: 'right' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}