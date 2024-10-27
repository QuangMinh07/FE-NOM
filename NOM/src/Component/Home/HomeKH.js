import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import icons
import { api, typeHTTP } from "../../utils/api"; // Import the reusable API function
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window"); // Get screen width

const HomeKH = () => {
  const [userData, setUserData] = useState(null); // State to store user data
  const navigation = useNavigation();
  const [foodList, setFoodList] = useState([
    { _id: "1", foodName: "Phở bò", price: 50000, imageUrl: null },
    { _id: "2", foodName: "Bánh mì", price: 20000, imageUrl: null },
    { _id: "3", foodName: "Cơm tấm", price: 40000, imageUrl: null },
    { _id: "4", foodName: "Bún chả", price: 45000, imageUrl: null },
  ]);

  // Fetch user profile from API
  const getUserProfile = async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: "/user/profile",
        sendToken: true,
      });

      if (response.success) {
        setUserData(response.user); // Save user data to state
        console.log("User data:", response.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUserProfile();
    }, [])
  );

  const categories = [
    { id: 1, name: "Món chính", image: require("../../img/Menu1.png") },
    { id: 2, name: "Ăn kèm", image: require("../../img/Menu2.png") },
    { id: 3, name: "Đồ uống", image: require("../../img/Menu3.png") },
    { id: 4, name: "Tráng miệng", image: require("../../img/Menu4.png") },
    { id: 5, name: "Món chay", image: require("../../img/Menu5.png") },
    { id: 6, name: "Combo", image: require("../../img/Menu6.png") },
  ];

  const banners = [
    { id: 1, name: "TIMMON1", image: require("../../img/TIMMON1.png") },
    { id: 2, name: "TIMMON2", image: require("../../img/TIMMON2.png") },
    { id: 3, name: "TIMMON3", image: require("../../img/TIMMON3.png") },
  ];

  
  const banners1 = [
    { id: 3, name: "banner3", image: require("../../img/03.png") },
    { id: 1, name: "banner1", image: require("../../img/01.png") },
    { id: 2, name: "banner6", image: require("../../img/06.png") },
    { id: 2, name: "banner2", image: require("../../img/02.png") },
    { id: 2, name: "banner4", image: require("../../img/04.png") },
    { id: 2, name: "banner5", image: require("../../img/05.png") },
   
  ];


  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#E53935", padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 140 }}>
        {/* User Information */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 50, height: 50, backgroundColor: "#fff", borderRadius: 25, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{userData ? userData.fullName.charAt(0) : "N"}</Text>
          </View>
          <Text style={{ color: "#fff", fontSize: 18, marginLeft: 10 }}>{userData ? userData.fullName : "Nguyễn Thị Kiều Nghi"}</Text>
        </View>

        {/* Icons */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate("Shopping")}
          >
            <Ionicons name="cart-outline" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("CustomerNotice")}
          >
            <Ionicons name="notifications-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar and Heart Icon */}
      <View style={{ flexDirection: "row", paddingHorizontal: 15, marginTop: -30, alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, elevation: 5, height: 50 }}>
            <Ionicons onPress={() => navigation.navigate("Search")} name="search-outline" size={25} color="#E53935" />
            <TextInput placeholder="Tìm kiếm" style={{ marginLeft: 10, flex: 1 }} />
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("FavoriteFood")} style={{ marginLeft: 10 }}>
          <View style={{ backgroundColor: "#fff", width: 50, height: 50, justifyContent: "center", alignItems: "center", borderRadius: 25 }}>
            <Ionicons name="heart-outline" size={25} color="#E53935" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={{ marginTop: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10 }}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={{ alignItems: "center", marginHorizontal: 15 }}>
              <Image source={category.image} style={{ width: 50, height: 50, borderRadius: 25 }} />
              <Text style={{ marginTop: 10, fontWeight: "bold" }}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView>
        {/* Banner List */}
        <Text style={{ fontSize: 18, fontWeight: "bold", padding: 14, }}>Tìm món ngon</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 15, }}>
          {banners.map((banner) => (
            <TouchableOpacity key={banner.id} style={{ marginRight: 10 }}>
              <Image
                source={banner.image}
                style={{
                  width: width * 0.8,
                  height: undefined,
                  aspectRatio: 4.8 / 2,
                  borderRadius: 10,
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

 {/* Best Sellers */}
<View style={{ marginTop: 25, paddingHorizontal: 15 }}>
  <Text style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 5 }}>Đề xuất</Text>
  <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 10 }}>
    {foodList.map((food) => (
      <View key={food._id} style={{ width: (width - 60) / 2, marginBottom: 15, backgroundColor: "#fff", borderRadius: 15, overflow: "hidden", elevation: 3, height:200 }}>
        {/* Image and Heart Icon */}
        <View style={{ position: "relative", backgroundColor: food.imageUrl ? "transparent" : "#D3D3D3", borderTopLeftRadius: 15, borderTopRightRadius: 15, overflow: "hidden" }}>
          {food.imageUrl ? (
            <Image source={{ uri: food.imageUrl }} style={{ width: "100%", height: 120 }} />
          ) : (
            <View style={{ width: "100%", height: 120, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "#888" }}>Ảnh món ăn</Text>
            </View>
          )}
          <TouchableOpacity style={{ position: "absolute", top: 10, right: 10, backgroundColor: "#fff", padding: 5, borderRadius: 15 }}>
            <Ionicons name="heart-outline" size={18} color="#E53935" />
          </TouchableOpacity>
        </View>

        {/* Rating */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, marginTop: 5 }}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>4.5</Text>
          <Ionicons name="star" size={14} color="#FFC107" style={{ marginHorizontal: 5 }} />
          <Text style={{ fontSize: 12, color: "#888" }}>(25+)</Text>
        </View>

        {/* Food Name and Description */}
        <View style={{ paddingHorizontal: 10, marginTop: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{food.foodName}</Text>
          <Text style={{ fontSize: 14, color: "#888" }}>Mỳ ý sốt kem</Text>
        </View>

        {/* Plus Icon */}
        <TouchableOpacity 
          onPress={() => {/* Function to increment count */}} 
          style={{ position: "absolute", bottom: 10, right: 10, backgroundColor: "#E53935", width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    ))}
  </View>
</View>
        {/* Best Sellers */}
        <View style={{ marginTop: 25, backgroundColor: "#E53935", paddingVertical: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 15, color: "white" }}>Có thể bạn sẽ thích</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
            {foodList.map((food) => (
              <View key={food._id} style={{ width: width * 0.4, marginRight: 15, backgroundColor: "#fff", borderRadius: 10, padding: 10, elevation: 3 }}>
                <View style={{ width: "100%", height: 100, backgroundColor: food.imageUrl ? "transparent" : "#D3D3D3", borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                  {food.imageUrl ? <Image source={{ uri: food.imageUrl }} style={{ width: "100%", height: "100%", borderRadius: 10 }} /> : <Text style={{ color: "#fff" }}>Ảnh món ăn</Text>}
                </View>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>{food.foodName}</Text>
                <Text style={{ fontSize: 14, color: "#888" }}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Other Foods */}
        <View style={{ marginTop: 20, paddingHorizontal: 15, flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Các món khác</Text>
          <ScrollView style={{ marginTop: 10 }}>
            {foodList.map((food) => (
              <View key={food._id} style={{ flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 15, elevation: 3 }}>
                <View style={{ width: 80, height: 80, backgroundColor: food.imageUrl ? "transparent" : "#D3D3D3", borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                  {food.imageUrl ? <Image source={{ uri: food.imageUrl }} style={{ width: "100%", height: "100%", borderRadius: 10 }} /> : <Text style={{ color: "#fff" }}>Ảnh món ăn</Text>}
                </View>
                <View style={{ flex: 1, marginLeft: 10, justifyContent: "space-around" }}>
                  <Text style={{ fontSize: 14, color: "#888" }}>4.5 ⭐ (25+)</Text>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{food.foodName}</Text>
                  <Text style={{ fontSize: 14, color: "#E53935" }}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Best Sellers */}
        <View style={{ marginTop: 25 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 15 }}>Khám phá ngay</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
            {foodList.map((food) => (
              <View key={food._id} style={{ width: width * 0.4, marginRight: 15, backgroundColor: "#fff", borderRadius: 10, padding: 10, elevation: 3 }}>
                <View style={{ width: "100%", height: 100, backgroundColor: food.imageUrl ? "transparent" : "#D3D3D3", borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                  {food.imageUrl ? <Image source={{ uri: food.imageUrl }} style={{ width: "100%", height: "100%", borderRadius: 10 }} /> : <Text style={{ color: "#fff" }}>Ảnh món ăn</Text>}
                </View>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>{food.foodName}</Text>
                <Text style={{ fontSize: 14, color: "#888" }}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
              </View>
            ))}
          </ScrollView>
        </View>
 {/* Banner List */}
 <Text style={{ fontSize: 18, fontWeight: "bold", padding: 14, }}>Tìm món ngon</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 15, }}>
          {banners1.map((banner) => (
            <TouchableOpacity key={banner.id} style={{ marginRight: 10 }}>
              <Image
                source={banner.image}
                style={{
                  width: width * 0.8,
                  height: undefined,
                  aspectRatio: 4.8 / 2,
                  borderRadius: 10,
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Other Foods */}
        <View style={{ marginTop: 20, paddingHorizontal: 15, flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Các món khác</Text>
          <ScrollView style={{ marginTop: 10 }}>
            {foodList.map((food) => (
              <View key={food._id} style={{ flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 15, elevation: 3 }}>
                <View style={{ width: 80, height: 80, backgroundColor: food.imageUrl ? "transparent" : "#D3D3D3", borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                  {food.imageUrl ? <Image source={{ uri: food.imageUrl }} style={{ width: "100%", height: "100%", borderRadius: 10 }} /> : <Text style={{ color: "#fff" }}>Ảnh món ăn</Text>}
                </View>
                <View style={{ flex: 1, marginLeft: 10, justifyContent: "space-around" }}>
                  <Text style={{ fontSize: 14, color: "#888" }}>4.5 ⭐ (25+)</Text>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{food.foodName}</Text>
                  <Text style={{ fontSize: 14, color: "#E53935" }}>{food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeKH;
