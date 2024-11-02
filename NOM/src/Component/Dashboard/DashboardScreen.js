import React from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const revenueData = {
    labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'],
    datasets: [
      {
        data: [5000, 8000, 6500, 9000, 12000, 14000],
      },
    ],
  };

  const ordersData = {
    labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'],
    datasets: [
      {
        data: [50, 70, 65, 85, 95, 100],
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Bảng Điều Khiển Doanh Thu</Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#E53935' }]}>
          <Text style={styles.cardTitle}>Tổng Doanh Thu</Text>
          <Text style={styles.cardValue}>58,000$</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#FF7043' }]}>
          <Text style={styles.cardTitle}>Tổng Đơn Hàng</Text>
          <Text style={styles.cardValue}>1,200</Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#8E24AA' }]}>
          <Text style={styles.cardTitle}>Giá Trị Đơn TB</Text>
          <Text style={styles.cardValue}>48.33$</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#43A047' }]}>
          <Text style={styles.cardTitle}>KH Quay Lại</Text>
          <Text style={styles.cardValue}>300</Text>
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
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(229, 57, 53, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
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
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
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
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E53935',
    textAlign: 'center',
    marginBottom: 5,
    marginTop:50
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 10,
  },
});

export default DashboardScreen;
