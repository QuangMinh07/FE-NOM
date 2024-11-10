import React, { useEffect, useState, useContext } from "react";
import { View, Text, Dimensions, ScrollView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = () => {
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [ordersData, setOrdersData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const { globalData } = useContext(globalContext);

  // Hàm lấy dữ liệu từ API và xử lý dữ liệu
  const fetchOrdersData = async () => {
    const storeId = globalData.storeData?._id;

    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/storeOrder/get-orders/${storeId}`,
        sendToken: true,
      });

      // Kiểm tra nếu không có dữ liệu đơn hàng
      if (!response || !response.storeOrdersDetails) {
        console.error("Không có dữ liệu đơn hàng.");
        setLoading(false);
        return;
      }

      const orders = response.storeOrdersDetails;
      const revenueByMonth = Array(12).fill(0);
      const ordersCountByMonth = Array(12).fill(0);

      // Xử lý dữ liệu để tính tổng doanh thu và số đơn hàng theo tháng
      let totalRevenueSum = 0;
      let totalOrderCount = 0;

      orders.forEach((order) => {
        const month = new Date(order.orderDate).getMonth(); // Lấy tháng từ ngày tạo đơn hàng
        revenueByMonth[month] += order.totalAmount;
        ordersCountByMonth[month] += 1;
        totalRevenueSum += order.totalAmount;
        totalOrderCount += 1;
      });

      // Cập nhật dữ liệu biểu đồ và tổng số
      setRevenueData({
        labels: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
        datasets: [{ data: revenueByMonth }],
      });
      setOrdersData({
        labels: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
        datasets: [{ data: ordersCountByMonth }],
      });
      setTotalRevenue(totalRevenueSum);
      setTotalOrders(totalOrderCount);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchOrdersData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#E53935" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Bảng Điều Khiển Doanh Thu</Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: "#E53935" }]}>
          <Text style={styles.cardTitle}>Tổng Doanh Thu</Text>
          <Text style={styles.cardValue}>{totalRevenue.toLocaleString("vi-VN")} VND</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#FF7043" }]}>
          <Text style={styles.cardTitle}>Tổng Đơn Hàng</Text>
          <Text style={styles.cardValue}>{totalOrders}</Text>
        </View>
      </View>

      {/* Line Chart for Monthly Revenue */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Doanh Thu Hàng Tháng</Text>
        <LineChart
          data={revenueData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#FFFFFF",
            backgroundGradientFrom: "#FFF",
            backgroundGradientTo: "#FFF",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(229, 57, 53, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
          onDataPointClick={(data) => {
            // Hiển thị Alert với giá trị cụ thể của điểm nhấn
            Alert.alert("Doanh Thu Tháng " + (data.index + 1), `${data.value.toLocaleString("vi-VN")} VND`);
          }}
        />
      </View>

      {/* Bar Chart for Monthly Orders */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Số Đơn Hàng Hàng Tháng</Text>
        <BarChart
          data={ordersData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#FFFFFF",
            backgroundGradientFrom: "#FFF",
            backgroundGradientTo: "#FFF",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(67, 160, 71, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E53935",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardValue: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E53935",
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    borderRadius: 10,
  },
});

export default DashboardScreen;
