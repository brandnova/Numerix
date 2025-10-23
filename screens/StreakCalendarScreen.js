import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { Storage } from '../utils/storage';

export default function StreakCalendarScreen({ navigation }) {
  const { colors } = useTheme();
  const [dailyData, setDailyData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadDailyData();
  }, []);

  const loadDailyData = async () => {
    const data = await Storage.getDailyChallenge();
    setDailyData(data);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get starting day of week (0 = Sunday, 1 = Monday, etc.)
    const startDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getDayStatus = (date) => {
    if (!date || !dailyData) return 'future';
    
    // Use local date string to avoid timezone issues
    const dateString = date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const result = dailyData.results.find(r => {
      const resultDate = new Date(r.date);
      const resultDateString = resultDate.toLocaleDateString('en-CA');
      return resultDateString === dateString;
    });
    
    if (result) {
      return result.won ? 'completed' : 'missed';
    }
    
    const today = new Date();
    const todayString = today.toLocaleDateString('en-CA');
    const dateStringFormatted = date.toLocaleDateString('en-CA');
    
    if (dateStringFormatted === todayString) return 'today';
    
    // Check if date is in the past
    if (date < today && dateStringFormatted !== todayString) return 'missed';
    
    return 'future';
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  if (!dailyData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  const monthDays = getMonthDays(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header - Consistent with Settings Screen */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Streak</Text>
          <Pressable 
            onPress={handleGoBack} 
            style={[styles.backButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
          </Pressable>
        </View>

        {/* Streak Overview */}
        <View style={[styles.streakOverview, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.streakStat}>
            <Text style={[styles.streakNumber, { color: colors.primary }]}>{dailyData.currentStreak}</Text>
            <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Current Streak</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.streakStat}>
            <Text style={[styles.streakNumber, { color: colors.success }]}>{dailyData.longestStreak}</Text>
            <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Longest Streak</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.streakStat}>
            <Text style={[styles.streakNumber, { color: colors.text }]}>
              {dailyData.results.filter(r => r.won).length}
            </Text>
            <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Total Wins</Text>
          </View>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <Pressable 
            onPress={() => navigateMonth(-1)}
            style={[styles.navButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <Text style={[styles.navButtonText, { color: colors.text }]}>⬅</Text>
          </Pressable>
          
          <Text style={[styles.monthTitle, { color: colors.text }]}>{monthName}</Text>
          
          <Pressable 
            onPress={() => navigateMonth(1)}
            style={[styles.navButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <Text style={[styles.navButtonText, { color: colors.text }]}>➡</Text>
          </Pressable>
        </View>

        {/* Calendar Grid */}
        <View style={[styles.calendar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          {/* Week Days Header */}
          <View style={styles.weekDaysRow}>
            {weekDays.map(day => (
              <Text key={day} style={[styles.weekDay, { color: colors.textSecondary }]}>
                {day}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {monthDays.map((date, index) => {
              const status = getDayStatus(date);
              const isToday = date => {
                if (!date) return false;
                const today = new Date();
                return date.toLocaleDateString('en-CA') === today.toLocaleDateString('en-CA');
              };
              
              return (
                <View key={index} style={styles.dayCell}>
                  {date ? (
                    <View style={[
                      styles.day,
                      status === 'completed' && [styles.completedDay, { backgroundColor: colors.success }],
                      status === 'missed' && [styles.missedDay, { backgroundColor: colors.danger }],
                      status === 'today' && [styles.todayDay, { borderColor: colors.primary }],
                      isToday(date) && styles.today,
                    ]}>
                      <Text style={[
                        styles.dayNumber,
                        { color: colors.text },
                        status === 'completed' && styles.completedText,
                        status === 'missed' && styles.missedText,
                        isToday(date) && { color: colors.primary, fontWeight: '700' },
                      ]}>
                        {date.getDate()}
                      </Text>
                      {status === 'completed' && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                      {status === 'missed' && (
                        <Text style={styles.cross}>✕</Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.emptyDay} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={[styles.legend, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.danger }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>Missed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.todayLegend, { borderColor: colors.primary }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>Today</Text>
          </View>
        </View>

        {/* Motivation Text */}
        <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
          {dailyData.currentStreak > 0 
            ? `🔥 Amazing! You're on a ${dailyData.currentStreak}-day streak!`
            : "Start your streak today and don't break the chain!"
          }
        </Text>
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
  streakOverview: {
    flexDirection: 'row',
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    justifyContent: 'space-around',
  },
  streakStat: {
    alignItems: 'center',
    flex: 1,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  streakLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    marginHorizontal: SPACING.sm,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  navButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.sm,
    borderWidth: 1,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendar: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 7 days in a week
    aspectRatio: 1,
    padding: 2,
  },
  day: {
    flex: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  emptyDay: {
    flex: 1,
  },
  completedDay: {
    borderRadius: 8,
  },
  missedDay: {
    borderRadius: 8,
  },
  todayDay: {
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  missedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 1,
    right: 1,
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '900',
  },
  cross: {
    position: 'absolute',
    top: 1,
    right: 1,
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '900',
  },
  legend: {
    flexDirection: 'row',
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  todayLegend: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  legendText: {
    fontSize: 12,
  },
  motivationText: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});