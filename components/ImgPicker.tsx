import React, { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '../theme';
import CustomButton from './ui/CustomButton';

const ImgPicker = ({
  onImageTaken,
}: {
  onImageTaken: (image: string) => void;
}) => {
  const { t } = useTheme();
  const [pickedImage, setPickedImage] = useState('');

  const verifyPermissions = async () => {
    const cameraPermissionResult =
      await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraPermissionResult.status !== 'granted' ||
      mediaLibraryPermissionResult.status !== 'granted'
    ) {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant camera and media library permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    if (!image.cancelled) {
      setPickedImage(image.uri);
      onImageTaken(image.uri);
    }
  };

  return (
    <View style={[t.itemsCenter, t.mB4]}>
      <View
        style={[
          t.wFull,
          t.h52,
          t.mB2,
          t.justifyCenter,
          t.itemsCenter,
          t.border,
          t.borderGray400,
        ]}
      >
        {!pickedImage ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image style={[t.wFull, t.hFull]} source={{ uri: pickedImage }} />
        )}
      </View>
      <CustomButton title="Take Image" onPress={takeImageHandler} />
    </View>
  );
};

export default ImgPicker;
