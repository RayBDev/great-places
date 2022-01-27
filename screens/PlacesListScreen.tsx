import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import PlaceItem from '../components/PlaceItem';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setPlaces } from '../store/slices/placesSlice';
import { RootStackScreenProps } from '../types';

const PlacesListScreen = ({ navigation }: RootStackScreenProps<'Places'>) => {
  const places = useAppSelector((state) => state.places.places);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPlaces());
  }, []);

  return (
    <FlatList
      data={places}
      renderItem={(itemData) => (
        <PlaceItem
          imageUri={itemData.item.imageUri}
          title={itemData.item.title}
          address={itemData.item.address}
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
