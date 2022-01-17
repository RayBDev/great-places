import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, Text } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, RootStackScreenProps } from '../types';
import { useTheme } from '../theme';
import LinkingConfiguration from './LinkingConfiguration';
import NotFoundScreen from '../screens/NotFoundScreen';
import PlacesListScreen from '../screens/PlacesListScreen';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';
import NewPlaceScreen from '../screens/NewPlaceScreen';
import MapScreen from '../screens/MapScreen';
import CustomHeaderButton from '../components/ui/HeaderButton';

const Navigation = () => {
  const { navTheme } = useTheme();

  return (
    <NavigationContainer
      theme={navTheme}
      linking={LinkingConfiguration}
      fallback={<Text>Loading...</Text>}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { t } = useTheme();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerTitleStyle: t.fontSansBold,
        headerBackTitleStyle: t.fontSans,
      }}
    >
      <RootStack.Screen
        name="Places"
        component={PlacesListScreen}
        options={({ navigation }: RootStackScreenProps<'Places'>) => ({
          headerTitle: 'All Places',
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title=" Place"
                iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
                onPress={() => {
                  navigation.navigate('NewPlace');
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
      <RootStack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
      <RootStack.Screen
        name="NewPlace"
        component={NewPlaceScreen}
        options={{ headerTitle: 'Add Place' }}
      />
      <RootStack.Screen name="Map" component={MapScreen} />
      <RootStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ headerTitle: 'Oops!' }}
      />
    </RootStack.Navigator>
  );
};

export default Navigation;
