import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { getGameMode, GameLogic } from '../constants/gameModes';
import { Storage } from '../utils/storage';
import { AchievementSystem } from '../utils/achievementSystem';
import { DailyChallengeGenerator } from '../utils/dailyChallengeGenerator';
import { SpeedChallengeGenerator } from '../utils/speedChallengeGenerator';
import TrialIndicator from '../components/TrialIndicator';
import HintDisplay from '../components/HintDisplay';
import GuessHistory from '../components/GuessHistory';
import TimerDisplay from '../components/TimerDisplay';

export default function GameScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { 
    mode = 'classic', 
    difficulty,
    dailyChallenge,
    speedChallenge,
  } = route.params;

  console.log('🎮 Game Screen Initialized:', { mode, difficulty, dailyChallenge, speedChallenge });
  
  // Get the appropriate game mode
  const gameMode = getGameMode(mode);
  
  // Get configuration based on mode
  let config;
  if (mode === 'daily') {
    config = gameMode.getConfig(dailyChallenge);
    if (!config) {
      Alert.alert('Error', 'Invalid daily challenge configuration');
      navigation.goBack();
      return null;
    }
  } else if (mode === 'speed') {
    config = gameMode.getConfig(speedChallenge);
    if (!config) {
      Alert.alert('Error', 'Invalid speed challenge configuration');
      navigation.goBack();
      return null;
    }
  } else {
    config = gameMode.getConfig(difficulty || 'medium');
  }

  console.log('⚙️ Game Config:', config);

  // Validate config for daily mode
  useEffect(() => {
    if (mode === 'daily' && config) {
      console.log('🎮 DAILY MODE VALIDATION:', {
        configMax: config.max,
        configTrials: config.trials,
        configTarget: config.targetNumber,
      });
      
      // Validate target is within range
      if (config.targetNumber && (config.targetNumber < 1 || config.targetNumber > config.max)) {
        console.error('❌ INVALID TARGET NUMBER!', {
          target: config.targetNumber,
          max: config.max
        });
        Alert.alert('Error', 'Invalid daily challenge configuration', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    }
  }, []);
  
  // Game state
  const [gameState, setGameState] = useState({
    status: 'playing', // 'playing', 'won', 'lost'
    targetNumber: null,
    guess: '',
    trialsLeft: config.trials,
    hint: config.instructions,
    guessHistory: [],
    proximity: null,
    timeLeft: config.hasTimer ? config.timerDuration : null,
  });
  
  const [settings, setSettings] = useState(null);
  const startTime = useRef(Date.now());
  const timerRef = useRef(null);

  // Load settings and initialize game
  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (config.hasTimer && gameState.timeLeft > 0 && gameState.status === 'playing') {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return { ...prev, timeLeft: 0, status: 'lost' };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [config.hasTimer, gameState.timeLeft, gameState.status]);

  const initializeGame = async () => {
    const userSettings = await Storage.getSettings();
    setSettings(userSettings);
    
    // Generate or use pre-set target
    const target = gameMode.generateTarget(config);
    
    console.log('🎯 Game Initialized:', { 
      mode: config.mode,
      target, 
      max: config.max,
      trials: config.trials,
      specialRule: config.specialRule,
    });
    
    setGameState(prev => ({
      ...prev,
      targetNumber: target,
      hint: config.instructions,
      trialsLeft: config.trials,
      timeLeft: config.hasTimer ? config.timerDuration : null,
    }));
  };

  const handleTimeUp = () => {
    const finalMessage = `⏰ Time's up! The answer was ${gameState.targetNumber}`;
    setGameState(prev => ({
      ...prev,
      status: 'lost',
      hint: finalMessage,
    }));
    handleGameComplete('lost');
  };

  const handleGuess = async () => {
    if (!gameState.guess || gameState.status !== 'playing') return;

    console.log('🔍 PROCESSING GUESS:', {
      guess: gameState.guess,
      target: gameState.targetNumber,
      configMax: config.max
    });

    // Validate guess using game mode logic
    const validation = gameMode.validateGuess(
      gameState.guess, 
      gameState.targetNumber, 
      config, 
      gameState
    );

    if (!validation.valid) {
      setGameState(prev => ({ ...prev, hint: validation.message }));
      return;
    }

    // Process guess using game mode logic
    const result = gameMode.handleGuess(
      validation.guess,
      gameState.targetNumber,
      config,
      gameState
    );

    console.log('🎯 GUESS RESULT:', result);

    setGameState(prev => ({
      ...prev,
      ...result,
      guess: '', // Clear input
    }));

    // Check if game ended
    if (result.status === 'won' || result.status === 'lost') {
      handleGameComplete(result.status);
    }
  };

  const handleGameComplete = async (result) => {
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
    
    console.log('🏁 GAME COMPLETE:', { result, timeTaken, mode });

    const stats = await Storage.getStats();
    let updatedStats = { ...stats };

    if (mode === 'classic') {
      updatedStats = await handleClassicStats(result, stats, timeTaken);
    } else if (mode === 'daily') {
      updatedStats = await handleDailyStats(result, stats, timeTaken);
    } else if (mode === 'speed') {
      updatedStats = await handleSpeedStats(result, stats, timeTaken);
    }

    await Storage.saveStats(updatedStats);

    // Check achievements
    const newAchievements = await AchievementSystem.checkAchievements(updatedStats);
    if (newAchievements.length > 0) {
      setTimeout(() => {
        Alert.alert(
          '🏆 Achievement Unlocked!',
          newAchievements.map(a => a.title).join('\n'),
          [{ text: 'Awesome!', style: 'default' }]
        );
      }, 1000);
    }
  };

  const handleClassicStats = async (result, stats, timeTaken) => {
    const attemptsUsed = config.trials - gameState.trialsLeft + 1;
    const isPerfect = GameLogic.isPerfectGame(attemptsUsed);
    const isComeback = GameLogic.isComeback(gameState.trialsLeft);

    const difficultyKey = config.difficulty || difficulty || 'medium';

    const updatedStats = {
      ...stats,
      totalGames: stats.totalGames + 1,
      totalWins: result === 'won' ? stats.totalWins + 1 : stats.totalWins,
      totalLosses: result === 'lost' ? stats.totalLosses + 1 : stats.totalLosses,
      currentWinStreak: result === 'won' ? stats.currentWinStreak + 1 : 0,
      longestWinStreak: Math.max(
        stats.longestWinStreak,
        result === 'won' ? stats.currentWinStreak + 1 : 0
      ),
      perfectGames: isPerfect ? stats.perfectGames + 1 : stats.perfectGames,
      comebacks: isComeback ? stats.comebacks + 1 : stats.comebacks,
      byDifficulty: {
        ...stats.byDifficulty,
        [difficultyKey]: {
          games: (stats.byDifficulty[difficultyKey]?.games || 0) + 1,
          wins: result === 'won' ? (stats.byDifficulty[difficultyKey]?.wins || 0) + 1 : (stats.byDifficulty[difficultyKey]?.wins || 0),
          totalAttempts: (stats.byDifficulty[difficultyKey]?.totalAttempts || 0) + attemptsUsed,
          bestAttempts: result === 'won' 
            ? (stats.byDifficulty[difficultyKey]?.bestAttempts 
                ? Math.min(stats.byDifficulty[difficultyKey].bestAttempts, attemptsUsed)
                : attemptsUsed)
            : stats.byDifficulty[difficultyKey]?.bestAttempts,
        },
      },
    };

    console.log('📊 CLASSIC STATS UPDATED:', updatedStats);
    return updatedStats;
  };

  const handleDailyStats = async (result, stats, timeTaken) => {
    const attemptsUsed = config.trials === Infinity 
      ? gameState.guessHistory.length 
      : config.trials - gameState.trialsLeft + 1;
    
    const dailyData = await Storage.getDailyChallenge();
    
    // Update daily challenge data
    const updatedDailyData = await DailyChallengeGenerator.updateStreak(
      result === 'won',
      dailyData
    );

    // Save updated daily data FIRST
    await Storage.saveDailyChallenge(updatedDailyData);

    // Track in the appropriate difficulty bucket
    const difficultyKey = config.difficulty || 'medium';
    
    const updatedStats = {
      ...stats,
      totalGames: stats.totalGames + 1,
      totalWins: result === 'won' ? stats.totalWins + 1 : stats.totalWins,
      totalLosses: result === 'lost' ? stats.totalLosses + 1 : stats.totalLosses,
      byDifficulty: {
        ...stats.byDifficulty,
        [difficultyKey]: {
          games: (stats.byDifficulty[difficultyKey]?.games || 0) + 1,
          wins: result === 'won' ? (stats.byDifficulty[difficultyKey]?.wins || 0) + 1 : (stats.byDifficulty[difficultyKey]?.wins || 0),
          totalAttempts: (stats.byDifficulty[difficultyKey]?.totalAttempts || 0) + attemptsUsed,
          bestAttempts: result === 'won' 
            ? (stats.byDifficulty[difficultyKey]?.bestAttempts 
                ? Math.min(stats.byDifficulty[difficultyKey].bestAttempts, attemptsUsed)
                : attemptsUsed)
            : stats.byDifficulty[difficultyKey]?.bestAttempts,
        },
      },
    };

    console.log('📊 Daily Stats Updated:', updatedStats);
    return updatedStats;
  };

  const handleSpeedStats = async (result, stats, timeTaken) => {
    const guessCount = gameState.guessHistory.length;
    const timeRemaining = gameState.timeLeft || 0;
    const totalTime = config.timerDuration || 60;
    const timeUsed = totalTime - timeRemaining;
    
    // Get speed challenge from route params
    const { speedChallenge } = route.params;
    const level = speedChallenge || 1;

    // Calculate score
    const baseScore = 100 * level;
    const timeBonus = Math.max(0, timeRemaining * 10);
    const efficiencyBonus = Math.max(0, (10 - guessCount) * 20);
    const totalScore = baseScore + timeBonus + efficiencyBonus;

    // Check for perfect game (max time remaining)
    const isPerfect = timeRemaining >= totalTime * 0.8; // 80%+ time remaining

    // Initialize speedStats if it doesn't exist
    const currentSpeedStats = stats.speedStats || {
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

    // Update speed stats
    const updatedSpeedStats = {
      ...currentSpeedStats,
      totalGames: currentSpeedStats.totalGames + 1,
      totalWins: result === 'won' ? currentSpeedStats.totalWins + 1 : currentSpeedStats.totalWins,
      totalLosses: result === 'lost' ? currentSpeedStats.totalLosses + 1 : currentSpeedStats.totalLosses,
      currentWinStreak: result === 'won' ? currentSpeedStats.currentWinStreak + 1 : 0,
      longestWinStreak: Math.max(
        currentSpeedStats.longestWinStreak,
        result === 'won' ? currentSpeedStats.currentWinStreak + 1 : 0
      ),
      perfectGames: isPerfect && result === 'won' ? currentSpeedStats.perfectGames + 1 : currentSpeedStats.perfectGames,
      bestTime: result === 'won' && (currentSpeedStats.bestTime === null || timeUsed < currentSpeedStats.bestTime) 
        ? timeUsed 
        : currentSpeedStats.bestTime,
      bestGuesses: result === 'won' && (currentSpeedStats.bestGuesses === null || guessCount < currentSpeedStats.bestGuesses)
        ? guessCount
        : currentSpeedStats.bestGuesses,
      highestScore: Math.max(currentSpeedStats.highestScore, totalScore),
      totalScore: currentSpeedStats.totalScore + totalScore,
      totalTimePlayed: currentSpeedStats.totalTimePlayed + timeUsed,
      levelsCompleted: {
        ...currentSpeedStats.levelsCompleted,
        [level]: {
          completions: result === 'won' ? currentSpeedStats.levelsCompleted[level].completions + 1 : currentSpeedStats.levelsCompleted[level].completions,
          bestTime: result === 'won' && (currentSpeedStats.levelsCompleted[level].bestTime === null || timeUsed < currentSpeedStats.levelsCompleted[level].bestTime)
            ? timeUsed
            : currentSpeedStats.levelsCompleted[level].bestTime,
          bestScore: Math.max(currentSpeedStats.levelsCompleted[level].bestScore, totalScore),
        }
      }
    };

    // Calculate averages
    updatedSpeedStats.averageTime = updatedSpeedStats.totalTimePlayed / updatedSpeedStats.totalGames;
    updatedSpeedStats.averageGuesses = ((currentSpeedStats.averageGuesses * currentSpeedStats.totalGames) + guessCount) / updatedSpeedStats.totalGames;

    // Update speed-specific stats
    await SpeedChallengeGenerator.updateStats(
      result === 'won',
      speedChallenge,
      timeRemaining,
      guessCount
    );

    // If won, show score
    if (result === 'won') {
      setTimeout(() => {
        Alert.alert(
          '⚡ Speed Challenge Complete!',
          `Score: ${totalScore}\n\n` +
          `Level: ${level}\n` +
          `Time: ${timeUsed}s\n` +
          `Guesses: ${guessCount}\n` +
          (isPerfect ? `🎯 Perfect Game!` : ''),
          [{ text: 'Nice!', style: 'default' }]
        );
      }, 1000);
    }

    // Update general stats with enhanced speed stats
    const updatedStats = {
      ...stats,
      totalGames: stats.totalGames + 1,
      totalWins: result === 'won' ? stats.totalWins + 1 : stats.totalWins,
      totalLosses: result === 'lost' ? stats.totalLosses + 1 : stats.totalLosses,
      speedStats: updatedSpeedStats,
    };

    console.log('📊 Enhanced Speed Stats Updated:', updatedStats);
    return updatedStats;
  };

  const handlePlayAgain = () => {
    navigation.replace('Game', route.params);
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const getGameTitle = () => {
    if (mode === 'daily') {
      return `Daily Challenge • ${config.difficulty?.charAt(0).toUpperCase() + config.difficulty?.slice(1) || 'Medium'}`;
    } else if (mode === 'speed') {
      return `Speed Challenge • Level ${speedChallenge || 1}`;
    } else {
      return `${config.name} • 1-${config.max} • ${config.trials} attempts`;
    }
  };

  if (!gameState.targetNumber || !settings) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading Game...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Consistent with Settings Screen */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Game</Text>
          <Pressable 
            onPress={handleGoHome}
            style={({ pressed }) => [
              styles.backButton, 
              { 
                backgroundColor: colors.cardBg, 
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              }
            ]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Home</Text>
          </Pressable>
        </View>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {getGameTitle()}
        </Text>

        {/* Timer Display */}
        {config.hasTimer && gameState.timeLeft !== null && (
          <TimerDisplay 
            timeLeft={gameState.timeLeft}
            totalTime={config.timerDuration}
          />
        )}

        {/* Trial Indicator */}
        {config.trials !== Infinity && (
          <TrialIndicator 
            trialsLeft={gameState.trialsLeft}
            totalTrials={config.trials}
          />
        )}

        {/* Special Rule Display */}
        {config.specialRule && gameState.status === 'playing' && (
          <View style={[styles.specialRuleCard, { backgroundColor: colors.warning + '15', borderColor: colors.warning }]}>
            <Text style={[styles.specialRuleTitle, { color: colors.warning }]}>⚠️ Special Rule Active</Text>
            <Text style={[styles.specialRuleText, { color: colors.text }]}>
              {config.specialRule === 'no_consecutive_direction' && 'Cannot guess in the same direction twice'}
              {config.specialRule === 'reverse_hints' && 'Hints are reversed!'}
              {config.specialRule === 'only_multiples_of_5' && 'Only multiples of 5 allowed'}
              {config.specialRule === 'time_pressure' && 'Beat the clock!'}
              {config.specialRule?.includes('time_limit') && `${config.timerDuration}s time limit`}
            </Text>
          </View>
        )}

        {/* Hint Display */}
        <HintDisplay 
          hint={gameState.hint}
          gameStatus={gameState.status}
          proximity={gameState.proximity}
        />

        {/* Input Section */}
        {gameState.status === 'playing' && (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Enter a number between 1 and {config.max}
            </Text>
            <TextInput
              value={gameState.guess}
              onChangeText={(text) => {
                // Only allow numbers
                const numericText = text.replace(/[^0-9]/g, '');
                setGameState(prev => ({ ...prev, guess: numericText }));
              }}
              keyboardType="number-pad"
              placeholder={`1-${config.max}`}
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  color: colors.text 
                }
              ]}
              placeholderTextColor={colors.textMuted || colors.textSecondary}
              onSubmitEditing={handleGuess}
              maxLength={config.max.toString().length}
              autoFocus
              selectTextOnFocus
            />
            <Pressable
              onPress={handleGuess}
              style={({ pressed }) => [
                styles.submitButton, 
                { 
                  backgroundColor: colors[config.color] || colors.primary,
                  opacity: pressed ? 0.8 : 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }
              ]}
            >
              <Text style={styles.submitButtonText}>Submit Guess</Text>
            </Pressable>
          </View>
        )}

        {/* Game Over Actions */}
        {gameState.status !== 'playing' && (
          <View style={styles.gameOverSection}>
            <View style={[
              styles.resultCard,
              { 
                backgroundColor: gameState.status === 'won' ? colors.success + '15' : colors.danger + '15',
                borderColor: gameState.status === 'won' ? colors.success : colors.danger
              }
            ]}>
              <Text style={[
                styles.resultTitle, 
                { color: gameState.status === 'won' ? colors.success : colors.danger }
              ]}>
                {gameState.status === 'won' ? '🎉 Victory!' : '💀 Game Over'}
              </Text>
              <Text style={[styles.resultText, { color: colors.text }]}>
                {gameState.hint}
              </Text>
              {gameState.status === 'won' && (
                <View style={styles.resultStats}>
                  <Text style={[styles.attemptsText, { color: colors.textSecondary }]}>
                    {config.trials === Infinity 
                      ? `Solved in ${gameState.guessHistory.length} ${gameState.guessHistory.length === 1 ? 'guess' : 'guesses'}`
                      : `Solved in ${config.trials - gameState.trialsLeft} ${config.trials - gameState.trialsLeft === 1 ? 'attempt' : 'attempts'}`
                    }
                  </Text>
                  {config.hasTimer && (
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                      Time: {Math.floor((Date.now() - startTime.current) / 1000)}s
                    </Text>
                  )}
                </View>
              )}
            </View>

            <View style={styles.gameOverActions}>
              <Pressable
                onPress={handlePlayAgain}
                style={({ pressed }) => [
                  styles.primaryButton, 
                  { 
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {mode === 'daily' ? '↻ Try Again' : '▶ Play Again'}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleGoHome}
                style={({ pressed }) => [
                  styles.secondaryButton, 
                  { 
                    backgroundColor: colors.cardBg, 
                    borderColor: colors.border,
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                  ⬅ Back to Home
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Guess History */}
        {gameState.guessHistory.length > 0 && (
          <GuessHistory 
            guesses={gameState.guessHistory}
            targetNumber={gameState.targetNumber}
          />
        )}
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
    paddingBottom: SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
  },
  // Updated Header - Consistent with Settings Screen
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.title,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: SPACING.xl,
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
  specialRuleCard: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  specialRuleTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  specialRuleText: {
    fontSize: 14,
    lineHeight: 18,
  },
  inputSection: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontWeight: '500',
  },
  input: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
  },
  submitButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  gameOverSection: {
    marginBottom: SPACING.xl,
  },
  resultCard: {
    borderRadius: SPACING.md,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  resultStats: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  attemptsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  gameOverActions: {
    gap: SPACING.md,
  },
  primaryButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});