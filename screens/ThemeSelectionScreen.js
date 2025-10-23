import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING, THEMES } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { Storage } from '../utils/storage';

const THEME_OPTIONS = [
  { id: 'dark', name: 'Dark', description: 'Classic dark theme', emoji: '🌙' },
  { id: 'light', name: 'Light', description: 'Bright and clean', emoji: '☀️' },
  { id: 'ocean', name: 'Ocean', description: 'Deep blue vibes', emoji: '🌊' },
  { id: 'sunset', name: 'Sunset', description: 'Purple and pink', emoji: '🌇' },
  { id: 'forest', name: 'Forest', description: 'Natural greens', emoji: '🌲' },
  { id: 'midnight', name: 'Midnight', description: 'Pure darkness', emoji: '🕶️' },
  { id: 'cherry', name: 'Cherry', description: 'Red passion', emoji: '🍒' },
  { id: 'arctic', name: 'Arctic', description: 'Icy blues', emoji: '❄️' },
];

export default function ThemeSelectionScreen({ navigation }) {
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

  const handleGoBack = () => {
    navigation.goBack();
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
        {/* Header - Consistent with Settings Screen */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Select Theme</Text>
          <Pressable 
            onPress={handleGoBack} 
            style={[styles.backButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
          </Pressable>
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Choose a theme that matches your style
        </Text>

        {/* Theme Grid */}
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
                <View style={[styles.themeEmoji, { backgroundColor: THEMES[theme.id].primary }]}>
                  <Text style={styles.emojiText}>{theme.emoji}</Text>
                </View>
              </View>
              
              <View style={styles.themeInfo}>
                <Text style={[styles.themeName, { color: THEMES[theme.id].text }]}>
                  {theme.name}
                </Text>
                <Text style={[styles.themeDescription, { color: THEMES[theme.id].textSecondary }]}>
                  {theme.description}
                </Text>
              </View>

              {currentTheme === theme.id && (
                <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.selectedText}>Selected</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
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
  // Updated Header - Consistent with Settings Screen
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 22,
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
    borderWidth: 3,
    alignItems: 'center',
  },
  themePreview: {
    width: '100%',
    height: 100,
    borderRadius: SPACING.sm,
    marginBottom: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeEmoji: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  themeInfo: {
    alignItems: 'center',
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  themeDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
});