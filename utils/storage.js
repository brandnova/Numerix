import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_STATS: '@numerix_user_stats',
  ACHIEVEMENTS: '@numerix_achievements',
  DAILY_CHALLENGE: '@numerix_daily_challenge',
  SPEED_STATS: '@numerix_speed_stats',
  SETTINGS: '@numerix_settings',
};

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'dark',
  soundEnabled: true,
  musicEnabled: true,
  hapticFeedback: true,
  notifications: true,
};

// Default data structures
const DEFAULT_STATS = {
  totalGames: 0,
  totalWins: 0,
  totalLosses: 0,
  currentWinStreak: 0,
  longestWinStreak: 0,
  perfectGames: 0,
  comebacks: 0,
  dailyStreak: 0,
  byDifficulty: {
    easy: { games: 0, wins: 0, totalAttempts: 0, bestAttempts: null },
    medium: { games: 0, wins: 0, totalAttempts: 0, bestAttempts: null },
    hard: { games: 0, wins: 0, totalAttempts: 0, bestAttempts: null },
  },
  // Added speed stats to main stats for achievement checking
  speedStats: {
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    currentWinStreak: 0,
    longestWinStreak: 0,
    bestTime: null,
    averageTime: 0,
    totalTimePlayed: 0,
    perfectGames: 0, // Games won with max time remaining
    bestGuesses: null, // Fewest guesses to win
    averageGuesses: 0,
    highestScore: 0,
    totalScore: 0,
    levelsCompleted: {
      1: { completions: 0, bestTime: null, bestScore: 0 },
      2: { completions: 0, bestTime: null, bestScore: 0 },
      3: { completions: 0, bestTime: null, bestScore: 0 },
      4: { completions: 0, bestTime: null, bestScore: 0 },
      5: { completions: 0, bestTime: null, bestScore: 0 },
    }
  },
};

const DEFAULT_ACHIEVEMENTS = [];

const DEFAULT_DAILY = {
  lastPlayedDate: null,
  currentStreak: 0,
  longestStreak: 0,
  results: [],
};

const DEFAULT_SPEED_STATS = {
  totalGames: 0,
  totalWins: 0,
  totalLosses: 0,
  currentWinStreak: 0,
  longestWinStreak: 0,
  bestTime: null,
  averageTime: 0,
  totalTimePlayed: 0,
  perfectGames: 0,
  bestGuesses: null,
  averageGuesses: 0,
  highestScore: 0,
  totalScore: 0,
  levelsCompleted: {
    1: { completions: 0, bestTime: null, bestScore: 0 },
    2: { completions: 0, bestTime: null, bestScore: 0 },
    3: { completions: 0, bestTime: null, bestScore: 0 },
    4: { completions: 0, bestTime: null, bestScore: 0 },
    5: { completions: 0, bestTime: null, bestScore: 0 },
  }
};

export const Storage = {
  // Get settings
  async getSettings() {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error reading settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  // Save settings
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  },

  // Get user stats
  async getStats() {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_STATS);
      const stats = data ? JSON.parse(data) : DEFAULT_STATS;
      
      // Merge with detailed speed stats
      const speedStats = await this.getSpeedStats();
      stats.speedStats = { ...stats.speedStats, ...speedStats };
      
      return stats;
    } catch (error) {
      return DEFAULT_STATS;
    }
  },

  // Save user stats
  async saveStats(stats) {
    try {
      await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(stats));
      
      // Also update the detailed speed stats if they exist in main stats
      if (stats.speedStats) {
        await this.saveSpeedStats(stats.speedStats);
      }
      
      // Verify the save worked
      const verified = await AsyncStorage.getItem(KEYS.USER_STATS);
      if (verified) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },

  // Get achievements
  async getAchievements() {
    try {
      const data = await AsyncStorage.getItem(KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : DEFAULT_ACHIEVEMENTS;
    } catch (error) {
      console.error('Error reading achievements:', error);
      return DEFAULT_ACHIEVEMENTS;
    }
  },

  // Save achievements
  async saveAchievements(achievements) {
    try {
      await AsyncStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      return true;
    } catch (error) {
      console.error('Error saving achievements:', error);
      return false;
    }
  },

  // Get daily challenge data
  async getDailyChallenge() {
    try {
      const data = await AsyncStorage.getItem(KEYS.DAILY_CHALLENGE);
      return data ? JSON.parse(data) : DEFAULT_DAILY;
    } catch (error) {
      console.error('Error reading daily challenge:', error);
      return DEFAULT_DAILY;
    }
  },

  // Save daily challenge data
  async saveDailyChallenge(data) {
    try {
      await AsyncStorage.setItem(KEYS.DAILY_CHALLENGE, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving daily challenge:', error);
      return false;
    }
  },

  // Get speed stats
  async getSpeedStats() {
    try {
      const data = await AsyncStorage.getItem(KEYS.SPEED_STATS);
      return data ? JSON.parse(data) : DEFAULT_SPEED_STATS;
    } catch (error) {
      console.error('Error reading speed stats:', error);
      return DEFAULT_SPEED_STATS;
    }
  },

  // Save speed stats
  async saveSpeedStats(stats) {
    try {
      await AsyncStorage.setItem(KEYS.SPEED_STATS, JSON.stringify(stats));
      return true;
    } catch (error) {
      console.error('Error saving speed stats:', error);
      return false;
    }
  },

  // Clear all data (for testing)
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        KEYS.USER_STATS,
        KEYS.ACHIEVEMENTS,
        KEYS.DAILY_CHALLENGE,
        KEYS.SETTINGS,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },
};