import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MapView, { Marker } from "react-native-maps";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { api, typeHTTP } from "../../utils/api"; // Import API utilities
import { globalContext } from "../../context/globalContext"; // Lấy globalContext để lấy userId
import { styles } from "./EditAddressStyles"; // Import styles từ file mới
import { useRoute } from "@react-navigation/native"; // Import useRoute

export default function EditAddress() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState({
    phone: "",
    name: "",
    location: "",
    description: "",
  });

  const { globalData } = useContext(globalContext); // Lấy userId từ globalContext
  const userId = globalData?.user?.id; // Lấy userId từ globalData nếu có
  const route = useRoute(); // Lấy route để nhận storeId từ params
  const storeId = route.params?.storeId; // Lấy storeId từ route.params
  // Gọi API để lấy thông tin giỏ hàng và địa chỉ

  console.log(userId);
  console.log(storeId);
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await api({
          method: typeHTTP.GET,
          url: `/cart/getcart/${userId}/${storeId}`, // Gọi API với cả userId và storeId
          sendToken: true,
        });

        // Cập nhật state address với dữ liệu từ API
        if (response && response.cart) {
          const cart = response.cart;
          setAddress({
            phone: cart.receiverPhone || "",
            name: cart.receiverName || "",
            location: cart.deliveryAddress || "",
            description: cart.description || "",
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin giỏ hàng:", error);
      }
    };

    if (userId && storeId) {
      // Kiểm tra nếu có userId và storeId
      fetchCartData();
    }
  }, [userId, storeId]); // Gọi lại hàm này nếu userId hoặc storeId thay đổi

  // Function to toggle the modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Function to handle editing mode
  const handleEdit = () => {
    setIsEditing(true);
    toggleModal();
  };

  // Function to handle add new address mode
  const handleAddNew = () => {
    setIsEditing(false);
    setAddress({
      phone: "",
      name: "",
      location: "",
      description: "",
    });
    toggleModal();
  };

  // Function to save the address by calling the checkout API
  const saveAddress = async () => {
    if (!address.phone || !address.name || !address.location) {
      alert("Vui lòng điền đầy đủ thông tin cần thiết.");
      return;
    }

    try {
      if (isEditing) {
        // Gọi API cập nhật địa chỉ (updateShippingInfo)
        const data = await api({
          method: typeHTTP.PUT, // API cập nhật sử dụng PUT method
          url: `/cart/update/${userId}/${storeId}`, // Gọi API với userId và storeId
          body: {
            deliveryAddress: address.location,
            receiverName: address.name,
            receiverPhone: address.phone,
            description: address.description || "", // Cho phép mô tả trống
          },
          sendToken: true,
        });
        console.log("Cập nhật địa chỉ thành công:", data);
      } else {
        // Gọi API thêm mới địa chỉ (checkout)
        const data = await api({
          method: typeHTTP.POST,
          url: `/cart/checkout/${userId}/${storeId}`, // Gọi API với userId và storeId
          body: {
            deliveryAddress: address.location,
            receiverName: address.name,
            receiverPhone: address.phone,
            description: address.description || "", // Cho phép mô tả trống
          },
          sendToken: true,
        });
        console.log("Thêm địa chỉ thành công:", data);
      }

      toggleModal(); // Đóng modal sau khi cập nhật hoặc thêm thành công
    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ:", error);
      alert("Đã xảy ra lỗi khi lưu địa chỉ");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Địa chỉ nhận món</Text>
        <TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
          <Icon name="add-circle" size={24} color="#E53935" />
        </TouchableOpacity>
      </View>

      {/* Address Details */}
      <View style={styles.addressCard}>
        <Text style={styles.textLarge}>{address.phone || "Không có dữ liệu"}</Text>
        <Text style={styles.textLarge}>{address.name || "Không có dữ liệu"}</Text>
        <Text style={styles.textLarge}>{address.location || "Không có dữ liệu"}</Text>
        <Text style={styles.textSmall}>{address.description || "Không có dữ liệu"}</Text>

        {/* Edit Button */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleEdit}>
            <Icon name="edit" size={24} color="#E53935" style={{ marginRight: 10 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for adding/editing address */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
        {/* Dùng TouchableOpacity để nhấn bên ngoài modal cũng đóng modal */}
        <TouchableOpacity activeOpacity={1} style={styles.modalOverlay} onPress={toggleModal}>
          {/* Modal content */}
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <KeyboardAvoidingView behavior="padding">
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {/* Address Form */}
                  <Text style={styles.modalTitle}>{isEditing ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</Text>

                  <TextInput style={styles.input} placeholder="Số điện thoại" value={address.phone} onChangeText={(text) => setAddress({ ...address, phone: text })} />
                  <TextInput style={styles.input} placeholder="Tên người nhận" value={address.name} onChangeText={(text) => setAddress({ ...address, name: text })} />

                  {/* Địa chỉ nhập từ TextInput thay vì GooglePlacesAutocomplete */}
                  <TextInput style={styles.input} placeholder="Địa chỉ" value={address.location} onChangeText={(text) => setAddress({ ...address, location: text })} />

                  <TextInput style={styles.input} placeholder="Mô tả (Tùy chọn)" value={address.description} onChangeText={(text) => setAddress({ ...address, description: text })} />

                  {/* Map for displaying only */}
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: 10.762622,
                      longitude: 106.660172,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker coordinate={{ latitude: 10.762622, longitude: 106.660172 }} />
                  </MapView>

                  {/* Save Button */}
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveAddress} // Gọi hàm saveAddress
                  >
                    <Text style={styles.saveButtonText}>Lưu địa chỉ</Text>
                  </TouchableOpacity>
                </ScrollView>
              </KeyboardAvoidingView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
