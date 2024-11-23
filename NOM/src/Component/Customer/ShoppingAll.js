import React, { useState, useContext, useCallback } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, Dimensions, Alert, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function ShoppingAll() {
  const { globalData } = useContext(globalContext);
  const userId = globalData.user?.id;
  const navigation = useNavigation();

  const [selectedItems, setSelectedItems] = useState([]);
  const [isManaging, setIsManaging] = useState(false);
  const [shoppingData, setShoppingData] = useState([]);

  const fetchCartData = useCallback(async () => {
    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/cart/get-cart/${userId}`,
        sendToken: true,
      });

      if (response && response.carts) {
        const items = response.carts.flatMap((cart) =>
          cart.items.map((item) => ({
            cartId: cart._id,
            id: item.foodId,
            name: item.foodName,
            items: item.quantity,
            totalprice: `${item.totalItemPrice.toLocaleString("vi-VN")} VND`,
            price: `${item.price.toLocaleString("vi-VN")} VND`,
            image: { uri: item.imageUrl },
            storeName: item.storeName || "Không xác định",
            storeId: item.storeId,
          }))
        );
        setShoppingData(items);
      } else {
        setShoppingData([]);
      }
    } catch (error) {
      // console.error("Lỗi khi lấy thông tin giỏ hàng:", error);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchCartData();
    }, [fetchCartData])
  );

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const itemsToDelete = shoppingData.filter((item) => selectedItems.includes(item.id));

      // Xóa từng mục giỏ hàng được chọn trên máy chủ
      for (const item of itemsToDelete) {
        await api({
          method: typeHTTP.DELETE,
          url: `/cart/delete-cart/${item.cartId}`,
          sendToken: true,
        });
      }

      // Lọc các mục đã xóa ra khỏi shoppingData ngay lập tức
      setShoppingData((prevData) => prevData.filter((item) => !selectedItems.includes(item.id)));

      // Làm trống selectedItems và thoát khỏi chế độ quản lý
      setSelectedItems([]);
      setIsManaging(false);

      Alert.alert("Thông báo", "Xóa giỏ hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
      Alert.alert("Lỗi", "Không thể xóa giỏ hàng.");
    }
  };

  const handleNavigateToShopping = (storeId) => {
    if (storeId) {
      navigation.navigate("Shopping", { storeId });
    } else {
      console.warn("storeId không tồn tại");
    }
  };

  const renderShoppingItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#e0e0e0",
          backgroundColor: isSelected ? "#FFEBEE" : "#fff",
          borderRadius: 10,
        }}
        onPress={() => (isManaging ? handleSelectItem(item.id) : handleNavigateToShopping(item.storeId))}
      >
        {isSelected && <Ionicons name="checkmark-circle" size={24} color="#E53935" style={{ marginRight: 10 }} />}

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#333",
            }}
            numberOfLines={1}
          >
            {item.storeName}
          </Text>
          <Text style={{ fontSize: 14, color: "#666" }}>
            {item.items} món • {item.totalprice} • {item.name}
          </Text>
        </View>
        <Image
          source={item.image}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            marginLeft: 10,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: Platform.OS === "android" ? 40 : 20, // Điều chỉnh padding cho Android và iOS
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#e0e0e0",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333",color: "#E53935" }}>Giỏ hàng của tôi</Text>
        <TouchableOpacity onPress={() => setIsManaging(!isManaging)}>
          <Text style={{ fontSize: 16, color: "#E53935" }}>{isManaging ? "Hủy" : "Quản lý"}</Text>
        </TouchableOpacity>
      </View>

      {shoppingData.length > 0 ? (
        <FlatList data={shoppingData} keyExtractor={(item, index) => `${item.cartId}-${item.id}-${index}`} renderItem={renderShoppingItem} contentContainerStyle={{ padding: 16 }} />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Image
            source={require("../../img/tatcagiohangtrong.png")}
            style={{
              width: 280,
              height: 280,
              resizeMode: "contain",
              marginBottom: 30,
            }}
          />

          <Text style={{ fontSize: 18, color: "#333" }}>Vui lòng thêm món ăn vào giỏ hàng</Text>
        </View>
      )}

      {isManaging && selectedItems.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
          }}
        >
          <TouchableOpacity onPress={() => setSelectedItems(shoppingData.map((item) => item.id))}>
            <Text>Chọn tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#e0e0e0",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 5,
            }}
            onPress={handleDeleteSelected}
          >
            <Text style={{ color: "#E53935", fontWeight: "bold" }}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
