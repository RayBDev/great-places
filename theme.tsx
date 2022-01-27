import { createTheme } from 'react-native-whirlwind';
import { scale, verticalScale } from 'react-native-size-matters';
import { StyleSheet, Platform } from 'react-native';

import useColorScheme from './hooks/useColorScheme';

// Color scheme for light mode
export const lightColors = {
  primary: '#fc9208',
  primaryDark: '#77002E',
  primaryLight: '#E06896',
  primaryContrast: '#fff',
  secondary: '#FFC107',
  secondaryDark: '#9E7700',
  secondaryLight: '#FFD967',
  selected: 'rgba(0,0,0,0.08)',
  paper: '#fafafa',
  warning: '#ff9800',
  gray100: '#f7fafc',
  gray800: '#2d3748',
};

// Color scheme for dark mode
export const darkColors = {
  primary: '#fc9208',
  primaryDark: '#77002E',
  primaryLight: '#E06896',
  primaryContrast: '#fff',
  secondary: '#FFC107',
  secondaryDark: '#9E7700',
  secondaryLight: '#FFD967',
  selected: 'rgba(0,0,0,0.08)',
  paper: '#fafafa',
};

// Setup font sizes to include scaling
const fontSizes = {
  '2xs': scale(8),
  xs: scale(12),
  sm: scale(14),
  base: scale(16),
  lg: scale(18),
  xl: scale(20),
  '2xl': scale(24),
  '3xl': scale(30),
  '4xl': scale(36),
  '5xl': scale(48),
};

// Font family setup based on fonts defined by Expo's async font utility
const fontFamilies = {
  sans: 'OpenSans',
  sansBold: 'OpenSans-Bold',
};

// Custom heights that include scaling
const height = {
  h17: {
    height: scale(68),
  },
  h7_20: {
    height: '35%',
  },
  minH75: {
    minHeight: 300,
  },
  h75: {
    height: 300,
  },
};

// Custom widths that include scaling
const width = {
  w17: {
    width: scale(68),
  },
  w9_10: {
    width: '90%',
  },
  maxW87: {
    maxWidth: scale(348),
  },
};

// Setup light theme
export const lightTheme = StyleSheet.create({
  ...createTheme({
    colors: lightColors,
    fontSizes,
    fontFamilies,
  }),
  ...height,
  ...width,
});

// Setup dark theme
export const darkTheme = StyleSheet.create({
  ...createTheme({
    colors: darkColors,
    fontSizes,
    fontFamilies,
  }),
  ...height,
  ...width,
});

/** Typescript Definitions for Whirlwind Dark and Light Themes */
export type ThemeProps = typeof lightTheme | typeof darkTheme;

// Function to export both the utility theme and the navigation theme based on dark mode, light mode, IOS, and Android.
export const useTheme = () => {
  // Is the device set to light or dark mode?
  const colorScheme = useColorScheme();

  // Is device in Dark mode: True or False
  const isDark = colorScheme === 'dark';

  // Setup utility based on dark/light mode
  const t = isDark ? darkTheme : lightTheme;

  // Setup navigation theme based on dark/light mode + IOS/Android
  const navTheme =
    Platform.OS === 'ios'
      ? {
          dark: isDark,
          colors: {
            primary: isDark ? darkColors.primary : lightColors.primary,
            background: isDark ? darkColors.selected : lightColors.paper,
            text: isDark ? darkColors.primaryContrast : lightColors.primary,
            card: isDark ? darkColors.primary : lightColors.primaryContrast,
            border: lightColors.gray100,
            notification: lightColors.warning,
          },
        }
      : {
          dark: isDark,
          colors: {
            primary: isDark ? darkColors.primary : lightColors.primaryContrast,
            background: isDark ? darkColors.selected : lightColors.paper,
            text: isDark
              ? darkColors.primaryContrast
              : lightColors.primaryContrast,
            card: isDark ? darkColors.primary : lightColors.primary,
            border: lightColors.gray100,
            notification: lightColors.warning,
          },
        };
  return {
    t,
    navTheme,
  };
};
