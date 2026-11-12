import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { SplashScreen, WelcomeScreen, LoginScreen, SignUpScreen, SetPasswordScreen } from '../screens/AuthScreens';
import { HomeScreen } from '../screens/HomeScreen';
import { DoctorsScreen, FavoritesScreen, DoctorProfileScreen, BookingScreen } from '../screens/DoctorScreens';
import { AppointmentsScreen, PaymentScreen, PaymentSuccessScreen } from '../screens/AppointmentScreens';
import { ProfileScreen, EditProfileScreen, NotificationsScreen, ChatScreen, SettingsScreen } from '../screens/ProfileScreens';
import { COLORS } from '../constants/theme';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: COLORS.primary, tabBarInactiveTintColor: '#9AA2B2', tabBarStyle: { height: 64, paddingTop: 8, paddingBottom: 8, borderTopColor: '#EEF0F5', backgroundColor: '#FFFFFF' }, tabBarLabelStyle: { fontSize: 10, fontWeight: '700' } }}>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Басты бет', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 19 }}>⌂</Text> }} />
      <Tab.Screen name="DoctorsTab" component={DoctorsScreen} options={{ tabBarLabel: 'Дәрігерлер', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>♙</Text> }} />
      <Tab.Screen name="AppointmentsTab" component={AppointmentsScreen} options={{ tabBarLabel: 'Жазбалар', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>▦</Text> }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Профиль', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>◉</Text> }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
    </Stack.Navigator>
  );
}
