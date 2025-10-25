// utils/puzzleChallengeGenerator.js

import { Storage } from './storage';
import PUZZLE_GENERATORS from '../constants/puzzleTemplates';

const PUZZLE_TYPES = {
  mathematical: {
    id: 'mathematical',
    name: 'Math Puzzles',
    icon: '🔢',
    description: 'Solve mathematical riddles',
    color: '#3B82F6',
  },
  logical: {
    id: 'logical',
    name: 'Logic Puzzles',
    icon: '🧠',
    description: 'Use logic and reasoning',
    color: '#8B5CF6',
  },
  pattern: {
    id: 'pattern',
    name: 'Pattern Recognition',
    icon: '🔍',
    description: 'Find the pattern',
    color: '#10B981',
  },
  wordplay: {
    id: 'wordplay',
    name: 'Word Math',
    icon: '💬',
    description: 'Decode word puzzles',
    color: '#F59E0B',
  },
};

const DIFFICULTY_CONFIGS = {
  easy: {
    maxAttempts: 7,
    timeLimit: 240, // 4 minutes
    hintsAvailable: 3,
    pointsMultiplier: 1,
  },
  medium: {
    maxAttempts: 5,
    timeLimit: 180, // 3 minutes
    hintsAvailable: 2,
    pointsMultiplier: 1.5,
  },
  hard: {
    maxAttempts: 4,
    timeLimit: 120, // 2 minutes
    hintsAvailable: 1,
    pointsMultiplier: 2,
  },
  extreme: {
    maxAttempts: 3,
    timeLimit: 90, // 1.5 minutes
    hintsAvailable: 1,
    pointsMultiplier: 3,
  },
};

export class PuzzleChallengeGenerator {
  static generateChallenge(difficulty = 'medium', puzzleType = null) {
    console.log('🧩 Generating Puzzle:', { difficulty, puzzleType });
    
    const config = DIFFICULTY_CONFIGS[difficulty];
    
    // If no puzzle type specified, pick random
    const types = Object.keys(PUZZLE_TYPES);
    const selectedType = puzzleType || types[Math.floor(Math.random() * types.length)];
    
    console.log('📝 Selected Type:', selectedType);
    
    // Get puzzle generators for this type and difficulty
    const generatorsForType = PUZZLE_GENERATORS[selectedType];
    if (!generatorsForType) {
      console.error('❌ No generators for type:', selectedType);
      return null;
    }
    
    const generatorsForDifficulty = generatorsForType[difficulty];
    if (!generatorsForDifficulty || generatorsForDifficulty.length === 0) {
      console.error('❌ No generators for difficulty:', difficulty);
      // Fallback to easy if difficulty not found
      const fallbackGenerators = generatorsForType.easy || generatorsForType[Object.keys(generatorsForType)[0]];
      if (!fallbackGenerators || fallbackGenerators.length === 0) {
        console.error('❌ No fallback generators available');
        return null;
      }
      const generator = fallbackGenerators[Math.floor(Math.random() * fallbackGenerators.length)];
      const puzzleData = generator();
      return this._buildChallenge(puzzleData, selectedType, difficulty, config);
    }
    
    // Select random generator and generate puzzle
    const generator = generatorsForDifficulty[Math.floor(Math.random() * generatorsForDifficulty.length)];
    
    try {
      const puzzleData = generator();
      
      // Validate generated puzzle
      if (!puzzleData || !puzzleData.puzzle || !puzzleData.solution || !puzzleData.hints) {
        console.error('❌ Invalid puzzle data generated:', puzzleData);
        return null;
      }
      
      console.log('✅ Puzzle Generated:', puzzleData);
      
      return this._buildChallenge(puzzleData, selectedType, difficulty, config);
    } catch (error) {
      console.error('❌ Error generating puzzle:', error);
      return null;
    }
  }

