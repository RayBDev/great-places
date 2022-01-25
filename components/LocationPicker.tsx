import React, { useState } from 'react';
import { Text, View, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';

import { lightColors, useTheme } from '../theme';
import CustomButton from './ui/CustomButton';
import MapPreview from './MapPreview';
import { RootStackParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const LocationPicker = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, keyof RootStackParamList>) => {
  const { t } = useTheme();
  type LocationData = {
    lat: number;
    lng: number;
  };
  const [pickedLocation, setPickedLocation] = useState<LocationData>();
  const [isFetching, setIsFetching] = useState(false);

  const verifyPermissions = async () => {
    const locationForegroundPermissionResult =
      await Location.requestForegroundPermissionsAsync();

    const locationBackgroundPermissionResult =
      await Location.requestBackgroundPermissionsAsync();

    if (
      locationForegroundPermissionResult.status !== 'granted' &&
      locationBackgroundPermissionResult.status !== 'granted'
    ) {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant location permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync();
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (err) {
      Alert.alert(
        'Could not fetch location!',
        'Please try again later or pick a location on the map.',
        [{ text: 'Okay' }]
      );
    }
    setIsFetching(false);
  };

  const pickOnMapHandler = () => {
    navigation.navigate('Map');
  };

  return (
    <View style={[t.mB4]}>
      <MapPreview
        style={[t.mB3, t.wFull, t.h36, t.borderGray400, t.border]}
        location={pickedLocation}
        onPress={pickOnMapHandler}
      >
        {isFetching ? (
          <ActivityIndicator size="large" color={lightColors.primary} />
        ) : (
          <Text>No location chosen yet</Text>
        )}
      </MapPreview>
      <View style={[t.flexRow, t.justifyBetween, t.wFull]}>
        <CustomButton title="Get User Location" onPress={getLocationHandler} />
        <CustomButton title="Pick On Map" onPress={pickOnMapHandler} />
      </View>
    </View>
  );
};

export default LocationPicker;
