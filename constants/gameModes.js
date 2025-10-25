import { DIFFICULTIES } from './difficulties';

const GameLogic = {
  generateTarget(max) {
    return Math.floor(Math.random() * max) + 1;
  },

  getHint(guess, target) {
    const diff = Math.abs(guess - target);
    const isHigher = guess < target;

    if (diff <= 5) {
      return { text: isHigher ? 'Slightly higher' : 'Slightly lower', proximity: 'very_close' };
    } else if (diff <= 15) {
      return { text: isHigher ? 'Go higher' : 'Go lower', proximity: 'close' };
    } else if (diff <= 30) {
      return { text: isHigher ? 'Much higher' : 'Much lower', proximity: 'medium' };
    } else {
      return { text: isHigher ? 'Way too low' : 'Way too high', proximity: 'far' };
    }
  },

  isPerfectGame(attemptsUsed) {
    return attemptsUsed === 1;
  },

  isComeback(trialsLeft) {
    return trialsLeft === 1;
  },
};

export const GAME_MODES = {
  // CLASSIC MODE - Traditional gameplay
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Guess the number within limited attempts',
    icon: '🎯',
    color: 'primary',
    
    getConfig: (difficulty) => {
      const diffConfig = DIFFICULTIES[difficulty] || DIFFICULTIES.medium;
      return {
        mode: 'classic',
        modeId: 'classic',
        difficulty: difficulty,
        hasTimer: false,
        max: diffConfig.max,
        trials: diffConfig.trials,
        name: diffConfig.name,
        color: diffConfig.color,
        targetNumber: null, // Will be generated
        specialRule: null,
        instructions: `Guess the number between 1 and ${diffConfig.max} in ${diffConfig.trials} attempts`,
      };
    },
    
    generateTarget: (config) => GameLogic.generateTarget(config.max),
    
    validateGuess: (guess, target, config, gameState) => {
      const numGuess = parseInt(guess);
      if (isNaN(numGuess) || numGuess < 1 || numGuess > config.max) {
        return { valid: false, message: `Enter a number between 1 and ${config.max}` };
      }
      if (gameState.guessHistory.includes(numGuess)) {
        return { valid: false, message: `Already guessed ${numGuess}` };
      }
      return { valid: true, guess: numGuess };
    },
    
    handleGuess: (guess, target, config, gameState) => {
      const newTrials = gameState.trialsLeft - 1;
      const newHistory = [...gameState.guessHistory, guess];
      
      if (guess === target) {
        return { 
          status: 'won', 
          trialsLeft: newTrials, 
          guessHistory: newHistory,
          hint: `🎉 Correct! The answer was ${target}`,
        };
      } else if (newTrials === 0) {
        return { 
          status: 'lost', 
          trialsLeft: 0, 
          guessHistory: newHistory,
          hint: `💀 Game over! The answer was ${target}`,
        };
      } else {
        const hintData = GameLogic.getHint(guess, target);
        return {
          status: 'playing',
          trialsLeft: newTrials,
          guessHistory: newHistory,
          hint: hintData.text,
          proximity: hintData.proximity,
        };
      }
    },
  },
  
  // DAILY CHALLENGE MODE - Unique daily challenges
  daily: {
    id: 'daily',
    name: 'Daily Challenge',
    description: 'Unique challenge every day with special rules',
    icon: '📅',
    color: 'success',
    
    getConfig: (dailyChallenge) => {
      console.log('📋 Building Daily Config from:', dailyChallenge);
      
      // Validate daily challenge object
      if (!dailyChallenge || typeof dailyChallenge !== 'object') {
        console.error('❌ Invalid daily challenge object');
        return null;
      }
      
      const {
        maxRange,
        trials,
        difficulty,
        targetNumber,
        specialRule,
        date,
      } = dailyChallenge;
      
      // Validate all required fields
      if (!maxRange || !trials || !targetNumber) {
        console.error('❌ Missing required daily challenge fields');
        return null;
      }
      
      // Validate target is within range
      if (targetNumber < 1 || targetNumber > maxRange) {
        console.error('❌ Target number outside valid range', { targetNumber, maxRange });
        return null;
      }
      
      const config = {
        mode: 'daily',
        modeId: 'daily',
        difficulty: difficulty,
        hasTimer: specialRule?.includes('time_limit'),
        timerDuration: specialRule?.includes('time_limit_30') ? 30 : 60,
        max: maxRange,
        trials: trials,
        name: 'Daily Challenge',
        color: 'primary',
        specialRule: specialRule,
        targetNumber: targetNumber,
        date: date,
        instructions: `Guess the number between 1 and ${maxRange} in ${trials} attempts${specialRule ? `. Special Rule: ${specialRule.replace(/_/g, ' ').toUpperCase()}` : ''}`,
      };
      
      console.log('✅ Daily Config Created:', config);
      return config;
    },
    
    generateTarget: (config) => {
      // Daily mode always uses pre-generated target
      return config.targetNumber;
    },
    
    validateGuess: (guess, target, config, gameState) => {
      const numGuess = parseInt(guess);
      if (isNaN(numGuess) || numGuess < 1 || numGuess > config.max) {
        return { valid: false, message: `Enter a number between 1 and ${config.max}` };
      }
      if (gameState.guessHistory.includes(numGuess)) {
        return { valid: false, message: `Already guessed ${numGuess}` };
      }
      
      // Apply special rules
      if (config.specialRule === 'no_consecutive_direction') {
        if (gameState.guessHistory.length > 0) {
          const lastGuess = gameState.guessHistory[gameState.guessHistory.length - 1];
          const lastWasHigh = lastGuess > target;
          const currentIsHigh = numGuess > target;
          if (lastWasHigh === currentIsHigh) {
            return { valid: false, message: '⚠️ Cannot guess in the same direction twice!' };
          }
        }
      }
      
      if (config.specialRule === 'only_multiples_of_5') {
        if (numGuess % 5 !== 0) {
          return { valid: false, message: '⚠️ Only multiples of 5 allowed!' };
        }
      }
      
      return { valid: true, guess: numGuess };
    },
    
    handleGuess: (guess, target, config, gameState) => {
      const newTrials = gameState.trialsLeft - 1;
      const newHistory = [...gameState.guessHistory, guess];
      
      if (guess === target) {
        return { 
          status: 'won', 
          trialsLeft: newTrials, 
          guessHistory: newHistory,
          hint: `🎊 Daily Challenge Completed! The answer was ${target}`,
        };
      } else if (newTrials === 0) {
        return { 
          status: 'lost', 
          trialsLeft: 0, 
          guessHistory: newHistory,
          hint: `💔 Challenge Failed! The answer was ${target}. Try again!`,
        };
      } else {
        let hintData = GameLogic.getHint(guess, target);
        
        // Reverse hints for special rule
        if (config.specialRule === 'reverse_hints') {
          const isHigher = guess < target;
          hintData.text = isHigher ? 'Go lower' : 'Go higher';
        }
        
        return {
          status: 'playing',
          trialsLeft: newTrials,
          guessHistory: newHistory,
          hint: hintData.text,
          proximity: hintData.proximity,
        };
      }
    },
  },
  
  // SPEED MODE - Quick thinking challenge
  speed: {
    id: 'speed',
    name: 'Speed Challenge',
    description: 'Race against time with unlimited attempts',
    icon: '⚡',
    color: 'warning',
    
    getConfig: (speedChallenge) => {
      console.log('⚡ Building Speed Config from:', speedChallenge);
      
      if (!speedChallenge || typeof speedChallenge !== 'object') {
        console.error('❌ Invalid speed challenge object');
        return null;
      }
      
      const {
        maxRange,
        timeLimit,
        targetNumber,
        difficulty,
        baseScore,
        difficultyMultiplier,
        useProximityBonus,
      } = speedChallenge;
      
      if (!maxRange || !timeLimit || !targetNumber) {
        console.error('❌ Missing required speed challenge fields');
        return null;
      }
      
      const config = {
        mode: 'speed',
        modeId: 'speed',
        difficulty: difficulty,
        hasTimer: true,
        timerDuration: timeLimit,
        max: maxRange,
        trials: Infinity,
        name: 'Speed Challenge',
        color: 'warning',
        targetNumber: targetNumber,
        baseScore: baseScore,
        difficultyMultiplier: difficultyMultiplier,
        useProximityBonus: useProximityBonus,
        specialRule: 'unlimited_attempts',
        instructions: `Find the number between 1 and ${maxRange} before time runs out!${useProximityBonus ? ' Proximity hints enabled!' : ''}`,
      };
      
      console.log('✅ Speed Config Created:', config);
      return config;
    },
    
    generateTarget: (config) => {
      return config.targetNumber;
    },
    
    validateGuess: (guess, target, config, gameState) => {
      const numGuess = parseInt(guess);
      if (isNaN(numGuess) || numGuess < 1 || numGuess > config.max) {
        return { valid: false, message: `Enter a number between 1 and ${config.max}` };
      }
      if (gameState.guessHistory.includes(numGuess)) {
        return { valid: false, message: `Already tried ${numGuess}` };
      }
      return { valid: true, guess: numGuess };
    },
    
    handleGuess: (guess, target, config, gameState) => {
      const newHistory = [...gameState.guessHistory, guess];
      const guessCount = newHistory.length;
      
      if (guess === target) {
        return { 
          status: 'won', 
          trialsLeft: Infinity, 
          guessHistory: newHistory,
          hint: `⚡ Speed Challenge Complete! Found ${target} in ${guessCount} ${guessCount === 1 ? 'guess' : 'guesses'}!`,
        };
      } else {
        // Enhanced hints for speed mode
        const diff = Math.abs(guess - target);
        const isHigher = guess < target;
        
        let hintText;
        let proximity;
        
        if (config.useProximityBonus) {
          // More detailed hints when proximity bonus is active
          if (diff <= 3) {
            hintText = isHigher ? '🔥 SO CLOSE! Slightly higher' : '🔥 SO CLOSE! Slightly lower';
            proximity = 'burning';
          } else if (diff <= 10) {
            hintText = isHigher ? '🌡️ Getting warm... higher' : '🌡️ Getting warm... lower';
            proximity = 'very_close';
          } else if (diff <= 25) {
            hintText = isHigher ? '➡️ Go higher' : '⬅️ Go lower';
            proximity = 'close';
          } else if (diff <= 50) {
            hintText = isHigher ? '⬆️ Much higher' : '⬇️ Much lower';
            proximity = 'medium';
          } else {
            hintText = isHigher ? '🚀 Way too low!' : '⚓ Way too high!';
            proximity = 'far';
          }
        } else {
          // Standard hints
          if (diff <= 5) {
            hintText = isHigher ? 'Slightly higher' : 'Slightly lower';
            proximity = 'very_close';
          } else if (diff <= 15) {
            hintText = isHigher ? 'Go higher' : 'Go lower';
            proximity = 'close';
          } else if (diff <= 30) {
            hintText = isHigher ? 'Much higher' : 'Much lower';
            proximity = 'medium';
          } else {
            hintText = isHigher ? 'Way too low' : 'Way too high';
            proximity = 'far';
          }
        }
        
        return {
          status: 'playing',
          trialsLeft: Infinity,
          guessHistory: newHistory,
          hint: `${hintText} • ${guessCount} ${guessCount === 1 ? 'guess' : 'guesses'}`,
          proximity: proximity,
        };
      }
    },
  },

  // PUZZLE MODE - Mathematical challenges
  puzzle: {
    id: 'puzzle',
    name: 'Puzzle Mode',
    description: 'Solve riddles and puzzles to find the number',
    icon: '🧩',
    color: 'purple',
    
    getConfig: (puzzleChallenge) => {
      console.log('🧩 Building Puzzle Config from:', puzzleChallenge);
      
      // Validate puzzle challenge object
      if (!puzzleChallenge || typeof puzzleChallenge !== 'object') {
        console.error('❌ Invalid puzzle challenge object:', puzzleChallenge);
        return null;
      }
      
      const {
        solution,
        puzzle,
        hints,
        maxAttempts,
        timeLimit,
        difficulty,
        type,
        maxRange,
        hintsAvailable,
        typeInfo,
      } = puzzleChallenge;
      
      // More flexible validation - check for critical fields
      if (solution === undefined || solution === null) {
        console.error('❌ Missing solution field');
        return null;
      }
      
      if (!puzzle || typeof puzzle !== 'string') {
        console.error('❌ Missing or invalid puzzle field');
        return null;
      }
      
      if (!Array.isArray(hints) || hints.length === 0) {
        console.error('❌ Missing or invalid hints field');
        return null;
      }
      
      // Provide defaults for optional fields
      const config = {
        mode: 'puzzle',
        modeId: 'puzzle',
        difficulty: difficulty || 'medium',
        hasTimer: true,
        timerDuration: timeLimit || 180,
        max: maxRange || 100,
        trials: maxAttempts || 5,
        name: 'Puzzle Challenge',
        color: 'purple',
        targetNumber: parseInt(solution),
        puzzleText: puzzle,
        puzzleHints: hints,
        hintsAvailable: hintsAvailable || Math.min(3, hints.length),
        hintsUsed: 0,
        puzzleType: type || 'mathematical',
        typeInfo: typeInfo || { name: 'Puzzle', icon: '🧩' },
        specialRule: 'puzzle_solving',
        instructions: puzzle,
      };
      
      // Final validation of target number
      if (isNaN(config.targetNumber)) {
        console.error('❌ Invalid target number:', solution);
        return null;
      }
      
      console.log('✅ Puzzle Config Created:', config);
      return config;
    },
    
    generateTarget: (config) => {
      return config.targetNumber;
    },
    
    validateGuess: (guess, target, config, gameState) => {
      const numGuess = parseInt(guess);
      if (isNaN(numGuess) || numGuess < 0 || numGuess > config.max) {
        return { valid: false, message: `Enter a number between 0 and ${config.max}` };
      }
      if (gameState.guessHistory.includes(numGuess)) {
        return { valid: false, message: `Already tried ${numGuess}` };
      }
      return { valid: true, guess: numGuess };
    },
    
    handleGuess: (guess, target, config, gameState) => {
      const newTrials = gameState.trialsLeft - 1;
      const newHistory = [...gameState.guessHistory, guess];
      
      if (guess === target) {
        return { 
          status: 'won', 
          trialsLeft: newTrials, 
          guessHistory: newHistory,
          hint: `🎊 Puzzle Solved! The answer was ${target}`,
        };
      } else if (newTrials === 0) {
        return { 
          status: 'lost', 
          trialsLeft: 0, 
          guessHistory: newHistory,
          hint: `🧩 Puzzle Failed! The answer was ${target}`,
        };
      } else {
        // Provide contextual hints based on how close they are
        const diff = Math.abs(guess - target);
        let hintText;
        
        if (diff <= 3) {
          hintText = `🔥 Very close! Try ${guess < target ? 'slightly higher' : 'slightly lower'}`;
        } else if (diff <= 10) {
          hintText = `Getting warmer... Go ${guess < target ? 'higher' : 'lower'}`;
        } else {
          hintText = `❌ Not quite. ${newTrials} ${newTrials === 1 ? 'attempt' : 'attempts'} left`;
        }
        
        return {
          status: 'playing',
          trialsLeft: newTrials,
          guessHistory: newHistory,
          hint: hintText,
          proximity: diff <= 3 ? 'very_close' : diff <= 10 ? 'close' : 'far',
        };
      }
    },
  },
};

export const getGameMode = (modeId) => GAME_MODES[modeId] || GAME_MODES.classic;
export { GameLogic };