  static _buildChallenge(puzzleData, selectedType, difficulty, config) {
    // Ensure hints is always an array
    const hints = Array.isArray(puzzleData.hints) ? puzzleData.hints : [];
    
    // Ensure solution is a valid number
    const solution = parseInt(puzzleData.solution);
    if (isNaN(solution)) {
      console.error('❌ Invalid solution:', puzzleData.solution);
      return null;
    }
    
    // Ensure maxRange is valid
    const maxRange = puzzleData.maxRange || 100;
    
    return {
      id: `puzzle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: selectedType,
      difficulty: difficulty,
      puzzle: puzzleData.puzzle || 'Solve this puzzle',
      solution: solution,
      hints: hints,
      maxAttempts: config.maxAttempts,
      timeLimit: config.timeLimit,
      hintsAvailable: Math.min(config.hintsAvailable, hints.length), // Don't offer more hints than available
      hintsUsed: 0,
      maxRange: maxRange,
      pointsMultiplier: config.pointsMultiplier,
      typeInfo: PUZZLE_TYPES[selectedType],
    };
  }

  static async getStats() {
    const stats = await Storage.getPuzzleStats();
    return stats;
  }

  static async updateStats(won, puzzleChallenge, timeRemaining, attemptsUsed, hintsUsed = 0) {
    const stats = await this.getStats();
    
    const { difficulty, type } = puzzleChallenge;
    const timeUsed = puzzleChallenge.timeLimit - timeRemaining;
    
    // Update type-specific stats
    if (!stats.byType[type]) {
        stats.byType[type] = {
        games: 0,
        wins: 0,
        totalAttempts: 0,
        bestAttempts: null,
        bestTime: null,
        totalHintsUsed: 0, // Add this
        averageHintsUsed: 0, // Add this
        };
    }
    
    stats.byType[type].games += 1;
    if (won) {
        stats.byType[type].wins += 1;
        stats.byType[type].totalAttempts += attemptsUsed;
        
        if (stats.byType[type].bestAttempts === null || attemptsUsed < stats.byType[type].bestAttempts) {
        stats.byType[type].bestAttempts = attemptsUsed;
        }
        
        if (stats.byType[type].bestTime === null || timeUsed < stats.byType[type].bestTime) {
        stats.byType[type].bestTime = timeUsed;
        }
    }
    
    // Track hints usage
    stats.byType[type].totalHintsUsed = (stats.byType[type].totalHintsUsed || 0) + hintsUsed;
    stats.byType[type].averageHintsUsed = stats.byType[type].totalHintsUsed / stats.byType[type].games;
    
    // Update difficulty-specific stats
    if (!stats.byDifficulty[difficulty]) {
        stats.byDifficulty[difficulty] = {
        games: 0,
        wins: 0,
        bestTime: null,
        totalHintsUsed: 0, // Add this
        };
    }
    
    stats.byDifficulty[difficulty].games += 1;
    if (won) {
        stats.byDifficulty[difficulty].wins += 1;
        
        if (stats.byDifficulty[difficulty].bestTime === null || timeUsed < stats.byDifficulty[difficulty].bestTime) {
        stats.byDifficulty[difficulty].bestTime = timeUsed;
        }
    }
    
    stats.byDifficulty[difficulty].totalHintsUsed = (stats.byDifficulty[difficulty].totalHintsUsed || 0) + hintsUsed;
    
    // Update overall stats
    stats.totalGames += 1;
    stats.totalHintsUsed = (stats.totalHintsUsed || 0) + hintsUsed; // Add this
    
    if (won) {
        stats.totalWins += 1;
        stats.currentWinStreak += 1;
        stats.longestWinStreak = Math.max(stats.longestWinStreak, stats.currentWinStreak);
        
        if (stats.bestTime === null || timeUsed < stats.bestTime) {
        stats.bestTime = timeUsed;
        }
    } else {
        stats.totalLosses += 1;
        stats.currentWinStreak = 0;
    }
    
    await Storage.savePuzzleStats(stats);
    return stats;
    }

  static getPuzzleTypes() {
    return PUZZLE_TYPES;
  }

  static getDifficultyConfigs() {
    return DIFFICULTY_CONFIGS;
  }
  
  // Helper method to get available puzzle count for a type/difficulty
  static getAvailablePuzzleCount(type, difficulty) {
    const generators = PUZZLE_GENERATORS[type];
    if (!generators) return 0;
    
    const difficultyGenerators = generators[difficulty];
    if (!difficultyGenerators) return 0;
    
    // Since puzzles are generated dynamically, return a high number
    // Or return the number of generators (each can produce infinite variations)
    return difficultyGenerators.length * 999; // Effectively infinite
  }
}