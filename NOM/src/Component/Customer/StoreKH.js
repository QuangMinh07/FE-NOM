import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api"; // Ensure you import your API utilities

const { width, height } = Dimensions.get("window"); // Get device dimensions

export default function StoreKH() {
  const navigation = useNavigation(); // To navigate between screens

  const [loading, setLoading] = useState(true); // Loading state
  const [store, setStore] = useState(null); // Store data state
  const [foodList, setFoodList] = useState([]); // Food data state
  const [error, setError] = useState(null); // Error state
  const [foodGroups, setFoodGroups] = useState([]); // State để lưu danh sách nhóm món từ MongoDB
  const route = useRoute();
  const { storeId } = route.params; // Kiểm tra nếu storeId có tồn tại trong route params
  console.log("storeId:", storeId);
  const [storeIdState, setStoreIdState] = useState(storeId);

  useEffect(() => {
    if (storeId) {
      setStoreIdState(storeId);
    }
  }, [storeId]);
  // Nhóm món ăn theo foodGroup và sắp xếp thứ tự
  const groupFoodsByCategory = (foods, foodGroups) => {
    const groupedFoods = foods.reduce((groupedFoods, food) => {
      // Tìm tên của nhóm món dựa trên ID của foodGroup trong food
      const group = foodGroups.find((group) => group._id === food.foodGroup)?._id || "Khác";
      if (!groupedFoods[group]) {
        groupedFoods[group] = [];
      }
      groupedFoods[group].push(food);
      return groupedFoods;
    }, {});
    return groupedFoods;
  };

  const getFoodGroups = async () => {
    if (!storeId) {
      console.error("storeId không tồn tại");
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/foodgroup/getfood-groups/${storeId}`,
        sendToken: true, // Gửi token để xác thực
      });

      // Kiểm tra nếu response và response.foodGroups tồn tại
      if (response && response.foodGroups) {
        setFoodGroups(response.foodGroups); // Cập nhật state với danh sách nhóm món từ MongoDB
      } else {
        console.error("Không tìm thấy nhóm món hoặc dữ liệu không hợp lệ");
      }
    } catch (error) {
      // Kiểm tra xem error.response có tồn tại không
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
      } else {
        console.error("Lỗi không xác định:", error.message);
      }
    }
  };

  useEffect(() => {
    getFoodGroups(); // Lấy danh sách nhóm món khi component được mount
  }, [storeId]); // Chỉ gọi khi storeData thay đổi

  const formatSellingTime = () => {
    if (!store.sellingTime || !store.sellingTime.length) return "Không có dữ liệu thời gian";
    const groupedTime = {};

    store.sellingTime.forEach((day) => {
      const timeSlotString = day.timeSlots.map((slot) => `${slot.open}-${slot.close}`).join(", ");
      if (!groupedTime[timeSlotString]) {
        groupedTime[timeSlotString] = [];
      }
      groupedTime[timeSlotString].push(day.day);
    });

    return Object.entries(groupedTime)
      .map(([timeSlotString, days]) => {
        return `${days.join(", ")} - ${timeSlotString.replace("-", " đến ")}`;
      })
      .join("\n");
  };

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const data = await api({
          method: typeHTTP.GET,
          url: `/store/get-store/${storeId}`, // API endpoint to get store by ID
          sendToken: true, // Send authentication token
        });
        setStore(data.data); // Set store data
      } catch (err) {
        console.error("Error fetching store:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await api({
          method: typeHTTP.GET,
          url: `/food/get-foodstore/${storeId}`, // API endpoint to get foods by store ID
          sendToken: true, // Send authentication token
        });
        setFoodList(data.foods); // Set food data
      } catch (err) {
        console.error("Error fetching foods:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStore();
      fetchFoods();
    }
  }, [storeId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading store data: {error.message}</Text>
      </View>
    );
  }

  if (!store) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Store not found</Text>
      </View>
    );
  }

  const groupedFoods = groupFoodsByCategory(foodList, foodGroups);
  const { storeName, storeAddress, isOpen, sellingTime } = store;

  const firstGroup = Object.keys(groupedFoods)[0];
  const remainingGroups = Object.keys(groupedFoods).slice(1);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/* Header - Store Banner */}
        <View style={{ position: "relative" }}>
          <View
            style={{
              backgroundColor: "#E53935",
              height: height * 0.25,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />

          {/* Cart Icon */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 60,
              right: 30,
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 8,
              elevation: 5,
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 2 },
            }}
            onPress={() => {
              console.log("Navigating to Shopping with Store ID:", storeId); // Log để kiểm tra storeId
              navigation.navigate("Shopping", { storeId });
            }}
          >
            <Icon name="shopping-cart" size={24} color="#E53935" />
          </TouchableOpacity>

          {/* Store Info */}
          <View
            style={{
              position: "absolute",
              bottom: -40,
              left: width * 0.05,
              right: width * 0.05,
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              elevation: 5,
              shadowColor: "#000",
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
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000", width: 110 }}>{storeName}</Text>
              <Text style={{ fontSize: 12, color: "#333", marginTop: 4 }}>4.5 ⭐ (25+)</Text>
              <View
                style={{
                  backgroundColor: isOpen ? "#00a651" : "#E53935",
                  borderRadius: 3,
                  paddingHorizontal: 5,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>{isOpen ? "Đang mở cửa" : "Đã đóng cửa"}</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 14, color: "#E53935", marginTop: 5 }}>Thời gian mở cửa:</Text>
              <Text style={{ paddingLeft: 20, fontSize: 14, color: "#E53935" }}>{formatSellingTime()}</Text>
            </View>

            <Text style={{ fontSize: 14, color: "#333", marginTop: 5 }}>{storeAddress}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 15, marginBottom: 20, marginTop: 50 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {foodList.map((food) => (
              <TouchableOpacity
                key={food._id} // Sử dụng id chính xác cho key
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#eee",
                  marginRight: 15,
                  width: width * 0.4, // Chiều rộng của khung chứa
                }}
                onPress={() => {
                  console.log("Navigating to Orderfood with foodId:", food._id);
                  console.log("Navigating to Orderfood with storeId:", storeIdState);
                  if (storeIdState) {
                    navigation.navigate("Orderfood", { foodId: food._id, storeId: storeIdState });
                  } else {
                    console.error("storeIdState is undefined!");
                  }
                }} 
              >
                {/* Placeholder cho ảnh */}
                <View
                  style={{
                    height: 100, // Chiều cao khung chứa
                    width: "100%", // Đảm bảo chiếm toàn bộ chiều rộng
                    backgroundColor: "#f0f0f0", // Màu nền cho khung chứa ảnh
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {food.imageUrl ? (
                    <Image
                      source={{ uri: food.imageUrl }}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 10,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>
                  )}
                </View>

                {/* Thông tin món ăn */}
                <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 10 }}>{food.foodName}</Text>
                <Text style={{ fontSize: 12, color: "#888" }}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
                <Text style={{ fontSize: 12, color: "#E53935", marginTop: 5 }}>
                  {food.rating || 5} ⭐ ({food.price.toLocaleString()} VND)
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {firstGroup && (
          <View style={{ paddingHorizontal: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>{foodGroups.find((fg) => fg._id === firstGroup)?.groupName || "Món Đặc Biệt"}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {groupedFoods[firstGroup].map((food) => (
                <TouchableOpacity
                  key={food._id}
                  style={{
                    backgroundColor: "#fff",
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#eee",
                    marginRight: 15,
                    width: width * 0.55,
                  }}
                  onPress={() => {
                    console.log("Navigating to Orderfood with foodId:", food._id);
                    console.log("Navigating to Orderfood with storeId:", storeIdState);
                    if (storeIdState) {
                      navigation.navigate("Orderfood", { foodId: food._id, storeId: storeIdState });
                    } else {
                      console.error("storeIdState is undefined!");
                    }
                  }}
                >
                  <View
                    style={{
                      height: 120,
                      width: "100%",
                      backgroundColor: "#f0f0f0", // Placeholder background color
                      borderRadius: 10,
                      overflow: "hidden", // Ensure the image doesn't exceed the border radius
                    }}
                  >
                    {food.imageUrl ? (
                      <Image
                        source={{ uri: food.imageUrl }}
                        style={{
                          height: "100%", // Fill the height of the parent View
                          width: "100%", // Fill the width of the parent View
                        }}
                        resizeMode="cover" // Ensure the image covers the View without distortion
                      />
                    ) : (
                      <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>
                    )}
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 10 }}>{food.foodName}</Text>
                  <Text style={{ fontSize: 12, color: "#E53935", marginTop: 5 }}>{food.price ? food.price.toLocaleString("vi-VN").replace(/\./g, ",") : "Chưa có giá"} VND</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {remainingGroups.map((group) => (
          <View key={group} style={{ marginTop: 20, paddingHorizontal: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>{foodGroups.find((fg) => fg._id === group)?.groupName || "Khác"}</Text>
            {groupedFoods[group].map((food) => (
              <TouchableOpacity
                key={food._id} // Sử dụng id chính xác cho key
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#eee",
                  marginRight: 15,
                  width: width * 0.4, // Chiều rộng của khung chứa
                }}
                onPress={() => {
                  console.log("Navigating to Orderfood with foodId:", food._id);
                  console.log("Navigating to Orderfood with storeId:", storeIdState);
                  if (storeIdState) {
                    navigation.navigate("Orderfood", { foodId: food._id, storeId: storeIdState });
                  } else {
                    console.error("storeIdState is undefined!");
                  }
                }}
              >
                <View
                  style={{
                    height: 80,
                    width: 80,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 10,
                    overflow: "hidden",
                    marginRight: 10,
                  }}
                >
                  {food.imageUrl ? (
                    <Image
                      source={{ uri: food.imageUrl }}
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>
                  )}
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>{food.foodName}</Text>
                  <Text style={{ fontSize: 14 }}>{food.description}</Text>
                  <Text style={{ fontSize: 12, color: "#E53935" }}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#E53935",
          padding: 15,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>20.000 VND</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "#E53935", fontSize: 16 }}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
