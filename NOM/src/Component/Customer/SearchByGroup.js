import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, FlatList, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { api, typeHTTP } from "../../utils/api";

const { width, height } = Dimensions.get("window");

const categories = [
  { id: 1, name: "Món chính", image: require("../../img/Menu1.png") },
  { id: 2, name: "Ăn kèm", image: require("../../img/Menu2.png") },
  { id: 3, name: "Đồ uống", image: require("../../img/Menu3.png") },
  { id: 4, name: "Tráng miệng", image: require("../../img/Menu4.png") },
  { id: 5, name: "Món chay", image: require("../../img/Menu5.png") },
  { id: 6, name: "Combo", image: require("../../img/Menu6.png") },
];

export default function SearchByGroup({ route, navigation }) {
  const { foodType } = route.params || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(foodType ? [foodType] : []);
  const [stores, setStores] = useState([]);

  const handleSearch = (text) => setSearchQuery(text);

  const handleCategorySelect = (name) => {
    setSelectedCategories((prevCategories) => (prevCategories.includes(name) ? prevCategories.filter((category) => category !== name) : [...prevCategories, name]));
  };

  const handleStorePress = (storeId) => {
    console.log("Navigating to StoreKH with storeId:", storeId); // Log để kiểm tra storeId
    navigation.navigate("StoreKH", { storeId });
  };

  // Hàm lọc cửa hàng con
  const filterOutSubStores = (storeList) => {
    return storeList.filter((store) => !store.storeName.includes(" - "));
  };

  // Gọi API `searchStores` để tìm kiếm theo `searchQuery` và `selectedCategories`
  const searchStores = async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/store/search?storeName=${searchQuery}`,
        sendToken: true,
      });
      const filteredStores = filterOutSubStores(response.success ? response.data : []);

      setStores(filteredStores);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm cửa hàng:", error);
      setStores([]);
    }
  };

  // Gọi API `getStoresForCategories` để lấy cửa hàng theo các nhóm món ăn
  const getStoresForCategories = async () => {
    try {
      const storeResults = await Promise.all(
        selectedCategories.map(async (foodType) => {
          const response = await api({
            method: typeHTTP.GET,
            url: `/store/by-food-type/${foodType}`,
            sendToken: true,
          });
          return response.success ? response.data : [];
        })
      );
      const uniqueStores = Array.from(new Map(storeResults.flat().map((store) => [store._id, store])).values());
      const filteredStores = filterOutSubStores(uniqueStores); // Lọc cửa hàng con
      setStores(filteredStores);
    } catch (error) {
      // console.error("Lỗi khi lấy danh sách cửa hàng theo các nhóm món ăn:", error);
      setStores([]);
    }
  };

  // Điều kiện gọi API tìm kiếm hoặc lấy danh sách theo loại thức ăn
  useEffect(() => {
    if (searchQuery) {
      searchStores();
    } else if (selectedCategories.length > 0) {
      getStoresForCategories();
    } else {
      setStores([]);
    }
  }, [selectedCategories, searchQuery]);

  const renderStoreItem = ({ item: store }) => (
    <TouchableOpacity onPress={() => handleStorePress(store._id)}>
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
          alignItems: "center",
          paddingHorizontal: width * 0.05,
        }}
      >
        <View
          style={{
            backgroundColor: "#f5f5f5",
            height: height * 0.12,
            width: height * 0.12,
            borderRadius: 10,
            marginRight: width * 0.05,
            justifyContent: "center",
            alignItems: "center",
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

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: width * 0.04, color: "#333", fontWeight: "bold" }}>{store.storeName}</Text>
          <Text style={{ fontSize: width * 0.04, color: "#E53935", marginTop: 5 }}>{store.storeAddress}</Text>
          <Text style={{ fontSize: width * 0.04, color: "#E53935", marginTop: 5 }}>{store.averageRating}⭐</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f8f8f8", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, margin: 16 }}>
        <Ionicons name="search-outline" size={25} color="#E53935" />
        <TextInput placeholder="Tìm kiếm" placeholderTextColor="#999" style={{ marginLeft: 10, flex: 1, color: "#333" }} value={searchQuery} onChangeText={handleSearch} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10, paddingLeft: 16 }}>
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.name);
          return (
            <TouchableOpacity key={category.id} onPress={() => handleCategorySelect(category.name)} style={{ alignItems: "center", marginHorizontal: 10 }}>
              <Image
                source={category.image}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: isSelected ? "#E53935" : "transparent",
                }}
              />
              <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 12, color: isSelected ? "#E53935" : "#333" }}>{category.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ flex: 22, paddingHorizontal: width * 0.05, paddingTop: height * 0.02 }}>
        {stores.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              padding: 20,
            }}
          >
            {/* <Image
              source={require("../../img/LOGOBLACK.png")}
              style={{
                width: 180,
                height: 180,
                resizeMode: "contain",
                marginBottom: 30,
              }}
            /> */}
            <Image
              source={require("../../img/Illustration.png")}
              style={{
                width: 180,
                height: 180,
                resizeMode: "contain",
                marginBottom: 30,
                marginTop: "30%",
              }}
            />

            <Text style={{ fontSize: 14, color: "#333" }}>Không có cửa hàng thuộc nhóm món này</Text>
          </View>
        ) : (
          <FlatList data={stores} keyExtractor={(item) => item._id.toString()} renderItem={renderStoreItem} showsVerticalScrollIndicator={false} />
        )}
      </View>
    </SafeAreaView>
  );
}
