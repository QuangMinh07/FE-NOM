import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  containergiohang: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 50,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    justifyContent: "space-between",
    flexGrow: 1,
  },
  addressSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
    marginTop: 30,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderDetailsSection: {
    marginBottom: 20,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addMore: {
    flexDirection: "row",
    alignItems: "center",
  },
  addMoreText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#E53935",
  },
  orderItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
  },
  orderItemText: {
    fontSize: 14,
    color: "#333",
    width: 150,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    fontSize: 14,
    color: "#333",
  },
  totalSection: {
    marginBottom: 20,
  },
  totalBreakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalBreakdownText: {
    fontSize: 14,
    color: "#666",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalAmountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E53935",
  },
  paymentSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentButtonText: {
    fontSize: 14,
    color: "#E53935",
    marginRight: 10,
  },
  footerButton: {
    position: "absolute",
    bottom: 35,
    left: 10,
    right: 0,
    backgroundColor: "#E53935",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    width: width * 0.9,
    alignSelf: "center",
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  swipeableDeleteButton: {
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 10,
  },
});
