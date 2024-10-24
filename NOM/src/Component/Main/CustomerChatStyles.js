import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#E53935",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 10,
  },
  headerName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  headerStatus: {
    color: "#fff",
    fontSize: 14,
  },
  headerIcon: {
    marginLeft: 15,
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20, // Space for input bar
  },
  messageContainer: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: width * 0.8, // Max width for message bubbles
  },
  messageLeft: {
    justifyContent: "flex-start",
  },
  messageRight: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
  },
  bubbleLeft: {
    backgroundColor: "#f1f1f1", // Màu nền cho tin nhắn bên trái
    marginLeft: 5,
  },
  bubbleRight: {
    backgroundColor: "#E53935", // Màu nền cho tin nhắn bên phải
    marginRight: 5,
  },
  messageTextLeft: {
    color: "#000", // Màu chữ cho tin nhắn bên trái
    fontSize: 16,
  },
  messageTextRight: {
    color: "#fff", // Màu chữ cho tin nhắn bên phải
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  attachButton: {
    padding: 5,
  },
  textInput: {
    flex: 1,
    maxHeight: 100, // Allow multiline input up to 100 height
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    padding: 5,
    marginLeft: 5,
  },
});

export default styles;
