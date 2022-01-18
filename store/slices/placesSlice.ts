import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as FileSystem from 'expo-file-system';

import { Place } from '../../types/place';

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
    const fileName = place.image.split('/').pop();
    if (FileSystem.documentDirectory && fileName) {
      const newPath = FileSystem.documentDirectory + fileName;
      try {
        await FileSystem.moveAsync({
          from: place.image,
          to: newPath,
        });
        const newPlace: Place = {
          id: new Date().toString(),
          title: place.title,
          image: newPath,
        };
        return newPlace;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }
);

export const placesSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addPlace.fulfilled, (state, action) => {
      if (action.payload) {
        return {
          places: state.places.concat(action.payload),
        };
      } else {
        return state;
      }
    });
  },
});

export default placesSlice.reducer;
