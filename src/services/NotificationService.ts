import PushNotification from 'react-native-push-notification';
import {Alarm} from '../types';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.configure();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private configure() {
    PushNotification.configure({
      // Called when a remote or local notification is opened or received
      onNotification: (notification: any) => {
        console.log('NOTIFICATION:', notification);

        // Handle notification actions
        if (notification.action === 'Yes') {
          // User confirmed wake-up
          console.log('User confirmed wake-up');
        } else if (notification.action === 'No') {
          // User denied wake-up - alarm will repeat
          console.log('User denied wake-up');
        }

        // Process the notification
        if (notification.userInfo) {
          const {type, alarmId} = notification.userInfo;

          switch (type) {
            case 'gym_alarm':
              // Initial gym alarm triggered
              break;
            case 'wakeup_check':
              // Wake-up check notification
              break;
            case 'location_check':
              // Location check reminder
              break;
            case 'regular_alarm':
              // Regular alarm triggered
              break;
          }
        }
      },

      // Called when the user clicks on a notification
      onAction: (notification: any) => {
        console.log('ACTION:', notification.action);
      },

      // Called when the user registers for remote notifications
      onRegister: (token: any) => {
        console.log('TOKEN:', token);
      },

      // Called when registering for remote notifications fails
      onRegistrationError: (err: any) => {
        console.error('RegistrationError:', err);
      },

      // IOS ONLY: Called when the user grants or denies permission for remote notifications
      onRemoteNotification: (notification: any) => {
        console.log('Remote Notification:', notification);
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      // Request permissions on iOS
      requestPermissions: true,
    });

    // Create notification channel for Android
    PushNotification.createChannel(
      {
        channelId: 'gym-alarm-channel',
        channelName: 'Gym Alarm Notifications',
        channelDescription: 'Notifications for gym alarm reminders',
        soundName: 'default',
        importance: 4,
        vibrate: true,
        playSound: true,
      },
      (created: boolean) => console.log(`Channel created: ${created}`)
    );
  }

  scheduleAlarm(alarm: Alarm) {
    if (!alarm.isEnabled) return;

    const [hours, minutes] = alarm.time.split(':').map(Number);
    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(hours, minutes, 0, 0);

    // If alarm time has passed today, schedule for tomorrow
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      id: alarm.id,
      title: `⏰ ${alarm.label || 'Alarm'}`,
      message: `Time for: ${alarm.label || 'Alarm'}`,
      date: alarmTime,
      channelId: 'gym-alarm-channel',
      soundName: alarm.sound || 'default',
      playSound: true,
      vibrate: true,
      userInfo: {
        type: 'regular_alarm',
        alarmId: alarm.id,
      },
      repeatType: 'day', // Repeat daily for now, can be extended for days array
    });

    console.log(`Alarm scheduled for ${alarmTime.toLocaleString()}`);
  }

  cancelAlarm(alarmId: string) {
    PushNotification.cancelLocalNotification(alarmId);
    console.log(`Cancelled alarm: ${alarmId}`);
  }

  scheduleGymAlarm(alarmId: string, gymTime: string) {
    // Parse gym time (HH:MM format)
    const [hours, minutes] = gymTime.split(':').map(Number);
    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(hours, minutes, 0, 0);

    // If alarm time has passed today, schedule for tomorrow
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      id: alarmId,
      title: '🏋️ Gym Time!',
      message: 'Time to hit the gym! Are you ready?',
      date: alarmTime,
      channelId: 'gym-alarm-channel',
      soundName: 'default',
      playSound: true,
      vibrate: true,
      userInfo: {
        type: 'gym_alarm',
        alarmId,
      },
      actions: '["Yes", "No"]',
      repeatType: 'day', // Repeat daily
    });

    console.log(`Gym alarm scheduled for ${alarmTime.toLocaleString()}`);
  }

  scheduleWakeUpCheck(alarmId: string, delayMinutes: number = 5) {
    const checkTime = new Date();
    checkTime.setMinutes(checkTime.getMinutes() + delayMinutes);

    PushNotification.localNotificationSchedule({
      id: `${alarmId}_wakeup`,
      title: '⏰ Wake Up Check',
      message: 'Are you awake and ready for gym?',
      date: checkTime,
      channelId: 'gym-alarm-channel',
      soundName: 'default',
      playSound: true,
      vibrate: true,
      userInfo: {
        type: 'wakeup_check',
        alarmId,
      },
      actions: '["Yes", "No"]',
    });

    console.log(`Wake-up check scheduled for ${checkTime.toLocaleString()}`);
  }

  scheduleLocationCheck(alarmId: string, delayMinutes: number = 15) {
    const checkTime = new Date();
    checkTime.setMinutes(checkTime.getMinutes() + delayMinutes);

    PushNotification.localNotificationSchedule({
      id: `${alarmId}_location`,
      title: '📍 Location Check',
      message: 'Please share your location to confirm gym attendance.',
      date: checkTime,
      channelId: 'gym-alarm-channel',
      soundName: 'default',
      playSound: true,
      vibrate: true,
      userInfo: {
        type: 'location_check',
        alarmId,
      },
    });

    console.log(`Location check scheduled for ${checkTime.toLocaleString()}`);
  }

  cancelAlarmNotifications(alarmId: string) {
    PushNotification.cancelLocalNotification(alarmId);
    PushNotification.cancelLocalNotification(`${alarmId}_wakeup`);
    PushNotification.cancelLocalNotification(`${alarmId}_location`);
    console.log(`Cancelled notifications for alarm: ${alarmId}`);
  }

  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
    console.log('Cancelled all notifications');
  }

  // Test notification for development
  showTestNotification() {
    PushNotification.localNotification({
      title: 'Test Notification',
      message: 'This is a test notification',
      channelId: 'gym-alarm-channel',
      soundName: 'default',
      playSound: true,
      vibrate: true,
    });
  }
}

export default NotificationService;
