import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const isOperatorOfflineModal = createSlice({
    name: "isOperatorOfflineModal",
    initialState,
    reducers: {
        setShowDisconnectedModal: (state, action) => {
            const payload = action.payload;
            return payload;
        },
    },
});

export const { setShowDisconnectedModal } = isOperatorOfflineModal.actions;

export default isOperatorOfflineModal.reducer;
