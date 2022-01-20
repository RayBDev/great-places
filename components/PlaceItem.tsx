import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '../theme';

type Props = {
  /** The title of the location */
  title: string;
  /** The address of the location */
  address: string;
  /** Image URI */
  imageUri: string;
  onSelect: () => void;
};

const PlaceItem = ({ onSelect, title, address, imageUri }: Props) => {
  const { t } = useTheme();
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[t.borderMuted, t.borderB, t.pY4, t.pX8, t.flexRow, t.itemsCenter]}
    >
      <Image
        source={{ uri: imageUri }}
        style={[t.w17, t.h17, t.roundedLg, t.bgInfo, t.borderPrimary, t.border]}
      />
      <View style={[t.mL6, t.w64, t.justifyCenter, t.itemsCenter]}>
        <Text style={[t.textGray900, t.textLg, t.mB1]}>{title}</Text>
        <Text style={[t.textGray700, t.textBase]}>{address}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PlaceItem;
