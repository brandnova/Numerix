import { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

export default function SplashScreen({ navigation }) {
  const { colors } = useTheme();

  useEffect(() => {
    // Navigate to Home after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/numerix-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <Text style={[styles.version, { color: colors.textMuted }]}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  version: {
    ...TYPOGRAPHY.caption,
    marginBottom: 40,
  },
});