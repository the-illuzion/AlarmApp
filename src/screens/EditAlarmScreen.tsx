import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp, RouteProp} from '@react-navigation/stack';
import {useAlarms} from '../context/AlarmContext';

type RootStackParamList = {
  Home: undefined;
  AddAlarm: undefined;
  EditAlarm: {alarmId: string};
};

type EditAlarmScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditAlarm'>;
type EditAlarmScreenRouteProp = RouteProp<RootStackParamList, 'EditAlarm'>;

const EditAlarmScreen: React.FC = () => {
  const navigation = useNavigation<EditAlarmScreenNavigationProp>();
  const route = useRoute<EditAlarmScreenRouteProp>();
  const {alarms, updateAlarm, deleteAlarm} = useAlarms();

  const {alarmId} = route.params;
  const alarm = alarms.find(a => a.id === alarmId);

  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [sound, setSound] = useState('');
  const [snooze, setSnooze] = useState(false);

  useEffect(() => {
    if (alarm) {
      setTime(alarm.time);
      setLabel(alarm.label);
      setSelectedDays(alarm.days);
      setSound(alarm.sound);
      setSnooze(alarm.snooze);
    }
  }, [alarm]);

  if (!alarm) {
    return (
      <View style={styles.container}>
        <Text>Alarm not found</Text>
      </View>
    );
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev =>
      prev.includes(dayIndex)
        ? prev.filter(day => day !== dayIndex)
        : [...prev, dayIndex],
    );
  };

  const handleSave = () => {
    if (!time) {
      Alert.alert('Error', 'Please set a time for the alarm');
      return;
    }

    updateAlarm(alarmId, {
      time,
      label,
      days: selectedDays.length === 0 ? [] : selectedDays,
      sound,
      snooze,
    });

    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Alarm',
      `Are you sure you want to delete "${label || 'this alarm'}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', style: 'destructive', onPress: () => {
          deleteAlarm(alarmId);
          navigation.goBack();
        }},
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time</Text>
        <TouchableOpacity style={styles.timeContainer}>
          <Text style={styles.timeText}>{time}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Label</Text>
        <TextInput
          style={styles.textInput}
          value={label}
          onChangeText={setLabel}
          placeholder="Alarm label (optional)"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Repeat</Text>
        <View style={styles.daysContainer}>
          {dayNames.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDays.includes(index) && styles.dayButtonSelected,
              ]}
              onPress={() => toggleDay(index)}>
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDays.includes(index) && styles.dayButtonTextSelected,
                ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedDays.length === 0 && (
          <Text style={styles.repeatInfo}>Alarm will ring once</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sound</Text>
        <TouchableOpacity style={styles.optionContainer}>
          <Text style={styles.optionText}>{sound}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.switchContainer}>
          <Text style={styles.sectionTitle}>Snooze</Text>
          <TouchableOpacity
            style={[styles.switch, snooze && styles.switchActive]}
            onPress={() => setSnooze(!snooze)}>
            <View style={[styles.switchThumb, snooze && styles.switchThumbActive]} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Alarm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  timeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#007AFF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  dayButtonSelected: {
    backgroundColor: '#007AFF',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#666',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  repeatInfo: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  optionContainer: {
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#666',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: '#007AFF',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EditAlarmScreen;
