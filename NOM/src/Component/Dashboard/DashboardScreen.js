import React, { useEffect, useState, useContext } from "react";
import { View, Text, Dimensions, ScrollView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { Picker } from '@react-native-picker/picker';
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
  
  // Year filter state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { globalData } = useContext(globalContext);

  const fetchOrdersData = async () => {
    const storeId = globalData.storeData?._id;

    try {
      const response = await api({
        method: typeHTTP.GET,
        url: `/storeOrder/get-orders/${storeId}`,
        sendToken: true,
      });

      if (!response || !response.storeOrdersDetails) {
        console.error("No order data found.");
        setLoading(false);
        return;
      }

      const orders = response.storeOrdersDetails;
      const revenueByMonth = Array(12).fill(0);
      const ordersCountByMonth = Array(12).fill(0);

      let totalRevenueSum = 0;
      let totalOrderCount = 0;

      orders.forEach((order) => {
        const orderDate = new Date(order.orderDate);
        if (orderDate.getFullYear() === selectedYear) {
          const month = orderDate.getMonth();
          revenueByMonth[month] += order.totalAmount;
          ordersCountByMonth[month] += 1;
          totalRevenueSum += order.totalAmount;
          totalOrderCount += 1;
        }
      });

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
      console.error("Error fetching order data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [selectedYear]);

  if (loading) {
    return <ActivityIndicator size="large" color="#E53935" style={styles.loadingIndicator} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Bảng Điều Khiển Doanh Thu</Text>

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


      import { Picker } from '@react-native-picker/picker';

{/* Year Filter */}
<View style={styles.filterContainer}>
  <Text style={styles.filterLabel}>Chọn Năm:</Text>
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={selectedYear}
      style={styles.picker}
      onValueChange={(itemValue) => setSelectedYear(itemValue)}
    >
      {[2024, 2025, 2026].map((year) => (
        <Picker.Item key={year} label={`${year}`} value={year} />
      ))}
    </Picker>
  </View>
</View>




      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Doanh Thu Hàng Tháng</Text>
        <ScrollView horizontal contentContainerStyle={{ alignItems: "center" }}>
          <LineChart
            data={revenueData}
            width={Math.max(screenWidth, revenueData.labels.length * 50)}
            height={220}
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFF",
              backgroundGradientTo: "#FFF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(229, 57, 53, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              formatYLabel: (yValue) => Math.round(yValue / 100) * 100,
            }}
            style={styles.chart}
            onDataPointClick={(data) => {
              Alert.alert(
                "Doanh Thu Tháng " + (data.index + 1),
                `${data.value.toLocaleString("vi-VN")} VND`
              );
            }}
          />
        </ScrollView>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Số Đơn Hàng Hàng Tháng</Text>
        <ScrollView horizontal contentContainerStyle={{ alignItems: "center" }}>
          <BarChart
            data={ordersData}
            width={Math.max(screenWidth, ordersData.labels.length * 50)}
            height={220}
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFF",
              backgroundGradientTo: "#FFF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(67, 160, 71, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              formatYLabel: (yValue) => Math.round(yValue / 10) * 10,
            }}
            style={styles.chart}
          />
        </ScrollView>
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
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
    fontWeight: "bold",
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    color: "#333",
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
