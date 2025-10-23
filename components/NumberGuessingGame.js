import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Animated } from 'react-native';

const DIFFICULTIES = {
  easy: { max: 50, trials: 10, name: 'Easy', color: '#059669' },
  medium: { max: 100, trials: 7, name: 'Medium', color: '#d97706' },
  hard: { max: 200, trials: 5, name: 'Hard', color: '#dc2626' }
};

function DifficultyCard({ difficulty, config, onSelect }) {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={() => onSelect(difficulty)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        style={[
          styles.difficultyCard,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.difficultyHeader}>
          <Text style={styles.difficultyName}>{config.name}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: config.color }]} />
        </View>
        <View style={styles.difficultyStats}>
          <View style={styles.difficultyStatItem}>
            <Text style={styles.difficultyStatLabel}>Range</Text>
            <Text style={styles.difficultyStatValue}>1-{config.max}</Text>
          </View>
          <View style={styles.difficultyStatItem}>
            <Text style={styles.difficultyStatLabel}>Attempts</Text>
            <Text style={styles.difficultyStatValue}>{config.trials}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

function TrialIndicator({ trialsLeft, totalTrials }) {
  const percentage = (trialsLeft / totalTrials) * 100;
  let color = '#059669';
  
  if (percentage <= 30) color = '#dc2626';
  else if (percentage <= 50) color = '#d97706';

  return (
    <View style={styles.trialIndicator}>
      <View style={styles.trialHeader}>
        <Text style={styles.trialLabel}>Attempts</Text>
        <Text style={styles.trialCount}>{trialsLeft}/{totalTrials}</Text>
      </View>
      <View style={styles.trialBarContainer}>
        <View style={[styles.trialBar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function GuessHistoryItem({ guess, target }) {
  const difference = Math.abs(guess - target);
  const tooHigh = guess > target;

  let bgColor = '#1e293b';
  let textColor = '#94a3b8';
  
  if (difference <= 5) {
    bgColor = '#7c2d1215';
    textColor = '#dc2626';
  } else if (difference <= 15) {
    bgColor = '#78350f15';
    textColor = '#d97706';
  }

  return (
    <View style={[styles.historyItem, { backgroundColor: bgColor }]}>
      <Text style={[styles.historyNumber, { color: textColor }]}>
        {guess}
      </Text>
      <Text style={[styles.historyArrow, { color: textColor }]}>
        {tooHigh ? '↓' : '↑'}
      </Text>
    </View>
  );
}

function HintDisplay({ hint, difference, gameStatus }) {
  let displayHint = hint;
  let bgColor = '#1e293b';
  let textColor = '#e2e8f0';

  if (gameStatus === 'won') {
    bgColor = '#05966915';
    textColor = '#059669';
  } else if (gameStatus === 'lost') {
    bgColor = '#dc262615';
    textColor = '#dc2626';
  } else if (difference !== null) {
    if (difference <= 5) {
      bgColor = '#dc262615';
      textColor = '#dc2626';
    } else if (difference <= 15) {
      bgColor = '#d9770615';
      textColor = '#d97706';
    } else if (difference <= 30) {
      bgColor = '#2563eb15';
      textColor = '#2563eb';
    }
  }

  return (
    <View style={[styles.hintBox, { backgroundColor: bgColor }]}>
      <Text style={[styles.hintText, { color: textColor }]}>{displayHint}</Text>
    </View>
  );
}

export default function NumberGuessingGame() {
  const [difficulty, setDifficulty] = useState(null);
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [trialsLeft, setTrialsLeft] = useState(0);
  const [hint, setHint] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [guessHistory, setGuessHistory] = useState([]);
  const [difference, setDifference] = useState(null);
  const [totalGames, setTotalGames] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [bestScore, setBestScore] = useState({});

  const startGame = (level) => {
    const config = DIFFICULTIES[level];
    const newTarget = Math.floor(Math.random() * config.max) + 1;
    setDifficulty(level);
    setTargetNumber(newTarget);
    setTrialsLeft(config.trials);
    setGuess('');
    setHint(`Enter a number between 1 and ${config.max}`);
    setGameStatus('playing');
    setGuessHistory([]);
    setDifference(null);
    setTotalGames(totalGames + 1);
  };

  const getDirectionHint = (numGuess, target, diff) => {
    const isHigher = numGuess < target;
    const percentage = (diff / target) * 100;

    if (diff <= 5) {
      return isHigher ? 'Slightly higher' : 'Slightly lower';
    } else if (diff <= 15) {
      return isHigher ? 'Go higher' : 'Go lower';
    } else if (diff <= 30) {
      return isHigher ? 'Much higher' : 'Much lower';
    } else {
      return isHigher ? 'Way too low' : 'Way too high';
    }
  };

  const handleGuess = () => {
    if (!guess || gameStatus !== 'playing') return;

    const numGuess = parseInt(guess);
    const config = DIFFICULTIES[difficulty];

    if (isNaN(numGuess) || numGuess < 1 || numGuess > config.max) {
      setHint(`Invalid input. Enter 1-${config.max}`);
      return;
    }

    if (guessHistory.includes(numGuess)) {
      setHint(`Already guessed ${numGuess}. Try another number`);
      return;
    }

    const newTrials = trialsLeft - 1;
    const diff = Math.abs(numGuess - targetNumber);
    
    setTrialsLeft(newTrials);
    setGuessHistory([...guessHistory, numGuess]);
    setDifference(diff);

    if (numGuess === targetNumber) {
      setGameStatus('won');
      setHint(`Correct! The answer was ${targetNumber}`);
      setGamesWon(gamesWon + 1);
      
      const attempts = config.trials - newTrials;
      if (!bestScore[difficulty] || attempts < bestScore[difficulty]) {
        setBestScore({...bestScore, [difficulty]: attempts});
      }
    } else if (newTrials === 0) {
      setGameStatus('lost');
      setHint(`Game over. The answer was ${targetNumber}`);
    } else {
      const directionHint = getDirectionHint(numGuess, targetNumber, diff);
      setHint(directionHint);
    }

    setGuess('');
  };

  if (!difficulty) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.menuContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>NUMERIX</Text>
            <Text style={styles.subtitle}>Number Guessing Challenge</Text>
          </View>

          {totalGames > 0 && (
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{gamesWon}</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalGames}</Text>
                <Text style={styles.statLabel}>Played</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {totalGames > 0 ? Math.round((gamesWon / totalGames) * 100) : 0}%
                </Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>
            </View>
          )}

          <View style={styles.difficultiesContainer}>
            {Object.entries(DIFFICULTIES).map(([key, config]) => (
              <DifficultyCard
                key={key}
                difficulty={key}
                config={config}
                onSelect={startGame}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  const config = DIFFICULTIES[difficulty];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.gameContainer}>
        <View style={styles.gameHeader}>
          <View>
            <Text style={styles.gameTitle}>NUMERIX</Text>
            <Text style={styles.gameDifficulty}>{config.name} Mode</Text>
          </View>
          <Pressable
            onPress={() => setDifficulty(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>

        <TrialIndicator trialsLeft={trialsLeft} totalTrials={config.trials} />

        <HintDisplay 
          hint={hint} 
          gameStatus={gameStatus} 
          difference={difference}
        />

        {gameStatus === 'playing' && (
          <View style={styles.inputSection}>
            <TextInput
              value={guess}
              onChangeText={setGuess}
              keyboardType="numeric"
              placeholder={`1-${config.max}`}
              style={styles.input}
              placeholderTextColor="#475569"
              onSubmitEditing={handleGuess}
              maxLength={3}
            />
            <Pressable
              onPress={handleGuess}
              style={[styles.submitButton, { backgroundColor: config.color }]}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        )}

        {gameStatus !== 'playing' && (
          <View style={styles.gameOverActions}>
            <Pressable
              onPress={() => startGame(difficulty)}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Play Again</Text>
            </Pressable>
            <Pressable
              onPress={() => setDifficulty(null)}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Change Difficulty</Text>
            </Pressable>
          </View>
        )}

        {guessHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Guess History</Text>
            <View style={styles.historyGrid}>
              {guessHistory.map((g, i) => (
                <GuessHistoryItem
                  key={i}
                  guess={g}
                  target={targetNumber}
                />
              ))}
            </View>
          </View>
        )}

        {gameStatus === 'won' && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Victory</Text>
            <Text style={styles.resultText}>
              Solved in {config.trials - trialsLeft + 1} attempts
            </Text>
            {bestScore[difficulty] && (
              <Text style={styles.bestScoreText}>
                Best: {bestScore[difficulty]} attempts
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  menuContainer: {
    padding: 24,
    paddingTop: 50,
  },
  gameContainer: {
    padding: 24,
    paddingTop: 50,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    letterSpacing: 0.5,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#334155',
  },
  difficultiesContainer: {
    gap: 12,
  },
  difficultyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  difficultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  difficultyName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
  },
  difficultyBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  difficultyStats: {
    flexDirection: 'row',
    gap: 24,
  },
  difficultyStatItem: {
    flex: 1,
  },
  difficultyStatLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  difficultyStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: 1.5,
  },
  gameDifficulty: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  backButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  backButtonText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '500',
  },
  trialIndicator: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  trialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  trialLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trialCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
  },
  trialBarContainer: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  trialBar: {
    height: '100%',
    borderRadius: 3,
  },
  hintBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  hintText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  inputSection: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#f8fafc',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  gameOverActions: {
    marginBottom: 20,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryButtonText: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '500',
  },
  historySection: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  historyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyItem: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyNumber: {
    fontSize: 15,
    fontWeight: '600',
  },
  historyArrow: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#05966915',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#059669',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  bestScoreText: {
    fontSize: 12,
    color: '#64748b',
  },
});