import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme';

const MapScreen = () => {
  const { t } = useTheme();
  return (
    <View>
      <Text>MapScreen</Text>
    </View>
  );
};

export default MapScreen;
