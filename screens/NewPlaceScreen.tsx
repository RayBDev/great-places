import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import CustomButton from '../components/ui/CustomButton';
import { useAppDispatch } from '../hooks/reduxHooks';
import { addPlace } from '../store/slices/placesSlice';
import { useTheme } from '../theme';
import { RootStackScreenProps } from '../types';

const NewPlaceScreen = ({ navigation }: RootStackScreenProps<'NewPlace'>) => {
  const { t } = useTheme();
  const [titleValue, setTitleValue] = useState('');
  const dispatch = useAppDispatch();

  const titleChangeHandler = (text: string) => {
    setTitleValue(text);
  };

  const savePlaceHandler = () => {
    dispatch(addPlace(titleValue));
    navigation.goBack();
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
        <CustomButton title="Save Place" onPress={savePlaceHandler} />
      </View>
    </ScrollView>
  );
};

export default NewPlaceScreen;
