import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler"; // Import Swipeable
import { AntDesign } from "@expo/vector-icons"; // Import AntDesign
import { globalContext } from "../../context/globalContext"; // Đảm bảo import đúng đường dẫn
import { api, typeHTTP } from "../../utils/api"; // Đảm bảo import đúng API
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // or any other icon set

export default function ListFood({ navigation }) {
  const { globalData, globalHandler } = useContext(globalContext); // Truy cập globalData từ GlobalContext
  const { foods, storeData } = globalData; // Lấy danh sách món ăn và thông tin cửa hàng từ globalData
  const [foodGroups, setFoodGroups] = useState([]); // State để lưu danh sách nhóm món từ MongoDB
  const [foodList, setFoodList] = useState([]);
  // const [selectedItems, setSelectedItems] = useState([]); // Track selected items for combo

  useEffect(() => {
    console.log("Foods in globalData:", foods); // Kiểm tra danh sách món ăn từ globalData
    console.log("StoreId from storeData:", storeData?._id); // Kiểm tra storeId từ storeData
  }, [foods, storeData]); // Chỉ gọi lại khi foods hoặc storeData thay đổi

  const [selectedTab, setSelectedTab] = useState("Món");
  const [modalVisible, setModalVisible] = useState(false); // State cho modal thêm nhóm món
  const [groupName, setGroupName] = useState(""); // State cho nhóm món mới
  // const [selectedDishes, setSelectedDishes] = useState([]);
  const [isSelectingGroups, setIsSelectingGroups] = useState(false); // Trạng thái đang chọn nhóm
  const [currentGroup, setCurrentGroup] = useState(null); // Nhóm món được nhấn `link`
  const [selectedGroups, setSelectedGroups] = useState([]); // Danh sách nhóm đã chọn
  const [groupedNames, setGroupedNames] = useState([]); // Danh sách nhóm đã gộp
  const [editModalVisible, setEditModalVisible] = useState(false); // Hiển thị modal cập nhật nhóm món
  const [editGroupName, setEditGroupName] = useState(""); // Tên nhóm món được chỉnh sửa
  const [editingGroupId, setEditingGroupId] = useState(null); // ID của nhóm món đang chỉnh sửa

  // Khi nhấn vào `link` của một nhóm
  const handleLinkClick = (groupId) => {
    if (isSelectingGroups && currentGroup === groupId) {
      // Nếu đang trong chế độ chọn và nhấn lại vào nhóm hiện tại
      setIsSelectingGroups(false); // Tắt chế độ chọn
      setCurrentGroup(null);
      setSelectedGroups([]);
    } else {
      // Bật chế độ chọn cho nhóm
      setIsSelectingGroups(true);
      setCurrentGroup(groupId);

      // Nếu nhóm đã gộp trước đó, tự động thêm các nhóm đã gộp vào checkbox
      const preSelectedGroups = groupedNames[groupId]?.combined ? foodGroups.filter((group) => groupedNames[groupId].combined.split(" + ").includes(group.groupName)).map((group) => group._id) : [];
      setSelectedGroups([groupId, ...preSelectedGroups]);
    }
  };

  // Khi chọn/deselect checkbox
  const handleGroupSelection = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };
  const handleConfirmGroups = () => {
    if (selectedGroups.length === 1) {
      // Nếu chỉ còn lại nhóm gốc, xóa gộp
      setGroupedNames((prev) => {
        const newGroupedNames = { ...prev };
        delete newGroupedNames[currentGroup];
        return newGroupedNames;
      });
    } else {
      // Cập nhật nhóm gộp
      const currentGroupName = foodGroups.find((group) => group._id === currentGroup)?.groupName || "";
      const selectedNames = foodGroups.filter((group) => selectedGroups.includes(group._id)).map((group) => group.groupName);

      // Lưu lại tên gốc + các nhóm được chọn
      setGroupedNames((prev) => ({
        ...prev,
        [currentGroup]: {
          original: currentGroupName,
          combined: selectedNames.filter((name) => name !== currentGroupName).join(" + "),
        },
      }));

      // Reset trạng thái chọn
      setIsSelectingGroups(false);
      setCurrentGroup(null);
      setSelectedGroups([]);
    }

    // Lấy nhóm hiện tại và các nhóm đã chọn
    const currentGroupName = foodGroups.find((group) => group._id === currentGroup)?.groupName || "";
    const selectedNames = foodGroups.filter((group) => selectedGroups.includes(group._id)).map((group) => group.groupName);

    // Tạo chuỗi tên gốc + nhóm mới (chỉ các nhóm được chọn, trừ nhóm hiện tại)
    const newGroupName = `${currentGroupName} + ${selectedNames.filter((name) => name !== currentGroupName).join(" + ")}`;

    // Cập nhật tên nhóm đã gộp
    setGroupedNames((prev) => ({
      ...prev,
      [currentGroup]: {
        original: currentGroupName,
        combined: selectedNames.filter((name) => name !== currentGroupName).join(" + "),
      },
    }));

    // Reset trạng thái chọn nhóm
    setIsSelectingGroups(false);
    setCurrentGroup(null);
    setSelectedGroups([]);
  };

  const handleAddFoodGroup = async () => {
    const storeId = globalData.storeData?._id; // Lấy storeId từ globalData
    console.log("StoreId for adding food group:", storeId);

    if (!storeId || !groupName) {
      Alert.alert("Lỗi", "ID cửa hàng và tên nhóm món không được để trống.");
      return;
    }

    try {
      console.log("Calling API...");

      const body = {
        groupName,
      };

      const response = await api({
        method: typeHTTP.POST,
        url: `/foodgroup/add-food-group/${storeId}`,
        body,
        sendToken: true,
      });

      console.log("API response full:", response); // Log toàn bộ phản hồi để kiểm tra cấu trúc

      // Kiểm tra phản hồi từ API trực tiếp
      if (response && response.message === "Thêm nhóm món thành công.") {
        Alert.alert("Thành công", "Thêm nhóm món thành công.");

        // Gọi lại hàm lấy nhóm món để cập nhật danh sách sau khi thêm thành công
        await getFoodGroups();
      } else {
        Alert.alert("Lỗi", "Có lỗi xảy ra khi thêm nhóm món.");
      }

      setModalVisible(false); // Đóng modal
    } catch (error) {
      console.error("Client error:", error?.response ? error.response.data : error.message);
      Alert.alert("Lỗi", "Có lỗi xảy ra: " + (error?.response ? error.response.data.message : error.message));
    }
  };

  const getFoodGroups = async () => {
    const storeId = storeData?._id; // Lấy storeId từ storeData

    if (!storeId) {
      console.error("storeId không tồn tại");
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/foodgroup/getfood-groups/${storeId}`,
        sendToken: true, // Gửi token để xác thực
      });

      // Log toàn bộ phản hồi để kiểm tra cấu trúc
      console.log("Response from API:", response);

      // Kiểm tra nếu response và response.foodGroups tồn tại
      if (response && response.foodGroups) {
        console.log("Danh sách nhóm món từ MongoDB:", response.foodGroups);
        setFoodGroups(response.foodGroups); // Cập nhật state với danh sách nhóm món từ MongoDB
      } else {
        console.error("Không tìm thấy nhóm món hoặc dữ liệu không hợp lệ");
      }
    } catch (error) {
      // Kiểm tra xem error.response có tồn tại không
      if (error.response) {
        // console.error("Lỗi từ server:", error.response.data);
      } else {
        // console.error("Lỗi không xác định:", error.message);
      }
    }
  };

  useEffect(() => {
    getFoodGroups(); // Lấy danh sách nhóm món khi component được mount
  }, [storeData]); // Chỉ gọi khi storeData thay đổi

  // Nhóm món ăn theo foodGroup và sắp xếp thứ tự
  const groupFoodsByCategory = (foods, foodGroups) => {
    const groupedFoods = foods.reduce((groupedFoods, food) => {
      // Tìm tên của nhóm món dựa trên ID của foodGroup trong food
      const group = foodGroups.find((group) => group._id === food.foodGroup)?.groupName || "Khác";

      if (!groupedFoods[group]) {
        groupedFoods[group] = [];
      }
      groupedFoods[group].push(food);
      return groupedFoods;
    }, {});

    return groupedFoods;
  };

  // Sử dụng hàm groupFoodsByCategory với cả foods và foodGroups
  const groupedFoods = groupFoodsByCategory(foodList, foodGroups);

  const handleAddButtonPress = () => {
    if (selectedTab === "Nhóm món") {
      setModalVisible(true); // Hiển thị modal khi chọn tab 'Nhóm món'
    } else {
      navigation.navigate("AddEat");
    }
  };

  const fetchFoodsByStoreId = useCallback(async () => {
    try {
      const storeId = globalData.storeData?._id;
      if (!storeId) {
        console.log("Không tìm thấy storeId trong globalData");
        return;
      }

      // Gọi API để lấy danh sách món ăn
      const response = await api({
        method: typeHTTP.GET,
        url: `/food/get-foodstore/${storeId}`, // API lấy danh sách món ăn theo storeId
        sendToken: true,
      });

      // Kiểm tra phản hồi
      console.log("Phản hồi từ API:", response); // Log phản hồi

      if (response && response.foods && Array.isArray(response.foods) && response.foods.length > 0) {
        setFoodList(response.foods); // Lưu danh sách món ăn vào state
        console.log("Danh sách món ăn:", response.foods);
      } else {
        console.log("Không tìm thấy món ăn nào");
      }
    } catch (error) {
      // console.error("Lỗi khi lấy dữ liệu món ăn:", error);
    }
  }, [globalData.storeData?._id]);

  useFocusEffect(
    useCallback(() => {
      fetchFoodsByStoreId();
    }, [fetchFoodsByStoreId])
  );

  const handleDeleteFood = useCallback(
    async (foodId) => {
      if (!foodId) {
        console.error("Invalid foodId:", foodId);
        Alert.alert("Lỗi", "ID món ăn không hợp lệ.");
        return;
      }

      try {
        await api({
          method: typeHTTP.DELETE,
          url: `/food/delete/${foodId}`,
          sendToken: true,
        });

        // Cập nhật foodList và loại bỏ món ăn vừa xóa
        const updatedFoodList = foodList.filter((food) => food._id !== foodId);
        setFoodList(updatedFoodList); // Cập nhật danh sách món ăn hiển thị

        Alert.alert("Xóa thành công", "Món ăn đã được xóa khỏi danh sách.", [{ text: "OK" }]);
        console.log("Đã xóa món ăn và cập nhật dữ liệu.");
      } catch (error) {
        console.error("Error deleting food:", error);
        Alert.alert("Lỗi", "Không thể xóa món ăn. Vui lòng thử lại sau.");
      }
    },
    [foodList] // Theo dõi sự thay đổi của foodList
  );

  const handleDeleteFoodGroup = useCallback(
    async (groupId) => {
      if (!groupId) {
        console.error("Invalid groupId:", groupId);
        Alert.alert("Lỗi", "ID nhóm món không hợp lệ.");
        return;
      }

      try {
        await api({
          method: typeHTTP.DELETE,
          url: `/foodgroup/delete-foodgroup/${groupId}`, // Đường dẫn API xóa nhóm món
          sendToken: true, // Gửi token để xác thực
        });

        // Cập nhật danh sách nhóm món, loại bỏ nhóm món vừa xóa
        const updatedFoodGroups = foodGroups.filter((group) => group._id !== groupId);
        setFoodGroups(updatedFoodGroups);

        // Lấy lại danh sách món ăn để đồng bộ
        const storeId = globalData.storeData?._id;
        if (storeId) {
          const response = await api({
            method: typeHTTP.GET,
            url: `/food/get-foodstore/${storeId}`, // API lấy danh sách món ăn
            sendToken: true,
          });

          if (response && response.foods) {
            setFoodList(response.foods); // Cập nhật danh sách món ăn sau khi xóa nhóm món
          }
        }

        Alert.alert("Thành công", "Nhóm món đã được xóa khỏi danh sách.", [{ text: "OK" }]);
      } catch (error) {
        console.error("Error deleting food group:", error);
        Alert.alert("Lỗi", "Không thể xóa nhóm món. Vui lòng thử lại sau.");
      }
    },
    [foodGroups] // Theo dõi sự thay đổi của foodGroups
  );

  const handleUpdateFoodGroup = async () => {
    if (!editingGroupId || !editGroupName) {
      Alert.alert("Lỗi", "ID nhóm món và tên nhóm món không được để trống.");
      return;
    }

    try {
      const response = await api({
        method: typeHTTP.PUT,
        url: `/foodgroup/update-foodgroup/${editingGroupId}`, // Đường dẫn API cập nhật nhóm món
        body: { groupName: editGroupName },
        sendToken: true,
      });

      if (response && response.message === "Cập nhật tên nhóm món thành công.") {
        Alert.alert("Thành công", "Tên nhóm món đã được cập nhật.");

        // Cập nhật danh sách nhóm món trong state
        const updatedFoodGroups = foodGroups.map((group) => (group._id === editingGroupId ? { ...group, groupName: editGroupName } : group));
        setFoodGroups(updatedFoodGroups);

        // Đóng modal sau khi cập nhật
        setEditModalVisible(false);
        setEditingGroupId(null);
        setEditGroupName("");
      } else {
        Alert.alert("Lỗi", "Không thể cập nhật tên nhóm món.");
      }
    } catch (error) {
      console.error("Error updating food group:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  // Khi người dùng bấm vào món ăn
  const handleDishClick = (foodId) => {
    globalHandler.setSelectedFoodId(foodId); // Lưu foodId vào globalData
    navigation.navigate("DishDetails"); // Điều hướng mà không cần truyền foodId
  };

  const renderLeftActions = (foodId) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteFood(foodId)} // Sử dụng foodId
      >
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text style={{ color: "#fff" }}>Xóa</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#E53935",
          padding: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 140,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Danh sách thực đơn</Text>
        <TouchableOpacity onPress={handleAddButtonPress}>
          <AntDesign name="pluscircleo" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Search Input */}
      <View
        style={{
          padding: 10,
          marginHorizontal: 15,
          marginTop: -30,
          backgroundColor: "#fff",
          borderRadius: 10,
          elevation: 5,
        }}
      >
        <TextInput placeholder="Tìm kiếm" style={{ padding: 10, fontSize: 16 }} />
      </View>
      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#fff",
          paddingVertical: 10,
        }}
      >
        {["Món", "Nhóm món"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={{
              borderBottomWidth: selectedTab === tab ? 2 : 0,
              borderBottomColor: "#E53935",
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                color: selectedTab === tab ? "#E53935" : "#6B7280",
                fontSize: 16,
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1 }}>
        {/* Nội dung tab "Món" */}
        {selectedTab === "Món" && (
          <View style={{ flex: 1 }}>
            {foodList.length === 0 ? (
              <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <Text style={{ fontSize: 18, color: "#999" }}>Không có món ăn nào</Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ padding: 15 }}>
                {Object.keys(groupedFoods).map((groupName) => (
                  <View key={groupName} style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#E53935" }}>{groupName}</Text>
                    </View>
                    {groupedFoods[groupName].map((item, index) => (
                      <Swipeable key={index} renderLeftActions={() => renderLeftActions(item._id)}>
                        <TouchableOpacity onPress={() => handleDishClick(item._id)} style={styles.foodItem}>
                          <View>
                            <Text style={styles.foodName}>{item.foodName}</Text>
                            <Text style={styles.foodPrice}>{item.price.toLocaleString("vi-VN").replace(/\./g, ",")} VND</Text>
                          </View>
                        </TouchableOpacity>
                      </Swipeable>
                    ))}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {/* Nội dung tab "Nhóm món" */}
        {selectedTab === "Nhóm món" && (
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 15 }}>
              {foodGroups.map((group, index) => (
                <View key={index} style={{ marginBottom: 20 }}>
                  <Swipeable
                    renderLeftActions={() => (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteFoodGroup(group._id)} // Thêm hành động xóa nhóm món
                      >
                        <Ionicons name="trash-outline" size={22} color="#fff" />
                        <Text style={{ color: "#fff" }}>Xóa</Text>
                      </TouchableOpacity>
                    )}
                  >
                    <View style={styles.foodItem}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {isSelectingGroups && currentGroup !== group._id && (
                          <TouchableOpacity
                            onPress={() => handleGroupSelection(group._id)}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 3,
                              borderWidth: 1,
                              borderColor: "#E53935",
                              backgroundColor: selectedGroups.includes(group._id) ? "#E53935" : "#fff",
                              marginRight: 10,
                            }}
                          />
                        )}
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#E53935" }}>{groupedNames[group._id]?.original || group.groupName}</Text>
                        {groupedNames[group._id]?.combined && <Text style={{ fontSize: 16, color: "#6B7280", marginLeft: 5 }}>+ {groupedNames[group._id].combined}</Text>}
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          onPress={() => {
                            setEditGroupName(group.groupName); // Lưu tên nhóm món hiện tại
                            setEditingGroupId(group._id); // Lưu ID nhóm món hiện tại
                            setEditModalVisible(true); // Hiển thị modal chỉnh sửa
                          }}
                        >
                          <Icon name="edit" size={24} color="#E53935" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleLinkClick(group._id)} style={{ paddingLeft: 10 }}>
                          <Icon name="link" size={24} color="#E53935" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Swipeable>
                </View>
              ))}

              <Modal transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Cập nhật tên nhóm món</Text>
                    <TextInput style={styles.modalInput} value={editGroupName} onChangeText={setEditGroupName} placeholder="Nhập tên nhóm món mới" />
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={handleUpdateFoodGroup} // Gọi hàm cập nhật nhóm món
                      >
                        <Text style={styles.modalButtonText}>Lưu</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                          setEditModalVisible(false); // Đóng modal
                          setEditingGroupId(null); // Xóa ID nhóm món đang chỉnh sửa
                          setEditGroupName(""); // Xóa tên nhóm món đang chỉnh sửa
                        }}
                      >
                        <Text style={styles.modalButtonText}>Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              {isSelectingGroups && (
                <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-around" }}>
                  <TouchableOpacity
                    onPress={handleConfirmGroups}
                    style={{
                      backgroundColor: "#E53935",
                      padding: 10,
                      borderRadius: 10,
                      width: "40%",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Xác nhận</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsSelectingGroups(false);
                      setCurrentGroup(null);
                      setSelectedGroups([]);
                    }}
                    style={{
                      backgroundColor: "#ccc",
                      padding: 10,
                      borderRadius: 10,
                      width: "40%",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#333", fontWeight: "bold" }}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Modal for adding new group */}
      <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tên Nhóm món</Text>
            <TextInput style={styles.modalInput} value={groupName} onChangeText={setGroupName} placeholder="Nhập tên nhóm món" />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddFoodGroup} // Gọi hàm để thêm nhóm món
              >
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  foodItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  foodPrice: {
    fontSize: 14,
    color: "#6B7280",
  },
  deleteButton: {
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "88%",
    borderRadius: 10,
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E53935",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
    elevation: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
