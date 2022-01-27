import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import MapPreview from '../components/MapPreview';
import { useAppSelector } from '../hooks/reduxHooks';
import { useTheme } from '../theme';
import { RootStackScreenProps } from '../types';

const PlaceDetailScreen = ({
  route,
  navigation,
}: RootStackScreenProps<'PlaceDetail'>) => {
  const { t } = useTheme();

  const placeId = route.params.placeId;
  const selectedPlace = useAppSelector((state) =>
    state.places.places.find((place) => place.id === placeId)
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.placeTitle,
    });
  }, [navigation]);

  const selectedLocation = {
    lat: selectedPlace?.lat!,
    lng: selectedPlace?.lng!,
  };

  const showMapHandler = () => {
    navigation.navigate('Map', {
      readonly: true,
      initialLocation: selectedLocation,
    });
  };

  return (
    <ScrollView contentContainerStyle={[t.itemsCenter]}>
      <Image
        style={[t.h7_20, t.minH75, t.wFull, t.bgGray400]}
        source={{ uri: selectedPlace?.imageUri }}
      />
      <View
        style={[
          t.mY5,
          t.w9_10,
          t.maxW87,
          t.justifyCenter,
          t.itemsCenter,
          t.shadow2xl,
          t.bgWhite,
          t.roundedSm,
        ]}
      >
        <View style={[t.p5]}>
          <Text style={[t.textPrimary, t.textCenter, t.fontSans]}>
            {selectedPlace?.address}
          </Text>
        </View>
        <MapPreview
          style={[t.wFull, t.maxW87, t.h75, t.roundedBSm]}
          location={selectedLocation}
          onPress={showMapHandler}
        />
      </View>
    </ScrollView>
  );
};

export default PlaceDetailScreen;
