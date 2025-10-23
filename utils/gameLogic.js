export const GameLogic = {
  // Generate random target number
  generateTarget(max) {
    return Math.floor(Math.random() * max) + 1;
  },

  // Calculate hint based on guess and target
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

  // Calculate score based on performance
  calculateScore(difficulty, attemptsUsed, totalAttempts, timeTaken) {
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    const efficiencyScore = ((totalAttempts - attemptsUsed + 1) / totalAttempts) * 100;
    const timeBonus = timeTaken < 30 ? 50 : timeTaken < 60 ? 25 : 0;
    
    return Math.round((efficiencyScore * difficultyMultiplier) + timeBonus);
  },

  // Check if it's a perfect game
  isPerfectGame(attemptsUsed) {
    return attemptsUsed === 1;
  },

  // Check if it's a comeback
  isComeback(trialsLeft) {
    return trialsLeft === 1;
  },
};