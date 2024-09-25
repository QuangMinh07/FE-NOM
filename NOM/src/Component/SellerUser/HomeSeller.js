import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Import API module
import { globalContext } from "../../context/globalContext";

const { width, height } = Dimensions.get("window"); // Lấy kích thước màn hình

export default function HomeSeller() {
  const [storeName, setStoreName] = useState(""); // State để lưu tên cửa hàng
  const [storeAddress, setStoreAddress] = useState(""); // State để lưu địa chỉ cửa hàng
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải dữ liệu
  const placeholderImage = null; // Giả định không có ảnh
  const navigation = useNavigation();

  // Lấy thông tin từ GlobalContext
  const { globalData, globalHandler } = useContext(globalContext); // Sử dụng globalContext

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

        console.log("Thông tin cửa hàng từ API:", storeData);

        if (storeData && storeData.data) {
          setStoreName(storeData.data.storeName || "Tên cửa hàng");
          setStoreAddress(storeData.data.storeAddress || "Địa chỉ cửa hàng");

          // Lưu toàn bộ thông tin cửa hàng vào GlobalContext
          globalHandler.setStoreData(storeData.data);

          console.log(
            "Thông tin cửa hàng đã lưu vào GlobalContext:",
            storeData.data
          );
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

  // Hàm xử lý tải ảnh lên
  const handleUploadPhoto = () => {
    // Xử lý tải ảnh lên ở đây
    console.log("Tải ảnh lên");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

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
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
              {storeName}
            </Text>
            <Text style={{ fontSize: 12, color: "#333", marginTop: 4 }}>
              4.5 ⭐ (25+)
            </Text>
            <View
              style={{
                backgroundColor: "#00a651",
                borderRadius: 3,
                paddingHorizontal: 5,
                paddingVertical: 4,
              }}
            >
              <Text
                onPress={() => navigation.navigate("TimeClose")}
                style={{ color: "#fff", fontWeight: "bold" }}
              >
                Đang mở cửa
              </Text>
            </View>
            <TouchableOpacity>
              <Icon name="edit" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
          <Text
            onPress={() => navigation.navigate("TimeClose")}
            style={{ fontSize: 14, color: "#E53935", marginTop: 5 }}
          >
            Thời gian mở cửa: t2,t3,t7,Cn - 7H30 - 10H30
          </Text>
          <Text style={{ fontSize: 14, color: "#333", marginTop: 5 }}>
            {storeAddress}
          </Text>
        </View>
      </View>

      {/* Tạo khoảng trống để không bị đè bởi khung nổi */}
      <View style={{ marginTop: 60 }} />

      {/* Doanh thu hôm nay */}
      <View style={{ paddingHorizontal: width * 0.05, paddingBottom: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#E53935" }}>
            Doanh thu Hôm nay
          </Text>
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
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
          Món bán chạy
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Khung ảnh món bán chạy */}
          <View
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
              {placeholderImage ? (
                <Image
                  source={{ uri: placeholderImage }}
                  style={{ height: height * 0.12, borderRadius: 10 }}
                />
              ) : (
                <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>
              )}
            </View>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
              Gỏi cuốn
            </Text>
            <Text style={{ fontSize: 14, color: "#333" }}>75.000 VND</Text>
          </View>

          <View
            style={{
              backgroundColor: "#fff", // Khung màu trắng
              height: height * 0.23, // Tăng chiều cao của khung linh hoạt theo chiều cao màn hình
              width: width * 0.55, // Độ rộng chiếm một nửa màn hình
              borderRadius: 10,
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
              {placeholderImage ? (
                <Image
                  source={{ uri: placeholderImage }}
                  style={{ height: height * 0.12, borderRadius: 10 }}
                />
              ) : (
                <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>
              )}
            </View>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
              Nhà Nghi
            </Text>
            <Text style={{ fontSize: 14, color: "#333" }}>45.000 VND</Text>
          </View>
        </ScrollView>
      </View>

      {/* Các món khác */}
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
          Các món khác
        </Text>

        {/* Món 1 */}
        <View
          style={{
            backgroundColor: "#fff", // Khung màu trắng
            height: height * 0.2, // Tăng chiều cao
            borderRadius: 10,
            marginBottom: 10,
            padding: 10,
            justifyContent: "space-between",
            borderColor: "#D3D3D3", // Màu xám cho viền ảnh
            borderWidth: 1,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: placeholderImage ? "transparent" : "#D3D3D3",
              height: height * 0.15,
              width: width * 0.3,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {placeholderImage ? (
              <Image
                source={{ uri: placeholderImage }}
                style={{ height: height * 0.12, borderRadius: 10 }}
              />
            ) : (
              <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>
            )}
          </View>
          <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>
            <Text style={{ fontSize: 14, color: "#333" }}>4.5 ⭐ (25+)</Text>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
              Cơm gà xối mỡ
            </Text>
            <Text style={{ fontSize: 14, color: "#333" }}>50.000 VND</Text>
          </View>
        </View>

        {/* Món 2 */}
        <View
          style={{
            backgroundColor: "#fff", // Khung màu trắng
            height: height * 0.2, // Tăng chiều cao
            borderRadius: 10,
            padding: 10,
            justifyContent: "space-between",
            borderColor: "#D3D3D3", // Màu xám cho viền ảnh
            borderWidth: 1,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: placeholderImage ? "transparent" : "#D3D3D3",
              height: height * 0.15,
              width: width * 0.3,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {placeholderImage ? (
              <Image
                source={{ uri: placeholderImage }}
                style={{ height: height * 0.12, borderRadius: 10 }}
              />
            ) : (
              <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>
            )}
          </View>
          <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>
            <Text style={{ fontSize: 14, color: "#333" }}>4.5 ⭐ (25+)</Text>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
              Cơm tấm sườn
            </Text>
            <Text style={{ fontSize: 14, color: "#333" }}>45.000 VND</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
