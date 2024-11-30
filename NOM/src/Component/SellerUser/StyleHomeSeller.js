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
    marginTop: 10, // Khoảng cách phía trên
  },
  actionButton: {
    backgroundColor: "#E53935", // Màu nền nút
    flexDirection: "row", // Căn ngang icon và text
    alignItems: "center", // Căn giữa nội dung theo chiều dọc
    justifyContent: "center", // Căn giữa theo chiều ngang
    paddingVertical: 15, // Tăng kích thước chiều cao nút
    paddingHorizontal: 20, // Tăng kích thước chiều rộng nút
    borderRadius: 10, // Bo góc nút mềm mại
    marginHorizontal: 8, // Khoảng cách giữa các nút
    elevation: 3, // Bóng cho Android
    shadowColor: "#000", // Bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  actionButtonText: {
    color: "#fff", // Màu chữ
    fontWeight: "bold", // Đậm chữ
    fontSize: 16, // Kích thước chữ
  },
  // Styles cho "Món bán chạy"
  bestSellerContainer: {
    backgroundColor: "#E53935", // Red background
    padding: 15, // Add padding inside the container
    marginBottom: 20, // Add spacing below the section
  },
  bestSellerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  bestSellerCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    width: 150, // Adjust width to fit multiple cards in a row
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: "relative",
  },
  bestSellerImageContainer: {
    width: "100%",
    height: width * 0.3, // Dynamic height for responsiveness
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  bestSellerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    paddingHorizontal: 15,
    marginVertical: 20,
  },
  otherFoodsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
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
