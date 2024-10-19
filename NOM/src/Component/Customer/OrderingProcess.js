import React, { useState } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
const { width, height } = Dimensions.get('window');
const OrderingProcess = () => {
  const [activeStep, setActiveStep] = useState(0); // Quản lý tap đang được chọn
  const [modalVisible, setModalVisible] = useState(false); // Trạng thái của modal
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const navigation = useNavigation();
  const [foodModalVisible, setFoodModalVisible] = useState(false); // Modal cho danh sách món ăn

  const steps = [
    { label: 'Đang chờ duyệt', visible: true },
    { label: 'Đã nhận đơn hàng', visible: false },
    { label: 'Đang hoàn thành đơn hàng', visible: false },
    { label: 'Đang giao tới bạn', visible: false },
    { label: 'Giao hàng thành công', visible: false },
  ];
  // Hàm để chọn tap và ẩn các tap còn lại
  const handleStepSelect = (index) => {
    setActiveStep(index);
  };
  // Hàm để mở modal
  const openModal = () => {
    setModalVisible(true);
  };
  // Hàm để đóng modal
  const closeModal = () => {
    setModalVisible(false);
  };
  // Function to open the cancel modal
  const openCancelModal = () => {
    setCancelModalVisible(true);
  };
  // Function to close the cancel modal
  const closeCancelModal = () => {
    setCancelModalVisible(false);
  };
  // Function to handle reason selection and close modal
  const selectReason = (reason) => {
    setSelectedReason(reason);
    closeCancelModal();
    // Navigate back to the previous page after selecting a reason
    navigation.goBack();
  };
  // Function to open the food modal
  const openFoodModal = () => {
    setFoodModalVisible(true);
  };

  // Function to close the food modal
  const closeFoodModal = () => {
    setFoodModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', }}>
      <View contentContainerStyle={{ flex: 1, paddingHorizontal: width * 0.05, paddingTop: height * 0.02, }}>
        {/* Logo và tên app */}
        <View style={{ alignItems: 'center', marginBottom: height * 0.02, }}>
          <Image
            source={require('../../img/LOGOBLACK.png')}
            style={{ width: width * 0.3, height: height * 0.15 }}
          />
        </View>
        {/* Thanh tiến trình */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: height * 0.02, paddingHorizontal: width * 0.05 }}>
          {steps.map((step, index) => (
            <TouchableOpacity key={index} onPress={() => handleStepSelect(index)} style={{ flexDirection: 'row', alignItems: 'center', }}>
              <View style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: activeStep >= index ? '#E53935' : 'white',
                borderWidth: 2,
                borderColor: '#E53935',
              }} />
              {index < steps.length - 1 && (
                <View style={{ width: width * 0.18, height: 2, backgroundColor: activeStep > index ? '#E53935' : '#E53935' }} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.02, paddingHorizontal: width * 0.05 }}>
          {steps.map((step, index) => (
            <Text
              key={index}
              style={{
                fontSize: width * 0.035,
                color: activeStep === index ? '#E53935' : 'gray',
                textAlign: 'center',
                flex: 1,
                fontWeight: 'bold',
                display: activeStep === index ? 'flex' : 'none', // Chỉ hiển thị tap được chọn
              }}
            >
              {step.label}
            </Text>
          ))}
        </View>
        {/* Thông tin thời gian */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.03, paddingHorizontal: width * 0.05 }}>
          <Text style={{ fontSize: width * 0.04, fontWeight: 'bold' }}>Thời gian đặt hàng:</Text>
          <Text style={{ fontSize: width * 0.04 }}>09:00 PM 12/08/2024</Text>
        </View>
        {/* Địa chỉ đi */}
        <View style={{
          backgroundColor: '#FFFFFF', // Nền trắng
          padding: width * 0.03,
          borderRadius: 10,
          marginBottom: height * 0.02,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000', // Bóng đổ màu đen
          shadowOffset: { width: 0, height: 2 }, // Độ lệch bóng
          shadowOpacity: 0.2, // Độ mờ của bóng
          shadowRadius: 5, // Bán kính đổ bóng
          elevation: 5, // Đổ bóng cho Android
          paddingHorizontal: width * 0.05
        }}>
          <MaterialIcons name="location-on" size={24} color="green" />
          <View>
            <Text style={{ fontSize: width * 0.045, fontWeight: 'bold', marginLeft: 10 }}>Cơm tấm sườn</Text>
            <Text style={{ fontSize: width * 0.04, color: '#A9A9A9', marginLeft: 10 }}>72, phường 5, Nguyễn Thái Sơn, Gò Vấp</Text>
          </View>
        </View>
        {/* Địa chỉ đến */}
        <View style={{
          backgroundColor: '#FFFFFF', // Nền trắng
          padding: width * 0.03,
          borderRadius: 10,
          marginBottom: height * 0.02,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000', // Bóng đổ màu đen
          shadowOffset: { width: 0, height: 2 }, // Độ lệch bóng
          shadowOpacity: 0.2, // Độ mờ của bóng
          shadowRadius: 5, // Bán kính đổ bóng
          elevation: 5, // Đổ bóng cho Android
          paddingHorizontal: width * 0.05
        }}>
          <MaterialIcons name="location-on" size={24} color="#E53935" />
          <View style={{}}>
            <Text style={{ fontSize: width * 0.045, fontWeight: 'bold', marginLeft: 10 }}>Nguyễn Thị Kiều Nghi</Text>
            <Text style={{ fontSize: width * 0.04, color: '#A9A9A9', marginLeft: 10 }}>72, phường 5, Nguyễn Thái Sơn, Gò Vấp</Text>
          </View>
        </View>
        <ScrollView
          style={{ marginBottom: height * 0.03 }}
          contentContainerStyle={{ paddingBottom: height * 0.03 }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onLongPress={openFoodModal}>
            <View style={{ maxHeight: height * 0.1 , paddingHorizontal: width * 0.05
 }}>
              {/* List of food items */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.01 }}>
                <Text style={{ fontSize: width * 0.04 }}>1x Cơm tấm sườn bì</Text>
                <Text style={{ fontSize: width * 0.04 }}>20.000 VND</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.01 }}>
                <Text style={{ fontSize: width * 0.04 }}>3x Cơm tấm sườn bì</Text>
                <Text style={{ fontSize: width * 0.04 }}>60.000 VND</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.01 }}>
                <Text style={{ fontSize: width * 0.04 }}>2x Gỏi cuốn tôm thịt</Text>
                <Text style={{ fontSize: width * 0.04 }}>40.000 VND</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.01 }}>
                <Text style={{ fontSize: width * 0.04 }}>1x Nước mía</Text>
                <Text style={{ fontSize: width * 0.04 }}>10.000 VND</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.01 }}>
                <Text style={{ fontSize: width * 0.04 }}>2x Bánh mì</Text>
                <Text style={{ fontSize: width * 0.04 }}>15.000 VND</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={foodModalVisible}
          onRequestClose={closeFoodModal}
        >
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0)', shadowOffset: { width: 0, height: 10 }, elevation: 3, shadowRadius: 10, shadowOpacity: 0.7, shadowColor: '#000', }}
            onPress={closeFoodModal}
            activeOpacity={1}
          >
            <Pressable
              style={{ width: width * 0.8, backgroundColor: '#fff', padding: 20, borderRadius: 10 }}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={{ fontSize: width * 0.05, fontWeight: 'bold', marginBottom: height * 0.02 }}>Danh sách món ăn</Text>
              <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.01 }}>
                  <Text style={{ fontSize: width * 0.04 }}>1x Cơm tấm sườn bì</Text>
                  <Text style={{ fontSize: width * 0.04 }}>20.000 VND</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.01 }}>
                  <Text style={{ fontSize: width * 0.04 }}>3x Cơm tấm sườn bì</Text>
                  <Text style={{ fontSize: width * 0.04 }}>60.000 VND</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.01 }}>
                  <Text style={{ fontSize: width * 0.04 }}>2x Gỏi cuốn tôm thịt</Text>
                  <Text style={{ fontSize: width * 0.04 }}>40.000 VND</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.01 }}>
                  <Text style={{ fontSize: width * 0.04 }}>1x Nước mía</Text>
                  <Text style={{ fontSize: width * 0.04 }}>10.000 VND</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.01 }}>
                  <Text style={{ fontSize: width * 0.04 }}>2x Bánh mì</Text>
                  <Text style={{ fontSize: width * 0.04 }}>15.000 VND</Text>
                </View>
                {/* Add more food items as needed */}
              </ScrollView>
            </Pressable>
          </TouchableOpacity>
        </Modal>

        {/* Dụng cụ ăn uống và phương thức thanh toán */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.02, paddingHorizontal: width * 0.05 }}>
          <Text style={{ fontSize: width * 0.04 }}>Dụng cụ ăn uống</Text>
          <Text style={{ fontSize: width * 0.04, fontWeight: 'bold' }}>Có</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.02, paddingHorizontal: width * 0.05 }}>
          <Text style={{ fontSize: width * 0.04 }}>Phương thức thanh toán</Text>
          <Text style={{ fontSize: width * 0.04, fontWeight: 'bold', }}>Tiền mặt</Text>
        </View>
        {/* Conditional rendering based on the active step */}
        {activeStep === 0 ? (
          // Display 'Hủy đơn hàng' button only for step 1 (tap 1)
          <TouchableOpacity onPress={openCancelModal}>
            <View style={{ backgroundColor: '#E53935', paddingVertical: height * 0.02, borderRadius: 1, alignItems: 'center', marginTop: height * 0.03, }}>
              <Text style={{ color: '#FFFFFF', fontSize: width * 0.05 }}>Hủy đơn hàng</Text>
            </View>
          </TouchableOpacity>
        ) : (
          // Display 'Thông tin tài xế' for steps 2, 3, 4, and 5
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: width * 0.03, backgroundColor: '#FFFFFF', borderRadius: 10 }}>
            <Text style={{ fontSize: width * 0.045, fontWeight: 'bold' }}>Thông tin tài xế</Text>
            <TouchableOpacity onPress={openModal}>
              <Text style={{ fontSize: width * 0.045, color: '#E53935', fontWeight: 'bold' }}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Modal for Cancel Order Reasons */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={cancelModalVisible} // Modal visibility state
          onRequestClose={closeCancelModal}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0)', // Background dimming effect
            }}
            onPress={closeCancelModal} // Close modal when clicking outside
          >
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: '#fff',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: height * 0.03,
                borderColor: '#D3D3D3', // Light gray border
                borderWidth: 1,
              }}
              onPress={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
            >
              {/* Title */}
              <Text style={{
                fontSize: height * 0.025,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#E53935',
                marginBottom: height * 0.02,
              }}>
                Lý do hủy đơn hàng
              </Text>
              {/* List of cancellation reasons */}
              <View style={{ marginBottom: height * 0.015 }}>
                <TouchableOpacity
                  onPress={() => selectReason('Thay đổi phương thức thanh toán')}
                  style={{
                    padding: height * 0.02,
                    backgroundColor: selectedReason === 'Thay đổi phương thức thanh toán' ? '#E0E0E0' : '#F5F5F5',
                    borderRadius: 10,
                    marginBottom: 10,
                  }}>
                  <Text style={{ fontSize: height * 0.02, color: '#555' }}>Thay đổi phương thức thanh toán</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectReason('Thay đổi địa chỉ')}
                  style={{
                    padding: height * 0.02,
                    backgroundColor: selectedReason === 'Thay đổi địa chỉ' ? '#E0E0E0' : '#F5F5F5',
                    borderRadius: 10,
                    marginBottom: 10,
                  }}>
                  <Text style={{ fontSize: height * 0.02, color: '#555' }}>Thay đổi địa chỉ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectReason('Đặt thêm món ăn')}
                  style={{
                    padding: height * 0.02,
                    backgroundColor: selectedReason === 'Đặt thêm món ăn' ? '#E0E0E0' : '#F5F5F5',
                    borderRadius: 10,
                    marginBottom: 10,
                  }}>
                  <Text style={{ fontSize: height * 0.02, color: '#555' }}>Đặt thêm món ăn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectReason('Lý do khác')}
                  style={{
                    padding: height * 0.02,
                    backgroundColor: selectedReason === 'Lý do khác' ? '#E0E0E0' : '#F5F5F5',
                    borderRadius: 10,
                    marginBottom: 10,
                  }}>
                  <Text style={{ fontSize: height * 0.02, color: '#555' }}>Lý do khác...</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        {/* Modal hiển thị thông tin tài xế */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0)', // Add some opacity to highlight the modal
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -3 }, // Shadow from the top
              shadowOpacity: 0.1, // Adjust shadow visibility
              shadowRadius: 20,   // Make shadow softer
              elevation: 20,
            }}
            onPress={closeModal} // Close the modal when clicking outside the content
          >
            <Pressable
              style={{
                width: '100%',
                backgroundColor: '#fff',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: height * 0.03,
                borderColor: '#fff', // Light gray color for border
                borderWidth: 1, // Border width
              }}
              onPress={(e) => e.stopPropagation()}  // Prevent closing the modal when clicking inside the content
            >
              {/* Title */}
              <Text style={{
                fontSize: height * 0.02,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: height * 0.03,
              }}>
                Thông tin tài xế
              </Text>
              <View style={{ marginBottom: height * 0.02 }}>
                {/* Avatar, Name, Rating, and Vehicle Info */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Avatar Placeholder */}
                  <View
                    style={{
                      width: height * 0.06,  // Size of the circle
                      height: height * 0.06,
                      borderRadius: (height * 0.06) / 2, // Circle shape
                      borderWidth: 2,
                      borderColor: '#E53935', // Red border
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 15,
                    }}
                  >
                    {/* Avatar Icon */}
                    <FontAwesome
                      name="user" // User icon to represent the avatar if no image
                      size={height * 0.03} // Icon size
                      color="#E53935" // Icon color
                    />
                  </View>
                  {/* Name and Rating */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: height * 0.02, fontWeight: 'bold', color: '#E53935', marginRight: 10 }}>
                        Nguyễn Thị Kiều Nghi
                      </Text>
                      {/* Rating Section aligned with the name */}
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: height * 0.016, color: '#333', marginRight: 5 }}>
                          4.5
                        </Text>
                        <Text style={{ fontSize: height * 0.015, color: '#f39c12' }}>⭐</Text>
                        <Text style={{ fontSize: height * 0.012, color: '#333', marginLeft: 5 }}>
                          (25+)
                        </Text>
                      </View>
                    </View>
                    {/* Vehicle Information */}
                    <Text style={{ fontSize: height * 0.018, color: '#555', marginTop: 5 }}>
                      63P-P7 5566.01
                    </Text>
                  </View>
                </View>
              </View>
              {/* Contact Info */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: height * 0.02,
                borderTopWidth: 2,
                borderTopColor: '#eee',
                paddingTop: height * 0.01
              }}>
                <FontAwesome name="comments" size={height * 0.025} color="#E53935" style={{ marginLeft: 20 }} />
                <Text style={{ fontSize: height * 0.02, color: 'black', marginLeft: 10, fontWeight: 'bold' }}>Liên hệ với tài xế</Text>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
export default OrderingProcess;