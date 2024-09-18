import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons'; // Import icon library

export default function Comment() {
  const [selectedTab, setSelectedTab] = useState('Tất cả'); // State quản lý tab đang chọn

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Phản hồi</Text>
      </View>

      {/* Phần hiển thị đánh giá */}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingTitle}>Quán</Text>
          <Text style={styles.ratingScore}>4.5</Text>
          <View style={styles.starContainer}>
            <FontAwesome name="star" size={18} color="#E53935" />
            <FontAwesome name="star" size={18} color="#E53935" />
            <FontAwesome name="star" size={18} color="#E53935" />
            <FontAwesome name="star" size={18} color="#E53935" />
            <FontAwesome name="star-half" size={18} color="#E53935" />
          </View>
          <Text style={styles.ratingCount}>324 người bình luận</Text>
        </View>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingTitle}>Món</Text>
          <Text style={styles.ratingScore}>4.5</Text>
          <View style={styles.starContainer}>
            <FontAwesome name="star" size={18} color="#E53935" />
            <FontAwesome name="star" size={18} color="#E53935" />
            <FontAwesome name="star" size={18} color="#E53935" />
            <FontAwesome name="star" size={18} color="#E53935" />
            <FontAwesome name="star-half" size={18} color="#E53935" />
          </View>
          <Text style={styles.ratingCount}>324 người bình luận</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Tất cả', 'Đánh giá', 'Bình luận'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tabItem,
              selectedTab === tab && styles.tabItemSelected,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextSelected,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách phản hồi */}
      <ScrollView>
        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUserName}>Nguyễn Thị Kiều Nghi</Text>
            <View style={styles.starContainer}>
              <FontAwesome name="star" size={16} color="#E53935" />
              <FontAwesome name="star" size={16} color="#E53935" />
              <FontAwesome name="star" size={16} color="#E53935" />
              <FontAwesome name="star" size={16} color="#E53935" />
              <FontAwesome name="star-half" size={16} color="#E53935" />
              <Text style={styles.commentRating}>4.5</Text>
            </View>
            <Text style={styles.commentDate}>06/09/2024</Text>
          </View>
          <Text style={styles.commentText}>Nhiều không ăn nổi luôn</Text>
          <TouchableOpacity style={styles.replyButton}>
            <AntDesign name="message1" size={16} color="black" />
            <Text style={styles.replyButtonText}>Trả lời</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#E53935',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -30,
    marginHorizontal: 15,
    paddingVertical: 10,
  },
  ratingBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
    elevation: 3,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 5,
  },
  ratingScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
  },
  starContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  ratingCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 10,
    marginTop: 10,
  },
  tabItem: {
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemSelected: {
    borderBottomColor: '#E53935',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabTextSelected: {
    color: '#E53935',
  },
  commentCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    elevation: 3,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
  },
  commentRating: {
    marginLeft: 5,
    fontSize: 14,
    color: '#E53935',
  },
  commentDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 10,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  replyButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#424242',
  },
});
