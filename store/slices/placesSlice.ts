import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Place } from '../../types/place';

type InitialState = {
  places: Place[];
};

const initialState: InitialState = {
  places: [],
};

export const placesSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addPlace: (state, action: PayloadAction<string>) => {
      const newPlace: Place = {
        id: new Date().toString(),
        title: action.payload,
      };
      return {
        places: state.places.concat(newPlace),
      };
    },
  },
});

export const { addPlace } = placesSlice.actions;

export default placesSlice.reducer;
