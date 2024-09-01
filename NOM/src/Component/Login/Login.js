import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Đăng nhập</Text>
      
      <TextInput
        placeholder="Email"
        style={{
          width: width * 0.8,
          height: 50,
          borderColor: '#CCCCCC',
          borderWidth: 1,
          borderRadius: 25,
          paddingHorizontal: 15,
          marginBottom: 20,
          backgroundColor: '#FFFFFF',
        }}
      />
      
      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry={true}
        style={{
          width: width * 0.8,
          height: 50,
          borderColor: '#CCCCCC',
          borderWidth: 1,
          borderRadius: 25,
          paddingHorizontal: 15,
          marginBottom: 20,
          backgroundColor: '#FFFFFF',
        }}
      />
      
      <TouchableOpacity
        style={{
          width: width * 0.8,
          height: 50,
          backgroundColor: '#E53935',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 25,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={{ color: '#E53935', fontSize: 16 }}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
}
