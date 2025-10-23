import { Storage } from './storage';

export const SpeedChallengeGenerator = {
  
  // Generate dynamic speed challenges
  generateChallenge(difficulty = 'medium') {
    const configs = {
      easy: {
        maxRange: 50,
        timeLimit: 45,
        baseScore: 100,
        difficultyMultiplier: 1.0,
      },
      medium: {
        maxRange: 100,
        timeLimit: 60,
        baseScore: 200,
        difficultyMultiplier: 1.5,
      },
      hard: {
        maxRange: 200,
        timeLimit: 75,
        baseScore: 300,
        difficultyMultiplier: 2.0,
      },
      extreme: {
        maxRange: 500,
        timeLimit: 90,
        baseScore: 500,
        difficultyMultiplier: 3.0,
      },
    };

    const config = configs[difficulty] || configs.medium;
    
    // Add some randomization for variety
    const timeVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5 seconds
    const adjustedTime = Math.max(20, config.timeLimit + timeVariation);
    
    // Generate target
    const targetNumber = Math.floor(Math.random() * config.maxRange) + 1;
    
    // Occasionally add a "hot/cold" bonus modifier
    const useProximityBonus = Math.random() > 0.7; // 30% chance
    
    const challenge = {
      id: `speed_${Date.now()}`,
      mode: 'speed',
      difficulty: difficulty,
      maxRange: config.maxRange,
      timeLimit: adjustedTime,
      targetNumber: targetNumber,
      baseScore: config.baseScore,
      difficultyMultiplier: config.difficultyMultiplier,
      useProximityBonus: useProximityBonus,
      name: `Speed Challenge - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
    };

    console.log('⚡ Generated Speed Challenge:', challenge);
    return challenge;
  },

  // Calculate score based on performance
  calculateScore(challenge, timeRemaining, guessCount) {
    const {
      baseScore,
      difficultyMultiplier,
      timeLimit,
      useProximityBonus,
    } = challenge;

    // Time bonus (more time left = higher score)
    const timeBonus = Math.floor((timeRemaining / timeLimit) * 100) * difficultyMultiplier;
    
    // Efficiency bonus (fewer guesses = higher score)
    const efficiencyBonus = Math.max(0, (20 - guessCount) * 10);
    
    // Proximity bonus if applicable
    const proximityBonus = useProximityBonus ? 50 : 0;
    
    const totalScore = Math.floor(
      baseScore + timeBonus + efficiencyBonus + proximityBonus
    );

    return {
      totalScore,
      breakdown: {
        base: baseScore,
        time: Math.floor(timeBonus),
        efficiency: efficiencyBonus,
        proximity: proximityBonus,
      },
    };
  },

  // Update speed stats after completion
  async updateStats(won, challenge, timeRemaining, guessCount) {
    const stats = await Storage.getSpeedStats();
    const difficulty = challenge.difficulty;
    
    const timeTaken = challenge.timeLimit - timeRemaining;
    
    // Calculate score if won
    let score = null;
    if (won) {
      score = this.calculateScore(challenge, timeRemaining, guessCount);
    }

    // Update difficulty-specific stats
    const diffStats = stats[difficulty] || {
      games: 0,
      wins: 0,
      bestTime: null,
      bestGuesses: null,
      totalGuesses: 0,
    };

    const updatedDiffStats = {
      games: diffStats.games + 1,
      wins: won ? diffStats.wins + 1 : diffStats.wins,
      bestTime: won 
        ? (diffStats.bestTime ? Math.min(diffStats.bestTime, timeTaken) : timeTaken)
        : diffStats.bestTime,
      bestGuesses: won
        ? (diffStats.bestGuesses ? Math.min(diffStats.bestGuesses, guessCount) : guessCount)
        : diffStats.bestGuesses,
      totalGuesses: diffStats.totalGuesses + guessCount,
    };

    // Update overall stats
    const updatedStats = {
      ...stats,
      totalGames: stats.totalGames + 1,
      totalWins: won ? stats.totalWins + 1 : stats.totalWins,
      bestTime: won
        ? (stats.bestTime ? Math.min(stats.bestTime, timeTaken) : timeTaken)
        : stats.bestTime,
      averageGuesses: Math.round(
        ((stats.averageGuesses * stats.totalGames) + guessCount) / (stats.totalGames + 1)
      ),
      [difficulty]: updatedDiffStats,
    };

    await Storage.saveSpeedStats(updatedStats);

    console.log('📊 Speed Stats Updated:', updatedStats);
    return { updatedStats, score };
  },
};