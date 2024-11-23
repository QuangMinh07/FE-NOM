import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Image, Alert, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
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
  const { storeId, foodId: selectedFoodId } = route.params; // Kiểm tra nếu storeId có tồn tại trong route params
  const scrollViewRef = useRef(null); // Khai báo ref cho ScrollView

  const [storeIdState, setStoreIdState] = useState(storeId);
  const [reviewCount, setReviewCount] = useState(0); // State để lưu số lượng đánh giá
  const [highlightedFoodId, setHighlightedFoodId] = useState(selectedFoodId || null);
  const [isScrollViewReady, setIsScrollViewReady] = useState(false); // Thêm state để kiểm tra khi scrollView sẵn sàng
  const [isHighlightedInFirstGroup, setIsHighlightedInFirstGroup] = useState(false);
  const [groupedFoods, setGroupedFoods] = useState({});
  const [firstGroup, setFirstGroup] = useState(null);
  const [remainingGroups, setRemainingGroups] = useState([]);
  const [reviews, setReviews] = useState([]); // State to store reviews

  // Cập nhật groupedFoods và phân chia các nhóm
  useEffect(() => {
    const groupedFoodsData = groupFoodsByCategory(foodList, foodGroups) || {};
    setGroupedFoods(groupedFoodsData);

    const firstGroupData = Object.keys(groupedFoodsData)[0] || null;
    const remainingGroupsData = Object.keys(groupedFoodsData).slice(1);

    setFirstGroup(firstGroupData);
    setRemainingGroups(remainingGroupsData);
  }, [foodList, foodGroups]);

  // Kiểm tra xem highlightedFoodId có thuộc firstGroup hay không và cập nhật state
  useEffect(() => {
    if (highlightedFoodId && groupedFoods && firstGroup) {
      const isFirstGroupItem = groupedFoods[firstGroup]?.some((food) => food._id === highlightedFoodId);
      setIsHighlightedInFirstGroup(isFirstGroupItem);
    }
  }, [highlightedFoodId, groupedFoods, firstGroup]);

  // Cuộn firstGroup nếu highlightedFoodId thuộc firstGroup
  useFocusEffect(
    React.useCallback(() => {
      if (!loading && highlightedFoodId && firstGroup && isScrollViewReady && isHighlightedInFirstGroup) {
        const foodIndex = groupedFoods[firstGroup].findIndex((food) => food._id === highlightedFoodId);
        if (foodIndex !== -1) {
          const scrollPosition = foodIndex * (width * 0.55 + 15);
          setTimeout(() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
            }
          }, 100);
        }
      }
    }, [loading, highlightedFoodId, firstGroup, isScrollViewReady, isHighlightedInFirstGroup])
  );

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

  // Hàm lấy số lượng và danh sách đánh giá của cửa hàng
  const fetchReviewsAndCount = async () => {
    try {
      const reviewResponse = await api({
        method: typeHTTP.GET,
        url: `/orderReview/store-reviews/${storeId}`,
        sendToken: true,
      });

      // Cập nhật số lượng đánh giá và danh sách đánh giá
      setReviewCount(reviewResponse.reviews.length); // Lấy tổng số đánh giá
      setReviews(reviewResponse.reviews); // Lưu danh sách đánh giá để hiển thị
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviewCount(0);
      setReviews([]); // Nếu lỗi, đặt danh sách đánh giá rỗng
    }
  };

  // Gọi hàm fetch dữ liệu khi component mount
  useEffect(() => {
    fetchReviewsAndCount();
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

  const { storeName, storeAddress, isOpen, sellingTime, averageRating } = store;

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
              overflow: "hidden", // Đảm bảo ảnh không vượt ra ngoài góc bo tròn
            }}
          >
            {store.imageURL ? (
              <Image
                source={{ uri: store.imageURL }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover", // Đảm bảo ảnh bao phủ toàn bộ khung
                }}
              />
            ) : (
              <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 16 }}>Không có ảnh</Text>
              </View>
            )}
          </View>

          {/* Cart Icon */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: Platform.OS === "ios" ? height * 0.06 : height * 0.035,
              right: width * 0.05,
              backgroundColor: "#fff",
              borderRadius: width * 0.1,
              padding: width * 0.03,
              elevation: 5,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 2 },
                },
              }),
            }}
            onPress={() => {
              console.log("Navigating to Shopping with Store ID:", storeId);
              navigation.navigate("Shopping", { storeId });
            }}
          >
            <Icon name="shopping-cart" size={width * 0.06} color="#E53935" />
          </TouchableOpacity>

          {/* Store Info */}
          <View
            style={{
              position: "absolute",
              bottom: -height * 0.05, // Dynamic bottom positioning
              left: width * 0.05, // 5% of screen width from left
              right: width * 0.05, // 5% of screen width from right
              backgroundColor: "#fff",
              padding: height * 0.02, // Dynamic padding
              borderRadius: width * 0.03, // Dynamic border radius
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
              {/* Store Name */}
              <Text
                style={{
                  fontSize: width * 0.045, // Dynamic font size
                  fontWeight: "bold",
                  color: "#000",
                  maxWidth: width * 0.4, // Restrict width to prevent overflow
                }}
                numberOfLines={1} // Truncate if text is too long
              >
                {storeName}
              </Text>

              {/* Rating */}
              <Text
                style={{
                  fontSize: width * 0.035,
                  color: "#333",
                  marginTop: height * 0.005,
                }}
              >
                {averageRating} ⭐ ({reviewCount})
              </Text>

              {/* Open/Close Status */}
              <View
                style={{
                  backgroundColor: isOpen ? "#00a651" : "#E53935",
                  borderRadius: width * 0.01,
                  paddingHorizontal: width * 0.02,
                  paddingVertical: height * 0.01,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: width * 0.035,
                  }}
                >
                  {isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
                </Text>
              </View>
            </View>

            {/* Opening Hours */}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: height * 0.01,
                }}
              >
                {/* Clock Icon */}
                <Icon name="access-time" size={width * 0.05} color="#E53935" />

                {/* Opening Time Text */}
                <Text
                  style={{
                    fontSize: width * 0.04,
                    color: "#000",
                    marginLeft: width * 0.02,
                  }}
                >
                  Thời gian mở cửa:
                </Text>
              </View>
              <Text
                style={{
                  paddingLeft: width * 0.05,
                  fontSize: width * 0.04,
                  color: "#E53935",
                }}
              >
                {formatSellingTime()}
              </Text>
            </View>
            {/* Store Address */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: height * 0.01,
              }}
            >
              {/* Location Icon */}
              <Icon name="location-on" size={width * 0.05} color="#E53935" />

              {/* Store Address */}
              <Text
                style={{
                  fontSize: width * 0.04,
                  color: "#333",
                  marginLeft: width * 0.02,
                }}
              >
                {storeAddress}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 15, marginBottom: 20, marginTop: 50 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {foodList.map((food, index) => (
              <TouchableOpacity
                key={food._id || index} // Sử dụng id chính xác cho key
                style={{
                  backgroundColor: food.isAvailable ? "#fff" : "#FEE2E2", // Đổi nền nếu không có sẵn
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#eee",
                  marginRight: 15,
                  width: width * 0.4, // Chiều rộng của khung chứa
                  overflow: "hidden", // Đảm bảo không tràn ra khỏi TouchableOpacity

                }}
                onPress={() => {
                  if (food.isAvailable) {
                    console.log("Navigating to Orderfood with foodId:", food._id);
                    console.log("Navigating to Orderfood with storeId:", storeIdState);
                    if (storeIdState) {
                      navigation.navigate("Orderfood", { foodId: food._id, storeId: storeIdState });
                    } else {
                      console.error("storeIdState is undefined!");
                    }
                  } else {
                    console.warn("Food is not available!");
                  }
                }}
                disabled={!food.isAvailable} // Vô hiệu hóa nếu không có sẵn
              >
                {/* Placeholder cho ảnh */}
                <View
                  style={{
                    height: 140, // Chiều cao lớn hơn để phù hợp dạng chữ nhật đứng
                    width: "100%", // Đảm bảo chiếm toàn bộ chiều rộng
                    backgroundColor: "#f0f0f0", // Màu nền cho khung chứa ảnh
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative", // Để thêm lớp phủ và ruy băng
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
                    <Text style={{ fontSize: 14, color: "#888" }}>Ảnh món ăn</Text>
                  )}

                  {/* Overlay chữ "Đã hết" */}
                  {!food.isAvailable && (
                    <View
                      style={{
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền đen bán trong suốt
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                        Đã hết
                      </Text>
                    </View>
                  )}

                  {/* Dây ruy băng đỏ */}
                  {!food.isAvailable && (
                    <View
                      style={{
                        position: "absolute",
                        width: "80%", // Chiều dài ruy băng vừa khung
                        height: 25, // Chiều rộng ruy băng
                        backgroundColor: "#E53935", // Màu đỏ
                        transform: [{ rotate: "-39deg" }], // Điều chỉnh góc xoay để nghiêng đúng
                        bottom: -45, // Đặt sát cạnh dưới
                        right: -35, // Đảm bảo nằm trong khung
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden", // Giữ nội dung trong khung
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                        Hết món
                      </Text>
                    </View>
                  )}
                </View>

                {/* Thông tin món ăn */}
                <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 10 }}>{food.foodName}</Text>
                <Text style={{ fontSize: 12, color: "#E53935", marginTop: 5 }}>
                  {food.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND
                </Text>
              </TouchableOpacity>

            ))}
          </ScrollView>
        </View>

        {firstGroup && (
          <View style={{ paddingHorizontal: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              {foodGroups.find((fg) => fg._id === firstGroup)?.groupName || "Món Đặc Biệt"}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={(ref) => {
                scrollViewRef.current = ref;
                if (ref && !isScrollViewReady) {
                  setIsScrollViewReady(true); // Đánh dấu rằng ScrollView đã sẵn sàng
                }
              }}
            >
              {groupedFoods[firstGroup].map((food, index) => (
                <TouchableOpacity
                  key={food._id || index}
                  style={{
                    backgroundColor: food.isAvailable ? "#fff" : "#FEE2E2", // Nền đổi màu nếu không có sẵn
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#eee",
                    marginRight: 15,
                    width: width * 0.55,
                    position: "relative", // Để thêm ruy băng lên ngoài khung
                    overflow: "hidden", // Đảm bảo không tràn ra khỏi TouchableOpacity

                  }}
                  onPress={() => {
                    if (food.isAvailable) {
                      console.log("Navigating to Orderfood with foodId:", food._id);
                      console.log("Navigating to Orderfood with storeId:", storeIdState);
                      if (storeIdState) {
                        navigation.navigate("Orderfood", { foodId: food._id, storeId: storeIdState });
                      } else {
                        console.error("storeIdState is undefined!");
                      }
                    } else {
                      console.warn("Food is not available!");
                    }
                  }}
                  disabled={!food.isAvailable} // Vô hiệu hóa nếu không có sẵn
                >
                  {/* Placeholder cho ảnh */}
                  <View
                    style={{
                      height: 120, // Chiều cao lớn hơn để phù hợp dạng chữ nhật đứng
                      width: "100%", // Đảm bảo chiếm toàn bộ chiều rộng
                      backgroundColor: "#f0f0f0", // Màu nền cho khung chứa ảnh
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden", // Đảm bảo hình ảnh không vượt ra ngoài border radius
                      position: "relative", // Để thêm lớp phủ lên ảnh
                      overflow: "hidden", // Đảm bảo không tràn ra khỏi TouchableOpacity

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
                        resizeMode="cover" // Đảm bảo hình ảnh bao phủ mà không bị méo
                      />
                    ) : (
                      <Text style={{ fontSize: 14, color: "#fff" }}>Ảnh món ăn</Text>
                    )}

                    {/* Lớp phủ chữ "Đã hết" */}
                    {!food.isAvailable && (
                      <View
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền đen bán trong suốt
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                          Đã hết
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Thông tin món ăn */}
                  <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 10 }}>
                    {food.foodName}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#E53935", marginTop: 5 }}>
                    {food.price ? food.price.toLocaleString("vi-VN").replace(/\./g, ",") : "Chưa có giá"} VND
                  </Text>

                  {/* Dây ruy băng đỏ nằm ngoài khung */}
                  {!food.isAvailable && (
                    <View
                      style={{
                        position: "absolute",
                        width: 150, // Chiều dài ruy băng
                        height: 30, // Chiều rộng ruy băng
                        backgroundColor: "#E53935", // Màu đỏ
                        transform: [{ rotate: "-29deg" }], // Điều chỉnh góc xoay để nghiêng đúng
                        bottom: 6, // Đưa ruy băng lên ngoài khung dưới
                        left: 100, // Đảm bảo nằm bên ngoài khung
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1, // Đảm bảo ruy băng nằm trên các phần tử khác
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                        Hết món
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tất cả đánh giá (User Reviews) Section */}
        <View
          style={{
            backgroundColor: "#E53935",
            paddingHorizontal: 15,
            marginTop: 20,
            paddingVertical: 20,
          }}
        >
          {/* Title and "See More" Arrow Button */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>Tất cả đánh giá</Text>
            <TouchableOpacity onPress={() => navigation.navigate("CommentDetails", { storeId })}>
              <Icon name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {reviews.map((review, index) => (
              <TouchableOpacity
                key={review.id || index}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 15,
                  marginRight: 15,
                  width: 200,
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  position: "relative",
                }}
                onPress={() => navigation.navigate("CommentDetails", { reviewId: review.id, storeId })} // Navigate to CommentDetails with reviewId
              >
                <Text style={{ fontSize: 14, color: "#333", marginBottom: 10 }}>{review.comment}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                  <Icon name="star" size={14} color="#FFD700" />
                  <Text style={{ fontSize: 14, color: "#333", marginLeft: 5 }}>{review.rating}</Text>
                  <Text style={{ fontSize: 14, color: "#333", marginLeft: 5 }}>• {review.user}</Text>
                </View>

                {/* Decorative Chat Icon in the Bottom-Right Corner */}
                <Icon name="chat-bubble-outline" size={40} color="rgba(229, 57, 53, 0.2)" style={{ position: "absolute", bottom: 10, right: 10 }} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {remainingGroups.map((group, index) => (
          <ScrollView key={group || index} style={{ marginTop: 20, paddingHorizontal: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              {foodGroups.find((fg) => fg._id === group)?.groupName || "Khác"}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {groupedFoods[group].map((food, index) => (
                <TouchableOpacity
                  key={food._id || index} // Sử dụng id chính xác cho key
                  style={{
                    backgroundColor: food.isAvailable ? "#fff" : "#FEE2E2", // Nền đổi màu nếu không có sẵn
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#eee",
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    position: "relative", // Để thêm lớp phủ và ruy băng
                    overflow: "hidden", // Đảm bảo không tràn ra khỏi TouchableOpacity

                  }}
                  onPress={() => {
                    if (food.isAvailable) {
                      console.log("Navigating to Orderfood with foodId:", food._id);
                      console.log("Navigating to Orderfood with storeId:", storeIdState);
                      if (storeIdState) {
                        navigation.navigate("Orderfood", { foodId: food._id, storeId: storeIdState });
                      } else {
                        console.error("storeIdState is undefined!");
                      }
                    } else {
                      console.warn("Food is not available!");
                    }
                  }}
                  disabled={!food.isAvailable} // Vô hiệu hóa nếu không có sẵn
                >
                  <View
                    style={{
                      height: 80,
                      width: 80,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 10,
                      overflow: "hidden",
                      marginRight: 15,
                      position: "relative", // Để thêm lớp phủ và ruy băng
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

                    {/* Lớp phủ chữ "Đã hết" */}
                    {!food.isAvailable && (
                      <View
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền đen bán trong suốt
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                          Đã hết
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Thông tin món ăn */}
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{food.foodName}</Text>
                    <Text style={{ fontSize: 14 }}>{food.description}</Text>
                    <Text style={{ fontSize: 12, color: "#E53935" }}>
                      {food.price ? food.price.toLocaleString("vi-VN").replace(/\./g, ",") : "Chưa có giá"} VND
                    </Text>
                  </View>

                  {/* Dây ruy băng đỏ nằm ngoài khung */}
                  {!food.isAvailable && (
                    <View
                      style={{
                        position: "absolute",
                        width: "50%", // Đặt chiều rộng dây ruy băng theo tỷ lệ của TouchableOpacity
                        height: 25,
                        backgroundColor: "#E53935", // Màu đỏ
                        transform: [{ rotate: "-45deg" }], // Gạch chéo
                        bottom: 30, // Gần sát đáy
                        right: -25, // Dịch sang phải
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                        Hết món
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

            </ScrollView>
          </ScrollView>
        ))}
      </ScrollView>

      {/* <View
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
      </View> */}
    </View>
  );
}
