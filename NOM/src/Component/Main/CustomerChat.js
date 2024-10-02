import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Icon library
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Get device dimensions for responsive design
const { width } = Dimensions.get('window');

export default function CustomerChat() {
  const [message, setMessage] = useState(''); // State to manage input message
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); // State to track keyboard visibility
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Jhon Abraham',
      text: 'Have a great working week!!',
      time: '09:25 AM',
      type: 'text',
      senderId: 'otherUser', // Message from another user
      image: null, // No image for the first message
    },
    {
      id: '2',
      sender: 'You',
      text: 'Thanks! Hope you too!',
      time: '09:26 AM',
      type: 'text',
      senderId: 'currentUser',
      image: 'https://example.com/current-user.jpg',
    },
    {
      id: '3',
      sender: 'Jhon Abraham',
      text: 'Hope you like it',
      time: '09:27 AM',
      type: 'text',
      senderId: 'otherUser',
      image: 'https://example.com/jhon-abraham.jpg',
    },
    {
      id: '4',
      sender: 'You',
      text: 'Yes, it looks good so far!',
      time: '09:28 AM',
      type: 'text',
      senderId: 'currentUser',
      image: 'https://example.com/current-user.jpg',
    },
    {
      id: '5',
      sender: 'Jhon Abraham',
      text: 'audio-message.mp3',
      time: '09:30 AM',
      type: 'audio',
      duration: '00:16',
      senderId: 'otherUser',
      image: 'https://example.com/jhon-abraham.jpg',
    },
    {
      id: '6',
      sender: 'You',
      text: 'Great! Let me check it out!',
      time: '09:31 AM',
      type: 'text',
      senderId: 'currentUser',
      image: 'https://example.com/current-user.jpg',
    },
    {
      id: '7',
      sender: 'Jhon Abraham',
      text: 'Let me know your thoughts once done.',
      time: '09:32 AM',
      type: 'text',
      senderId: 'otherUser',
      image: 'https://example.com/jhon-abraham.jpg',
    },
    {
      id: '8',
      sender: 'You',
      text: 'Sure, I will get back to you.',
      time: '09:33 AM',
      type: 'text',
      senderId: 'currentUser',
      image: 'https://example.com/current-user.jpg',
    },
  ]); // Initial messages data

  const user = 'currentUser'; // Identifier for the current user

  // Detect when the keyboard is open and closed
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Function to render each message
  const renderMessageItem = ({ item, index }) => {
    const isCurrentUser = item.senderId === user;
    const isFirstMessage = index === messages.length - 1; // Since FlatList is inverted

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageRight : styles.messageLeft,
        ]}
      >
        {/* Display profile picture or red circle for incoming messages */}
        {!isCurrentUser && (
          isFirstMessage ? (
            <View style={styles.redCircle} />
          ) : item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.whiteCircle} />
          )
        )}

        {/* Message Bubble */}
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.bubbleRight : styles.bubbleLeft,
          ]}
        >
          {item.type === 'text' ? (
            <Text style={isCurrentUser ? styles.messageTextRight : styles.messageTextLeft}>
              {item.text}
            </Text>
          ) : (
            // Audio message layout
            <View style={styles.audioMessage}>
              <FontAwesome name="play-circle" size={24} color={isCurrentUser ? '#fff' : '#000'} />
              <View style={styles.audioProgress} />
              <Text style={isCurrentUser ? styles.audioDurationRight : styles.audioDurationLeft}>
                {item.duration}
              </Text>
            </View>
          )}
        </View>

        {/* Display profile picture or red circle for outgoing messages */}
        {isCurrentUser && (
          isFirstMessage ? (
            <View style={styles.redCircle} />
          ) : item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.whiteCircle} />
          )
        )}

        {/* Timestamp */}
        <Text style={styles.timestamp}>{item.time}</Text>
      </View>
    );
  };

  // Function to handle sending a message
  const handleSend = () => {
    if (message.trim().length > 0) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        sender: 'You',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        senderId: 'currentUser',
        image: 'https://example.com/current-user.jpg',
      };
      setMessages([newMessage, ...messages]);
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80} // Adjust based on header height
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { /* Handle back action */ }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://example.com/jhon-abraham.jpg' }}
            style={styles.headerImage}
          />
          <View style={styles.headerTitle}>
            <Text style={styles.headerName}>Jhon Abraham</Text>
            <Text style={styles.headerStatus}>Active now</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="call" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          inverted // To show the latest message at the bottom
        />

        {/* Message Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="attach" size={24} color="#000" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập tin nhắn..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icon name="send" size={24} color="#E53935" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Stylesheet for the component
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E53935',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerStatus: {
    color: '#fff',
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: width * 0.8, // Max width for message bubbles
  },
  messageLeft: {
    justifyContent: 'flex-start',
  },
  messageRight: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  redCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#E53935',
    marginHorizontal: 10,
  },
  whiteCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
  },
  bubbleLeft: {
    backgroundColor: '#f1f1f1',
    marginLeft: 5,
  },
  bubbleRight: {
    backgroundColor: '#E53935',
    marginRight: 5,
  },
  messageTextLeft: {
    color: '#000',
    fontSize: 16,
  },
  messageTextRight: {
    color: '#fff',
    fontSize: 16,
  },
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  audioProgress: {
    flex: 1,
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 2.5,
    marginHorizontal: 10,
  },
  audioDurationLeft: {
    color: '#000',
    fontSize: 12,
  },
  audioDurationRight: {
    color: '#fff',
    fontSize: 12,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
    alignSelf: 'flex-end',
    marginHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  attachButton: {
    padding: 5,
  },
  textInput: {
    flex: 1,
    maxHeight: 100, // Allow multiline input up to 100 height
    backgroundColor: '#f1f1f1',
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
