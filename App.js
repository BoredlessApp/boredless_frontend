import React from 'react';
import { useFonts } from 'expo-font';
import { Image, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import GenerateScreen from './screens/GenerateScreen';
import SettingsScreen from './screens/SettingsScreen';
import ActivityScreen from './screens/ActivityScreen';
import SavedScreen from './screens/SavedScreen';
import ExpandActivityScreen from './screens/ExpandActivityScreen';
import ExpandSavedScreen from './screens/ExpandSavedScreen';

import focusHomeIcon from './assets/taskbar_icons/focus_home_icon.png';
import unfocusHomeIcon from './assets/taskbar_icons/unfocus_home_icon.png';

import focusSavedIcon from './assets/taskbar_icons/focus_saved_icon.png';
import unfocusSavedIcon from './assets/taskbar_icons/unfocus_saved_icon.png';

import focusGenerateIcon from './assets/taskbar_icons/focus_generate_icon.png';
import unfocusGenerateIcon from './assets/taskbar_icons/unfocus_generate_icon.png';

import focusSettingsIcon from './assets/taskbar_icons/focus_account_icon.png';
import unfocusSettingsIcon from './assets/taskbar_icons/unfocus_account_icon.png';

import backButtonImage from './assets/other_icons/back_button.png';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          let iconStyle = { width: size, height: size };

          if (route.name === 'Home') {
            iconName = focused ? focusHomeIcon : unfocusHomeIcon;
          } else if (route.name === 'Saved') {
            iconName = focused ? focusSavedIcon : unfocusSavedIcon;
            iconStyle = { width: size * 1.2, height: size * 1.2 };
          } else if (route.name === 'Generate') {
            iconStyle = { width: size * 1.1, height: size * 1.1 };
            iconName = focused ? focusGenerateIcon : unfocusGenerateIcon;
          } else if (route.name === 'Settings') {
            iconName = focused ? focusSettingsIcon : unfocusSettingsIcon;
          }

          return <Image source={iconName} style={iconStyle} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: [{ display: 'flex', paddingTop: 15 }, null],
        tabBarShowLabel: false,
        headerTitleStyle: { fontFamily: 'Montserrat-SemiBold' },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: "Home",
          // headerRight: () => (
          //   // LOGO WOULD GO HERE
          // )
        }}
      />
      <Tab.Screen 
        name="Generate" 
        component={GenerateScreen} 
        options={{
          title: "Generate",
          // headerRight: () => (
          //   // LOGO WOULD GO HERE
          // )
        }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedScreen} 
        options={{
          title: "Saved",
          // headerRight: () => (
          //   // LOGO WOULD GO HERE
          // )
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
        name="ExpandActivity" 
        component={ExpandActivityScreen} 
        options={({ navigation }) => ({
          tabBarButton: () => null,
          headerTitle: "Activity", 
          headerLeft: () => (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Saved')}>
                <Image source={backButtonImage} style={{ marginLeft: 10, height: 32, width: 32 }} />
            </TouchableWithoutFeedback>
          ),
          headerBackTitleVisible: false
        })}
      />
      <Tab.Screen 
        name="ExpandSaved" 
        component={ExpandSavedScreen} 
        options={({ navigation }) => ({
          tabBarButton: () => null,
          headerTitle: "Activity List", 
          headerLeft: () => (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Saved')}>
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
          // headerRight: () => (
          //   // LOGO WOULD GO HERE
          // )
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [loaded] = useFonts({
      'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
      'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
      'Montserrat-Thin': require('./assets/fonts/Montserrat-Thin.ttf'),
      'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
  });

  if (!loaded) {
      return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default App;