import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { api, typeHTTP } from "../../utils/api";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const SeachAll = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState(route.params?.searchQuery || "");
  const [searchResults, setSearchResults] = useState({ stores: [], foods: [] });
  const [allFoods, setAllFoods] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      getAllFoods();
    }
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/store/search-all?searchTerm=${query}`,
        sendToken: true,
      });
      if (response.success) {
        setSearchResults({
          stores: response.data.stores || [],
          foods: response.data.foods || [],
        });
      } else {
        setSearchResults({ stores: [], foods: [] });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults({ stores: [], foods: [] });
    }
  };

  const getAllFoods = async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: "/food/getAllfood",
        sendToken: true,
      });

      if (response && response.foods) {
        const foods = response.foods.slice(0, 15).map((food) => ({
          ...food,
          foodId: food._id,
          storeId: food.storeId,
        }));
        setAllFoods(foods);
      } else {
        console.log("No food data available.");
      }
    } catch (error) {
      console.error("Error fetching all foods:", error);
    }
  };

  const handleStorePress = (storeId) => {
    navigation.navigate("StoreKH", { storeId });
  };

  const handleFoodPress = (storeId, foodId) => {
    if (!storeId || !foodId) {
      console.error("Missing storeId or foodId:", { storeId, foodId });
      return;
    }
    navigation.navigate("StoreKH", { storeId, foodId });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header Section */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 30,
            height: 30,
            backgroundColor: "#E53935",
            borderRadius: 22.5,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
            elevation: 3,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Search Input */}
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 10,
            paddingHorizontal: 10,
            alignItems: "center",
            elevation: 10,
            height: height * 0.065, // Chiều cao linh hoạt
            shadowColor: "#000", // Bóng cho iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3.84,
          }}
        >
          <Ionicons name="search-outline" size={30} color="#E53935" />
          <TextInput
            placeholder="Tìm kiếm"
            style={{
              flex: 1,
              fontSize: 16,
              paddingVertical: 8,
              paddingHorizontal: 5,
              marginLeft: 5,
            }}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              fetchSearchResults(text);
            }}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {/* Search Results */}
        {searchQuery && (
          <>
            {/* Store Results */}
            {searchResults.stores.length > 0 && (
              <>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Cửa hàng</Text>
                {searchResults.stores.map((store, index) => (
                  <TouchableOpacity
                    key={store._id || index}
                    onPress={() => handleStorePress(store._id)}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      marginBottom: 15,
                      padding: 10,
                      elevation: 3,
                    }}
                  >
                    <Image
                      source={{ uri: store.imageURL }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 10,
                      }}
                    />
                    <View style={{ marginLeft: 10, flex: 1, justifyContent: "space-around" }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{store.storeName}</Text>
                      <Text style={{ fontSize: 14, color: "#888" }}>{store.storeAddress}</Text>
                      <Text style={{ fontSize: 14, color: "#E53935" }}>{store.averageRating}⭐</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Food Results */}
            {searchResults.foods.length > 0 && (
              <>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Món ăn</Text>
                {searchResults.foods.map((food, index) => (
                  <TouchableOpacity
                    key={food._id || index}
                    onPress={() =>
                      handleFoodPress(food.store?.storeId || food.store?._id, food._id)
                    }
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      marginBottom: 15,
                      padding: 10,
                      elevation: 3,
                    }}
                  >
                    <Image
                      source={{ uri: food.imageUrl }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 10,
                      }}
                    />
                    <View style={{ marginLeft: 10, flex: 1, justifyContent: "space-around" }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{food.foodName}</Text>
                      <Text style={{ fontSize: 14, color: "#888" }}>{food.store?.storeName}</Text>
                      <Text style={{ fontSize: 14, color: "#E53935" }}>
                        {food.price.toLocaleString("vi-VN")} VND
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}

        {/* All Foods */}
        {!searchQuery && allFoods.length > 0 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Tất cả món ăn</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {allFoods.map((food, index) => (
                <TouchableOpacity
                  key={food.foodId || index}
                  onPress={() => handleFoodPress(food.storeId, food.foodId)}
                  style={{
                    width: (width - 60) / 3,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    marginBottom: 15,
                    alignItems: "center",
                    padding: 5,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={{ uri: food.imageUrl }}
                    style={{
                      width: "100%",
                      height: 100,
                      borderRadius: 10,
                    }}
                  />
                  <Text style={{ fontSize: 14, fontWeight: "bold", textAlign: "center", marginTop: 5 }}>
                    {food.foodName}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#E53935", textAlign: "center", marginTop: 3 }}>
                    {food.price.toLocaleString("vi-VN")} VND
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* No Results */}
        {searchQuery &&
          searchResults.stores.length === 0 &&
          searchResults.foods.length === 0 && (
            <Text
              style={{
                fontSize: 16,
                color: "#888",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Không tìm thấy kết quả phù hợp
            </Text>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SeachAll;
