import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alarm} from '../types';
import NotificationService from '../services/NotificationService';

interface AlarmListState {
  alarms: Alarm[];
}

type AlarmListAction =
  | {type: 'SET_ALARMS'; payload: Alarm[]}
  | {type: 'ADD_ALARM'; payload: Alarm}
  | {type: 'UPDATE_ALARM'; payload: {id: string; alarm: Partial<Alarm>}}
  | {type: 'DELETE_ALARM'; payload: string}
  | {type: 'TOGGLE_ALARM'; payload: string};

const initialState: AlarmListState = {
  alarms: [],
};

function alarmListReducer(state: AlarmListState, action: AlarmListAction): AlarmListState {
  switch (action.type) {
    case 'SET_ALARMS':
      return {
        ...state,
        alarms: action.payload,
      };
    case 'ADD_ALARM':
      return {
        ...state,
        alarms: [...state.alarms, action.payload],
      };
    case 'UPDATE_ALARM':
      return {
        ...state,
        alarms: state.alarms.map(alarm =>
          alarm.id === action.payload.id
            ? {...alarm, ...action.payload.alarm}
            : alarm
        ),
      };
    case 'DELETE_ALARM':
      return {
        ...state,
        alarms: state.alarms.filter(alarm => alarm.id !== action.payload),
      };
    case 'TOGGLE_ALARM':
      return {
        ...state,
        alarms: state.alarms.map(alarm =>
          alarm.id === action.payload
            ? {...alarm, isEnabled: !alarm.isEnabled}
            : alarm
        ),
      };
    default:
      return state;
  }
}

interface AlarmListContextType {
  state: AlarmListState;
  addAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  loadAlarms: () => Promise<void>;
  saveAlarms: () => Promise<void>;
}

const AlarmListContext = createContext<AlarmListContextType | undefined>(undefined);

export const AlarmListProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, dispatch] = useReducer(alarmListReducer, initialState);

  const saveAlarms = async () => {
    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(state.alarms));
    } catch (error) {
      console.error('Error saving alarms:', error);
    }
  };

  const loadAlarms = async () => {
    try {
      const savedAlarms = await AsyncStorage.getItem('alarms');
      if (savedAlarms) {
        const parsedAlarms = JSON.parse(savedAlarms).map((alarm: any) => ({
          ...alarm,
          createdAt: new Date(alarm.createdAt),
          lastLocationCheck: alarm.lastLocationCheck ? new Date(alarm.lastLocationCheck) : undefined,
        }));
        dispatch({type: 'SET_ALARMS', payload: parsedAlarms});
      }
    } catch (error) {
      console.error('Error loading alarms:', error);
    }
  };

  const addAlarm = (alarmData: Omit<Alarm, 'id' | 'createdAt'>) => {
    const newAlarm: Alarm = {
      ...alarmData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    dispatch({type: 'ADD_ALARM', payload: newAlarm});
    // Schedule notification
    if (newAlarm.isEnabled) {
      const notificationService = NotificationService.getInstance();
      notificationService.scheduleAlarm(newAlarm);
    }
  };

  const updateAlarm = (id: string, alarmData: Partial<Alarm>) => {
    dispatch({type: 'UPDATE_ALARM', payload: {id, alarm: alarmData}});
    const updatedAlarm = state.alarms.find(a => a.id === id);
    if (updatedAlarm) {
      const notificationService = NotificationService.getInstance();
      if (alarmData.isEnabled !== undefined) {
        if (alarmData.isEnabled) {
          notificationService.scheduleAlarm(updatedAlarm);
        } else {
          notificationService.cancelAlarm(id);
        }
      } else {
        notificationService.scheduleAlarm(updatedAlarm);
      }
    }
  };

  const deleteAlarm = (id: string) => {
    dispatch({type: 'DELETE_ALARM', payload: id});
    const notificationService = NotificationService.getInstance();
    notificationService.cancelAlarm(id);
  };

  const toggleAlarm = (id: string) => {
    dispatch({type: 'TOGGLE_ALARM', payload: id});
    const alarm = state.alarms.find(a => a.id === id);
    if (alarm) {
      const notificationService = NotificationService.getInstance();
      if (!alarm.isEnabled) {
        notificationService.scheduleAlarm(alarm);
      } else {
        notificationService.cancelAlarm(id);
      }
    }
  };

  useEffect(() => {
    loadAlarms();
  }, []);

  useEffect(() => {
    saveAlarms();
  }, [state.alarms]);

  const value: AlarmListContextType = {
    state,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    loadAlarms,
    saveAlarms,
  };

  return (
    <AlarmListContext.Provider value={value}>
      {children}
    </AlarmListContext.Provider>
  );
};

export const useAlarmList = () => {
  const context = useContext(AlarmListContext);
  if (context === undefined) {
    throw new Error('useAlarmList must be used within an AlarmListProvider');
  }
  return context;
};
