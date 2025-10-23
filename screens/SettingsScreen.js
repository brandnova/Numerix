import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { SPACING, TYPOGRAPHY, THEMES } from '../constants/theme';
import { Storage } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

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

  const handleThemeChange = async (themeId) => {
    const updatedSettings = { ...settings, theme: themeId };
    setSettings(updatedSettings);
    await Storage.saveSettings(updatedSettings);
    changeTheme(themeId);
  };

  const handleToggleSetting = async (key) => {
    const updatedSettings = { ...settings, [key]: !settings[key] };
    setSettings(updatedSettings);
    await Storage.saveSettings(updatedSettings);
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
      'NUMERIX v1.0.0\n\nA number guessing challenge game that tests your intuition and logic.\n\nDeveloped with React Native & Expo',
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

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
          <View style={styles.themeGrid}>
            {THEME_OPTIONS.map((theme) => (
              <Pressable
                key={theme.id}
                onPress={() => handleThemeChange(theme.id)}
                style={[
                  styles.themeCard,
                  { 
                    backgroundColor: THEMES[theme.id].cardBg,
                    borderColor: currentTheme === theme.id ? colors.primary : 'transparent'
                  }
                ]}
              >
                <View style={[
                  styles.themePreview,
                  { backgroundColor: THEMES[theme.id].background }
                ]}>
                  <View style={[styles.themeAccent, { backgroundColor: THEMES[theme.id].primary }]} />
                </View>
                <Text style={[styles.themeName, { color: THEMES[theme.id].text }]}>
                  {theme.name}
                </Text>
                <Text style={[styles.themeDescription, { color: THEMES[theme.id].textSecondary }]}>
                  {theme.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Audio</Text>
          
          <View style={[styles.settingRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Sound Effects</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>Play sound effects</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={() => handleToggleSetting('soundEnabled')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={[styles.settingRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Background Music</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>Play background music</Text>
            </View>
            <Switch
              value={settings.musicEnabled}
              onValueChange={() => handleToggleSetting('musicEnabled')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        {/* Feedback Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Feedback</Text>
          
          <View style={[styles.settingRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Haptic Feedback</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>Vibration on interactions</Text>
            </View>
            <Switch
              value={settings.hapticFeedback}
              onValueChange={() => handleToggleSetting('hapticFeedback')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>

          <View style={[styles.settingRow, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>Daily challenge reminders</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={() => handleToggleSetting('notifications')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
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
            <Text style={[styles.actionButtonArrow, { color: colors.textSecondary }]}>→</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]} 
            onPress={() => Alert.alert('Coming Soon', 'Tutorial feature coming soon!')}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>How to Play</Text>
            <Text style={[styles.actionButtonArrow, { color: colors.textSecondary }]}>→</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]} 
            onPress={() => Alert.alert('Coming Soon', 'Rate feature coming soon!')}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Rate NUMERIX</Text>
            <Text style={[styles.actionButtonArrow, { color: colors.textSecondary }]}>→</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]} 
            onPress={() => Alert.alert('Coming Soon', 'Share feature coming soon!')}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Share with Friends</Text>
            <Text style={[styles.actionButtonArrow, { color: colors.textSecondary }]}>→</Text>
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

        <Text style={[styles.versionText, { color: colors.textMuted }]}>NUMERIX v1.0.0</Text>
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
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  themeCard: {
    width: '48%',
    borderRadius: SPACING.md,
    padding: SPACING.md,
    borderWidth: 2,
  },
  themePreview: {
    height: 60,
    borderRadius: SPACING.sm,
    marginBottom: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeAccent: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  themeDescription: {
    fontSize: 11,
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