import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const reviews = [
  {
    id: 1,
    name: 'Nguyễn Minh Khuê',
    rating: 5,
    date: '4 ngày trước',
    comment: 'Đồ uống ok không quá ngọt, oolong sữa ngon xỉu 😋',
    products: 'Đề xuất: Olong Sữa, Trà Dâu Tươi, Sữa Tươi Kem Trứng Nướng',
    likes: 10,
    userLiked: false,
    response: null,
  },
  {
    id: 2,
    name: 'Phan Chí Lâm',
    rating: 3,
    date: '8 ngày trước',
    comment: 'Quán làm ly lớn, ngon nha.',
    products: 'Đề xuất: Trà Xoài Chanh Dây, Hồng trà đá me, Trà Dứa Lưới',
    likes: 5,
    userLiked: true,
    response: 'Cảm ơn quý khách đã sử dụng sản phẩm của chúng tôi!',
  },
  // Add more reviews as needed
];

export default function CommentDetails({ navigation }) {
  const [selectedRating, setSelectedRating] = useState(null);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [filter, setFilter] = useState('newest'); // 'newest', 'rating', 'likes'
  const [reviewData, setReviewData] = useState(reviews);

  const applyFilter = (type) => {
    setFilter(type);
    if (type === 'newest') {
      setSelectedRating(null); // Reset the star rating filter if "Mới nhất" is selected
    } else if (type === 'rating') {
      setShowRatingFilter(true); // Show the rating filter modal
    }
  };

  const toggleLike = (id) => {
    setReviewData((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id
          ? {
              ...review,
              userLiked: !review.userLiked,
              likes: review.userLiked ? review.likes - 1 : review.likes + 1,
            }
          : review
      )
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>Đánh giá và nhận xét</Text>
      </View>

      {/* Rating Summary */}
      <View style={{ padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10, margin: 15 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>4.6</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <Icon name="star" size={20} color="#FFD700" />
          <Text style={{ marginLeft: 5, fontSize: 16, color: '#333' }}>54 đánh giá</Text>
        </View>
        {[5, 4, 3, 2, 1].map((star) => (
          <View key={star} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
            <Text style={{ width: 20 }}>{star}</Text>
            <Icon name="star" size={16} color="#FFD700" />
            <View style={{ flex: 1, height: 5, backgroundColor: '#ddd', borderRadius: 5, marginHorizontal: 10 }}>
              <View style={{ width: `${star * 10}%`, height: '100%', backgroundColor: '#FFD700', borderRadius: 5 }} />
            </View>
          </View>
        ))}
      </View>

      {/* Filter and Sort Options */}
      <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: filter === 'newest' ? '#E53935' : '#ccc',
            backgroundColor: filter === 'newest' ? '#E53935' : '#fff',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20
          }}
          onPress={() => applyFilter('newest')}
        >
          <Icon name="swap-vert" size={16} color={filter === 'newest' ? '#fff' : '#E53935'} />
          <Text style={{ fontSize: 14, color: filter === 'newest' ? '#fff' : '#E53935', marginLeft: 5 }}>Mới nhất</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: filter === 'rating' ? '#E53935' : '#ccc',
            backgroundColor: filter === 'rating' ? '#E53935' : '#fff',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20
          }}
          onPress={() => applyFilter('rating')}
        >
          <Text style={{ fontSize: 14, color: filter === 'rating' ? '#fff' : '#000', marginRight: 5 }}>Số sao</Text>
          <Icon name="arrow-drop-down" size={16} color={filter === 'rating' ? '#fff' : '#000'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: filter === 'likes' ? '#E53935' : '#ccc',
            backgroundColor: filter === 'likes' ? '#E53935' : '#fff',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20
          }}
          onPress={() => applyFilter('likes')}
        >
          <Text style={{ fontSize: 14, color: filter === 'likes' ? '#fff' : '#000' }}>Lượt thích</Text>
        </TouchableOpacity>
      </View>

      {/* Star Rating Filter Modal */}
      <Modal
        visible={showRatingFilter}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRatingFilter(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 200, backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Chọn số sao</Text>
            {[5, 4, 3, 2, 1].map((star) => (
              <TouchableOpacity
                key={star}
                style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                onPress={() => {
                  setSelectedRating(star);
                  setShowRatingFilter(false);
                }}
              >
                <Text style={{ fontSize: 14, color: '#333', marginRight: 10 }}>{star} sao</Text>
                <Icon name="star" size={18} color="#FFD700" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Reviews */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 20 }}>
        {reviewData
          .filter((review) => (filter === 'rating' && selectedRating ? review.rating === selectedRating : true))
          .map((review) => (
            <View key={review.id} style={{ marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#E53935', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{review.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{review.name}</Text>
                  <Text style={{ color: '#666', fontSize: 12 }}>
                    <Text style={{ color: '#FFD700' }}>{'⭐'.repeat(review.rating)}</Text> • {review.date}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, color: '#333', marginVertical: 5 }}>{review.comment}</Text>
              <Text style={{ fontSize: 12, color: '#888' }}>{review.products}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <TouchableOpacity
                  onPress={() => toggleLike(review.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: review.userLiked ? '#E53935' : '#aaa',
                    backgroundColor: review.userLiked ? '#E53935' : '#fff',
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                  }}
                >
                  <Icon name="thumb-up" size={18} color={review.userLiked ? '#fff' : '#aaa'} />
                  <Text style={{ fontSize: 12, color: review.userLiked ? '#fff' : '#666', marginLeft: 5 }}>{review.likes}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, color: '#666', marginLeft: 10 }}>Có giúp ích cho bạn?</Text>
              </View>
              {review.response && (
                <View style={{ backgroundColor: '#f0f0f0', borderRadius: 5, padding: 10, marginTop: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 5 }}>Phản hồi từ quán</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>{review.response}</Text>
                </View>
              )}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
