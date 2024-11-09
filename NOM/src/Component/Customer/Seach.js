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

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
  
        // Kiểm tra xem `searchQuery` có trống không
        const endpoint = searchQuery
          ? `/store/search?storeName=${searchQuery}`
          : "/store/get-all-store";
  
        const data = await api({
          method: typeHTTP.GET,
          url: endpoint,
          sendToken: true,
        });
  
        setStoreList(data.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Gọi API khi searchQuery thay đổi
    fetchStores();
  }, [searchQuery]);
  

  // Navigate to StoreKH screen when a store is selected
  const handleStorePress = (storeId) => {
    navigation.navigate("StoreKH", { storeId });
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
        <TouchableOpacity style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: "#E53935", fontWeight: "bold", fontSize: width * 0.04 }}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: "#333", fontSize: width * 0.04 }}>Gần nhất</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: "#333", fontSize: width * 0.04 }}>Đánh giá</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingHorizontal: width * 0.05 }}>
          <Text style={{ color: "#333", fontSize: width * 0.04 }}>Ưu đãi</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#E53935" />
      ) : (
        // Store List
        <ScrollView
          style={{
            paddingHorizontal: width * 0.05,
            paddingTop: height * 0.02,
            flexGrow: 1,
          }}
        >
          {storeList.map((store) => (
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
