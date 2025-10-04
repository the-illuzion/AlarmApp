/**
 * Gym Alarm App
 * A React Native app that ensures you never miss gym time
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import context
import {AlarmProvider} from './src/context/AlarmContext';
import {AlarmListProvider} from './src/context/AlarmListContext';

const Stack = createStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#2E3440" />
        <AlarmProvider>
          <AlarmListProvider>
            <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#2E3440',
                },
                headerTintColor: '#ECEFF4',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{title: 'Gym Alarm'}}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{title: 'Settings'}}
              />
            </Stack.Navigator>
          </NavigationContainer>
          </AlarmListProvider>
        </AlarmProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});

export default App;
