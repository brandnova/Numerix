# NUMERIX - Number Guessing Challenge

A beautifully designed, feature-rich number guessing game built with React Native and Expo. Test your intuition, logic, and speed across multiple challenging game modes.

## 🎯 Features

### Game Modes
- **Classic Mode**: Traditional number guessing with limited attempts across multiple difficulty levels
- **Daily Challenge**: Unique puzzle every day with special rules and streak tracking
- **Speed Challenge**: Race against time with unlimited attempts and scoring system

### Core Gameplay
- **Smart Hints**: Get intelligent feedback on your guesses (Higher/Lower with proximity indicators)
- **Multiple Difficulties**: Easy, Medium, and Hard modes with varying number ranges
- **Guess History**: Track your previous attempts and see your progress
- **Trial Indicators**: Visual feedback on remaining attempts

### Personalization & Progress
- **8 Beautiful Themes**: Dark, Light, Ocean, Sunset, Forest, Midnight, Cherry, and Arctic
- **Comprehensive Statistics**: Track wins, losses, streaks, and performance by difficulty
- **Achievement System**: 25+ achievements across different categories
- **Streak Calendar**: Visualize your daily challenge progress

### Technical Features
- **Cross-Platform**: Built with React Native for iOS and Android
- **Offline First**: All data stored locally on device
- **Smooth Animations**: Polished UI with consistent design language
- **Accessibility**: Designed with inclusive principles

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/brandnova/Numerix.git
   cd numerix
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera (iOS)
   - Or run on emulator: press `a` for Android, `i` for iOS

## 🎮 How to Play

### Basic Rules
1. The game generates a random number within a specified range
2. You have a limited number of attempts to guess the number
3. After each guess, you'll receive hints:
   - "Higher" if your guess is too low
   - "Lower" if your guess is too high
   - Proximity indicators show how close you are

### Game Modes Explained

#### Classic Mode
- **Easy**: Numbers 1-50, 10 attempts
- **Medium**: Numbers 1-100, 8 attempts  
- **Hard**: Numbers 1-250, 6 attempts

#### Daily Challenge
- Unique number every day
- Special rules that change daily
- Build and maintain your streak
- Compete with yourself over time

#### Speed Challenge
- Unlimited guesses
- Beat the clock for bonus points
- Score based on time and efficiency
- Multiple difficulty levels

## 🏆 Achievements & Stats

Track your progress with comprehensive statistics:
- Win/Loss records and ratios
- Current and longest win streaks
- Perfect games (solved in 1 attempt)
- Comeback victories
- Performance by difficulty level
- Daily challenge streaks

Unlock achievements across categories:
- **Beginner**: First wins and games played
- **Progress**: Milestone games completed
- **Win Streaks**: Consecutive victory challenges
- **Special**: Perfect games and comeback wins
- **Difficulty**: Master each difficulty level
- **Daily**: Consistent daily challenge completion
- **Speed**: Speed mode accomplishments

## 🎨 Customization

### Themes
Choose from 8 carefully crafted color themes:
- **Dark**: Classic dark mode
- **Light**: Clean and bright
- **Ocean**: Deep blue tones
- **Sunset**: Purple and pink hues
- **Forest**: Natural greens
- **Midnight**: Pure darkness
- **Cherry**: Red passion
- **Arctic**: Icy blues

### Settings
- Toggle sound effects and background music (Comming soon)
- Enable/disable haptic feedback (Comming soon)
- Configure daily notifications (Comming soon)
- Clear all progress data

## 📱 Screens

- **Home**: Overview with quick stats and mode selection
- **Game**: Core gameplay interface
- **Statistics**: Detailed performance analytics
- **Achievements**: Progress and unlocked accomplishments
- **Daily Challenge**: Today's special puzzle
- **Streak Calendar**: Visual daily progress tracker
- **Game Modes**: All available gameplay options
- **Settings**: Personalization and preferences
- **Theme Selection**: Visual customization

## 🛠️ Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data persistence
- **Styling**: React Native StyleSheet with design system
- **Icons**: Emoji-based for cross-platform consistency

## 📊 Game Architecture

The app features a modular architecture:
- **Game Logic**: Separate modules for each game mode
- **Storage System**: Centralized data management
- **Achievement System**: Dynamic unlocking based on stats
- **Theme System**: Consistent theming across components
- **Component Library**: Reusable UI components

## 🔧 Development

### Project Structure
```
src/
├── components/     # Reusable UI components
├── constants/      # Game config and themes
├── contexts/       # React Context providers
├── screens/        # App screens
└── utils/          # Utilities and helpers
```

### Key Components
- `GameScreen`: Core gameplay logic
- `ThemeContext`: Theme management
- `Storage`: Data persistence layer
- `AchievementSystem`: Achievement tracking
- `GameModes`: Mode-specific configurations

## 🎯 Future Enhancements

Planned features for future releases:
- Local multiplayer real-time competitions
- Mathematical puzzle variations
- Social features and leaderboards
- Additional game modes
- Enhanced statistics and analytics

## 📄 License

This project is licensed for personal and educational use.

---

**NUMERIX** - Challenge your mind, one number at a time! 🧠