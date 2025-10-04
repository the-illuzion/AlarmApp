import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useAlarm} from '../context/AlarmContext';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {state, saveSettings} = useAlarm();

  const [gymTime, setGymTime] = useState(state.settings.gymTime);
  const [wakeUpDelay, setWakeUpDelay] = useState(state.settings.wakeUpDelay.toString());
  const [locationCheckDelay, setLocationCheckDelay] = useState(state.settings.locationCheckDelay.toString());
  const [maxRetries, setMaxRetries] = useState(state.settings.maxRetries.toString());

  const handleSaveSettings = async () => {
    const settings = {
      gymTime,
      wakeUpDelay: parseInt(wakeUpDelay) || 5,
      locationCheckDelay: parseInt(locationCheckDelay) || 15,
      maxRetries: parseInt(maxRetries) || 3,
    };

    await saveSettings(settings);
    Alert.alert('Success', 'Settings saved successfully!', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  const requestLocationPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );

      if (result === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to set home location.');
      }
    } catch (error) {
      console.error('Permission request error:', error);
      Alert.alert('Error', 'Failed to request location permission.');
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        saveSettings({
          homeLocation: {latitude, longitude}
        });
        Alert.alert('Success', 'Home location set successfully!');
      },
      (error) => {
        console.error('Location error:', error);
        Alert.alert('Error', 'Failed to get current location.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const formatTimeInput = (text: string) => {
    // Format input to HH:MM format
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length >= 2) {
      const hours = cleaned.slice(0, 2);
      const minutes = cleaned.slice(2, 4);
      return `${hours}:${minutes}`;
    }
    return cleaned;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your gym alarm preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gym Schedule</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gym Time (HH:MM)</Text>
          <TextInput
            style={styles.textInput}
            value={gymTime}
            onChangeText={(text) => setGymTime(formatTimeInput(text))}
            placeholder="06:00"
            placeholderTextColor="#666"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timing Settings</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Wake-up Check Delay (minutes)</Text>
          <TextInput
            style={styles.textInput}
            value={wakeUpDelay}
            onChangeText={setWakeUpDelay}
            placeholder="5"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location Check Delay (minutes)</Text>
          <TextInput
            style={styles.textInput}
            value={locationCheckDelay}
            onChangeText={setLocationCheckDelay}
            placeholder="15"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Maximum Retry Attempts</Text>
          <TextInput
            style={styles.textInput}
            value={maxRetries}
            onChangeText={setMaxRetries}
            placeholder="3"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Settings</Text>

        <View style={styles.locationInfo}>
          <Text style={styles.label}>Home Location</Text>
          {state.settings.homeLocation ? (
            <Text style={styles.locationText}>
              Lat: {state.settings.homeLocation.latitude.toFixed(6)}
              {'\n'}
              Lng: {state.settings.homeLocation.longitude.toFixed(6)}
            </Text>
          ) : (
            <Text style={styles.locationText}>Not set</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={requestLocationPermission}
        >
          <Text style={styles.locationButtonText}>
            {state.settings.homeLocation ? 'Update Home Location' : 'Set Home Location'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E3440',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ECEFF4',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D8DEE9',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#3B4252',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ECEFF4',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#ECEFF4',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#434C5E',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ECEFF4',
  },
  locationInfo: {
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: '#D8DEE9',
    fontFamily: 'monospace',
  },
  locationButton: {
    backgroundColor: '#5E81AC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#ECEFF4',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#A3BE8C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#2E3440',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#434C5E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ECEFF4',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default SettingsScreen;
