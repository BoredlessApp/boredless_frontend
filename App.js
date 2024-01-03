import React from 'react';
import { Image, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import GenerateScreen from './GenerateScreen';
import SettingsScreen from './SettingsScreen';
import ActivityScreen from './ActivityScreen';
import homeIcon from './assets/icons8-home-page-24.png';
import generateIcon from './assets/icons8-light-on-48.png';
import settingsIcon from './assets/icons8-gear-30.png';
import backButtonImage from './assets/back-button.png';
import logoImage from './assets/logo.png';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const GenerateStack = createStackNavigator();

const GenerateStackNavigator = () => {
  return (
    <GenerateStack.Navigator initialRouteName="GenerateMain">
      <GenerateStack.Screen 
          name="GenerateMain" 
          component={GenerateScreen} 
          options={{
              headerShown: false
          }}
      />
      <GenerateStack.Screen 
          name="Activity" 
          component={ActivityScreen} 
          options={({ navigation }) => ({
              headerShown: true,
              headerLeft: () => (
                  <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                      <Image source={backButtonImage} style={{ marginLeft: 10, height: 32, width: 32 }} />
                  </TouchableWithoutFeedback>
              ),
              headerBackTitleVisible: false
          })}
      />
    </GenerateStack.Navigator>
  );
};

// Remove the ActivityScreen from MainStack as it is now part of GenerateStackNavigator
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Back" component={BottomTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? homeIcon : homeIcon;
          } else if (route.name === 'Generate') {
            iconName = focused ? generateIcon : generateIcon;
          } else if (route.name === 'Settings') {
            iconName = focused ? settingsIcon : settingsIcon;
          }

          return (
            <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />
          );
        },
        tabBarActiveTintColor: '#020E5D',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: [{ display: 'flex' }, null],
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: "Home",
          headerRight: () => (
            <Image source={logoImage} style={{ marginRight: 10, height: 25, width: 25 }} />
          )
        }}
      />
      <Tab.Screen 
        name="Generate" 
        component={GenerateScreen} 
        options={{
          title: "Generate",
          headerRight: () => (
            <Image source={logoImage} style={{ marginRight: 10, height: 25, width: 25 }} />
          )
        }}
      />
      <Tab.Screen 
        name="Activity" 
        component={ActivityScreen} 
        options={({ navigation }) => ({
          tabBarButton: () => null, // Hide the tab button
          headerLeft: () => (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Generate')}>
                <Image source={backButtonImage} style={{ marginLeft: 10, height: 32, width: 32 }} />
            </TouchableWithoutFeedback>
          ),
          headerBackTitleVisible: false
        })}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          title: "Settings",
          headerRight: () => (
            <Image source={logoImage} style={{ marginRight: 10, height: 25, width: 25 }} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default App;