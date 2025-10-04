export interface Alarm {
  id: string;
  time: string; // HH:MM format
  label: string;
  isEnabled: boolean;
  days: number[]; // 0-6 for Sunday-Saturday
  sound: string;
  snooze: boolean;
  createdAt: Date;
  // Gym-specific fields
  isGymAlarm?: boolean;
  homeLocation?: {
    latitude: number;
    longitude: number;
    radius: number; // meters
  };
  gymTime?: string; // Fixed gym time for daily alarms
  wakeUpCheckEnabled?: boolean;
  locationCheckEnabled?: boolean;
  lastLocationCheck?: Date;
  status?: 'pending' | 'awake_confirmed' | 'gym_confirmed' | 'failed';
}

export interface AlarmContextType {
  alarms: Alarm[];
  gymSettings: GymSettings;
  addAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  updateGymSettings: (settings: Partial<GymSettings>) => void;
  confirmWakeUp: (alarmId: string) => void;
  confirmGymLocation: (alarmId: string, location: {latitude: number; longitude: number}) => boolean;
}

export interface GymSettings {
  gymTime: string; // HH:MM format
  homeLocation?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  wakeUpDelayMinutes: number; // Default: 5
  locationCheckDelayMinutes: number; // Default: 15
  maxRetries: number; // Max alarm retries if user doesn't go to gym
  locationAccuracy: 'high' | 'balanced' | 'low';
  notificationsEnabled: boolean;
  backgroundTasksEnabled: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

export interface NotificationAction {
  id: string;
  title: string;
  callback: () => void;
}
