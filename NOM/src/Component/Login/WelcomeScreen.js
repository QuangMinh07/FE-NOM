import React from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../img/NOM.png')}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}
      resizeMode="cover"
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.1,
      }}>
        <Image 
          source={require('../../img/LOGOWHITE.png')} 
          style={{
            width: width * 0.5,
            height: height * 0.25,
            marginBottom: height * 0.1,
            resizeMode: 'contain',
          }} 
        />
      
        <TouchableOpacity 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 30,
            paddingVertical: height * 0.02,
            paddingHorizontal: width * 0.25,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3.84,
          }}
          onPress={() => navigation.navigate('Log')}
        >
          <Text style={{
            fontSize: 20,
            color: '#E53935',
            fontWeight: 'bold',
          }}>
            Get started
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;
