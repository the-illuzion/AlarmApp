import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAlarm} from '../context/AlarmContext';
import Chatbot from '../components/Chatbot';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const {state, startGymAlarm, confirmWakeUp} = useAlarm();

  const handleStartAlarm = () => {
    Alert.alert(
      'Start Gym Alarm',
      'This will start your daily gym alarm routine. Make sure your settings are configured correctly.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Start',
          onPress: startGymAlarm,
        },
      ]
    );
  };

  const handleWakeUpConfirm = () => {
    Alert.alert(
      'Wake Up Confirmed',
      'Great! Location check will be scheduled in 15 minutes.',
      [
        {
          text: 'OK',
          onPress: confirmWakeUp,
        },
      ]
    );
  };

  const handleWakeUpDeny = () => {
    Alert.alert(
      'Alarm will repeat',
      'The alarm will sound again shortly.',
      [{text: 'OK'}]
    );
  };

  const getStatusText = () => {
    switch (state.alarmStage) {
      case 'idle':
        return 'Ready to start gym alarm';
      case 'alarm_triggered':
        return 'Gym alarm triggered - waiting for wake-up confirmation';
      case 'wakeup_check':
        return 'Wake-up confirmed - location check scheduled';
      case 'location_check':
        return 'Checking gym attendance...';
      case 'gym_confirmed':
        return '🎉 Gym attendance confirmed! Great job!';
      default:
        return 'Ready to start gym alarm';
    }
  };

  const getStatusColor = () => {
    switch (state.alarmStage) {
      case 'idle':
        return '#5E81AC';
      case 'alarm_triggered':
        return '#EBCB8B';
      case 'wakeup_check':
        return '#A3BE8C';
      case 'location_check':
        return '#EBCB8B';
      case 'gym_confirmed':
        return '#A3BE8C';
      default:
        return '#5E81AC';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏋️ Gym Alarm</Text>
        <Text style={styles.subtitle}>Never miss your gym time again!</Text>
      </View>

      <View style={[styles.statusCard, {borderColor: getStatusColor()}]}>
        <Text style={[styles.statusText, {color: getStatusColor()}]}>
          {getStatusText()}
        </Text>

        {state.lastWakeUpCheck && (
          <Text style={styles.timestamp}>
            Wake-up confirmed: {state.lastWakeUpCheck.toLocaleTimeString()}
          </Text>
        )}

        {state.lastLocationCheck && (
          <Text style={styles.timestamp}>
            Location checked: {state.lastLocationCheck.toLocaleTimeString()}
          </Text>
        )}

        {state.retryCount > 0 && (
          <Text style={styles.retryText}>
            Retry attempts: {state.retryCount}/{state.settings.maxRetries}
          </Text>
        )}
      </View>

      <View style={styles.controls}>
        {state.alarmStage === 'idle' && (
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartAlarm}>
            <Text style={styles.primaryButtonText}>Start Gym Alarm</Text>
          </TouchableOpacity>
        )}

        {state.alarmStage === 'alarm_triggered' && (
          <View style={styles.wakeUpContainer}>
            <Text style={styles.wakeUpTitle}>Are you awake?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.yesButton]}
                onPress={handleWakeUpConfirm}
              >
                <Text style={styles.secondaryButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.noButton]}
                onPress={handleWakeUpDeny}
              >
                <Text style={styles.secondaryButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {state.alarmStage === 'wakeup_check' && (
          <View style={styles.waitingCard}>
            <Text style={styles.waitingText}>
              Location check scheduled in {state.settings.locationCheckDelay} minutes
            </Text>
          </View>
        )}

        {state.alarmStage === 'location_check' && (
          <View style={styles.waitingCard}>
            <Text style={styles.waitingText}>
              Checking your location...
            </Text>
          </View>
        )}

        {state.alarmStage === 'gym_confirmed' && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              // Reset alarm state for next day
              Alert.alert('Reset', 'Ready for tomorrow!', [{text: 'OK'}]);
            }}
          >
            <Text style={styles.resetButtonText}>Prepare for Tomorrow</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.chatbotContainer}>
        <Chatbot />
      </View>

      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E3440',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ECEFF4',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D8DEE9',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: '#3B4252',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 14,
    color: '#D8DEE9',
    marginBottom: 5,
  },
  retryText: {
    fontSize: 14,
    color: '#EBCB8B',
    fontWeight: '500',
  },
  controls: {
    flex: 1,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#5E81AC',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#ECEFF4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  wakeUpContainer: {
    alignItems: 'center',
  },
  wakeUpTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ECEFF4',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#A3BE8C',
  },
  noButton: {
    backgroundColor: '#BF616A',
  },
  secondaryButtonText: {
    color: '#ECEFF4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  waitingCard: {
    backgroundColor: '#3B4252',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 18,
    color: '#D8DEE9',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#88C0D0',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#2E3440',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  settingsButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: '#88C0D0',
    fontSize: 16,
    fontWeight: '500',
  },
  chatbotContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 10,
  },
});

export default HomeScreen;
