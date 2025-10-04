import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Voice from 'react-native-voice';
import {useAlarmList} from '../context/AlarmListContext';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const {state, addAlarm, deleteAlarm} = useAlarmList();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I can help you manage your alarms. Try saying "Set alarm at 6 AM" or "Show my alarms".',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const processMessage = (text: string) => {
    const lowerText = text.toLowerCase().trim();

    // Parse set alarm commands
    const setAlarmRegex = /(?:set|create|add)\s+alarm(?:s)?\s+(?:at|for)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi;
    const matches = [...lowerText.matchAll(setAlarmRegex)];

    if (matches.length > 0) {
      const alarmsToSet: {time: string; label: string}[] = [];

      for (const match of matches) {
        let hours = parseInt(match[1]);
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const ampm = match[3]?.toLowerCase();

        if (ampm === 'pm' && hours !== 12) {
          hours += 12;
        } else if (ampm === 'am' && hours === 12) {
          hours = 0;
        }

        const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        alarmsToSet.push({time, label: `Alarm at ${time}`});
      }

      if (alarmsToSet.length > 0) {
        alarmsToSet.forEach(alarm => {
          addAlarm({
            time: alarm.time,
            label: alarm.label,
            isEnabled: true,
            days: [0, 1, 2, 3, 4, 5, 6], // Daily
            sound: 'default',
            snooze: true,
          });
        });

        const alarmText = alarmsToSet.length === 1
          ? `alarm for ${alarmsToSet[0].time}`
          : `${alarmsToSet.length} alarms`;
        addMessage(`I've set ${alarmText} for you!`, false);
        return;
      }
    }

    // Parse list alarms command
    if (lowerText.includes('show') && lowerText.includes('alarm')) {
      if (state.alarms.length === 0) {
        addMessage('You have no active alarms.', false);
      } else {
        const alarmList = state.alarms
          .filter(alarm => alarm.isEnabled)
          .map(alarm => `${alarm.label} at ${alarm.time}`)
          .join('\n• ');
        addMessage(`Your active alarms:\n• ${alarmList}`, false);
      }
      return;
    }

    // Parse delete alarm command
    const deleteRegex = /(?:delete|remove|cancel)\s+alarm(?:s)?\s+(?:at|for)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
    const deleteMatch = lowerText.match(deleteRegex);

    if (deleteMatch) {
      let hours = parseInt(deleteMatch[1]);
      const minutes = deleteMatch[2] ? parseInt(deleteMatch[2]) : 0;
      const ampm = deleteMatch[3]?.toLowerCase();

      if (ampm === 'pm' && hours !== 12) {
        hours += 12;
      } else if (ampm === 'am' && hours === 12) {
        hours = 0;
      }

      const timeToDelete = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      const alarmToDelete = state.alarms.find(alarm =>
        alarm.isEnabled && alarm.time === timeToDelete
      );

      if (alarmToDelete) {
        deleteAlarm(alarmToDelete.id);
        addMessage(`Deleted alarm at ${timeToDelete}.`, false);
      } else {
        addMessage(`No active alarm found at ${timeToDelete}.`, false);
      }
      return;
    }

    // Fallback for unrecognized commands
    addMessage("I can only help with alarms right now. Try commands like 'Set alarm at 6 AM', 'Show my alarms', or 'Delete alarm at 7 PM'.", false);
  };

  const handleVoicePress = async () => {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
      } else {
        setInputText('');
        await Voice.start('en-US');
      }
    } catch (e) {
      console.error('Voice start/stop error:', e);
      Alert.alert('Voice Error', 'Could not start voice recognition.');
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      addMessage(inputText, true);
      processMessage(inputText);
      setInputText('');
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        setInputText(e.value[0]);
      }
    };
    Voice.onSpeechError = (e) => {
      console.error('Voice error:', e);
      setIsListening(false);
      Alert.alert('Voice Error', 'Could not process voice input. Please try again.');
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const renderMessage = ({item}: {item: ChatMessage}) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.botMessage]}>
      <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={handleVoicePress}
        >
          <Text style={styles.voiceButtonText}>
            {isListening ? '🎙️' : '🎤'}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E3440',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#5E81AC',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#3B4252',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userText: {
    color: '#ECEFF4',
  },
  botText: {
    color: '#D8DEE9',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: '#2E3440',
    borderTopWidth: 1,
    borderTopColor: '#434C5E',
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5E81AC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  voiceButtonActive: {
    backgroundColor: '#A3BE8C',
  },
  voiceButtonText: {
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#3B4252',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    color: '#ECEFF4',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#5E81AC',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#ECEFF4',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Chatbot;
