import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api, typeHTTP } from "../../utils/api";
import { useNavigation, useRoute } from "@react-navigation/native";

const RatingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, userId } = route.params; // Lấy orderId và userId từ route.params

  // Log orderId và userId để kiểm tra
  useEffect(() => {
    console.log("RatingScreen received orderId:", orderId, "and userId:", userId);
  }, [orderId, userId]);

  const [rating, setRating] = useState(4); // Default rating value
  const [feedback, setFeedback] = useState("");

  const forbiddenWords = ["xấu", "dốt", "ngu", "điên", "khốn", "chó", "mẹ mày", "bố mày", "đm", "vl", "vcl", "clgt", "dm", "đcm", "cmm", "mml", "vc", "đĩ", "ngu dốt", "khốn nạn", "khốn kiếp", "bần tiện", "đồ chó", "đồ điên", "đồ ngu", "đồ dốt", "mất dạy", "bẩn thỉu", "tồi tệ", "vô học", "vô đạo đức", "hèn nhát", "bẩn bựa", "đểu", "đê tiện", "vô liêm sỉ", "bỉ ổi", "khốn nạn", "cút", "biến", "chửi bới", "nhục nhã", "vô trách nhiệm"];

  const handleRatingPress = (value) => {
    setRating(value);
  };

  const containsForbiddenWords = (text) => {
    const lowerCaseText = text.toLowerCase();
    return forbiddenWords.some((word) => lowerCaseText.includes(word));
  };

  const handleSubmitRating = async () => {
    if (containsForbiddenWords(feedback)) {
      Alert.alert("Lỗi", "Vui lòng không sử dụng từ ngữ không phù hợp trong góp ý.");
      return;
    }

    try {
      // Gửi yêu cầu đến API để đánh giá đơn hàng và cửa hàng
      const response = await api({
        method: typeHTTP.POST,
        url: "/orderReview/rate-order-store",
        body: {
          orderId,
          userId,
          rating,
          comment: feedback,
        },
        sendToken: true,
      });

      if (response.message) {
        Alert.alert("Thành công", response.message);
        // Điều hướng trở lại màn hình trước hoặc màn hình chính
        navigation.navigate("HomeKH");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFFFFF" }} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          {/* Enlarged Logo */}
          <Image
            source={require("../../img/LOGOBLACK.png")}
            style={{
              width: 180,
              height: 180,
              resizeMode: "contain",
              marginBottom: 30,
            }}
          />
          {/* Question Text */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Bạn có cảm thấy hài lòng?
          </Text>
          {/* Subtext with Primary Color */}
          <Text
            style={{
              fontSize: 18,
              color: "#E53935",
              marginBottom: 30,
            }}
          >
            Người giao hàng
          </Text>
          {/* Star Rating Component */}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 30,
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRatingPress(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={45} // Slightly larger star size
                  color="#FFD700"
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>
          {/* Feedback Input */}
          <TextInput
            style={{
              width: "100%",
              height: 60,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 15,
              marginBottom: 30,
            }}
            placeholder="Góp ý"
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
            multiline
          />
          {/* Confirm Button with Primary Color */}
          <TouchableOpacity
            onPress={handleSubmitRating} // Gọi hàm khi nhấn nút Xác nhận
            style={{
              backgroundColor: "#E53935",
              paddingVertical: 18,
              paddingHorizontal: 50,
              borderRadius: 10,
              width: "100%",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Xác nhận
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RatingScreen;
