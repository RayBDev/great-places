import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as FileSystem from 'expo-file-system';

import { Place } from '../../types/place';
import { fetchPlaces, insertPlace } from '../../helpers/db';

type InitialState = {
  places: Place[];
};

const initialState: InitialState = {
  places: [],
};

// Thunks
export const addPlace = createAsyncThunk(
  'cart/addPlace',
  async (place: Omit<Place, 'id'>) => {
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
          'Dummy Address',
          15.6,
          12.3
        );

        if (dbResult.insertId) {
          return {
            id: dbResult.insertId,
            title: place.title,
            imageUri: newPath,
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
              };
            }),
          };
        }
      });
  },
});

export default placesSlice.reducer;
