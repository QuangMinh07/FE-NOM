import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05, // 5% of screen width
        paddingVertical: height * 0.05, // 5% of screen height
        backgroundColor: "#fff",
      },
      stepContainer: {
        marginBottom: height * 0.03, // 3% of screen height
      },
      logo: {
        width: width * 0.3, // 30% of screen width
        height: width * 0.3, // Maintain square aspect ratio
        alignSelf: "center",
        marginBottom: height * 0.05, // 5% of screen height
      },
      title: {
        fontSize: width * 0.045, // Dynamic font size based on screen width
        marginBottom: height * 0.02, // 2% of screen height
        textAlign: "center",
        color: "black",
      },
      label: {
        fontSize: width * 0.04,
        fontWeight: "500",
        marginBottom: height * 0.01,
        color: "#333",
      },
      input: {
        borderWidth: 1,
        borderColor: "#E53935",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.03,
        borderRadius: 8,
        marginBottom: height * 0.03,
        backgroundColor: "#fff",
        color: "#000",
      },
      button: {
        backgroundColor: "#E53935",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.1,
        borderRadius: 8,
        alignItems: "center",
        marginTop: height * 0.03,
      },
      buttonText: {
        color: "#fff",
        fontSize: width * 0.045,
        fontWeight: "bold",
      },
      progressBarContainer: {
        alignItems: "center",
        marginBottom: height * 0.04,
      },
      progressBar: {
        flexDirection: "row",
        alignItems: "center",
      },
      progressDot: {
        width: width * 0.04,
        height: width * 0.04,
        borderRadius: (width * 0.04) / 2,
        backgroundColor: "#ccc",
      },
      progressLine: {
        width: width * 0.1,
        height: 2,
        backgroundColor: "#ccc",
      },
      activeDot: {
        backgroundColor: "#E53935",
      },
      activeLine: {
        backgroundColor: "#E53935",
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        backgroundColor: "#fff",
        padding: width * 0.05,
        borderRadius: 8,
        width: "80%",
      },
      modalTitle: {
        fontSize: width * 0.045,
        fontWeight: "bold",
        marginBottom: height * 0.02,
      },
      modalItem: {
        padding: width * 0.03,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      },
      viewTerms3: {
        marginVertical: height * 0.03,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: width * 0.05,
      },
      linkText3: {
        fontSize: width * 0.04,
        color: "#E53935",
        fontWeight: "bold",
        marginLeft: width * 0.1,
      },
      termsBox3: {
        padding: width * 0.05,
        borderColor: "#E53935",
        borderWidth: 2,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: height * 0.05,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
      },
      termsText3: {
        fontSize: width * 0.035,
        color: "#333",
        lineHeight: width * 0.05,
        marginBottom: height * 0.01,
      },
      checkboxContainer3: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: height * 0.03,
        paddingHorizontal: width * 0.05,
      },
      checkboxLabel3: {
        fontSize: width * 0.035,
        marginLeft: width * 0.02,
        color: "#333",
        fontWeight: "600",
      },
      button3: {
        backgroundColor: "#E53935",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.2,
        borderRadius: 30,
        alignItems: "center",
        marginTop: height * 0.04,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
      },
      buttonText3: {
        color: "#fff",
        fontSize: width * 0.05,
        fontWeight: "bold",
      },
});

export default styles;
