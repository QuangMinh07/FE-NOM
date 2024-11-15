import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderDateText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemCountContainer: {
    backgroundColor: "#E53935",
    borderRadius: 20,
    padding: 10,
  },
  itemCountText: {
    color: "#fff",
    fontSize: 14,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  boldText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#E53935",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  completedButton: {
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  header: {
    backgroundColor: "#E53935",
    paddingTop: 50,
    height: 140,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 20,
  },
  searchBarContainer: {
    position: "absolute",
    top: 110,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 50,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
});
