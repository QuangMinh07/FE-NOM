import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  storeInfoContainer: {
    position: "absolute",
    bottom: -40,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  storeInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  storeNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    width: 110,
  },
  storeRatingText: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },
  storeStatusContainer: {
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  storeStatusText: {
    color: "#fff",
    fontWeight: "bold",
  },
  timeSectionText: {
    fontSize: 14,
    color: "#E53935",
    marginTop: 5,
    paddingLeft: 20,
  },
  addressText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  // Styles cho Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#E53935",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "#E53935",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  // Thêm style cho phần doanh thu
  revenueContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: 10,
  },
  revenueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  revenueTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E53935",
  },
  revenueAmount: {
    fontSize: 16,
    color: "#999999",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "#E53935",
    padding: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  actionButtonText: {
    color: "#fff",
  },
  // Styles cho "Món bán chạy"
  bestSellerContainer: {
    backgroundColor: "#E53935",
    padding: 15,
  },
  bestSellerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  bestSellerCard: {
    backgroundColor: "#fff",
    height: height * 0.23,
    width: width * 0.55,
    borderRadius: 10,
    marginRight: 15,
    padding: 10,
    justifyContent: "space-between",
    borderColor: "#D3D3D3",
    borderWidth: 1,
  },
  bestSellerImageContainer: {
    backgroundColor: "#D3D3D3",
    height: height * 0.15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bestSellerImage: {
    height: height * 0.15,
    borderRadius: 10,
    width: width * 0.5,
  },
  bestSellerFoodName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  bestSellerFoodPrice: {
    fontSize: 14,
    color: "#333",
  },
  // Thêm style cho "Các món khác"
  otherFoodsContainer: {
    padding: 20,
  },
  otherFoodsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  otherFoodCard: {
    backgroundColor: "#fff",
    height: height * 0.2,
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
    borderColor: "#D3D3D3",
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 10,
  },
  otherFoodImageContainer: {
    backgroundColor: "#D3D3D3",
    height: height * 0.15,
    width: width * 0.3,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  otherFoodImage: {
    height: height * 0.12,
    borderRadius: 10,
    width: width * 0.3,
  },
  otherFoodDetails: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
  },
  otherFoodRating: {
    fontSize: 14,
    color: "#333",
  },
  otherFoodName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  otherFoodPrice: {
    fontSize: 14,
    color: "#333",
  },
});
