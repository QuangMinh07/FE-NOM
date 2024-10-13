import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Modal, TextInput, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Import API module
import { globalContext } from "../../context/globalContext";
import ImagePickerScreen from "../SellerUser/ImagePickerScreen"; // Import ImageUploader
import { styles } from "./StyleHomeSeller"; // Import styles từ file mới

export default function HomeSeller() {
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [sellingTime, setSellingTime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStoreName, setNewStoreName] = useState(storeName);
  const [newStoreAddress, setNewStoreAddress] = useState(storeAddress);
  const [isOpen, setIsOpen] = useState(false);
  const placeholderImage = null;
  const navigation = useNavigation();
  const [foodList, setFoodList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Lấy thông tin từ GlobalContext
  const { globalData, globalHandler } = useContext(globalContext);

  const checkStoreStatus = useCallback(async () => {
    try {
      const storeId = globalData.storeData?._id; // Lấy storeId từ globalData
      if (!storeId) {
        console.log("Không tìm thấy storeId trong globalData");
        return;
      }

      const response = await api({
        method: typeHTTP.GET,
        url: `/store/check-store-open/${storeId}`,
        sendToken: true,
      });

      if (response && response.isOpen !== undefined) {
        setIsOpen(response.isOpen); // true nếu cửa hàng đang mở, false nếu đã đóng
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái cửa hàng:", error);
    }
  }, [globalData.storeData?._id]);

  // Dùng useFocusEffect để kiểm tra trạng thái khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      checkStoreStatus(); // Gọi kiểm tra ngay khi màn hình được focus
    }, [checkStoreStatus])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      checkStoreStatus();
    }, 60000);

    return () => clearInterval(interval);
  }, [checkStoreStatus]);

  const fetchFoodsByStoreId = useCallback(async () => {
    try {
      const storeId = globalData.storeData?._id;
      if (!storeId) {
        console.log("Không tìm thấy storeId trong globalData");
        return;
      }

      // Gọi API để lấy danh sách món ăn
      const response = await api({
        method: typeHTTP.GET,
        url: `/food/get-foodstore/${storeId}`, // API lấy danh sách món ăn theo storeId
        sendToken: true,
      });

      // Kiểm tra phản hồi và chuyển đổi thành JSON nếu cần
      const data = (await response.json) ? await response.json() : response;

      console.log("Phản hồi từ API (đã xử lý):", data); // Kiểm tra phản hồi sau khi xử lý

      if (data && data.foods && Array.isArray(data.foods) && data.foods.length > 0) {
        setFoodList(data.foods); // Lưu danh sách món ăn vào state
        console.log("Danh sách món ăn:", data.foods);
      } else {
        console.log("Không tìm thấy món ăn nào");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu món ăn:", error);
    }
  }, [globalData.storeData?._id]); // Callback chỉ thay đổi khi storeId thay đổi

  // Dùng useFocusEffect để gọi hàm fetchFoodsByStoreId mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      fetchFoodsByStoreId();
    }, [fetchFoodsByStoreId])
  );

  // Gọi API để lấy thông tin cửa hàng và lưu vào GlobalContext
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const userId = globalData.user?.id; // Lấy userId từ globalData
        if (!userId) {
          console.log("Không tìm thấy userId trong globalData");
          return;
        }

        // Gọi API với userId để lấy thông tin cửa hàng
        const storeData = await api({
          method: typeHTTP.GET,
          url: `/store/getStore/${userId}`,
          sendToken: true,
        });

        if (storeData && storeData.data) {
          setStoreName(storeData.data.storeName || "Tên cửa hàng");
          setStoreAddress(storeData.data.storeAddress || "Địa chỉ cửa hàng");

          // Lưu toàn bộ thông tin cửa hàng vào GlobalContext
          globalHandler.setStoreData(storeData.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu cửa hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    const userId = globalData.user?.id;

    // Khi userId thay đổi hoặc khi không có storeData, gọi API
    if (userId) {
      fetchStoreData(); // Gọi API để lấy thông tin cửa hàng khi userId thay đổi
    } else {
      // Nếu không có userId (đăng xuất), reset lại thông tin
      setStoreName("");
      setStoreAddress("");
      globalHandler.setStoreData(null); // Reset lại dữ liệu storeData
      setLoading(false);
    }
  }, [globalData.user?.id]); // Theo dõi userId để gọi lại API khi thay đổi

  const fetchStoreData1 = useCallback(async () => {
    try {
      const storeId = globalData.storeData?._id; // Lấy storeId từ globalData
      if (!storeId) {
        console.log("Không tìm thấy storeId trong globalData");
        return;
      }

      // Gọi API mới với storeId để lấy thông tin cửa hàng
      const storeData = await api({
        method: typeHTTP.GET,
        url: `/store/get-store/${storeId}`, // Sử dụng API mới
        sendToken: true,
      });

      if (storeData && storeData.data) {
        setSellingTime(storeData.data.sellingTime || []); // Lưu thời gian bán hàng vào state
        globalHandler.setStoreData(storeData.data); // Cập nhật GlobalContext
        checkStoreStatus(); // Kiểm tra trạng thái mở/đóng cửa
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu cửa hàng:", error);
    } finally {
      setLoading(false);
    }
  }, [globalData.storeData?._id]);

  useFocusEffect(
    useCallback(() => {
      fetchStoreData1();
    }, [fetchStoreData1])
  );

  // Hàm xử lý hiển thị thời gian mở cửa từ dữ liệu
  const formatSellingTime = () => {
    if (!sellingTime.length) return "Không có dữ liệu thời gian";

    // Nhóm các ngày có cùng giờ mở cửa
    const groupedTime = {};

    sellingTime.forEach((day) => {
      const timeSlotString = day.timeSlots.map((slot) => `${slot.open}-${slot.close}`).join(", ");

      if (!groupedTime[timeSlotString]) {
        groupedTime[timeSlotString] = [];
      }

      groupedTime[timeSlotString].push(day.day);
    });

    // Tạo chuỗi hiển thị
    return Object.entries(groupedTime)
      .map(([timeSlotString, days]) => {
        return `${days.join(", ")} - ${timeSlotString.replace("-", " đến ")}`;
      })
      .join("\n"); // Hiển thị từng dòng cho mỗi nhóm thời gian
  };

  const openEditModal = () => {
    setModalVisible(true);
    setNewStoreName(storeName);
    setNewStoreAddress(storeAddress);
  };

  const closeEditModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  const updateStore = async (storeName, storeAddress) => {
    const storeId = globalData.storeData?._id; // Lấy storeId từ globalData

    if (!storeId) {
      console.log("storeId không tồn tại");
      return;
    }

    const body = {
      storeName,
      storeAddress,
    };

    try {
      const response = await api({
        method: typeHTTP.PUT,
        url: `/store/update-store/${storeId}`, // Đường dẫn API tới store
        body,
        sendToken: true, // Nếu cần gửi token
      });

      if (response?.success) {
        console.log("Cập nhật thành công:", response);
        // Cập nhật lại state với dữ liệu mới
        setStoreName(newStoreName); // Đảm bảo state lưu tên cửa hàng mới
        setStoreAddress(newStoreAddress); // Đảm bảo state lưu địa chỉ mới

        // Đóng modal sau khi cập nhật thành công
        setModalVisible(false);
      } else {
        console.log("Cập nhật thất bại:", response?.message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Bìa ảnh */}
      <View style={{ position: "relative" }}>
        <ImagePickerScreen selectedImage={selectedImage} setSelectedImage={setSelectedImage} />

        {/* Thông tin cửa hàng - Khung nổi */}
        <View style={styles.storeInfoContainer}>
          <View style={styles.storeInfoHeader}>
            <Text style={styles.storeNameText}>{storeName}</Text>
            <Text style={styles.storeRatingText}>4.5 ⭐ (25+)</Text>
            <View style={[styles.storeStatusContainer, { backgroundColor: isOpen ? "#00a651" : "#E53935" }]}>
              <Text style={styles.storeStatusText}>{isOpen ? "Đang mở cửa" : "Đã đóng cửa"}</Text>
            </View>
            <TouchableOpacity onPress={openEditModal}>
              <Icon name="edit" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
          <Pressable onPress={() => navigation.navigate("TimeClose")}>
            <Text style={styles.timeSectionText}>Thời gian mở cửa:</Text>
            <Text style={styles.timeSectionText}>{formatSellingTime()}</Text>
          </Pressable>
          <Text style={styles.addressText}>{storeAddress}</Text>
        </View>
      </View>

      {/* Modal for Editing Store Info */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeEditModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeEditModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cập nhật thông tin</Text>
            <TextInput value={newStoreName} onChangeText={(value) => setNewStoreName(value)} placeholder="Tên cửa hàng" style={styles.inputField} />
            <TextInput value={newStoreAddress} onChangeText={(value) => setNewStoreAddress(value)} placeholder="Địa chỉ" style={styles.inputField} />
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity onPress={() => updateStore(newStoreName, newStoreAddress)} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Tạo khoảng trống để không bị đè bởi khung nổi */}
      <View style={{ marginTop: 60 }} />

      {/* Doanh thu hôm nay */}
      <View style={styles.revenueContainer}>
        <View style={styles.revenueHeader}>
          <Text style={styles.revenueTitle}>Doanh thu Hôm nay</Text>
          <Text style={styles.revenueAmount}>100.000 VND</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => navigation.navigate("ListFood")} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Thực đơn</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Comment")} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Phản hồi</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Staff")} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Nhân viên</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Món bán chạy */}
      <View style={styles.bestSellerContainer}>
        <Text style={styles.bestSellerTitle}>Món bán chạy</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {foodList.map((food) => (
            <View key={food._id} style={styles.bestSellerCard}>
              <View style={[styles.bestSellerImageContainer, { backgroundColor: placeholderImage ? "transparent" : "#D3D3D3" }]}>{food.imageUrl ? <Image source={{ uri: food.imageUrl }} style={styles.bestSellerImage} /> : <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>}</View>
              <Text style={styles.bestSellerFoodName}>{food.foodName}</Text>
              <Text style={styles.bestSellerFoodPrice}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Các món khác */}
      <View style={styles.otherFoodsContainer}>
        <Text style={styles.otherFoodsTitle}>Các món khác</Text>

        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
          {foodList.map((food) => (
            <View key={food._id} style={styles.otherFoodCard}>
              <View style={[styles.otherFoodImageContainer, { backgroundColor: food.imageUrl ? "transparent" : "#D3D3D3" }]}>{food.imageUrl ? <Image source={{ uri: food.imageUrl }} style={styles.otherFoodImage} /> : <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>}</View>

              <View style={styles.otherFoodDetails}>
                <Text style={styles.otherFoodRating}>4.5 ⭐ (25+)</Text>
                <Text style={styles.otherFoodName}>{food.foodName}</Text>
                <Text style={styles.otherFoodPrice}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
