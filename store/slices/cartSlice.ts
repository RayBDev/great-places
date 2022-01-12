import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  items: {
    [key: string]: string;
  };
  totalAmount: number;
};

const initialState: InitialState = {
  items: {},
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<string>) => {
      return {
        ...state,
      };
    },
  },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
