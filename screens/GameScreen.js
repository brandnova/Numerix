import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { DIFFICULTIES } from '../constants/difficulties';
import { GameLogic } from '../utils/gameLogic';
import { Storage } from '../utils/storage';
import { AchievementSystem } from '../utils/achievementSystem';
import TrialIndicator from '../components/TrialIndicator';
import HintDisplay from '../components/HintDisplay';
import GuessHistory from '../components/GuessHistory';

export default function GameScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { difficulty, mode = 'classic', targetNumber: providedTarget } = route.params;
  const config = DIFFICULTIES[difficulty];
  
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [trialsLeft, setTrialsLeft] = useState(config.trials);
  const [hint, setHint] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [guessHistory, setGuessHistory] = useState([]);
  const [proximity, setProximity] = useState(null);
  
  const startTime = useRef(Date.now());

  if (!DIFFICULTIES[difficulty]) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Invalid difficulty selected
        </Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }
  
  useEffect(() => {
    // Use provided target (for daily challenge) or generate new one
    const target = providedTarget || GameLogic.generateTarget(config.max);
    setTargetNumber(target);
    setHint(`Enter a number between 1 and ${config.max}`);
  }, []);

  const handleGuess = () => {
    if (!guess || gameStatus !== 'playing') return;

    const numGuess = parseInt(guess);

    // Validation
    if (isNaN(numGuess) || numGuess < 1 || numGuess > config.max) {
      setHint(`Invalid input. Enter 1-${config.max}`);
      return;
    }

    if (guessHistory.includes(numGuess)) {
      setHint(`Already guessed ${numGuess}. Try another number`);
      return;
    }

    const newTrials = trialsLeft - 1;
    setTrialsLeft(newTrials);
    setGuessHistory([...guessHistory, numGuess]);

    if (numGuess === targetNumber) {
      handleWin(config.trials - newTrials);
    } else if (newTrials === 0) {
      handleLoss();
    } else {
      const hintData = GameLogic.getHint(numGuess, targetNumber);
      setHint(hintData.text);
      setProximity(hintData.proximity);
    }

    setGuess('');
  };

  const handleWin = async (attemptsUsed) => {
    setGameStatus('won');
    setHint(`Correct! The answer was ${targetNumber}`);
    
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
    
    // Update stats
    const stats = await Storage.getStats();
    const isPerfect = GameLogic.isPerfectGame(attemptsUsed);
    const isComeback = GameLogic.isComeback(trialsLeft);
    
    const updatedStats = {
      ...stats,
      totalGames: stats.totalGames + 1,
      totalWins: stats.totalWins + 1,
      currentWinStreak: stats.currentWinStreak + 1,
      longestWinStreak: Math.max(stats.longestWinStreak, stats.currentWinStreak + 1),
      perfectGames: isPerfect ? stats.perfectGames + 1 : stats.perfectGames,
      comebacks: isComeback ? stats.comebacks + 1 : stats.comebacks,
      byDifficulty: {
        ...stats.byDifficulty,
        [difficulty]: {
          games: stats.byDifficulty[difficulty].games + 1,
          wins: stats.byDifficulty[difficulty].wins + 1,
          totalAttempts: stats.byDifficulty[difficulty].totalAttempts + attemptsUsed,
          bestAttempts: stats.byDifficulty[difficulty].bestAttempts 
            ? Math.min(stats.byDifficulty[difficulty].bestAttempts, attemptsUsed)
            : attemptsUsed,
        },
      },
    };
    
    await Storage.saveStats(updatedStats);
    
    // Check for new achievements
    const newAchievements = await AchievementSystem.checkAchievements(updatedStats);
    if (newAchievements.length > 0) {
      // Show achievement unlock notification
      setTimeout(() => {
        Alert.alert(
          'Achievement Unlocked!',
          newAchievements.map(a => a.title).join('\n'),
          [{ text: 'Nice!', style: 'default' }]
        );
      }, 500);
    }
  };

  const handleLoss = async () => {
    setGameStatus('lost');
    setHint(`Game over. The answer was ${targetNumber}`);
    
    // Update stats
    const stats = await Storage.getStats();
    const updatedStats = {
      ...stats,
      totalGames: stats.totalGames + 1,
      totalLosses: stats.totalLosses + 1,
      currentWinStreak: 0,
      byDifficulty: {
        ...stats.byDifficulty,
        [difficulty]: {
          ...stats.byDifficulty[difficulty],
          games: stats.byDifficulty[difficulty].games + 1,
        },
      },
    };
    
    await Storage.saveStats(updatedStats);
  };

  const handlePlayAgain = () => {
    navigation.replace('Game', { difficulty, mode });
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  if (!targetNumber) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>NUMERIX</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {config.name} Mode
            </Text>
          </View>
          <Pressable 
            onPress={handleGoHome} 
            style={[
              styles.backButton, 
              { 
                backgroundColor: colors.cardBg,
                borderColor: colors.border 
              }
            ]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Home</Text>
          </Pressable>
        </View>

        {/* Trial Indicator */}
        <TrialIndicator 
          trialsLeft={trialsLeft} 
          totalTrials={config.trials}
        />

        {/* Hint Display */}
        <HintDisplay 
          hint={hint}
          gameStatus={gameStatus}
          proximity={proximity}
        />

        {/* Input Section */}
        {gameStatus === 'playing' && (
          <View style={styles.inputSection}>
            <TextInput
              value={guess}
              onChangeText={setGuess}
              keyboardType="numeric"
              placeholder={`1-${config.max}`}
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  color: colors.text 
                }
              ]}
              placeholderTextColor={colors.textMuted}
              onSubmitEditing={handleGuess}
              maxLength={3}
              autoFocus
            />
            <Pressable
              onPress={handleGuess}
              style={[styles.submitButton, { backgroundColor: colors[config.color] }]}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        )}

        {/* Game Over Actions */}
        {gameStatus !== 'playing' && (
          <View style={styles.gameOverActions}>
            <Pressable
              onPress={handlePlayAgain}
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.primaryButtonText}>Play Again</Text>
            </Pressable>
            <Pressable
              onPress={handleGoHome}
              style={[
                styles.secondaryButton, 
                { 
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border 
                }
              ]}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                Back to Home
              </Text>
            </Pressable>
          </View>
        )}

        {/* Guess History */}
        {guessHistory.length > 0 && (
          <GuessHistory 
            guesses={guessHistory}
            targetNumber={targetNumber}
          />
        )}

        {/* Win Summary */}
        {gameStatus === 'won' && (
          <View style={[
            styles.winCard,
            {
              backgroundColor: colors.success + '15',
              borderColor: colors.success
            }
          ]}>
            <Text style={[styles.winTitle, { color: colors.success }]}>Victory!</Text>
            <Text style={[styles.winText, { color: colors.text }]}>
              Solved in {config.trials - trialsLeft + 1} attempts
            </Text>
          </View>
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
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.heading,
  },
  subtitle: {
    fontSize: 13,
    marginTop: SPACING.xs,
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
  inputSection: {
    marginBottom: SPACING.xl,
  },
  input: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  submitButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  gameOverActions: {
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  primaryButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  winCard: {
    borderRadius: SPACING.md,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: SPACING.xl,
  },
  winTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  winText: {
    fontSize: 14,
  },
});