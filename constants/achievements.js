export const ACHIEVEMENTS = [
  // Beginner Achievements
  {
    id: 'first_win',
    title: 'First Victory',
    description: 'Win your first game',
    category: 'beginner',
    condition: (stats) => stats.totalWins >= 1,
  },
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Play 5 games',
    category: 'beginner',
    condition: (stats) => stats.totalGames >= 5,
  },
  {
    id: 'getting_started',
    title: 'Getting Started',
    description: 'Play 10 games',
    category: 'progress',
    condition: (stats) => stats.totalGames >= 10,
  },

  // Win Streak Achievements
  {
    id: 'win_streak_3',
    title: 'Triple Threat',
    description: 'Win 3 games in a row',
    category: 'streak',
    condition: (stats) => stats.longestWinStreak >= 3,
  },
  {
    id: 'win_streak_5',
    title: 'Hot Streak',
    description: 'Win 5 games in a row',
    category: 'streak',
    condition: (stats) => stats.longestWinStreak >= 5,
  },
  {
    id: 'win_streak_10',
    title: 'Unstoppable',
    description: 'Win 10 games in a row',
    category: 'streak',
    condition: (stats) => stats.longestWinStreak >= 10,
  },
  {
    id: 'win_streak_20',
    title: 'Legendary',
    description: 'Win 20 games in a row',
    category: 'streak',
    condition: (stats) => stats.longestWinStreak >= 20,
  },

  // Special Performance
  {
    id: 'perfect_game',
    title: 'Perfect Game',
    description: 'Win in one attempt',
    category: 'special',
    condition: (stats) => stats.perfectGames >= 1,
  },
  {
    id: 'perfect_five',
    title: 'Perfectionist',
    description: 'Win 5 perfect games',
    category: 'special',
    condition: (stats) => stats.perfectGames >= 5,
  },
  {
    id: 'comeback_king',
    title: 'Comeback King',
    description: 'Win with only 1 attempt left',
    category: 'special',
    condition: (stats) => stats.comebacks >= 1,
  },
  {
    id: 'clutch_master',
    title: 'Clutch Master',
    description: 'Win 10 times with 1 attempt left',
    category: 'special',
    condition: (stats) => stats.comebacks >= 10,
  },

  // Progress Milestones
  {
    id: 'games_25',
    title: 'Regular Player',
    description: 'Play 25 games',
    category: 'progress',
    condition: (stats) => stats.totalGames >= 25,
  },
  {
    id: 'games_50',
    title: 'Dedicated Player',
    description: 'Play 50 games',
    category: 'progress',
    condition: (stats) => stats.totalGames >= 50,
  },
  {
    id: 'games_100',
    title: 'Century Club',
    description: 'Play 100 games',
    category: 'progress',
    condition: (stats) => stats.totalGames >= 100,
  },
  {
    id: 'games_250',
    title: 'Veteran',
    description: 'Play 250 games',
    category: 'progress',
    condition: (stats) => stats.totalGames >= 250,
  },

  // Difficulty Masters
  {
    id: 'master_easy',
    title: 'Easy Master',
    description: 'Win 20 easy games',
    category: 'difficulty',
    condition: (stats) => stats.byDifficulty?.easy?.wins >= 20,
  },
  {
    id: 'master_medium',
    title: 'Medium Master',
    description: 'Win 20 medium games',
    category: 'difficulty',
    condition: (stats) => stats.byDifficulty?.medium?.wins >= 20,
  },
  {
    id: 'master_hard',
    title: 'Hard Master',
    description: 'Win 20 hard games',
    category: 'difficulty',
    condition: (stats) => stats.byDifficulty?.hard?.wins >= 20,
  },
  {
    id: 'grand_master',
    title: 'Grand Master',
    description: 'Win 50 games on hard difficulty',
    category: 'difficulty',
    condition: (stats) => stats.byDifficulty?.hard?.wins >= 50,
  },

  // Daily Challenge Achievements
  {
    id: 'daily_streak_3',
    title: 'Daily Habit',
    description: 'Complete 3 daily challenges in a row',
    category: 'daily',
    condition: (stats) => stats.dailyStreak >= 3,
  },
  {
    id: 'daily_streak_7',
    title: 'Weekly Warrior',
    description: 'Complete 7 daily challenges in a row',
    category: 'daily',
    condition: (stats) => stats.dailyStreak >= 7,
  },
  {
    id: 'daily_streak_30',
    title: 'Monthly Master',
    description: 'Complete 30 daily challenges in a row',
    category: 'daily',
    condition: (stats) => stats.dailyStreak >= 30,
  },

  // Win Rate Achievements
  {
    id: 'win_rate_50',
    title: 'Fifty Percent',
    description: 'Achieve 50% win rate (min 20 games)',
    category: 'winrate',
    condition: (stats) => stats.totalGames >= 20 && (stats.totalWins / stats.totalGames) >= 0.5,
  },
  {
    id: 'win_rate_75',
    title: 'Three Quarters',
    description: 'Achieve 75% win rate (min 30 games)',
    category: 'winrate',
    condition: (stats) => stats.totalGames >= 30 && (stats.totalWins / stats.totalGames) >= 0.75,
  },

  // Ultimate Achievement
  {
    id: 'numerix_legend',
    title: 'NUMERIX Legend',
    description: 'Win 100 games total',
    category: 'ultimate',
    condition: (stats) => stats.totalWins >= 100,
  },
];

export const ACHIEVEMENT_CATEGORIES = {
  beginner: 'Beginner',
  progress: 'Progress',
  streak: 'Win Streaks',
  special: 'Special',
  difficulty: 'Difficulty',
  daily: 'Daily Challenge',
  winrate: 'Win Rate',
  ultimate: 'Ultimate',
};