import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as FileSystem from 'expo-file-system';

import { Place } from '../../types/place';
import { fetchPlaces, insertPlace } from '../../helpers/db';
import vars from '../../env';

type InitialState = {
  places: Place[];
};

const initialState: InitialState = {
  places: [],
};

// Thunks
export const addPlace = createAsyncThunk(
  'cart/addPlace',
  async (place: Omit<Place, 'id' | 'address'>) => {
    const response = await fetch(
      `http://www.mapquestapi.com/geocoding/v1/reverse?key=${vars.mapQuestApi}&location=${place.lat},${place.lng}`
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    if (!resData.results) {
      throw new Error('Something went wrong!');
    }

    const address = `${resData.results[0].locations[0].street}, ${resData.results[0].locations[0].adminArea5}, ${resData.results[0].locations[0].adminArea3} ${resData.results[0].locations[0].postalCode}, ${resData.results[0].locations[0].adminArea1}`;

    const fileName = place.imageUri.split('/').pop();
    if (FileSystem.documentDirectory && fileName) {
      const newPath = FileSystem.documentDirectory + fileName;
      try {
        await FileSystem.moveAsync({
          from: place.imageUri,
          to: newPath,
        });

        const dbResult = await insertPlace(
          place.title,
          newPath,
          address,
          place.lat,
          place.lng
        );

        if (dbResult.insertId) {
          return {
            id: dbResult.insertId,
            title: place.title,
            imageUri: newPath,
            address: address,
            lat: place.lat,
            lng: place.lng,
          };
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }
);

export const setPlaces = createAsyncThunk('cart/setPlaces', async () => {
  try {
    const dbResult = await fetchPlaces();

    return {
      places: dbResult.rows._array,
    };
  } catch (err) {
    throw err;
  }
});

export const placesSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPlace.fulfilled, (state, action) => {
        if (action.payload) {
          return {
            places: state.places.concat(action.payload),
          };
        } else {
          return state;
        }
      })
      .addCase(setPlaces.fulfilled, (state, action) => {
        if (action.payload) {
          return {
            places: action.payload.places.map((place) => {
              return {
                id: place.id,
                title: place.title,
                imageUri: place.imageUri,
                address: place.address,
                lat: place.lat,
                lng: place.lng,
              };
            }),
          };
        }
      });
  },
});

export default placesSlice.reducer;
