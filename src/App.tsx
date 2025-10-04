import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddAlarmScreen from './screens/AddAlarmScreen';
import EditAlarmScreen from './screens/EditAlarmScreen';
import SettingsScreen from './screens/SettingsScreen';
import {AlarmProvider} from './context/AlarmContext';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <AlarmProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Gym Alarm'}}
          />
          <Stack.Screen
            name="AddAlarm"
            component={AddAlarmScreen}
            options={{title: 'Add Alarm'}}
          />
          <Stack.Screen
            name="EditAlarm"
            component={EditAlarmScreen}
            options={{title: 'Edit Alarm'}}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{title: 'Settings'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AlarmProvider>
  );
};

export default App;
