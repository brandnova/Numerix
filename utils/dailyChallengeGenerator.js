export const DailyChallengeGenerator = {
  // Generate consistent daily number based on date
  generateDailyNumber(date = new Date()) {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    let hash = 0;
    
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Generate number between 1-100
    return Math.abs(hash % 100) + 1;
  },

  // Check if user has played today
  hasPlayedToday(lastPlayedDate) {
    if (!lastPlayedDate) return false;
    
    const today = new Date().toISOString().split('T')[0];
    const lastPlayed = new Date(lastPlayedDate).toISOString().split('T')[0];
    
    return today === lastPlayed;
  },

  // Get today's challenge info
  getTodayChallenge() {
    const today = new Date();
    const targetNumber = this.generateDailyNumber(today);
    
    return {
      date: today.toISOString().split('T')[0],
      targetNumber,
      difficulty: 'medium', // Daily is always medium
      trials: 7,
    };
  },
};