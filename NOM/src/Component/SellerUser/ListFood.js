import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, StyleSheet, Alert, Switch } from "react-native";
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

  useEffect(() => {
    console.log("Foods in globalData:", foods); // Kiểm tra danh sách món ăn từ globalData
    console.log("StoreId from storeData:", storeData?._id); // Kiểm tra storeId từ storeData
  }, [foods, storeData]); // Chỉ gọi lại khi foods hoặc storeData thay đổi

  const [selectedTab, setSelectedTab] = useState("Món");
  const [modalVisible, setModalVisible] = useState(false); // State cho modal thêm nhóm món
  const [groupName, setGroupName] = useState(""); // State cho nhóm món mới
  const [isSelectingGroups, setIsSelectingGroups] = useState(false); // Trạng thái đang chọn nhóm
  const [currentGroup, setCurrentGroup] = useState(null); // Nhóm món được nhấn `link`
  const [selectedGroups, setSelectedGroups] = useState([]); // Danh sách nhóm đã chọn
  const [groupedNames, setGroupedNames] = useState([]); // Danh sách nhóm đã gộp
  const [editModalVisible, setEditModalVisible] = useState(false); // Hiển thị modal cập nhật nhóm món
  const [editGroupName, setEditGroupName] = useState(""); // Tên nhóm món được chỉnh sửa
  const [editingGroupId, setEditingGroupId] = useState(null); // ID của nhóm món đang chỉnh sửa
  const [removeGroups, setRemoveGroups] = useState([]); // Danh sách nhóm cần xóa khỏi combo
  const [searchQuery, setSearchQuery] = useState(""); // Lưu từ khóa tìm kiếm
  const [searchResults, setSearchResults] = useState({ foods: [] }); // Lưu kết quả tìm kiếm
  const [searchResultsGroups, setSearchResultsGroups] = useState({ foodGroups: [] }); // Lưu kết quả tìm kiếm nhóm món

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else if (selectedTab === "Món") {
      fetchFoodsByStoreId(); // Gọi API lấy danh sách món ăn nếu đang ở tab "Món"
    } else if (selectedTab === "Nhóm món") {
      getFoodGroups(); // Gọi API lấy danh sách nhóm món nếu đang ở tab "Nhóm món"
    }
  }, [searchQuery, selectedTab]);

  const handleSearch = useCallback(
    async (query) => {
      try {
        const storeId = globalData.storeData?._id; // Lấy storeId từ globalData
        if (!storeId) {
          console.error("Không tìm thấy storeId.");
          return;
        }

        if (selectedTab === "Món") {
          // Tìm kiếm món ăn
          const response = await api({
            method: typeHTTP.GET,
            url: `/food/search?foodName=${encodeURIComponent(query)}&storeId=${storeId}`, // Thêm storeId vào query
            sendToken: true,
          });

          if (response && response.data) {
            setSearchResults({ foods: response.data }); // Lưu kết quả tìm kiếm món ăn
          } else {
            setSearchResults({ foods: [] });
          }
        } else if (selectedTab === "Nhóm món") {
          // Tìm kiếm nhóm món
          const response = await api({
            method: typeHTTP.GET,
            url: `/foodgroup/search?groupName=${encodeURIComponent(query)}&storeId=${storeId}`, // Thêm storeId vào query
            sendToken: true,
          });

          if (response && response.data) {
            setSearchResultsGroups({ foodGroups: response.data }); // Lưu kết quả tìm kiếm nhóm món
          } else {
            setSearchResultsGroups({ foodGroups: [] });
          }
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        Alert.alert("Lỗi", "Không thể tìm kiếm. Vui lòng thử lại sau.");
      }
    },
    [selectedTab, globalData.storeData?._id]
  );

  // Khi nhấn vào `link` của một nhóm
  const handleLinkClick = (groupId) => {
    // Kiểm tra nếu đang chọn nhóm và nhấn lại vào nhóm cha hiện tại
    if (isSelectingGroups && currentGroup === groupId) {
      setIsSelectingGroups(false); // Tắt chế độ chọn nhóm
      setCurrentGroup(null); // Reset nhóm hiện tại
      setSelectedGroups([]); // Xóa danh sách nhóm đã chọn
    } else {
      // Bật chế độ chọn
      setIsSelectingGroups(true);
      setCurrentGroup(groupId);

      // Tìm tất cả nhóm con của nhóm cha hiện tại
      const parentGroup = foodGroups.find((group) => group._id === groupId);
      if (!parentGroup) {
        console.error("Không tìm thấy nhóm cha.");
        return;
      }

      // Nếu nhóm cha có nhóm con, lấy danh sách ID nhóm con
      const childGroups = parentGroup.comboGroups || [];

      // Gộp nhóm cha và nhóm con vào `selectedGroups`
      setSelectedGroups([groupId, ...childGroups]);
    }
  };

  // Khi chọn/deselect checkbox
  const handleGroupSelection = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      // Nếu checkbox chuyển từ đỏ sang trắng
      setRemoveGroups((prev) => [...prev, groupId]); // Thêm nhóm vào danh sách cần xóa
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId)); // Loại bỏ khỏi nhóm được chọn
    } else {
      // Nếu checkbox chuyển từ trắng sang đỏ
      setSelectedGroups([...selectedGroups, groupId]); // Thêm nhóm vào danh sách được chọn
      setRemoveGroups((prev) => prev.filter((id) => id !== groupId)); // Loại bỏ khỏi danh sách cần xóa
    }
  };

  const handleConfirmGroups = async () => {
    // Kiểm tra nếu không có nhóm món nào được chọn ngoài nhóm hiện tại
    if (selectedGroups.length <= 1) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất một nhóm món khác để ghép combo.");
      return;
    }

    try {
      // Lấy thông tin nhóm hiện tại và tên của các nhóm được chọn
      const currentGroupName = foodGroups.find((group) => group._id === currentGroup)?.groupName || "";
      const selectedNames = foodGroups.filter((group) => selectedGroups.includes(group._id)).map((group) => group.groupName);

      // Tạo chuỗi tên gộp cho nhóm hiện tại
      const newGroupName = `${currentGroupName} + ${selectedNames.filter((name) => name !== currentGroupName).join(" + ")}`;

      // Gọi API để lưu thông tin nhóm gộp trên server
      const response = await api({
        method: typeHTTP.POST,
        url: `/foodgroup/add-combo/${currentGroup}`, // Đường dẫn API thêm combo nhóm
        body: { comboGroupIds: selectedGroups.filter((id) => id !== currentGroup) },
        sendToken: true,
      });

      if (response && response.message === "Ghép nhóm món thành công.") {
        Alert.alert("Thành công", "Combo nhóm món đã được thêm thành công.");

        // Cập nhật danh sách nhóm món từ server
        await getFoodGroups();

        // Lưu thông tin nhóm gộp cục bộ
        setGroupedNames((prev) => ({
          ...prev,
          [currentGroup]: {
            original: currentGroupName,
            combined: selectedNames.filter((name) => name !== currentGroupName).join(" + "),
          },
        }));
      } else {
        throw new Error(response?.message || "Không thể thêm combo nhóm món.");
      }

      // Gọi lại tìm kiếm nếu đang có từ khóa
      if (searchQuery) {
        await handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Error adding combo to food group:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thêm combo nhóm món.");
    } finally {
      // Reset trạng thái chọn nhóm
      setIsSelectingGroups(false);
      setCurrentGroup(null);
      setSelectedGroups([]);
    }
  };

  const handleDeleteConfirmGroups = async () => {
    if (removeGroups.length === 0) {
      Alert.alert("Lỗi", "Không có nhóm nào được chọn để xóa.");
      return;
    }

    try {
      for (const groupId of removeGroups) {
        console.log("Xóa comboGroupId:", groupId); // Log kiểm tra comboGroupId

        const response = await api({
          method: typeHTTP.PUT, // Chuyển từ DELETE sang PUT
          url: `/foodgroup/remove-combo/${currentGroup}`, // currentGroup là ID nhóm chính
          body: { comboGroupId: groupId }, // Truyền comboGroupId trong body
          sendToken: true,
        });

        if (response?.message === "Xóa nhóm món combo thành công.") {
          console.log(`Nhóm combo ${groupId} đã bị xóa.`);
        } else {
          console.error(`Lỗi khi xóa nhóm combo ${groupId}.`);
        }
      }

      // Cập nhật lại danh sách nhóm món từ server
      await getFoodGroups();

      // Gọi lại tìm kiếm nếu đang có từ khóa
      if (searchQuery) {
        await handleSearch(searchQuery);
      }

      Alert.alert("Thành công", "Nhóm combo đã được cập nhật.");
    } catch (error) {
      console.error("Lỗi xóa nhóm combo:", error);
      Alert.alert("Lỗi", "Không thể xóa nhóm combo. Vui lòng thử lại sau.");
    } finally {
      // Reset trạng thái chọn nhóm
      setIsSelectingGroups(false);
      setCurrentGroup(null);
      setSelectedGroups([]); // Xóa danh sách chọn
      setRemoveGroups([]); // Xóa danh sách cần xóa
    }
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
      // console.log("Response from API:", response);

      // Kiểm tra nếu response và response.foodGroups tồn tại
      if (response && response.foodGroups) {
        // console.log("Danh sách nhóm món từ MongoDB:", response.foodGroups);
        setFoodGroups(response.foodGroups); // Cập nhật state với danh sách nhóm món từ MongoDB
      } else {
        console.error("Không tìm thấy nhóm món hoặc dữ liệu không hợp lệ");
      }
      // Gọi lại tìm kiếm nếu đang có từ khóa
      if (searchQuery) {
        await handleSearch(searchQuery);
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
  }, [storeData, handleSearch, searchQuery]); // Chỉ gọi khi storeData thay đổi

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

        // Gọi lại tìm kiếm nếu đang có từ khóa
        if (searchQuery) {
          await handleSearch(searchQuery);
        }
        console.log("Đã xóa món ăn và cập nhật dữ liệu.");
      } catch (error) {
        console.error("Error deleting food:", error);
        Alert.alert("Lỗi", "Không thể xóa món ăn. Vui lòng thử lại sau.");
      }
    },
    [foodList, searchQuery, handleSearch] // Theo dõi sự thay đổi của foodList
  );

  const handleDeleteFoodGroup = useCallback(
    async (groupId) => {
      if (!groupId) {
        console.error("Invalid groupId:", groupId);
        Alert.alert("Lỗi", "ID nhóm món không hợp lệ.");
        return;
      }

      try {
        const response = await api({
          method: typeHTTP.DELETE,
          url: `/foodgroup/delete-foodgroup/${groupId}`,
          sendToken: true,
        });

        console.log("API Response:", response);

        // Cập nhật danh sách nhóm món, loại bỏ nhóm món vừa xóa
        const updatedFoodGroups = foodGroups.filter((group) => group._id !== groupId);
        setFoodGroups(updatedFoodGroups);

        // // Lấy lại danh sách món ăn để đồng bộ
        // const storeId = globalData.storeData?._id;
        // if (storeId) {
        //   const response = await api({
        //     method: typeHTTP.GET,
        //     url: `/food/get-foodstore/${storeId}`, // API lấy danh sách món ăn
        //     sendToken: true,
        //   });

        //   if (response && response.foods) {
        //     setFoodList(response.foods); // Cập nhật danh sách món ăn sau khi xóa nhóm món
        //   }
        // }

        Alert.alert("Thành công", "Nhóm món đã được xóa khỏi danh sách.", [{ text: "OK" }]);
        // Gọi lại tìm kiếm nếu đang có từ khóa
        if (searchQuery) {
          await handleSearch(searchQuery);
        }
      } catch (error) {
        console.error("Error deleting food group:", error);
        Alert.alert("Lỗi", "Không thể xóa nhóm món. Vui lòng thử lại sau.");
      }
    },
    [foodGroups, searchQuery, handleSearch] // Theo dõi sự thay đổi của foodGroups
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
      // Gọi lại tìm kiếm nếu đang có từ khóa
      if (searchQuery) {
        await handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Error updating food group:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleToggleAvailability = async (foodId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Đảo trạng thái hiện tại

      // Gọi API để cập nhật trạng thái
      const response = await api({
        method: typeHTTP.PUT,
        url: `/food/update-availability/${foodId}`,
        body: { isAvailable: updatedStatus }, // Truyền trạng thái mới
        sendToken: true, // Gửi token xác thực
      });

      if (response && response.message === "Cập nhật trạng thái thành công.") {
        // Cập nhật trạng thái trong foodList
        setFoodList((prevList) => prevList.map((food) => (food._id === foodId ? { ...food, isAvailable: updatedStatus } : food)));
        Alert.alert("Thành công", `Món ăn đã được ${updatedStatus ? "bật" : "tắt"} thành công.`);
      } else {
        throw new Error("Không thể cập nhật trạng thái món ăn.");
      }
      // Gọi lại tìm kiếm nếu đang có từ khóa
      if (searchQuery) {
        await handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái món ăn.");
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
        <TextInput
          placeholder="Tìm kiếm"
          style={{ padding: 10, fontSize: 16 }}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text); // Cập nhật từ khóa
            handleSearch(text); // Gọi API tìm kiếm
          }}
        />
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
      {/* Search Results */}
      {searchQuery ? (
        <ScrollView contentContainerStyle={{ padding: 10 }}>
          {/* Hiển thị kết quả tìm kiếm cho Món */}
          {selectedTab === "Món" && searchResults.foods.length > 0 && (
            <View>
              <Text style={styles.resultHeader}>Kết quả tìm kiếm món ăn:</Text>
              {searchResults.foods.map((food, index) => (
                <Swipeable key={food._id || index} renderLeftActions={() => renderLeftActions(food._id)}>
                  <TouchableOpacity onPress={() => handleDishClick(food._id)} style={styles.foodItem}>
                    <View>
                      <Text style={styles.foodName}>{food.foodName}</Text>
                      <Text style={styles.foodPrice}>{food.price.toLocaleString("vi-VN")} VND</Text>
                    </View>

                    {/* Switch bật/tắt trạng thái */}
                    <Switch
                      value={food.isAvailable} // Trạng thái hiện tại của món ăn
                      onValueChange={() => handleToggleAvailability(food._id, food.isAvailable)} // Gọi hàm xử lý
                      thumbColor={food.isAvailable ? "#fff" : "#fff"}
                      trackColor={{ false: "#ccc", true: "#E53935" }}
                    />
                  </TouchableOpacity>
                </Swipeable>
              ))}
            </View>
          )}

          {/* Hiển thị kết quả tìm kiếm cho Nhóm món */}
          {selectedTab === "Nhóm món" && searchResultsGroups.foodGroups.length > 0 && (
            <View>
              <Text style={styles.resultHeader}>Kết quả tìm kiếm nhóm món:</Text>
              {searchResultsGroups.foodGroups.map((group, index) => (
                <Swipeable
                  key={group._id || index}
                  renderLeftActions={() => (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteFoodGroup(group._id)} // Xóa nhóm món
                    >
                      <Ionicons name="trash-outline" size={22} color="#fff" />
                      <Text style={{ color: "#fff" }}>Xóa</Text>
                    </TouchableOpacity>
                  )}
                >
                  <View style={styles.foodItem}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {/* Checkbox gộp nhóm món */}
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
                      {/* Sử dụng style giống tab Nhóm món */}
                      <Text style={styles.groupHeader}>{group.groupName}</Text>
                      {group.comboGroups?.length > 0 && (
                        <Text>
                          {group.comboGroups.map((comboId, idx) => {
                            const comboGroup = foodGroups.find((g) => g._id === comboId);
                            return (
                              <Text key={idx} style={styles.comboGroup}>
                                {idx > 0 ? ", " : " + "}
                                {comboGroup?.groupName || "N/A"}
                              </Text>
                            );
                          })}
                        </Text>
                      )}
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      {/* Nút chỉnh sửa */}
                      <TouchableOpacity
                        onPress={() => {
                          setEditGroupName(group.groupName);
                          setEditingGroupId(group._id);
                          setEditModalVisible(true); // Mở modal chỉnh sửa
                        }}
                      >
                        <Icon name="edit" size={24} color="#E53935" />
                      </TouchableOpacity>
                      {/* Nút liên kết */}
                      <TouchableOpacity onPress={() => handleLinkClick(group._id)} style={{ paddingLeft: 10 }}>
                        <Icon name="link" size={24} color="#E53935" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Swipeable>
              ))}

              {/* Nút xác nhận gộp nhóm món */}
              {isSelectingGroups && (
                <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-around" }}>
                  <TouchableOpacity
                    onPress={async () => {
                      if (removeGroups.length > 0) {
                        await handleDeleteConfirmGroups();
                      }
                      if (selectedGroups.length > 1) {
                        await handleConfirmGroups();
                      }
                    }}
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
            </View>
          )}
        </ScrollView>
      ) : null}

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

                          {/* Switch bật/tắt trạng thái */}
                          <Switch
                            value={item.isAvailable} // Trạng thái hiện tại của món ăn
                            onValueChange={() => handleToggleAvailability(item._id, item.isAvailable)} // Gọi hàm xử lý
                            thumbColor={item.isAvailable ? "#fff" : "#fff"}
                            trackColor={{ false: "#ccc", true: "#E53935" }}
                          />
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
                        {/* Hiển thị checkbox khi đang trong chế độ chọn combo */}
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
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#E53935" }}>{group.groupName}</Text>
                        {group.comboGroups.length > 0 && (
                          <Text>
                            {foodGroups
                              .filter((g) => group.comboGroups.includes(g._id))
                              .map((g, index) => (
                                <Text key={g._id} style={{ fontSize: 16, color: "#6B7280" }}>
                                  {index === 0 ? " + " : ", "}
                                  {g.groupName}
                                </Text>
                              ))}
                          </Text>
                        )}
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

              {/* Hiển thị nút Xác nhận và Hủy khi chọn nhóm món */}
              {isSelectingGroups && (
                <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-around" }}>
                  <TouchableOpacity
                    onPress={async () => {
                      if (removeGroups.length > 0) {
                        await handleDeleteConfirmGroups(); // Gọi API xóa nhóm combo
                      }
                      if (selectedGroups.length > 1) {
                        await handleConfirmGroups(); // Gọi API thêm combo
                      }
                    }}
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
  searchResultItem: {
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
  resultHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E53935",
    marginBottom: 10,
  },
  noDataText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E53935",
    marginBottom: 10,
  },
});
