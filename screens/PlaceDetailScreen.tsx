import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme';
import { RootStackScreenProps } from '../types';

const PlaceDetailScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'PlaceDetail'>) => {
  const { t } = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.placeTitle,
    });
  }, [navigation]);

  return (
    <View>
      <Text>PlaceDetailScreen</Text>
    </View>
  );
};

export default PlaceDetailScreen;
