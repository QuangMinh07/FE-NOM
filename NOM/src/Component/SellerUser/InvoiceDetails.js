import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, SafeAreaView, Modal, Pressable, ScrollView, StatusBar } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const InvoiceDetails = () => {
    const [foodModalVisible, setFoodModalVisible] = useState(false); // Modal cho danh sách món ăn
    const [driverModalVisible, setDriverModalVisible] = useState(false); // Modal cho thông tin tài xế
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    // Function to open the food modal
    const openFoodModal = () => {
        setFoodModalVisible(true);
    };

    // Function to close the food modal
    const closeFoodModal = () => {
        setFoodModalVisible(false);
    };

    // Function to open the driver modal
    const openDriverModal = () => {
        setDriverModalVisible(true);
    };

    // Function to close the driver modal
    const closeDriverModal = () => {
        setDriverModalVisible(false);
    };
    return (
        <View style={{ flex: 1, backgroundColor: '#E53935' }}>
            {/* Set the StatusBar to make it translucent */}
            <StatusBar backgroundColor="#E53935" barStyle="light-content" translucent={true} />

            {/* Header */}
            <View
                style={{
                    backgroundColor: "#E53935",
                    paddingTop: insets.top + height * 0.02, // Add safe area top inset
                    paddingBottom: height * 0.05,
                    paddingHorizontal: width * 0.05,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text style={{ fontSize: width * 0.05, fontWeight: 'bold', color: 'white', marginTop: 10 }}>Chi tiết đơn hàng</Text>
                <Text style={{ fontSize: width * 0.035, color: 'white', marginTop: 10 }}>12/08/2024</Text>
            </View>

            {/* Rest of your content */}
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View contentContainerStyle={{ flexGrow: 1, paddingHorizontal: width * 0.05, paddingTop: height * 0.02 }}>

                    {/* Order Time */}
                    <View style={{ marginVertical: height * 0.03, paddingHorizontal: width * 0.05 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: width * 0.04, fontWeight: 'bold' }}>Thời gian đặt hàng:</Text>
                            <Text style={{ fontSize: width * 0.04 }}>09:00 PM</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: height * 0.01 }}>
                            <Text style={{ fontSize: width * 0.04, fontWeight: 'bold' }}>Thời gian nhận hàng:</Text>
                            <Text style={{ fontSize: width * 0.04 }}>09:09 PM</Text>
                        </View>
                    </View>

                    {/* Customer Info */}
                    <View style={{
                        flexDirection: 'column',
                        marginBottom: height * 0.02,
                        paddingHorizontal: width * 0.05
                    }}>
                        <Text style={{ fontSize: width * 0.04, fontWeight: 'bold', }}>Khách hàng</Text>
                        <Text style={{ fontSize: width * 0.045, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>Nguyễn Thị Kiều Nghi</Text>
                    </View>

                    {/* Order Details */}
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        padding: width * 0.03,
                        borderRadius: 10,
                        marginBottom: height * 0.02,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        paddingHorizontal: width * 0.05
                    }}>
                        <Text style={{ fontSize: width * 0.045, fontWeight: 'bold', marginBottom: height * 0.03 }}>Chi tiết đơn hàng</Text>
                        <ScrollView
                            style={{ marginBottom: height * 0.03 }}
                            contentContainerStyle={{ paddingBottom: height * 0.03 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableOpacity onLongPress={openFoodModal}>
                                <View style={{ maxHeight: height * 0.06 }}>
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
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0)',shadowOffset: { width: 0, height: 10 },elevation: 3, shadowRadius: 10,shadowOpacity: 0.7,shadowColor: '#000', }}
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



                    </View>

                    {/* Order Tools and Payment */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.02, paddingHorizontal: width * 0.05 }}>
                        <Text style={{ fontSize: width * 0.04 }}>Dụng cụ ăn uống</Text>
                        <Text style={{ fontSize: width * 0.04, fontWeight: 'bold' }}>Có</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: height * 0.02, paddingHorizontal: width * 0.05 }}>
                        <Text style={{ fontSize: width * 0.04 }}>Phương thức thanh toán</Text>
                        <Text style={{ fontSize: width * 0.04, fontWeight: 'bold' }}>Tiền mặt</Text>
                    </View>

                    {/* Total Invoice */}
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        padding: width * 0.03,
                        borderRadius: 10,
                        marginBottom: height * 0.02,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        paddingHorizontal: width * 0.05
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={{ fontSize: width * 0.045, fontWeight: 'bold' }}>Tổng hóa đơn</Text>
                            <Text style={{ fontSize: width * 0.05, color: '#E53935', fontWeight: 'bold' }}>40.000 VND</Text>
                        </View>
                    </View>

                    {/* Driver Information */}
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        padding: width * 0.03,
                        borderRadius: 10,
                        marginBottom: height * 0.02,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        paddingHorizontal: width * 0.05
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: width * 0.045, fontWeight: 'bold' }}>Thông tin tài xế</Text>
                            <TouchableOpacity onPress={openDriverModal}>
                                <Text style={{ fontSize: width * 0.045, color: '#E53935', fontWeight: 'bold' }}>Xem thông tin</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Complete Button */}
                    <TouchableOpacity>
                        <View style={{ backgroundColor: '#E53935', paddingVertical: height * 0.02, alignItems: 'center', marginTop: height * 0.03, paddingHorizontal: width * 0.05, paddingHorizontal: width * 0.05 }}>
                            <Text style={{ color: '#FFFFFF', fontSize: width * 0.05, fontWeight: 'bold' }}>Hoàn Thành</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Modal for Driver Info */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={driverModalVisible}
                        onRequestClose={closeDriverModal}
                    >
                        <Pressable
                            style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: -3 },
                                shadowOpacity: 0.1,
                                shadowRadius: 20,
                                elevation: 20,
                            }}
                            onPress={closeDriverModal}
                        >
                            <Pressable
                                style={{
                                    width: '100%',
                                    backgroundColor: '#fff',
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    padding: height * 0.03,
                                }}
                                onPress={(e) => e.stopPropagation()}
                            >
                                <Text style={{ fontSize: height * 0.025, fontWeight: 'bold', textAlign: 'center', marginBottom: height * 0.03 }}>
                                    Thông tin tài xế
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.02 }}>
                                    <View
                                        style={{
                                            width: height * 0.06,
                                            height: height * 0.06,
                                            borderRadius: (height * 0.06) / 2,
                                            borderWidth: 2,
                                            borderColor: '#E53935',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <FontAwesome name="user" size={height * 0.03} color="#E53935" />
                                    </View>
                                    <View style={{ marginLeft: width * 0.03 }}>
                                        <Text style={{ fontSize: height * 0.02, fontWeight: 'bold', color: '#E53935', marginBottom: 5 }}>
                                            Nguyễn Thị Kiều Nghi
                                        </Text>
                                        <Text style={{ fontSize: height * 0.018, color: '#555' }}>63P-P7 5566.01</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: height * 0.015 }}>
                                    <FontAwesome name="comments" size={height * 0.025} color="#E53935" style={{ marginLeft: 20 }} />
                                    <Text style={{ fontSize: height * 0.02, color: 'black', marginLeft: 10, fontWeight: 'bold' }}>Liên hệ với tài xế</Text>
                                </TouchableOpacity>
                            </Pressable>
                        </Pressable>
                    </Modal>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default InvoiceDetails;
