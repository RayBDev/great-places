import React from 'react';
import { Text, View } from 'react-native';
import MapView from 'react-native-maps';

import { useTheme } from '../theme';

const MapScreen = () => {
  const { t } = useTheme();

  const mapRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  return (
    <View style={[t.flex1, t.itemsCenter, t.justifyCenter]}>
      <MapView
        style={[t.wFull, t.hFull]}
        region={mapRegion}
        provider={'google'}
      />
    </View>
  );
};

export default MapScreen;
