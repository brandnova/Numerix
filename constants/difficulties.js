// Remove COLORS import and use theme color names directly
export const DIFFICULTIES = {
  easy: { 
    max: 50, 
    trials: 10, 
    name: 'Easy', 
    color: 'easy', // Just store the color key name
    pointsMultiplier: 1 
  },
  medium: { 
    max: 100, 
    trials: 7, 
    name: 'Medium', 
    color: 'medium', // Just store the color key name
    pointsMultiplier: 2 
  },
  hard: { 
    max: 200, 
    trials: 5, 
    name: 'Hard', 
    color: 'hard', // Just store the color key name
    pointsMultiplier: 3 
  }
};