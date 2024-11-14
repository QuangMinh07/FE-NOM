import React, { useState } from 'react';
import { View, Text, TextInput, Image, FlatList, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// Dữ liệu cho danh mục và danh sách cửa hàng
const categories = [
    { id: 1, name: "Món chính", image: require("../../img/Menu1.png") },
    { id: 2, name: "Ăn kèm", image: require("../../img/Menu2.png") },
    { id: 3, name: "Đồ uống", image: require("../../img/Menu3.png") },
    { id: 4, name: "Tráng miệng", image: require("../../img/Menu4.png") },
    { id: 5, name: "Món chay", image: require("../../img/Menu5.png") },
    { id: 6, name: "Combo", image: require("../../img/Menu6.png") },
];

const storeList = [
    { _id: 1, storeName: "Cửa hàng 1", storeAddress: "Địa chỉ 1", averageRating: 4.5, imageURL: "https://via.placeholder.com/150" },
    { _id: 2, storeName: "Cửa hàng 2", storeAddress: "Địa chỉ 2", averageRating: 4.7, imageURL: "https://via.placeholder.com/150" },
    { _id: 3, storeName: "Cửa hàng 3", storeAddress: "Địa chỉ 3", averageRating: 4.3, imageURL: "https://via.placeholder.com/150" },
    // Thêm các cửa hàng khác nếu cần
];

export default function SearchByGroup() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]); // Mảng để lưu nhiều danh mục được chọn

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const handleCategorySelect = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter((categoryId) => categoryId !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const handleStorePress = (storeId) => {
        console.log("Selected store ID:", storeId);
    };

    // Hàm render item cho cửa hàng
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
                {/* Placeholder cho Hình ảnh Cửa hàng */}
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

                {/* Thông tin chi tiết về cửa hàng */}
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: width * 0.04, color: "#333", fontWeight: "bold" }}>{store.storeName}</Text>
                    <Text style={{ fontSize: width * 0.04, color: "#E53935", marginTop: 5 }}>{store.storeAddress}</Text>
                    <Text style={{ fontSize: width * 0.04, color: "#E53935", marginTop: 5 }}>{store.averageRating}⭐</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Thanh Tìm Kiếm */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, margin: 16 }}>
                <Ionicons name="search-outline" size={25} color="#E53935" />
                <TextInput
                    placeholder="Tìm kiếm"
                    placeholderTextColor="#999"
                    style={{ marginLeft: 10, flex: 1, color: '#333' }}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {/* Danh sách Nhóm */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10, paddingLeft: 16 }}>
                {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category.id);
                    return (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => handleCategorySelect(category.id)}
                            style={{ alignItems: 'center', marginHorizontal: 10 }}
                        >
                            <Image
                                source={category.image}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    borderWidth: 2,
                                    borderColor: isSelected ? '#E53935' : 'transparent',
                                }}
                            />
                            <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 12, color: isSelected ? '#E53935' : '#333' }}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={{ flex: 20 }}>
                {/* Danh sách Cửa Hàng */}
                <FlatList
                    data={storeList}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderStoreItem}
                    contentContainerStyle={{ paddingHorizontal: width * 0.05, paddingTop: height * 0.02 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}
