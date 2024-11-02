import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RatingScreen = () => {
  const [rating, setRating] = useState(4); // Default rating value
  const [feedback, setFeedback] = useState('');

  const handleRatingPress = (value) => {
    setRating(value);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ 
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 20 
        }}>
          {/* Enlarged Logo */}
          <Image 
            source={require('../../img/LOGOBLACK.png')} 
            style={{ 
              width: 180, 
              height: 180, 
              resizeMode: 'contain', 
              marginBottom: 30 
            }} 
          />
          {/* Question Text */}
          <Text style={{ 
            fontSize: 22, 
            fontWeight: 'bold', 
            marginBottom: 10 
          }}>
            Bạn có cảm thấy hài lòng?
          </Text>
          {/* Subtext with Primary Color */}
          <Text style={{ 
            fontSize: 18, 
            color: '#E53935', 
            marginBottom: 30 
          }}>
            Người giao hàng
          </Text>
          {/* Star Rating Component */}
          <View style={{ 
            flexDirection: 'row', 
            marginBottom: 30 
          }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRatingPress(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={45}  // Slightly larger star size
                  color="#FFD700"
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>
          {/* Feedback Input */}
          <TextInput
            style={{ 
              width: '100%', 
              height: 60, 
              borderColor: '#ccc', 
              borderWidth: 1, 
              borderRadius: 10, 
              paddingHorizontal: 15, 
              marginBottom: 30 
            }}
            placeholder="Góp ý"
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
            multiline
          />
          {/* Confirm Button with Primary Color */}
          <TouchableOpacity style={{ 
            backgroundColor: '#E53935', 
            paddingVertical: 18, 
            paddingHorizontal: 50, 
            borderRadius: 10,
            width: '100%', 
            marginTop: 20 
          }}>
            <Text style={{ 
              color: '#FFFFFF', 
              fontSize: 18, 
              fontWeight: 'bold', 
              textAlign: 'center' 
            }}>
              Xác nhận
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RatingScreen;
