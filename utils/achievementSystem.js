import { ACHIEVEMENTS } from '../constants/achievements';
import { Storage } from './storage';

export const AchievementSystem = {
  // Check and unlock new achievements
  async checkAchievements(stats) {
    const unlockedAchievements = await Storage.getAchievements();
    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
      const alreadyUnlocked = unlockedAchievements.find(a => a.id === achievement.id);
      
      if (!alreadyUnlocked && achievement.condition(stats)) {
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date().toISOString(),
        };
        newlyUnlocked.push(unlockedAchievement);
      }
    }

    if (newlyUnlocked.length > 0) {
      const updatedAchievements = [...unlockedAchievements, ...newlyUnlocked];
      await Storage.saveAchievements(updatedAchievements);
    }

    return newlyUnlocked;
  },

  // Get achievement progress
  async getProgress() {
    const unlockedAchievements = await Storage.getAchievements();
    const totalAchievements = ACHIEVEMENTS.length;
    const unlockedCount = unlockedAchievements.length;
    
    return {
      total: totalAchievements,
      unlocked: unlockedCount,
      percentage: Math.round((unlockedCount / totalAchievements) * 100),
    };
  },
};