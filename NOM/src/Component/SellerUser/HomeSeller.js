import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal, // Import Modal
  TextInput, // For input fields
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Import API module
import { globalContext } from "../../context/globalContext";

const { width, height } = Dimensions.get("window"); // Lấy kích thước màn hình

export default function HomeSeller() {
  const [storeName, setStoreName] = useState(""); // State để lưu tên cửa hàng
  const [storeAddress, setStoreAddress] = useState(""); // State để lưu địa chỉ cửa hàng
  const [sellingTime, setSellingTime] = useState([]); // State để lưu thông tin thời gian bán hàng
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu
  const [modalVisible, setModalVisible] = useState(false); // State để mở/đóng modal
  const [newStoreName, setNewStoreName] = useState(storeName); // State để cập nhật tên cửa hàng mới
  const [newStoreAddress, setNewStoreAddress] = useState(storeAddress); // State để cập nhật địa chỉ cửa hàng mới
  const [isOpen, setIsOpen] = useState(false); // Thêm state để xác định mở/đóng cửa hàng
  const placeholderImage = null; // Giả định không có ảnh
  const navigation = useNavigation();
  const [foodList, setFoodList] = useState([]);

  // Lấy thông tin từ GlobalContext
  const { globalData, globalHandler } = useContext(globalContext); // Sử dụng globalContext

  useEffect(() => {
    const fetchFoodsByStoreId = async () => {
      try {
        const storeId = globalData.storeData?._id; // Lấy storeId từ globalData
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
    };

    const storeId = globalData.storeData?._id;
    if (storeId) {
      fetchFoodsByStoreId(); // Gọi API để lấy danh sách món ăn khi storeId thay đổi
    }
  }, [globalData.storeData?._id]);

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

  // Hàm để chuyển đổi giờ phút thành số phút trong ngày
  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Hàm lấy thời gian hiện tại và chuyển đổi thành phút
  const getCurrentMinutes = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours * 60 + minutes;
  };

  useEffect(() => {
    // Kiểm tra trạng thái cửa hàng ngay khi component mount
    checkStoreStatus();

    // Cập nhật trạng thái cửa hàng mỗi phút
    const interval = setInterval(() => {
      checkStoreStatus();
    }, 60000); // 60000ms tương đương với 1 phút

    // Cleanup interval khi component unmount
    return () => clearInterval(interval);
  }, [sellingTime]);

  // Hàm kiểm tra trạng thái cửa hàng có đang mở hay không
  const checkStoreStatus = () => {
    const nowMinutes = getCurrentMinutes(); // Lấy số phút hiện tại
    const currentDay = new Date().getDay(); // Lấy thứ hiện tại (0 là Chủ Nhật, 1 là Thứ 2,...)

    const daysMap = {
      0: "Chủ Nhật",
      1: "Thứ 2",
      2: "Thứ 3",
      3: "Thứ 4",
      4: "Thứ 5",
      5: "Thứ 6",
      6: "Thứ 7",
    };

    const today = daysMap[currentDay];
    const todaySellingTime = sellingTime.find((time) => time.day === today);

    if (todaySellingTime) {
      const openTimeMinutes = convertTimeToMinutes(todaySellingTime.timeSlots[0].open);
      const closeTimeMinutes = convertTimeToMinutes(todaySellingTime.timeSlots[0].close);

      // So sánh thời gian hiện tại với thời gian mở và đóng cửa
      if (nowMinutes >= openTimeMinutes && nowMinutes <= closeTimeMinutes) {
        if (!isOpen) setIsOpen(true); // Nếu chưa mở cửa, cập nhật thành mở cửa
      } else {
        if (isOpen) setIsOpen(false); // Nếu chưa đóng cửa, cập nhật thành đóng cửa
      }
    }
  };

  useEffect(() => {
    const fetchStoreData1 = async () => {
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
    };

    fetchStoreData1();
  }, [globalData.storeData?._id]);

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

  // Hàm xử lý tải ảnh lên
  const handleUploadPhoto = () => {
    console.log("Tải ảnh lên");
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
        <View
          style={{
            backgroundColor: "#E53935", // Placeholder màu đỏ
            height: height * 0.25, // Chiều cao linh hoạt dựa trên kích thước màn hình
            borderRadius: 10,
            marginBottom: 10,
          }}
        />

        {/* Nút tải ảnh lên nằm ở góc phải trên cùng */}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 60,
            right: 30,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 8,
            elevation: 5, // Shadow cho Android
            shadowColor: "#000", // Shadow cho iOS
            shadowOpacity: 0.3,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
          }}
          onPress={handleUploadPhoto}
        >
          <Icon name="cloud-upload" size={24} color="#E53935" />
        </TouchableOpacity>

        {/* Thông tin cửa hàng - Khung nổi */}
        <View
          style={{
            position: "absolute",
            bottom: -40,
            left: width * 0.05, // Canh giữa với tỷ lệ trên màn hình
            right: width * 0.05,
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            elevation: 5, // Shadow cho Android
            shadowColor: "#000", // Shadow cho iOS
            shadowOpacity: 0.2,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>{storeName}</Text>
            <Text style={{ fontSize: 12, color: "#333", marginTop: 4 }}>4.5 ⭐ (25+)</Text>
            <View
              style={{
                backgroundColor: isOpen ? "#00a651" : "#E53935", // Xanh lá khi mở, đỏ khi đóng
                borderRadius: 3,
                paddingHorizontal: 5,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>{isOpen ? "Đang mở cửa" : "Đã đóng cửa"}</Text>
            </View>

            <TouchableOpacity onPress={openEditModal}>
              <Icon name="edit" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
          {/* Hiển thị thời gian mở cửa từ dữ liệu */}
          <View>
            <Text style={{ fontSize: 14, color: "#E53935", marginTop: 5 }}>Thời gian mở cửa:</Text>
            <Text style={{ paddingLeft: 20, fontSize: 14, color: "#E53935" }}>{formatSellingTime()}</Text>
          </View>

          <Text style={{ fontSize: 14, color: "#333", marginTop: 5 }}>{storeAddress}</Text>
        </View>
      </View>

      {/* Modal for Editing Store Info */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeEditModal}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          activeOpacity={1}
          onPress={closeEditModal} // Close modal when tapping outside
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Cập nhật thông tin</Text>
            <TextInput
              value={newStoreName} // Sử dụng newStoreName
              onChangeText={(value) => {
                setNewStoreName(value); // Lấy giá trị từ sự kiện và cập nhật state
              }}
              placeholder="Tên cửa hàng"
              style={{
                borderWidth: 1,
                borderColor: "#E53935",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
            />
            <TextInput
              value={newStoreAddress} // Sử dụng newStoreAddress
              onChangeText={(value) => {
                setNewStoreAddress(value); // Lấy giá trị từ sự kiện và cập nhật state
              }}
              placeholder="Địa chỉ"
              style={{
                borderWidth: 1,
                borderColor: "#E53935",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => updateStore(newStoreName, newStoreAddress)}
                style={{
                  backgroundColor: "#E53935",
                  borderRadius: 5,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
              >
                <Text style={{ color: "#fff" }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Tạo khoảng trống để không bị đè bởi khung nổi */}
      <View style={{ marginTop: 60 }} />

      {/* Doanh thu hôm nay */}
      <View style={{ paddingHorizontal: width * 0.05, paddingBottom: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#E53935" }}>Doanh thu Hôm nay</Text>
          <Text style={{ fontSize: 16, color: "#999999" }}>100.000 VND</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("ListFood")}
            style={{
              backgroundColor: "#E53935",
              padding: 20,
              borderRadius: 10,
              flex: 1,
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: "#fff" }}>Thực đơn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Comment")}
            style={{
              backgroundColor: "#E53935",
              padding: 20,
              borderRadius: 10,
              flex: 1,
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: "#fff" }}>Phản hồi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Staff")}
            style={{
              backgroundColor: "#E53935",
              padding: 20,
              borderRadius: 10,
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Nhân viên</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Món bán chạy */}
      <View style={{ backgroundColor: "#E53935", padding: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>Món bán chạy</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Khung ảnh món bán chạy */}
          {foodList.map((food, index) => (
            <View
              key={food._id}
              style={{
                backgroundColor: "#fff", // Khung màu trắng
                height: height * 0.23, // Tăng chiều cao của khung linh hoạt theo chiều cao màn hình
                width: width * 0.55, // Độ rộng chiếm một nửa màn hình
                borderRadius: 10,
                marginRight: 15,
                padding: 10,
                justifyContent: "space-between",
                borderColor: "#D3D3D3", // Màu xám cho viền ảnh
                borderWidth: 1,
              }}
            >
              <View
                style={{
                  backgroundColor: placeholderImage ? "transparent" : "#D3D3D3",
                  height: height * 0.15,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {food.imageUrl ? <Image source={{ uri: food.imageUrl }} style={{ height: height * 0.12, borderRadius: 10 }} /> : <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>}
              </View>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>{food.foodName}</Text>
              <Text style={{ fontSize: 14, color: "#333" }}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Các món khác */}
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Các món khác</Text>
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
          {foodList.map((food, index) => (
            <View
              key={food._id}
              style={{
                backgroundColor: "#fff",
                height: height * 0.2,
                borderRadius: 10,
                padding: 10,
                justifyContent: "space-between",
                borderColor: "#D3D3D3",
                borderWidth: 1,
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: food.imageUrl ? "transparent" : "#D3D3D3",
                  height: height * 0.15,
                  width: width * 0.3,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {food.imageUrl ? <Image source={{ uri: food.imageUrl }} style={{ height: height * 0.12, borderRadius: 10 }} /> : <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>}
              </View>

              <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>
                <Text style={{ fontSize: 14, color: "#333" }}>4.5 ⭐ (25+)</Text>
                <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>{food.foodName}</Text>
                <Text style={{ fontSize: 14, color: "#333" }}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
