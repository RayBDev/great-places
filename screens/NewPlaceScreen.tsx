import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import ImgPicker from '../components/ImgPicker';
import LocationPicker from '../components/LocationPicker';
import CustomButton from '../components/ui/CustomButton';
import { useAppDispatch } from '../hooks/reduxHooks';
import { addPlace } from '../store/slices/placesSlice';
import { useTheme } from '../theme';
import { RootStackScreenProps } from '../types';
import { Location } from '../types/place';

const NewPlaceScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'NewPlace'>) => {
  const { t } = useTheme();

  const [titleValue, setTitleValue] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  const dispatch = useAppDispatch();

  const titleChangeHandler = (text: string) => {
    setTitleValue(text);
  };

  const imageTakenHandler = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const locationPickedHandler = (location: Location) => {
    setSelectedLocation(location);
  };

  const savePlaceHandler = () => {
    if (titleValue && selectedImage && selectedLocation) {
      dispatch(
        addPlace({
          title: titleValue,
          imageUri: selectedImage,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        })
      );
      navigation.goBack();
    }
  };

  return (
    <ScrollView>
      <View style={[t.m7]}>
        <Text style={[t.textLg, t.mB4, t.fontSans]}>Title</Text>
        <TextInput
          style={[t.borderB, t.borderMuted, t.mB4, t.pY2, t.pX1]}
          onChangeText={titleChangeHandler}
          value={titleValue}
        />
        <ImgPicker onImageTaken={imageTakenHandler} />
        <LocationPicker
          navigation={navigation}
          route={route}
          onLocationPicked={locationPickedHandler}
        />
        <CustomButton title="Save Place" onPress={savePlaceHandler} />
      </View>
    </ScrollView>
  );
};

export default NewPlaceScreen;
