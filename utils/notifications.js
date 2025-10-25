import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Storage } from './storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  // Request permissions
  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }
    
    return true;
  },

  // Get push token (OPTIONAL - only for remote push notifications)
  async getPushToken() {
    try {
      // Only attempt to get push token if we have a project ID and want remote notifications
      // For local notifications, we don't need this at all
      return null;
    } catch (error) {
      console.log('Push token not available for local notifications');
      return null;
    }
  },

  // Schedule daily reminder
  async scheduleDailyReminder() {
    try {
      // Cancel any existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      const settings = await Storage.getSettings();
      
      if (!settings.notifications) {
        return false;
      }

      // Schedule for 6 PM daily
      const trigger = {
        hour: 18, // 6 PM
        minute: 0,
        repeats: true,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📅 Your Daily Challenge Awaits!",
          body: "Don't break your streak! Complete today's challenge.",
          data: { screen: 'DailyChallenge' },
          sound: true, // Use default sound
        },
        trigger,
      });

      console.log('✅ Daily notification scheduled for 6 PM');
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  },

  // Schedule streak reminder (if user hasn't played today)
  async scheduleStreakReminder() {
    try {
      const dailyData = await Storage.getDailyChallenge();
      const hasPlayedToday = await this.hasPlayedToday(dailyData);
      
      if (hasPlayedToday) return;

      const settings = await Storage.getSettings();
      if (!settings.notifications) return;

      // Schedule reminder for 9 PM if not played
      const trigger = {
        hour: 21, // 9 PM
        minute: 0,
        repeats: false, // One-time for today
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔥 Streak in Danger!",
          body: "Complete today's challenge before midnight to keep your streak alive!",
          data: { screen: 'DailyChallenge' },
          sound: true,
        },
        trigger,
      });

      console.log('✅ Streak protection notification scheduled for 9 PM');
    } catch (error) {
      console.error('Error scheduling streak reminder:', error);
    }
  },

  // Check if user has played today
  async hasPlayedToday(dailyData) {
    if (!dailyData.lastPlayedDate) return false;
    
    const lastPlayed = new Date(dailyData.lastPlayedDate);
    const today = new Date();
    
    return (
      lastPlayed.getDate() === today.getDate() &&
      lastPlayed.getMonth() === today.getMonth() &&
      lastPlayed.getFullYear() === today.getFullYear()
    );
  },

  // Achievement notification
  async scheduleAchievementNotification(achievement) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🏆 Achievement Unlocked!",
          body: `${achievement.title} - ${achievement.description}`,
          data: { screen: 'Achievements' },
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error scheduling achievement notification:', error);
    }
  },

  // Weekly progress summary
  async scheduleWeeklySummary() {
    try {
      const settings = await Storage.getSettings();
      if (!settings.notifications) return;

      const trigger = {
        hour: 19, // 7 PM
        minute: 0,
        weekday: 0, // Sunday
        repeats: true,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📊 Your Weekly Progress",
          body: "Check out your NUMERIX stats for this week!",
          data: { screen: 'Statistics' },
          sound: true,
        },
        trigger,
      });

      console.log('✅ Weekly summary notification scheduled for Sundays at 7 PM');
    } catch (error) {
      console.error('Error scheduling weekly summary:', error);
    }
  },

  // Custom notification based on user behavior
  async schedulePersonalizedReminder() {
    try {
      const settings = await Storage.getSettings();
      if (!settings.notifications) return;

      const stats = await Storage.getStats();
      const dailyData = await Storage.getDailyChallenge();
      
      let title, body;

      if (dailyData.currentStreak >= 3) {
        title = "🔥 Hot Streak!";
        body = `You're on a ${dailyData.currentStreak} day streak! Keep it going.`;
      } else if (stats.currentWinStreak >= 5) {
        title = "🎯 On Fire!";
        body = `${stats.currentWinStreak} wins in a row! Ready for another?`;
      } else {
        title = "🧠 Time to Play!";
        body = "Your brain is waiting for a NUMERIX challenge!";
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { screen: 'Home' },
          sound: true,
        },
        trigger: {
          hour: 20, // 8 PM
          minute: 0,
          repeats: false,
        },
      });
    } catch (error) {
      console.error('Error scheduling personalized reminder:', error);
    }
  },

  // Send immediate test notification
  async scheduleTestNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Test Notification",
          body: "Your notification settings are working perfectly!",
          data: { screen: 'Home' },
          sound: true,
        },
        trigger: null, // Show immediately
      });
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  },

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  },

  // Initialize notification system
  async initialize() {
    try {
      const permissionsGranted = await this.requestPermissions();
      
      if (permissionsGranted) {
        await this.scheduleDailyReminder();
        await this.scheduleWeeklySummary();
        console.log('🔔 Notification system initialized successfully');
      }
      
      return permissionsGranted;
    } catch (error) {
      console.error('Error initializing notification system:', error);
      return false;
    }
  },
};