import PushNotification from 'react-native-push-notification';

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

export const formatTime12Hour = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const scheduleAlarmNotification = (alarm: any) => {
  // Cancel any existing notification for this alarm
  PushNotification.cancelLocalNotification(alarm.id);

  if (!alarm.isEnabled) return;

  // Schedule the alarm notification
  PushNotification.localNotificationSchedule({
    id: alarm.id,
    title: alarm.label || 'Alarm',
    message: 'Time to wake up!',
    date: new Date(), // This should be calculated based on the alarm time and days
    repeatType: alarm.days.length > 0 ? 'week' : 'time',
    repeatTime: alarm.days.length * 24 * 60 * 60 * 1000, // Repeat every week if days are set
    actions: ['Snooze', 'Dismiss'],
  });
};

export const cancelAlarmNotification = (alarmId: string) => {
  PushNotification.cancelLocalNotification(alarmId);
};
