import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import DailyChallengeScreen from './screens/DailyChallengeScreen';
import StreakCalendarScreen from './screens/StreakCalendarScreen';
import SpeedModeScreen from './screens/SpeedModeScreen';
import GameModesScreen from './screens/GameModesScreen';
import ThemeSelectionScreen from './screens/ThemeSelectionScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NavigationContainer>
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