import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  header: {
    paddingVertical: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 50,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    paddingHorizontal: 10,
  },
  addressCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    marginHorizontal: 15,
    width: width * 0.9,
  },
  detailRow: {
    flexDirection: "row", // Row layout
    justifyContent: "space-between", // Space between label and value
    alignItems: "center", // Align items vertically
    marginVertical: 5, // Space between rows
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 1, // Label takes up 1 part of the row
    textAlign: "left",
  },
  textLarge: {
    fontSize: 16,
    color: "#555",
    flex: 2, // Value takes up 2 parts of the row
    textAlign: "right", // Align value to the right
  },
  textSmall: {
    fontSize: 120,
    color: "#aaa",
    flex: 2,
    textAlign: "right", // Align description to the right
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: height * 0.9,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#E53935",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: "100%",
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#E53935",
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E53935", // Primary color
    marginBottom: 10, // Space below the header
  },
  
});
