import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MomoIcon from 'react-native-vector-icons/FontAwesome'; // Replace with appropriate Momo icon
import VnpayIcon from 'react-native-vector-icons/FontAwesome'; // Replace with appropriate VNPay icon
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Select() {
  const navigation = useNavigation();
  
  // State to store card details and validation
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // Selected method (Momo, VNPay, Bank Card)

  // Function to validate inputs
  const validatePaymentDetails = () => {
    if (selectedPaymentMethod === 'BankCard') {
      if (!cardNumber || !expiryDate || !cvv) {
        alert('Vui lòng nhập đầy đủ thông tin thẻ');
        return false;
      }
    }
    return true;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          paddingVertical: 15,
          backgroundColor: '#fff',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          marginTop: 50,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Chọn Phương Thức Thanh Toán</Text>
      </View>

      {/* Payment Methods and Bank Card Input */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
          flexGrow: 1,
        }}
      >
        {/* Bank Card Payment Option */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: selectedPaymentMethod === 'BankCard' ? '#E53935' : '#fff',
            borderColor: '#eee',
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
            marginVertical: 10,
          }}
          onPress={() => setSelectedPaymentMethod('BankCard')}
        >
          <Icon name="credit-card" size={30} color={selectedPaymentMethod === 'BankCard' ? '#fff' : '#E53935'} />
          <Text style={{ marginLeft: 10, fontSize: 16, color: selectedPaymentMethod === 'BankCard' ? '#fff' : '#333' }}>
            Thẻ ngân hàng
          </Text>
        </TouchableOpacity>

        {/* Bank Card Inputs */}
        {selectedPaymentMethod === 'BankCard' && (
          <View>
            <TextInput
              style={{
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                marginTop: 10,
              }}
              placeholder="Số thẻ"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TextInput
                style={{
                  borderColor: '#ccc',
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  width: '48%',
                }}
                placeholder="Ngày hết hạn (MM/YY)"
                keyboardType="numeric"
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
              <TextInput
                style={{
                  borderColor: '#ccc',
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  width: '48%',
                }}
                placeholder="CVV"
                secureTextEntry
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
              />
            </View>
          </View>
        )}

        {/* Momo Payment Option */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: selectedPaymentMethod === 'Momo' ? '#E53935' : '#fff',
            borderColor: '#eee',
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
            marginVertical: 10,
          }}
          onPress={() => setSelectedPaymentMethod('Momo')}
        >
          <MomoIcon name="mobile" size={30} color={selectedPaymentMethod === 'Momo' ? '#fff' : '#E53935'} />
          <Text style={{ marginLeft: 10, fontSize: 16, color: selectedPaymentMethod === 'Momo' ? '#fff' : '#333' }}>
            Momo
          </Text>
        </TouchableOpacity>

        {/* VNPay Payment Option */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: selectedPaymentMethod === 'VNPay' ? '#E53935' : '#fff',
            borderColor: '#eee',
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
            marginVertical: 10,
          }}
          onPress={() => setSelectedPaymentMethod('VNPay')}
        >
          <VnpayIcon name="credit-card" size={30} color={selectedPaymentMethod === 'VNPay' ? '#fff' : '#E53935'} />
          <Text style={{ marginLeft: 10, fontSize: 16, color: selectedPaymentMethod === 'VNPay' ? '#fff' : '#333' }}>
            VNPay
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Button to Confirm Payment Method */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: selectedPaymentMethod ? '#E53935' : '#aaa',
          padding: 15,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          margin: 20,
          width: width * 0.9,
          alignSelf: 'center',
        }}
        onPress={() => {
          if (validatePaymentDetails()) {
            console.log(`Proceeding with ${selectedPaymentMethod}`);
            navigation.navigate('PaymentConfirmation', { paymentMethod: selectedPaymentMethod });
          }
        }}
        disabled={!selectedPaymentMethod} // Disable button if no method selected
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}
