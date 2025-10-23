## Quick Theme Creation Tips

### Step 1: Add theme to constants/theme.js

**Theme Object Structure:**
```javascript
themeName: {
  background: '#hex',      // Main background
  cardBg: '#hex',         // Card/container backgrounds
  border: '#hex',         // Borders and dividers
  text: '#hex',           // Primary text
  textSecondary: '#hex',  // Secondary text
  textMuted: '#hex',      // Muted/disabled text
  primary: '#hex',        // Primary accent color
  success: '#hex',        // Success/green
  warning: '#hex',        // Warning/orange
  danger: '#hex',         // Error/red
  easy: '#hex',          // Easy difficulty color
  medium: '#hex',        // Medium difficulty color
  hard: '#hex',          // Hard difficulty color
}
```

**Color Palette Tools:**
- https://coolors.co/ - Generate color schemes
- https://colorhunt.co/ - Browse color palettes
- https://materialui.co/colors - Material Design colors

**Good Theme Contrast:**
- Ensure text colors have good contrast against backgrounds
- Test with different difficulty colors
- Keep consistent brightness levels within a theme


### Step 2: Add to THEME_OPTIONS in SettingsScreen.js

```javascript
const THEME_OPTIONS = [
  { id: 'dark', name: 'Dark', description: 'Classic dark theme' },
  { id: 'light', name: 'Light', description: 'Bright and clean' },
  { id: 'ocean', name: 'Ocean', description: 'Deep blue vibes' },
  { id: 'sunset', name: 'Sunset', description: 'Purple and pink' },
  { id: 'forest', name: 'Forest', description: 'Natural greens' },
  { id: 'midnight', name: 'Midnight', description: 'Pure darkness' },
  { id: 'cherry', name: 'Cherry', description: 'Red passion' },
  { id: 'arctic', name: 'Arctic', description: 'Icy blues' },
];
```

That's it! The new theme will automatically work everywhere in the app.