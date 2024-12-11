import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Button, KeyboardAvoidingView, Platform } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons"; // Import icon library
import { api, typeHTTP } from "../../utils/api"; // Import the reusable API function
import { globalContext } from "../../context/globalContext";

export default function Comment() {
  const [selectedTab, setSelectedTab] = useState("Tất cả"); // State quản lý tab đang chọn
  const [storeData, setStoreData] = useState(null); // State lưu trữ dữ liệu cửa hàng
  const [storeReviews, setStoreReviews] = useState([]); // State lưu danh sách đánh giá
  const [replyInput, setReplyInput] = useState(""); // Nội dung trả lời
  const [replyingTo, setReplyingTo] = useState(null); // Đánh giá hiện đang trả lời

  const { globalData } = useContext(globalContext);

  const fetchReviewsAndCount = async () => {
    try {
      const storeId = globalData.storeData?._id; // Lấy storeId từ globalData

      const reviewResponse = await api({
        method: typeHTTP.GET,
        url: `/orderReview/store-reviews/${storeId}`,
        sendToken: true,
      });

      // Cập nhật số lượng đánh giá và danh sách đánh giá
      setStoreReviews(reviewResponse.reviews); // Lưu danh sách đánh giá để hiển thị
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setStoreReviews([]); // Nếu lỗi, đặt danh sách đánh giá rỗng
    }
  };

  // Gọi hàm fetch dữ liệu khi component mount
  useEffect(() => {
    fetchReviewsAndCount();
  }, [fetchReviewsAndCount]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeId = globalData.storeData?._id; // Lấy storeId từ globalData

        if (!storeId) {
          console.error("Không tìm thấy storeId trong globalData:", globalData);
          return; // Dừng nếu storeId không tồn tại
        }

        const response = await api({
          method: typeHTTP.GET,
          url: `/store/get-store/${storeId}`, // Đảm bảo endpoint đúng
          sendToken: true,
        });

        if (response.success) {
          setStoreData(response.data);
        } else {
          console.error("Lỗi khi lấy dữ liệu cửa hàng:", response.message);
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStoreData();
  }, []);

  const handleReplySubmit = async () => {
    if (!replyInput.trim() || !replyingTo) return;

    const userId = globalData.user?.id; // Lấy userId từ globalData

    console.log("Sending reply:", { replyText: replyInput, userId });

    if (!userId) {
      console.error("Không tìm thấy userId trong globalData:", globalData);
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.POST,
        url: `/orderReview/reply/${replyingTo}`,
        sendToken: true,
        body: {
          replyText: replyInput,
          userId,
        },
      });

      if (response.success) {
        setReplyInput("");
        setReplyingTo(null);
        fetchReviewsAndCount(); // Làm mới danh sách đánh giá
      } else {
        console.error("Lỗi khi gửi phản hồi:", response.message);
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null} // Chỉ iOS cần padding
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Offset khi bàn phím mở
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Phản hồi</Text>
      </View>
      {/* Phần hiển thị đánh giá */}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingTitle}>Quán</Text>
          <Text style={styles.ratingScore}>{storeData ? storeData.averageRating.toFixed(1) : "Đang tải..."}</Text>
          <View style={styles.starContainer}>
            {storeData
              ? [...Array(5)].map((_, index) => {
                  const rating = storeData.averageRating;
                  const filled = index + 1 <= Math.floor(rating);
                  const halfFilled = index + 1 === Math.ceil(rating) && !Number.isInteger(rating);

                  return <FontAwesome key={index} name={filled ? "star" : halfFilled ? "star-half" : "star-o"} size={18} color="#FFC529" />;
                })
              : null}
          </View>
          <Text style={styles.ratingCount}>{storeReviews.length} người bình luận</Text>
        </View>
        {/* <View style={styles.ratingBox}>
          <Text style={styles.ratingTitle}>Món</Text>
          <Text style={styles.ratingScore}>{storeData ? storeData.averageRating.toFixed(1) : "Đang tải..."}</Text>
          <View style={styles.starContainer}>
            {storeData
              ? [...Array(5)].map((_, index) => {
                  const rating = storeData.averageRating;
                  const filled = index + 1 <= Math.floor(rating);
                  const halfFilled = index + 1 === Math.ceil(rating) && !Number.isInteger(rating);

                  return <FontAwesome key={index} name={filled ? "star" : halfFilled ? "star-half" : "star-o"} size={18} color="#E53935" />;
                })
              : null}
          </View>
          <Text style={styles.ratingCount}>{storeReviews.length} người bình luận</Text>
        </View> */}
      </View>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["Tất cả", "Đánh giá", "Bình luận"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)} style={[styles.tabItem, selectedTab === tab && styles.tabItemSelected]}>
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextSelected]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Danh sách phản hồi */}
      <ScrollView>
        {storeReviews.length > 0 ? (
          storeReviews.map((review, index) => (
            <View key={index} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentUserName}>{review.user}</Text>
                <View style={styles.starContainer}>
                  {[...Array(5)].map((_, idx) => {
                    const filled = idx + 1 <= Math.floor(review.rating);
                    const halfFilled = idx + 1 === Math.ceil(review.rating) && !Number.isInteger(review.rating);

                    return <FontAwesome key={idx} name={filled ? "star" : halfFilled ? "star-half" : "star-o"} size={16} color="#FFC529" />;
                  })}
                  <Text style={styles.commentRating}>{review.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.commentDate}>{new Date(review.reviewDate).toLocaleDateString("vi-VN")}</Text>
              </View>
              <Text style={styles.commentText}>{review.comment}</Text>
              {review.replies?.map((reply, idx) => (
                <View key={idx} style={styles.replySection}>
                  <Text style={styles.replyText}>Phản hồi từ quán</Text>
                  <Text style={styles.replyText}>{reply.replyText}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.replyButton} onPress={() => setReplyingTo(review._id)}>
                <AntDesign name="message1" size={16} color="black" />
                <Text style={styles.replyButtonText}>Trả lời</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noComments}>Chưa có đánh giá nào.</Text>
        )}
      </ScrollView>
      {/* Phần nhập phản hồi */}
      {replyingTo && (
        <View style={styles.replyInputContainer}>
          <TextInput style={styles.replyInput} placeholder="Nhập phản hồi của bạn..." value={replyInput} onChangeText={setReplyInput} />
          <Button title="Gửi" onPress={handleReplySubmit} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    paddingBottom: 100, // Dành không gian để hiển thị khung nhập
  },
  header: {
    backgroundColor: "#E53935",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 140,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -30,
    marginHorizontal: 15,
    paddingVertical: 10,
  },
  ratingBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: "95%",
    elevation: 3,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E53935",
    marginBottom: 5,
  },
  ratingScore: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E53935",
  },
  starContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  ratingCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 10,
    marginTop: 10,
  },
  tabItem: {
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemSelected: {
    borderBottomColor: "#E53935",
  },
  tabText: {
    fontSize: 16,
    color: "#6B7280",
  },
  tabTextSelected: {
    color: "#E53935",
  },
  commentCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    elevation: 3,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  commentUserName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E53935",
  },
  commentRating: {
    marginLeft: 5,
    fontSize: 14,
    color: "#E53935",
  },
  commentDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  commentText: {
    fontSize: 14,
    color: "#424242",
    marginBottom: 10,
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  replyButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#424242",
  },
  replyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  replyInput: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  replySection: {
    marginTop: 10,
    marginLeft: 20,
  },
  replyText: {
    fontSize: 14,
    color: "#424242",
  },
});
