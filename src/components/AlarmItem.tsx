import React from 'react';
import {View, Text, TouchableOpacity, Switch, StyleSheet} from 'react-native';
import {Alarm} from '../types';

interface AlarmItemProps {
  alarm: Alarm;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const AlarmItem: React.FC<AlarmItemProps> = ({alarm, onEdit, onDelete, onToggle}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDays = (days: number[]) => {
    if (days.length === 0) return 'One time';
    if (days.length === 7) return 'Every day';

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => dayNames[day]).join(', ');
  };

  const getStatusText = () => {
    if (alarm.isGymAlarm) {
      switch (alarm.status) {
        case 'awake_confirmed':
          return '⏰ Awake - Location check pending';
        case 'gym_confirmed':
          return '✅ Gym confirmed!';
        case 'failed':
          return '❌ Still at home';
        default:
          return '🏋️ Gym alarm';
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.content} onPress={onEdit}>
        <View style={styles.leftSection}>
          <Text style={styles.time}>{formatTime(alarm.time)}</Text>
          <Text style={styles.label}>{alarm.label || 'Alarm'}</Text>
          <Text style={styles.days}>{formatDays(alarm.days)}</Text>
          {getStatusText() && (
            <Text style={[styles.status, alarm.status === 'gym_confirmed' && styles.statusSuccess]}>
              {getStatusText()}
            </Text>
          )}
        </View>
        <View style={styles.rightSection}>
          <Switch
            value={alarm.isEnabled}
            onValueChange={onToggle}
            trackColor={{false: '#ccc', true: '#007AFF'}}
            thumbColor={alarm.isEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    marginLeft: 16,
  },
  time: {
    fontSize: 32,
    fontWeight: '300',
    color: '#000',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  days: {
    fontSize: 14,
    color: '#999',
  },
  status: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '500',
  },
  statusSuccess: {
    color: '#28a745',
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AlarmItem;
