import React, { useState, useContext, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import { globalContext } from "../../context/globalContext"; // Import GlobalContext

const { width, height } = Dimensions.get("window");

const TimeScheduleSell = () => {
  const { globalData, globalHandler } = useContext(globalContext); // Lấy dữ liệu và handler từ context
  const [timeData, setTimeData] = useState([
    {
      day: "Thứ 2",
      is24h: false,
      isActive: true,
      timeSlots: [{ startTime: "12:30", endTime: "15:30" }],
    },
    {
      day: "Thứ 3",
      is24h: false,
      isActive: true,
      timeSlots: [{ startTime: "10:00", endTime: "14:00" }],
    },
    {
      day: "Thứ 4",
      is24h: false,
      isActive: true,
      timeSlots: [{ startTime: "09:00", endTime: "17:00" }],
    },
    {
      day: "Thứ 5",
      is24h: false,
      isActive: true,
      timeSlots: [{ startTime: "08:00", endTime: "16:00" }],
    },
    {
      day: "Thứ 6",
      is24h: false,
      isActive: true,
      timeSlots: [{ startTime: "08:00", endTime: "16:00" }],
    },
    {
      day: "Thứ 7",
      is24h: false,
      isActive: true,
      timeSlots: [{ startTime: "08:00", endTime: "16:00" }],
    },
    {
      day: "Chủ nhật",
      is24h: false,
      isActive: true,
      timeSlots: [{ startTime: "08:00", endTime: "16:00" }],
    },
  ]);

  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [isStartTime, setIsStartTime] = useState(true);

  const navigation = useNavigation();

  // Tải dữ liệu sellingTime từ context khi component mount
  useEffect(() => {
    if (globalData.sellingTime && globalData.sellingTime.length > 0) {
      setTimeData(globalData.sellingTime);
    }
  }, [globalData.sellingTime]);

  const toggleSwitch = (index) => {
    const newData = [...timeData];
    newData[index].isActive = !newData[index].isActive;
    setTimeData(newData);
  };

  const toggle24h = (index) => {
    const newData = [...timeData];
    newData[index].is24h = !newData[index].is24h;
    if (newData[index].is24h) {
      // Nếu bật 24h, xóa tất cả timeSlots
      newData[index].timeSlots = [];
    } else {
      // Nếu tắt 24h, thêm một timeSlot mặc định nếu chưa có
      if (newData[index].timeSlots.length === 0) {
        newData[index].timeSlots.push({ startTime: "", endTime: "" });
      }
    }
    setTimeData(newData);
  };

  const handleAddTime = (index) => {
    const newData = [...timeData];
    newData[index].timeSlots.push({ startTime: "", endTime: "" });
    setTimeData(newData);
  };

  const handleDeleteTime = (dayIndex, slotIndex) => {
    const newData = [...timeData];
    newData[dayIndex].timeSlots.splice(slotIndex, 1);
    setTimeData(newData);
  };

  const showTimePicker = (dayIndex, slotIndex, isStart) => {
    setSelectedDayIndex(dayIndex);
    setSelectedSlotIndex(slotIndex);
    setIsStartTime(isStart);
    setTimePickerVisible(true);
  };

  const handleConfirm = (date) => {
    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newData = [...timeData];

    if (isStartTime) {
      newData[selectedDayIndex].timeSlots[selectedSlotIndex].startTime = timeString;
    } else {
      newData[selectedDayIndex].timeSlots[selectedSlotIndex].endTime = timeString;
    }

    setTimeData(newData);
    setTimePickerVisible(false);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const renderDeleteButton = (dayIndex, slotIndex) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#E53935",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        width: 50,
        height: "53%",
      }}
      onPress={() => handleDeleteTime(dayIndex, slotIndex)}
    >
      <AntDesign name="delete" size={20} color="#fff" />
    </TouchableOpacity>
  );

  const handleSave = () => {
    // Lọc và chuyển đổi dữ liệu dựa trên trạng thái isActive và is24h
    const filteredTimeData = timeData
      .filter((day) => day.isActive) // Chỉ lưu những ngày có isActive: true
      .map((day) => {
        if (day.is24h) {
          return {
            day: day.day,
            is24h: true,
            timeSlots: [
              {
                startTime: "00:00", // Bắt đầu từ nửa đêm
                endTime: "23:59", // Kết thúc vào cuối ngày
              },
            ], // Ghi nhận rằng bán nguyên ngày
          };
        } else {
          return {
            day: day.day,
            is24h: false,
            timeSlots: day.timeSlots.map((slot) => ({
              startTime: slot.startTime,
              endTime: slot.endTime,
            })), // Lưu lại các time slots đã cài đặt
          };
        }
      });

    globalHandler.setSellingTime(filteredTimeData); // Cập nhật sellingTime qua context
    Alert.alert("Thành công", "Đã lưu thời gian bán!");
    navigation.goBack(); // Quay lại màn hình AddEat
    console.log("Dữ liệu lưu:", filteredTimeData); // Log dữ liệu trước khi gửi đi
  };

  // Reset lại timeData khi vào màn hình
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setTimeData([
        {
          day: "Thứ 2",
          is24h: false,
          isActive: true,
          timeSlots: [{ startTime: "", endTime: "" }],
        },
        {
          day: "Thứ 3",
          is24h: false,
          isActive: true,
          timeSlots: [{ startTime: "", endTime: "" }],
        },
        {
          day: "Thứ 4",
          is24h: false,
          isActive: true,
          timeSlots: [{ startTime: "", endTime: "" }],
        },
        {
          day: "Thứ 5",
          is24h: false,
          isActive: true,
          timeSlots: [{ startTime: "", endTime: "" }],
        },
        {
          day: "Thứ 6",
          is24h: false,
          isActive: true,
          timeSlots: [{ startTime: "", endTime: "" }],
        },
        {
          day: "Thứ 7",
          is24h: false,
          isActive: true,
          timeSlots: [{ startTime: "", endTime: "" }],
        },
        {
          day: "Chủ nhật",
          is24h: false,
          isActive: true,
          timeSlots: [{ startTime: "", endTime: "" }],
        },
      ]);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#E53935",
          height: height * 0.13,
          paddingHorizontal: 15,
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Thời gian bán</Text>
      </View>

      <ScrollView style={{ flex: 1, marginTop: height * 0.02 }}>
        {/* Time Schedule Form */}
        <View style={{ paddingHorizontal: width * 0.05 }}>
          <Text
            style={{
              marginTop: 2,
              fontSize: 18,
              color: "#E53935",
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Ngày áp dụng
          </Text>
          {timeData.map((item, dayIndex) => (
            <View
              key={dayIndex}
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: 15,
                padding: 20,
                marginBottom: 20,
                elevation: 3,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
              }}
            >
              {/* Day and Switch */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.day}</Text>
                <Switch
                  value={item.isActive}
                  onValueChange={() => toggleSwitch(dayIndex)}
                  thumbColor={item.isActive ? "#ffff" : "#ffff"} // Set thumb color
                  trackColor={{ false: "#ffff", true: "#E53935" }} // Set track color
                />
              </View>

              {/* 24h Checkbox */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                }}
                onPress={() => toggle24h(dayIndex)}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.is24h && (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor: "#E53935",
                        borderRadius: 2,
                      }}
                    />
                  )}
                </View>
                <Text style={{ fontSize: 14, fontWeight: "bold", marginLeft: 10 }}>24h</Text>
              </TouchableOpacity>

              {/* Time Slots (Horizontal Layout) */}
              {!item.is24h ? (
                item.timeSlots.map((slot, slotIndex) => (
                  <Swipeable key={slotIndex} renderLeftActions={() => renderDeleteButton(dayIndex, slotIndex)}>
                    <View>
                      {/* Giờ bán & Giờ nghỉ Titles */}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 5,
                        }}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 14 }}>Giờ bán</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 14 }}>Giờ nghỉ</Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <TouchableOpacity onPress={() => showTimePicker(dayIndex, slotIndex, true)}>
                          <Text
                            style={{
                              paddingVertical: 8,
                              paddingHorizontal: 12,
                              backgroundColor: "#E53935",
                              color: "#fff",
                              borderRadius: 10,
                              fontSize: 16,
                              textAlign: "center",
                              width: width * 0.35,
                            }}
                          >
                            {slot.startTime || "HH:MM"}
                          </Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>-</Text>
                        <TouchableOpacity onPress={() => showTimePicker(dayIndex, slotIndex, false)}>
                          <Text
                            style={{
                              paddingVertical: 8,
                              paddingHorizontal: 12,
                              backgroundColor: "#E53935",
                              color: "#fff",
                              borderRadius: 10,
                              fontSize: 16,
                              textAlign: "center",
                              width: width * 0.35,
                            }}
                          >
                            {slot.endTime || "HH:MM"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Swipeable>
                ))
              ) : (
                <Text
                  style={{
                    fontStyle: "italic",
                    color: "#E53935",
                    marginBottom: 5,
                  }}
                >
                  Cửa hàng mở cả ngày (24h)
                </Text>
              )}

              {/* Add Time Button */}
              {!item.is24h && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  onPress={() => handleAddTime(dayIndex)}
                >
                  <AntDesign name="plus" size={20} color="#E53935" />
                  <Text style={{ color: "#E53935", marginLeft: 10 }}>Thêm giờ</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Save Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#E53935",
              borderRadius: 25,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 10,
              width: "100%",
            }}
            onPress={handleSave} // Gọi hàm lưu dữ liệu
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Time Picker Modal with Vietnamese labels */}
      <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={handleConfirm} onCancel={hideTimePicker} cancelTextIOS="Hủy" confirmTextIOS="Xác nhận" />
    </SafeAreaView>
  );
};

export default TimeScheduleSell;
