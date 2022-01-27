import React, { useState, useLayoutEffect } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useTheme } from '../theme';
import { RootStackScreenProps } from '../types';
import { Location } from '../types/place';

const MapScreen = ({ navigation }: RootStackScreenProps<'Map'>) => {
  const { t } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={savePickedLocationHandler}>
          <Text
            style={[
              t.textBase,
              Platform.OS === 'android' ? t.textWhite : t.textPrimary,
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  });

  const savePickedLocationHandler = () => {
    if (!selectedLocation) {
      return;
    }
    navigation.navigate('NewPlace', { pickedLocation: selectedLocation });
  };

  const selectLocationHandler = (event: any) => {
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  const mapRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };
  }

  return (
    <View style={[t.flex1, t.itemsCenter, t.justifyCenter]}>
      <MapView
        style={[t.wFull, t.hFull]}
        region={mapRegion}
        provider={'google'}
        onPress={selectLocationHandler}
      >
        {markerCoordinates && (
          <Marker
            title="Picked Location"
            coordinate={markerCoordinates}
          ></Marker>
        )}
      </MapView>
    </View>
  );
};

export default MapScreen;
