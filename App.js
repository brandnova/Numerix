import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { NotificationService } from './utils/notifications';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';

import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import DailyChallengeScreen from './screens/DailyChallengeScreen';
import StreakCalendarScreen from './screens/StreakCalendarScreen';
import SpeedModeScreen from './screens/SpeedModeScreen';
import PuzzleModeScreen from './screens/PuzzleModeScreen';
import GameModesScreen from './screens/GameModesScreen';
import ThemeSelectionScreen from './screens/ThemeSelectionScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { colors } = useTheme();
  const navigationRef = useRef();

  // Configure notification handler
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Handle notification responses (when user taps notification)
    const notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { screen } = response.notification.request.content.data;
        if (screen && navigationRef.current) {
          // Navigate to the screen specified in the notification
          navigationRef.current.navigate(screen);
        }
      }
    );

    // Handle foreground notifications
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📱 Notification received in foreground:', notification);
        // You could show a custom in-app toast here if needed
      }
    );

    // Initialize notification system
    const initializeNotifications = async () => {
      try {
        await NotificationService.initialize();
        console.log('🔔 Notification system initialized');
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initializeNotifications();

    // Cleanup subscriptions
    return () => {
      notificationResponseSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NavigationContainer 
        ref={navigationRef}
        onReady={() => {
          console.log('🚀 Navigation container ready');
        }}
      >
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
          <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} />
          <Stack.Screen name="StreakCalendar" component={StreakCalendarScreen} />
          <Stack.Screen name="GameModes" component={GameModesScreen} />
          <Stack.Screen name="SpeedMode" component={SpeedModeScreen} />
          <Stack.Screen name="PuzzleMode" component={PuzzleModeScreen} />
          {/* <Stack.Screen name="ScreenName" component={ScreenName} options={{ headerShown: true }} /> */}
          <Stack.Screen name="ThemeSelection" component={ThemeSelectionScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

// Loading component while theme is initializing
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
      <Text style={{ color: '#f8fafc', fontSize: 16 }}>Loading...</Text>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}