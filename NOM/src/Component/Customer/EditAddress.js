import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, ScrollView, Image, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";
import { styles } from "./EditAddressStyles";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function EditAddress() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    phone: "",
    name: "",
    location: "",
    description: "",
  });

  const navigation = useNavigation();
  const { globalData } = useContext(globalContext);
  const userId = globalData?.user?.id;
  const route = useRoute();
  const storeId = route.params?.storeId;

  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      try {
        const response = await api({
          method: typeHTTP.GET,
          url: `/cart/getcart/${userId}/${storeId}`,
          sendToken: true,
        });

        if (response && response.cart) {
          setAddress({
            phone: response.cart.receiverPhone || "",
            name: response.cart.receiverName || "",
            location: response.cart.deliveryAddress || "",
            description: response.cart.description || "",
          });
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        alert("Không thể lấy dữ liệu giỏ hàng.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && storeId) {
      fetchCartData();
    }
  }, [userId, storeId]);

  const handleAddNew = () => {
    setIsEditing(false);
    setAddress({
      phone: "",
      name: "",
      location: "",
      description: "",
    });
    setModalVisible(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setModalVisible(true);
  };

  const saveAddress = async () => {
    const trimmedPhone = address.phone.trim();
    const trimmedName = address.name.trim();
    const trimmedLocation = address.location.trim();

    if (!trimmedPhone || !trimmedName || !trimmedLocation) {
      alert("Vui lòng điền đầy đủ thông tin cần thiết.");
      return;
    }

    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      alert("Số điện thoại phải có ít nhất 10 chữ số, không chứa ký tự đặc biệt hoặc khoảng trắng.");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        await api({
          method: typeHTTP.PUT,
          url: `/cart/update/${userId}/${storeId}`,
          body: {
            deliveryAddress: trimmedLocation,
            receiverName: trimmedName,
            receiverPhone: trimmedPhone,
            description: address.description || "",
          },
          sendToken: true,
        });
        console.log("Address updated successfully");
      } else {
        await api({
          method: typeHTTP.POST,
          url: `/cart/checkout/${userId}/${storeId}`,
          body: {
            deliveryAddress: trimmedLocation,
            receiverName: trimmedName,
            receiverPhone: trimmedPhone,
            description: address.description || "",
          },
          sendToken: true,
        });
        console.log("Address added successfully");
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Có lỗi xảy ra khi lưu địa chỉ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
          <Icon name="arrow-back" size={24} color="#E53935" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Địa chỉ nhận món</Text>
        <TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
          <Icon name="add-circle" size={24} color="#E53935" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#E53935" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.addressCard}>
          <Text style={styles.sectionHeader}>Thông tin người nhận</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.textLarge}>{address.phone || "Không có dữ liệu"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Tên người nhận:</Text>
            <Text style={styles.textLarge}>{address.name || "Không có dữ liệu"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Địa chỉ:</Text>
            <Text style={styles.textLarge}>{address.location || "Không có dữ liệu"}</Text>
          </View>
          <View style={styles.descriptionRow}>
            <Text style={styles.descriptionLabel}>Mô tả:</Text>
            <Text style={styles.descriptionText}>{address.description || "Không có dữ liệu"}</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleEdit}>
              <Icon name="edit" size={24} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView behavior="padding">
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.modalTitle}>{isEditing ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Số điện thoại"
                  value={address.phone}
                  onChangeText={(text) => setAddress({ ...address, phone: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tên người nhận"
                  value={address.name}
                  onChangeText={(text) => setAddress({ ...address, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Địa chỉ"
                  value={address.location}
                  onChangeText={(text) => setAddress({ ...address, location: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mô tả (Tùy chọn)"
                  value={address.description}
                  onChangeText={(text) => setAddress({ ...address, description: text })}
                />
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                  <Image source={require("../../img/map.png")} style={{ width: "100%", height: 150, borderRadius: 10, resizeMode: "cover" }} />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={saveAddress}>
                  <Text style={styles.saveButtonText}>Lưu địa chỉ</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
