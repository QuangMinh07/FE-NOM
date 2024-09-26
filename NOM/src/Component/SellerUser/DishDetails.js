import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, Image, Switch, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { globalContext } from "../../context/globalContext"; // Sử dụng globalContext

export default function DishDetails() {
  const navigation = useNavigation();
  const { globalData } = useContext(globalContext); // Lấy thông tin từ globalContext
  const { selectedFoodId, foods } = globalData; // Lấy selectedFoodId và foods từ globalData
  const [foodDetails, setFoodDetails] = useState(null);

  useEffect(() => {
    const selectedFood = foods.find((food) => food._id === selectedFoodId); // Tìm món ăn dựa trên selectedFoodId
    if (selectedFood) {
      setFoodDetails(selectedFood);
    } else {
      console.error("Không tìm thấy thông tin món ăn");
    }
  }, [selectedFoodId]);

  // Function to format time to AM/PM manually
  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const period = hourInt >= 12 ? "PM" : "AM";
    const formattedHour = hourInt % 12 || 12; // Convert to 12-hour format
    return `${formattedHour}:${minute} ${period}`;
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate("ListFood")} style={{ flexDirection: "row", alignItems: "center" }}>
              <AntDesign name="arrowleft" size={24} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.headerText}>Chi tiết món ăn</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content with ScrollView */}
          <ScrollView scontentContainerStyle={styles.scrollViewContainer}>
            {/* Food Name and Price */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tên món</Text>
              <TextInput style={styles.input} value={foodDetails ? foodDetails.foodName : ""} editable={false} />

              <Text style={[styles.label, { marginTop: 10 }]}>Giá món ăn</Text>
              <TextInput style={styles.input} value={foodDetails ? foodDetails.price.toString() : ""} editable={false} keyboardType="numeric" />

              <Text style={[styles.label, { marginTop: 10 }]}>Ảnh món ăn</Text>
              <TouchableOpacity style={styles.imagePicker}>{foodDetails && foodDetails.imageUrl ? <Image source={{ uri: foodDetails.imageUrl }} style={styles.image} /> : <Text style={{ color: "#ccc", fontSize: 16 }}>Chưa có ảnh</Text>}</TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mô tả món ăn</Text>
              <TextInput style={[styles.input, { height: 80 }]} multiline value={foodDetails ? foodDetails.description : ""} editable={false} />
            </View>

            {/* Group and Availability */}
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Nhóm món</Text>
              <TouchableOpacity style={styles.selectButton}>
                <Text>{foodDetails ? foodDetails.foodGroup : "Chưa có nhóm"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Còn món</Text>
              <Switch value={foodDetails ? foodDetails.isAvailable : false} disabled={true} thumbColor={foodDetails?.isAvailable ? "#ffff" : "#ffff"} trackColor={{ false: "#ccc", true: "red" }} />
            </View>

            {/* Time Selling */}
            <View style={styles.timeSellingContainer}>
              <Text style={styles.label}>Thời gian bán</Text>
              {foodDetails && foodDetails.sellingTime && Array.isArray(foodDetails.sellingTime) ? (
                foodDetails.sellingTime.map((dayItem, index) => (
                  <View key={index} style={styles.timeRow}>
                    <Text style={styles.dayLabel}>{dayItem.day}:</Text>
                    {dayItem.timeSlots && dayItem.timeSlots.length > 0 ? (
                      dayItem.timeSlots.map((slot, slotIndex) => (
                        <Text key={slotIndex} style={styles.timeSlot}>
                          Mở: {formatTime(slot.open)} - Đóng: {formatTime(slot.close)}
                        </Text>
                      ))
                    ) : (
                      <Text>Chưa có khung thời gian</Text>
                    )}
                  </View>
                ))
              ) : (
                <Text>Chưa có thời gian bán</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E53935",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 140,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollViewContainer: {
    paddingBottom: 100, // Add padding at the bottom to ensure scrolling works well
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    width: "100%",
    backgroundColor: "#f9f9f9",
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  selectButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: 120,
    alignItems: "center",
  },
  timeSellingContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  timeRow: {
    flexDirection: "column", // Change to column for better readability
    marginVertical: 8,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timeSlot: {
    fontSize: 14,
    color: "#555",
    marginLeft: 20, // Add indentation for better visibility
  },
});
