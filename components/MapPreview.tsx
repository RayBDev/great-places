import React from 'react';
import { Image, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import vars from '../env';
import { useTheme } from '../theme';

type Props = {
  /** The location details of the location including latitude and longitude */
  location:
    | {
        /** The latitude of the location */
        lat: number;
        /** The longitude of the location */
        lng: number;
      }
    | undefined;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

const MapPreview = ({ location, children, style, onPress }: Props) => {
  const { t } = useTheme();

  let imagePreviewUrl;

  if (location) {
    imagePreviewUrl = `https://www.mapquestapi.com/staticmap/v5/map?&key=${vars.mapQuestApi}&center=${location.lat},${location.lng}&zoom=14&size=400,200&type=map&defaultMarker=marker-7B0099`;
  }

  return (
    <TouchableOpacity
      style={[t.itemsCenter, t.justifyCenter, style]}
      onPress={onPress}
    >
      {location ? (
        <Image style={[t.wFull, t.hFull]} source={{ uri: imagePreviewUrl }} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default MapPreview;
