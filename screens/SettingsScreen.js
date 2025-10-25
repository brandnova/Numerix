import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { SPACING, TYPOGRAPHY, THEMES } from '../constants/theme';
import { Storage } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';
import { NotificationService } from '../utils/notifications';

const THEME_OPTIONS = [
  { id: 'dark', name: 'Dark', description: 'Classic dark theme' },
  { id: 'light', name: 'Light', description: 'Bright and clean' },
  { id: 'ocean', name: 'Ocean', description: 'Deep blue vibes' },
  { id: 'sunset', name: 'Sunset', description: 'Purple and pink' },
  { id: 'forest', name: 'Forest', description: 'Natural greens' },
  { id: 'midnight', name: 'Midnight', description: 'Pure darkness' },
  { id: 'cherry', name: 'Cherry', description: 'Red passion' },
  { id: 'arctic', name: 'Arctic', description: 'Icy blues' },
];

export default function SettingsScreen({ navigation }) {
  const { currentTheme, colors, changeTheme } = useTheme();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const userSettings = await Storage.getSettings();
    setSettings(userSettings);
  };

  const handleToggleSetting = async (key) => {
    const updatedSettings = { ...settings, [key]: !settings[key] };
    setSettings(updatedSettings);
    await Storage.saveSettings(updatedSettings);
  };

  // Enhanced notification toggle with immediate feedback
  const handleToggleNotification = async () => {
    const updatedSettings = { ...settings, notifications: !settings.notifications };
    setSettings(updatedSettings);
    await Storage.saveSettings(updatedSettings);
    
    if (updatedSettings.notifications) {
      const permissionsGranted = await NotificationService.requestPermissions();
      if (permissionsGranted) {
        await NotificationService.scheduleDailyReminder();
        Alert.alert(
          'Notifications Enabled', 
          'You will receive daily reminders at 6 PM to keep your streak alive! 🔥'
        );
      } else {
        // If permissions denied, revert the toggle
        const revertedSettings = { ...updatedSettings, notifications: false };
        setSettings(revertedSettings);
        await Storage.saveSettings(revertedSettings);
      }
    } else {
      await NotificationService.cancelAllNotifications();
      Alert.alert(
        'Notifications Disabled', 
        'You will no longer receive daily reminders.'
      );
    }
  };

  // Test notification function
  const handleTestNotification = async () => {
    const success = await NotificationService.scheduleTestNotification();
    if (success) {
      Alert.alert('Success', 'Test notification sent!');
    } else {
      Alert.alert('Error', 'Failed to send test notification. Please check if notifications are enabled.');
    }
  };

  // Coming soon alert for disabled features
  const handleComingSoon = (featureName) => {
    Alert.alert('Coming Soon', `${featureName} will be available in a future update!`);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your progress, statistics, and achievements. This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await Storage.clearAll();
            // Also cancel notifications when data is cleared
            await NotificationService.cancelAllNotifications();
            Alert.alert('Success', 'All data has been cleared');
            navigation.replace('Home');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About NUMERIX',
      'NUMERIX v2.1.0\n\nA number guessing challenge game that tests your intuition and logic.\n\nDeveloped by Brand Nova with React Native & Expo',
      [{ text: 'OK' }]
    );
  };

  if (!settings) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <Pressable 
            onPress={() => navigation.goBack()} 
            style={[styles.backButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
          </Pressable>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
          
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]} 
            onPress={() => navigation.navigate('ThemeSelection')}
          >
            <View style={styles.actionButtonContent}>
              <View>
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Change Theme</Text>
                <Text style={[styles.actionButtonSubtext, { color: colors.textSecondary }]}>
                  Currently: {THEME_OPTIONS.find(t => t.id === currentTheme)?.name}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Notifications Section - MOVED UP */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Notifications</Text>
          
          <View style={[styles.settingRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Daily Reminders</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Get reminded to complete daily challenges
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={handleToggleNotification}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>

          {/* Test Notification Button - Only show if notifications are enabled */}
          {settings.notifications && (
            <Pressable 
              style={[styles.testButton, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]} 
              onPress={handleTestNotification}
            >
              <Text style={[styles.testButtonText, { color: colors.primary }]}>🔔 Test Notification</Text>
            </Pressable>
          )}

          <View style={[styles.notificationInfo, { backgroundColor: colors.primary + '10' }]}>
            <Text style={[styles.notificationInfoText, { color: colors.textSecondary }]}>
              📅 Daily reminders at 6 PM{'\n'}
              🔥 Streak protection at 9 PM if not played{'\n'}
              📊 Weekly progress summary on Sundays
            </Text>
          </View>
        </View>

        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Audio</Text>
          
          <View style={[styles.settingRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Sound Effects</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Play sound effects during gameplay
                <Text style={[styles.comingSoonText, { color: colors.warning }]}> • Coming Soon</Text>
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={() => handleComingSoon('Sound Effects')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
              disabled={true}
            />
          </View>

          <View style={[styles.settingRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Background Music</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Play background music in menus
                <Text style={[styles.comingSoonText, { color: colors.warning }]}> • Coming Soon</Text>
              </Text>
            </View>
            <Switch
              value={settings.musicEnabled}
              onValueChange={() => handleComingSoon('Background Music')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
              disabled={true}
            />
          </View>
        </View>

        {/* Feedback Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Feedback</Text>
          
          <View style={[styles.settingRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Haptic Feedback</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Vibration on interactions
                <Text style={[styles.comingSoonText, { color: colors.warning }]}> • Coming Soon</Text>
              </Text>
            </View>
            <Switch
              value={settings.hapticFeedback}
              onValueChange={() => handleComingSoon('Haptic Feedback')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
              disabled={true}
            />
          </View>
        </View>

        {/* Other Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Other</Text>
          
          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]} 
            onPress={handleAbout}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>About NUMERIX</Text>
            <Text style={[styles.actionButtonArrow, { color: colors.textSecondary }]}>➡</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]} 
            onPress={() => handleComingSoon('Tutorial')}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>How to Play</Text>
            <Text style={[styles.actionButtonArrow, { color: colors.textSecondary }]}>➡</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]} 
            onPress={() => handleComingSoon('Rating')}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Rate NUMERIX</Text>
            <Text style={[styles.actionButtonArrow, { color: colors.textSecondary }]}>➡</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]} 
            onPress={() => handleComingSoon('Sharing')}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Share with Friends</Text>
            <Text style={[styles.actionButtonArrow, { color: colors.textSecondary }]}>➡</Text>
          </Pressable>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.danger }]}>Danger Zone</Text>
          
          <Pressable 
            style={[styles.dangerButton, { backgroundColor: colors.danger + '15', borderColor: colors.danger }]} 
            onPress={handleClearData}
          >
            <Text style={[styles.dangerButtonText, { color: colors.danger }]}>Clear All Data</Text>
          </Pressable>
        </View>

        <Text style={[styles.versionText, { color: colors.textMuted }]}>NUMERIX v2.1.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xxl,
    paddingTop: 50,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.title,
  },
  backButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.sm,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: SPACING.xxl + SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.md,
  },
  settingRow: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontSize: 13,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  testButton: {
    borderRadius: SPACING.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationInfo: {
    borderRadius: SPACING.md,
    padding: SPACING.md,
  },
  notificationInfoText: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtonArrow: {
    fontSize: 18,
  },
  dangerButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});