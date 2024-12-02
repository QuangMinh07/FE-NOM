import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, FlatList, Dimensions, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Swipeable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api, typeHTTP } from "../../utils/api"; // Import API function
import { globalContext } from "../../context/globalContext"; // Import globalContext
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const { width, height } = Dimensions.get("window"); // Lấy kích thước màn hình

export default function FavoriteFood() {
  const insets = useSafeAreaInsets();
  const [thucAn, setThucAn] = useState([]);
  const { globalData } = useContext(globalContext);
  const userId = globalData.user?.id;
  const navigation = useNavigation(); // Sử dụng useNavigation để điều hướng

  // Hàm lấy danh sách cửa hàng yêu thích
  const getFavoriteStores = async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/user/get-favorite-store/${userId}`,
        sendToken: true,
      });

      console.log("API response:", response); // Log toàn bộ phản hồi từ API

      // Kiểm tra nếu response chứa trường favoriteStores và có dữ liệu
      if (response.favoriteStores && response.favoriteStores.length > 0) {
        setThucAn(response.favoriteStores);
      } else {
        // console.log("Không có cửa hàng yêu thích.");
        setThucAn([]); // Nếu không có cửa hàng yêu thích, set mảng rỗng
      }
    } catch (error) {
      // console.error("Lỗi khi lấy danh sách cửa hàng yêu thích:", error);
      setThucAn([]); // Set mảng rỗng khi có lỗi xảy ra
    }
  };

  useEffect(() => {
    if (userId) {
      getFavoriteStores(); // Gọi API khi màn hình được load
    }
  }, [userId]);

  const loaiBoThucAn = async (storeId) => {
    try {
      console.log("storeId:", storeId);
      console.log("userId:", userId);

      const response = await api({
        method: typeHTTP.POST,
        url: "/user/remove-favorite-store",
        body: { userId, storeId },
        sendToken: true,
      });

      console.log("API response:", response); // Kiểm tra toàn bộ phản hồi từ API

      if (response.message === "Cửa hàng đã được xóa khỏi danh sách yêu thích") {
        // Cập nhật lại danh sách yêu thích sau khi xóa
        setThucAn((prev) => prev.filter((store) => store._id !== storeId));
        Alert.alert("Thành công", "Cửa hàng đã được xóa khỏi danh sách yêu thích.");
      } else {
        Alert.alert("Lỗi", "Không thể xóa cửa hàng yêu thích.");
      }
    } catch (error) {
      // console.error("Lỗi khi xóa cửa hàng yêu thích:", error);
      Alert.alert("Lỗi", "Không thể xóa cửa hàng yêu thích.");
    }
  };

  const renderRightActions = (storeId) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#E53935",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderRadius: 10,
        marginBottom: 10,
      }}
      onPress={() => loaiBoThucAn(storeId)} // Gọi hàm xóa cửa hàng yêu thích
    >
      <Icon name="trash-outline" size={30} color="#fff" />
      <Text style={{ color: "#fff", fontSize: 12, marginTop: 5 }}>Xóa</Text>
    </TouchableOpacity>
  );

  const hienThiMonAn = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item._id)} overshootRight={false}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f9f9f9",
          padding: 15,
          borderRadius: 12,
          marginBottom: 15,
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        onPress={() => navigation.navigate("StoreKH", { storeId: item._id })} // Chuyển tới StoreKH và truyền storeId
      >
        <Image
          source={{ uri: item.imageURL }}
          style={{
            width: 70,
            height: 70,
            borderRadius: 12,
            marginRight: 15,
          }}
        />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>{item.storeName}</Text>
          <Text style={{ fontSize: 14, color: "#666", marginTop: 6 }}>{item.storeAddress}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header Full Màn Hình */}
      <View
        style={{
          backgroundColor: "#E53935",
          height: height * 0.15, // Chiều cao header
          width: "100%", // Full chiều ngang
          paddingTop: insets.top + 10, // Đệm trên cho notch
          paddingHorizontal: 20, // Khoảng cách 2 bên
          position: "absolute", // Đảm bảo chiếm toàn bộ chiều ngang
          top: 0, // Căn sát đỉnh màn hình
          left: 0, // Căn sát mép trái
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
            marginTop: 20, // Thêm khoảng cách giữa icon và tiêu đề
          }}
        >
          Cửa Hàng Yêu Thích
        </Text>
      </View>

      {/* Danh sách thức ăn */}
      {thucAn.length > 0 ? (
        <FlatList
          data={thucAn}
          renderItem={hienThiMonAn}
          keyExtractor={(item) => item._id} // Sử dụng _id làm key
          contentContainerStyle={{
            paddingHorizontal: 15, // Lề hai bên
            paddingBottom: insets.bottom + 30, // Khoảng cách phía dưới
            paddingTop: height * 0.15 + 10, // Đặt khoảng cách bằng chiều cao của header
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "#999" }}>Bạn chưa có cửa hàng yêu thích nào.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
// import React, { useState } from "react";
// import { SafeAreaView, View, Text, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
// import { Swipeable } from "react-native-gesture-handler";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const { width } = Dimensions.get("window");

// export default function FavoriteFood({ navigation }) {
//   const insets = useSafeAreaInsets();

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: "#fff",
//         paddingTop: insets.top,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {/* Logo */}
//       <Image
//         source={require("../../img/LOGONOM.png")} // Điều chỉnh đường dẫn nếu cần
//         style={{
//           width: width * 0.6,
//           height: width * 0.6,
//           resizeMode: "contain",
//           marginBottom: 20,
//         }}
//       />

//       {/* Thông báo */}
//       <Text
//         style={{
//           fontSize: 18,
//           fontWeight: "bold",
//           color: "#333",
//           textAlign: "center",
//           marginBottom: 10,
//         }}
//       >
//         Tính năng đang được phát triển
//       </Text>
//       <Text
//         style={{
//           fontSize: 16,
//           color: "#666",
//           textAlign: "center",
//           marginBottom: 30,
//         }}
//       >
//         Xin lỗi đã làm gián đoạn trải nghiệm của bạn. Chúng tôi đang nỗ lực để hoàn thiện tính năng này.
//       </Text>

//       {/* Nút Go Back */}
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={{
//           backgroundColor: "#E53935",
//           paddingVertical: 10,
//           paddingHorizontal: 20,
//           borderRadius: 8,
//           flexDirection: "row",
//           alignItems: "center",
//         }}
//       >
//         <Icon name="arrow-back" size={20} color="#fff" style={{ marginRight: 10 }} />
//         <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Quay Lại</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }
