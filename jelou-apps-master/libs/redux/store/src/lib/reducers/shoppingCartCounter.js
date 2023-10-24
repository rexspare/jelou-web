import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const shoppingCartCounter = createSlice({
    name: "shoppingCartCounter",
    initialState,
    reducers: {
        showCounter: (state, action) => {
            const payload = action.payload;
            return [...state, { id: payload, qty: 1, show: true }];
        },
        restCounter: (state, action) => {
            const isProductExist = state.find((item) => item.id === action.payload);
            if (isProductExist && isProductExist.qty > 1) {
                const index = state.findIndex((item) => item.id === action.payload);
                state[index].qty = state[index].qty - 1;
                return state;
            }
            if (isProductExist && isProductExist.qty === 1) return state.filter((item) => item.id !== action.payload);
        },
        plusCounter: (state, action) => {
            const index = state.findIndex((item) => item.id === action.payload);
            state[index].qty = state[index].qty + 1;
            return state;
        },
        restartCounter: (state, action) => {
            return initialState;
        },
    },
});

export const { showCounter, restCounter, plusCounter, restartCounter } = shoppingCartCounter.actions;

export default shoppingCartCounter.reducer;
