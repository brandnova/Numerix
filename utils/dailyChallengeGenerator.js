import { Storage } from './storage';
import { NotificationService } from './notifications';

export const DailyChallengeGenerator = {
  
  // Generate truly unique daily challenges
  generateDailyNumber(date = new Date()) {
    const dateString = date.toISOString().split('T')[0];
    
    // Create a robust hash from the date
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const seed = Math.abs(hash);
    
    // Define varied ranges for true diversity
    const rangeOptions = [
      { max: 50, trials: 5, difficulty: 'easy' },
      { max: 100, trials: 7, difficulty: 'easy' },
      { max: 200, trials: 8, difficulty: 'medium' },
      { max: 500, trials: 10, difficulty: 'medium' },
      { max: 1000, trials: 12, difficulty: 'hard' },
      { max: 2000, trials: 15, difficulty: 'hard' },
    ];
    
    const specialRules = [
      null,
      null, // More chances for no special rule
      'no_consecutive_direction',
      'reverse_hints',
      'only_multiples_of_5',
      'time_limit_60',
    ];
    
    // Select range configuration
    const rangeConfig = rangeOptions[seed % rangeOptions.length];
    
    // Select special rule FIRST
    const specialRule = specialRules[(seed >> 8) % specialRules.length];
    
    // Generate target based on special rule
    let targetNumber;
    if (specialRule === 'only_multiples_of_5') {
      // Generate target that IS a multiple of 5
      const maxMultiples = Math.floor(rangeConfig.max / 5);
      const targetSeed = Math.abs((seed * 7919 + 104729) % maxMultiples);
      targetNumber = (targetSeed + 1) * 5; // Ensures multiple of 5
      
      // Ensure it's within range
      if (targetNumber > rangeConfig.max) {
        targetNumber = rangeConfig.max - (rangeConfig.max % 5);
      }
    } else {
      // Normal target generation
      const targetSeed = Math.abs((seed * 7919 + 104729) % rangeConfig.max);
      targetNumber = targetSeed + 1;
    }
    
    // Adjust trials based on special rule
    let adjustedTrials = rangeConfig.trials;
    if (specialRule === 'no_consecutive_direction') {
      adjustedTrials += 2; // Give more attempts for harder rule
    } else if (specialRule === 'only_multiples_of_5') {
      // Calculate reasonable attempts based on possible guesses
      const possibleGuesses = Math.floor(rangeConfig.max / 5);
      adjustedTrials = Math.min(15, Math.ceil(Math.log2(possibleGuesses)) + 3);
    }
    
    const result = {
      targetNumber: targetNumber,
      maxRange: rangeConfig.max,
      trials: adjustedTrials,
      difficulty: rangeConfig.difficulty,
      specialRule: specialRule,
      date: dateString,
    };
    
    console.log('🎲 Generated Daily Challenge:', result);
    
    // Validation
    if (targetNumber < 1 || targetNumber > rangeConfig.max) {
      console.error('❌ Invalid target generated!', result);
    }
    
    // Additional validation for special rules
    if (specialRule === 'only_multiples_of_5' && targetNumber % 5 !== 0) {
      console.error('❌ Target is not a multiple of 5!', result);
    }
    
    return result;
  },

  // Get today's complete challenge object
  getTodayChallenge() {
    const today = new Date();
    const challengeData = this.generateDailyNumber(today);
    
    return {
      id: `daily_${challengeData.date}`,
      date: challengeData.date,
      targetNumber: challengeData.targetNumber,
      maxRange: challengeData.maxRange,
      trials: challengeData.trials,
      difficulty: challengeData.difficulty,
      specialRule: challengeData.specialRule,
      name: 'Daily Challenge',
      mode: 'daily',
    };
  },

  // Check if user has played today
  hasPlayedToday(dailyData) {
    if (!dailyData || !dailyData.lastPlayedDate) return false;
    
    const today = new Date().toISOString().split('T')[0];
    const lastPlayed = new Date(dailyData.lastPlayedDate).toISOString().split('T')[0];
    
    return today === lastPlayed;
  },

  // Check if today's challenge is completed
  hasCompletedToday(dailyData) {
    if (!dailyData || !dailyData.results) return false;
    
    const today = new Date().toISOString().split('T')[0];
    const todayResult = dailyData.results.find(r => r.date === today);
    
    return todayResult?.won === true;
  },

  // Check if completed yesterday (for streak)
  completedYesterday(dailyData) {
    if (!dailyData || !dailyData.results) return false;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    const yesterdayResult = dailyData.results.find(r => r.date === yesterdayString);
    return yesterdayResult?.won === true;
  },

  // Update streak after completing daily challenge - ADD NOTIFICATION HERE
  async updateStreak(won, dailyData) {
    const today = new Date().toISOString().split('T')[0];
    
    let newStreak = dailyData.currentStreak || 0;
    let newLongestStreak = dailyData.longestStreak || 0;

    if (won) {
      // Check if this continues a streak
      if (this.completedYesterday(dailyData) || newStreak === 0) {
        newStreak += 1;
      } else if (!this.hasCompletedToday(dailyData)) {
        // If there's a gap, reset streak
        newStreak = 1;
      }
      
      if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak;
      }
    } else {
      // Loss doesn't break streak if they retry and win same day
      if (!this.hasCompletedToday(dailyData)) {
        // Only reset if they haven't won today yet
        // (allows retries)
      }
    }

    // Update or add today's result
    const existingResultIndex = dailyData.results.findIndex(r => r.date === today);
    const todayResult = {
      date: today,
      won: won,
      attempts: dailyData.results[existingResultIndex]?.attempts || 0,
    };

    let updatedResults = [...dailyData.results];
    if (existingResultIndex >= 0) {
      // Update existing result if this is a win (only track best/winning attempts)
      if (won) {
        updatedResults[existingResultIndex] = todayResult;
      }
    } else {
      updatedResults.push(todayResult);
    }

    const updatedDailyData = {
      ...dailyData,
      lastPlayedDate: today,
      currentStreak: won ? newStreak : dailyData.currentStreak,
      longestStreak: newLongestStreak,
      results: updatedResults.slice(-90), // Keep last 90 days
    };

    console.log('📊 Streak Updated:', {
      won,
      newStreak,
      newLongestStreak,
      previousStreak: dailyData.currentStreak,
    });

    // 🔔 CRITICAL: ADD NOTIFICATION SCHEDULING HERE
    try {
      // Schedule streak reminder for tomorrow if user completed today
      if (won) {
        await NotificationService.scheduleStreakReminder();
        
        // Schedule personalized reminder based on streak length
        if (newStreak >= 3) {
          await NotificationService.schedulePersonalizedReminder();
        }
      }
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      // Don't let notification errors break the streak update
    }

    return updatedDailyData;
  },

  // NEW: Initialize notifications when app starts (call this from App.js)
  async initializeNotifications() {
    try {
      const settings = await Storage.getSettings();
      if (settings.notifications) {
        await NotificationService.initialize();
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  },
};