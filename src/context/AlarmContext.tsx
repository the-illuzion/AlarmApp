import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../services/NotificationService';
import BackgroundTaskService from '../services/BackgroundTaskService';

export interface GymSettings {
  gymTime: string; // HH:MM format
  homeLocation?: {
    latitude: number;
    longitude: number;
  };
  wakeUpDelay: number; // minutes
  locationCheckDelay: number; // minutes
  maxRetries: number;
}

export interface AlarmState {
  settings: GymSettings;
  isAlarmActive: boolean;
  lastWakeUpCheck: Date | null;
  lastLocationCheck: Date | null;
  gymAttendanceConfirmed: boolean;
  alarmStage: 'idle' | 'alarm_triggered' | 'wakeup_check' | 'location_check' | 'gym_confirmed';
  retryCount: number;
}

type AlarmAction =
  | {type: 'SET_SETTINGS'; payload: Partial<GymSettings>}
  | {type: 'SET_ALARM_ACTIVE'; payload: boolean}
  | {type: 'SET_WAKEUP_CHECK'; payload: Date}
  | {type: 'SET_LOCATION_CHECK'; payload: Date}
  | {type: 'SET_GYM_CONFIRMED'; payload: boolean}
  | {type: 'SET_ALARM_STAGE'; payload: AlarmState['alarmStage']}
  | {type: 'INCREMENT_RETRY'}
  | {type: 'RESET_RETRY'}
  | {type: 'RESET_ALARM_STATE'};

const initialState: AlarmState = {
  settings: {
    gymTime: '06:00',
    wakeUpDelay: 5,
    locationCheckDelay: 15,
    maxRetries: 3,
  },
  isAlarmActive: false,
  lastWakeUpCheck: null,
  lastLocationCheck: null,
  gymAttendanceConfirmed: false,
  alarmStage: 'idle',
  retryCount: 0,
};

function alarmReducer(state: AlarmState, action: AlarmAction): AlarmState {
  switch (action.type) {
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: {...state.settings, ...action.payload},
      };
    case 'SET_ALARM_ACTIVE':
      return {
        ...state,
        isAlarmActive: action.payload,
      };
    case 'SET_WAKEUP_CHECK':
      return {
        ...state,
        lastWakeUpCheck: action.payload,
        alarmStage: 'wakeup_check',
      };
    case 'SET_LOCATION_CHECK':
      return {
        ...state,
        lastLocationCheck: action.payload,
        alarmStage: 'location_check',
      };
    case 'SET_GYM_CONFIRMED':
      return {
        ...state,
        gymAttendanceConfirmed: action.payload,
        alarmStage: action.payload ? 'gym_confirmed' : state.alarmStage,
      };
    case 'SET_ALARM_STAGE':
      return {
        ...state,
        alarmStage: action.payload,
      };
    case 'INCREMENT_RETRY':
      return {
        ...state,
        retryCount: state.retryCount + 1,
      };
    case 'RESET_RETRY':
      return {
        ...state,
        retryCount: 0,
      };
    case 'RESET_ALARM_STATE':
      return {
        ...initialState,
        settings: state.settings, // Keep settings
      };
    default:
      return state;
  }
}

interface AlarmContextType {
  state: AlarmState;
  dispatch: React.Dispatch<AlarmAction>;
  saveSettings: (settings: Partial<GymSettings>) => Promise<void>;
  loadSettings: () => Promise<void>;
  startGymAlarm: () => void;
  confirmWakeUp: () => void;
  confirmGymAttendance: (latitude: number, longitude: number) => boolean;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(alarmReducer, initialState);

  const saveSettings = async (newSettings: Partial<GymSettings>) => {
    try {
      const updatedSettings = {...state.settings, ...newSettings};
      await AsyncStorage.setItem('gymSettings', JSON.stringify(updatedSettings));
      dispatch({type: 'SET_SETTINGS', payload: newSettings});
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('gymSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({type: 'SET_SETTINGS', payload: parsedSettings});
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const startGymAlarm = () => {
    const notificationService = NotificationService.getInstance();
    const alarmId = `gym_alarm_${Date.now()}`;

    // Schedule the initial gym alarm
    notificationService.scheduleGymAlarm(alarmId, state.settings.gymTime);

    dispatch({type: 'SET_ALARM_ACTIVE', payload: true});
    dispatch({type: 'SET_ALARM_STAGE', payload: 'alarm_triggered'});
    dispatch({type: 'RESET_RETRY'});
  };

  const confirmWakeUp = () => {
    const notificationService = NotificationService.getInstance();
    const alarmId = `gym_alarm_${Date.now()}`;

    // Schedule location check notification
    notificationService.scheduleLocationCheck(alarmId, state.settings.locationCheckDelay);

    dispatch({type: 'SET_WAKEUP_CHECK', payload: new Date()});
  };

  const confirmGymAttendance = (latitude: number, longitude: number): boolean => {
    if (!state.settings.homeLocation) {
      return false;
    }

    // Calculate distance from home (rough calculation)
    const distance = calculateDistance(
      latitude,
      longitude,
      state.settings.homeLocation.latitude,
      state.settings.homeLocation.longitude
    );

    // If more than 100 meters from home, consider it gym attendance
    const isAtGym = distance > 100; // 100 meters threshold

    if (isAtGym) {
      dispatch({type: 'SET_GYM_CONFIRMED', payload: true});
      dispatch({type: 'SET_ALARM_ACTIVE', payload: false});
      return true;
    } else {
      // Still at home, increment retry count
      dispatch({type: 'INCREMENT_RETRY'});
      if (state.retryCount + 1 >= state.settings.maxRetries) {
        // Max retries reached, reset alarm state
        dispatch({type: 'RESET_ALARM_STATE'});
      } else {
        // Schedule another alarm cycle
        dispatch({type: 'SET_ALARM_STAGE', payload: 'alarm_triggered'});
      }
      return false;
    }
  };

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  useEffect(() => {
    loadSettings();

    // Initialize services
    const notificationService = NotificationService.getInstance();
    const backgroundService = BackgroundTaskService.getInstance();
    backgroundService.configure();
  }, []);

  const value: AlarmContextType = {
    state,
    dispatch,
    saveSettings,
    loadSettings,
    startGymAlarm,
    confirmWakeUp,
    confirmGymAttendance,
  };

  return (
    <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>
  );
};

export const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
};
