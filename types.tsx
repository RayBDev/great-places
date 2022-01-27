/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Navigator Param Types
export type RootStackParamList = {
  Places: undefined;
  PlaceDetail: {
    /** The title of the place to display on the place detail screen */
    placeTitle: string;
    /** The ID of the place that will be displayed on the place detail screen */
    placeId: number;
  };
  NewPlace:
    | {
        pickedLocation: {
          /** The latitude of the location */
          lat: number;
          /** The longitude of the location */
          lng: number;
        };
      }
    | undefined;
  Map: undefined;
  NotFound: undefined;
};

// Navigator Prop Types
export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
