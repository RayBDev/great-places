import React from 'react';
import { FlatList, Text, View } from 'react-native';
import PlaceItem from '../components/PlaceItem';
import { useAppSelector } from '../hooks/reduxHooks';
import { useTheme } from '../theme';
import { RootStackScreenProps } from '../types';

const PlacesListScreen = ({ navigation }: RootStackScreenProps<'Places'>) => {
  const { t } = useTheme();
  const places = useAppSelector((state) => state.places.places);

  return (
    <FlatList
      data={places}
      renderItem={(itemData) => (
        <PlaceItem
          image=""
          title={itemData.item.title}
          address=""
          onSelect={() => {
            navigation.navigate('PlaceDetail', {
              placeTitle: itemData.item.title,
              placeId: itemData.item.id,
            });
          }}
        />
      )}
    />
  );
};

export default PlacesListScreen;
