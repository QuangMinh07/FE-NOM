import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { api, typeHTTP } from "../../utils/api";

const { width, height } = Dimensions.get("window");

const Seach = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [storeList, setStoreList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("all"); // Trạng thái tab hiện tại
  const [filteredStoreList, setFilteredStoreList] = useState([]); // Cửa hàng được lọc
  const [foodList, setFoodList] = useState([]); // Danh sách tất cả món ăn
  const [filteredFoodList, setFilteredFoodList] = useState([]); // Danh sách món ăn theo tab
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);

        // Kiểm tra xem `searchQuery` có trống không
        const endpoint = searchQuery ? `/store/search?storeName=${searchQuery}` : "/store/get-all-store";

        const data = await api({
          method: typeHTTP.GET,
          url: endpoint,
          sendToken: true,
        });

        // Lọc bỏ các cửa hàng con (dựa trên ký tự `-` trong `storeName`)
        const filteredStores = data.data.filter((store) => !store.storeName.includes(" - "));

        setStoreList(filteredStores);
        setFilteredStoreList(filteredStores); // Mặc định hiển thị tất cả
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Gọi API khi searchQuery thay đổi
    fetchStores();
  }, [searchQuery]);

  // Hàm lấy danh sách món ăn
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await api({
          method: typeHTTP.GET,
          url: "/food/getAllfood",
          sendToken: true,
        });

        if (response && response.foods) {
          const foods = response.foods.map((food) => ({
            ...food,
            foodId: food._id, // Đảm bảo foodId được lấy từ _id
            storeId: food.storeId || food.store?._id, // Lấy storeId từ food nếu có
          }));

          setFoodList(foods);
        }
      } catch (error) {
        // console.error("Error fetching food data:", error);
      }
    };

    fetchFoods();
  }, []);

  // Xử lý khi chọn tab
  const handleTabChange = (tab) => {
    setSelectedTab(tab);

    if (tab === "rating") {
      const ratingFilteredStores = storeList.filter((store) => store.averageRating >= 4 && store.averageRating <= 5);
      setFilteredStoreList(ratingFilteredStores);
    } else if (tab === "recent") {
      // Lọc các món ăn có giảm giá
      const discountedFoods = foodList.filter((food) => food.isDiscounted && food.discountedPrice);
      setFilteredFoodList(discountedFoods);
    } else if (tab === "deal") {
      // Sắp xếp món ăn theo giá tăng dần
      const sortedFoods = [...foodList].sort((a, b) => a.price - b.price);
      setFilteredFoodList(sortedFoods);
    } else {
      setFilteredStoreList(storeList);
    }
  };

  // Navigate to StoreKH screen when a store is selected
  const handleStorePress = (storeId, foodId) => {
    navigation.navigate("StoreKH", { storeId, foodId });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center" }}>
      {/* Search Bar */}
      <View style={{ flexDirection: "row", paddingHorizontal: 15, marginTop: height * 0.05, alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
              height: height * 0.08,
            }}
          >
            <Ionicons name="search-outline" size={28} color="#E53935" />
            <TextInput placeholder="Tìm kiếm" style={{ marginLeft: 10, flex: 1, fontSize: width * 0.04 }} value={searchQuery} onChangeText={(text) => setSearchQuery(text)} />
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: height * 0.02, marginBottom: height * 0.02 }}>
        <TouchableOpacity onPress={() => handleTabChange("all")} style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: selectedTab === "all" ? "#E53935" : "#333", fontWeight: "bold", fontSize: width * 0.04 }}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange("rating")} style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: selectedTab === "rating" ? "#E53935" : "#333", fontSize: width * 0.04, fontWeight: "bold" }}>Đánh giá</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange("recent")} style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: selectedTab === "recent" ? "#E53935" : "#333", fontWeight: "bold", fontSize: width * 0.04 }}>Giảm giá</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange("deal")} style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: selectedTab === "deal" ? "#E53935" : "#333", fontWeight: "bold", fontSize: width * 0.04 }}>Tăng dần</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#E53935" />
      ) : selectedTab === "recent" || selectedTab === "deal" ? (
        <ScrollView
          style={{
            paddingHorizontal: width * 0.05,
            paddingTop: height * 0.02,
            flexGrow: 12,
          }}
        >
          {filteredFoodList.map((food, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleStorePress(food.storeId, food.foodId)} // Điều hướng với storeId và foodId
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: height * 0.02,
                  marginBottom: height * 0.02,
                  borderRadius: 10,
                  borderColor: "#f1f1f1",
                  borderWidth: 1,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  elevation: 5,
                  flexDirection: "row",
                }}
              >
                {/* Store Image Placeholder */}
                <View
                  style={{
                    backgroundColor: "#f5f5f5",
                    height: height * 0.12,
                    width: height * 0.12,
                    borderRadius: 10,
                    marginRight: width * 0.05,
                  }}
                >
                  {food.imageUrl ? (
                    <Image
                      source={{ uri: food.imageUrl }}
                      style={{
                        height: height * 0.12,
                        width: height * 0.12,
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <Text style={{ color: "#888" }}>No Image</Text>
                  )}
                </View>

                {/* Store Details */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: width * 0.04, color: "#333", marginTop: 5, fontWeight: "bold" }}>{food.foodName}</Text>
                  <Text style={{ fontSize: 14, color: "#E53935", marginTop: 5 }}>{food.price.toLocaleString("vi-VN")} VND</Text>
                  {food.isDiscounted && <Text style={{ fontSize: 14, color: "#E53935", marginTop: 5 }}>Giảm giá: {food.discountedPrice.toLocaleString("vi-VN")} VND</Text>}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        // Store List
        <ScrollView
          style={{
            paddingHorizontal: width * 0.05,
            paddingTop: height * 0.02,
            flexGrow: 12,
          }}
        >
          {filteredStoreList.map((store) => (
            <TouchableOpacity key={store._id} onPress={() => handleStorePress(store._id)}>
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: height * 0.02,
                  marginBottom: height * 0.02,
                  borderRadius: 10,
                  borderColor: "#f1f1f1",
                  borderWidth: 1,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  elevation: 5,
                  flexDirection: "row",
                }}
              >
                {/* Store Image Placeholder */}
                <View
                  style={{
                    backgroundColor: "#f5f5f5",
                    height: height * 0.12,
                    width: height * 0.12,
                    borderRadius: 10,
                    marginRight: width * 0.05,
                  }}
                >
                  {store.imageURL ? (
                    <Image
                      source={{ uri: store.imageURL }}
                      style={{
                        height: height * 0.12,
                        width: height * 0.12,
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <Text style={{ color: "#888" }}>No Image</Text>
                  )}
                </View>

                {/* Store Details */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: width * 0.04, color: "#333", marginTop: 5, fontWeight: "bold" }}>{store.storeName}</Text>
                  <Text style={{ fontSize: width * 0.04, color: "#E53935", marginTop: 5 }}>{store.storeAddress}</Text>
                  <Text style={{ fontSize: width * 0.04, color: "#E53935", marginTop: 5 }}>{store.averageRating}⭐</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Seach;
