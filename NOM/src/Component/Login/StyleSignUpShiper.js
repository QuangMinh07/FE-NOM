import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const StyleSignUpShiper = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // Handles iPhone notches
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: "#fff",
  },
  banner: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 30,
  },
  stepContainer: {
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#333",
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
    padding: height * 0.02,
    borderRadius: 8,
    marginBottom: height * 0.02,
    backgroundColor: "#fff",
    color: "#000",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  dateInputField: {
    borderWidth: 1,
    borderColor: "#E53935",
    padding: height * 0.02,
    borderRadius: 8,
    flex: 1,
    marginRight: width * 0.02,
    color: "#000",
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: "#E53935",
    padding: height * 0.02,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#E53935",
    paddingVertical: height * 0.02,
    borderRadius: 8,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  avatar: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    alignSelf: "center",
    marginBottom: height * 0.02,
  },
  avatarButton: {
    backgroundColor: "#E53935",
    padding: height * 0.015,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  progressBarContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: width * 0.04,
    height: width * 0.04,
    borderRadius: width * 0.02,
    backgroundColor: "#ccc",
  },
  progressLine: {
    width: width * 0.15,
    height: 2,
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: "#E53935",
  },
  activeLine: {
    backgroundColor: "#E53935",
  },
  termsBox: {
    padding: width * 0.05,
    borderColor: "#E53935",
    borderWidth: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: height * 0.03,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  termsText: {
    fontSize: width * 0.035,
    color: "#333",
    lineHeight: height * 0.025,
    marginBottom: height * 0.01,
  },
  viewTerms: {
    marginVertical: height * 0.02,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  linkText: {
    fontSize: width * 0.04,
    color: "#E53935",
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.05,
  },
  checkboxLabel: {
    fontSize: width * 0.04,
    marginLeft: width * 0.02,
    color: "#333",
    fontWeight: "600",
  },
});

export default StyleSignUpShiper;
