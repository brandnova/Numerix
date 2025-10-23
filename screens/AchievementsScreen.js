import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { ACHIEVEMENTS } from '../constants/achievements';
import { Storage } from '../utils/storage';
import AchievementBadge from '../components/AchievementBadge';
import { useNavigation } from '@react-navigation/native';

export default function AchievementsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const unlocked = await Storage.getAchievements();
    const userStats = await Storage.getStats();
    setUnlockedAchievements(unlocked);
    setStats(userStats);
  };

  const isUnlocked = (achievementId) => {
    return unlockedAchievements.some(a => a.id === achievementId);
  };

  const progress = stats ? {
    unlocked: unlockedAchievements.length,
    total: ACHIEVEMENTS.length,
    percentage: Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100),
  } : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header - Consistent with Settings Screen */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Achievements</Text>
          <Pressable 
            onPress={() => navigation.goBack()} 
            style={[styles.backButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
          </Pressable>
        </View>

        {/* Progress Bar */}
        {progress && (
          <View style={[
            styles.progressSection, 
            { 
              backgroundColor: colors.cardBg,
              borderColor: colors.border 
            }
          ]}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressText, { color: colors.text }]}>
                {progress.unlocked} / {progress.total}
              </Text>
              <Text style={[styles.progressPercentage, { color: colors.primary }]}>
                {progress.percentage}%
              </Text>
            </View>
            <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
              <View 
                style={[styles.progressBar, { 
                  width: `${progress.percentage}%`,
                  backgroundColor: colors.primary 
                }]} 
              />
            </View>
          </View>
        )}

        {/* Achievements List */}
        <View style={styles.achievementsList}>
          {ACHIEVEMENTS.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              unlocked={isUnlocked(achievement.id)}
            />
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
  progressSection: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderWidth: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  achievementsList: {
    gap: SPACING.md,
  },
});