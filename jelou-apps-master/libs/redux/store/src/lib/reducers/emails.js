import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import concat from "lodash/concat";
import compact from "lodash/compact";
import isEmpty from "lodash/isEmpty";
import { deleteById, mergeById, updateById } from "@apps/shared/utils";
import { setCurrentEmail } from "./currentEmail";

const initialState = [];

export const addEmail = createAsyncThunk("emails/addEmail", async (email, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const { emails, currentEmail } = thunkAPI.getState();

    if (isEmpty(currentEmail)) {
        dispatch(setCurrentEmail(email));
    }
    const updatedEmails = compact(mergeById(emails, email, "_id"));
    dispatch(setEmails(updatedEmails));
    return updatedEmails;
});

const emails = createSlice({
    name: "emails",
    initialState,
    reducers: {
        addEmails: (state, action) => {
            let emails = state.push(action.payload);
            return emails;
        },
        setEmails: (state, action) => {
            return action.payload;
        },
        updateEmail: (state, action) => {
            return compact(updateById(state, action.payload, "_id"));
        },
        updateEmails: (state, action) => {
            return concat(state, action.payload);
        },
        deleteEmails: (state, action) => {
            return initialState;
        },
        deleteEmail: (state, action) => {
            const roomId = action.payload;
            const currentEmails = current(state);

            return compact(deleteById(currentEmails, roomId, "_id"));
        },
    },
});

export const { addEmails, setEmails, updateEmail, updateEmails, deleteEmails, deleteEmail } = emails.actions;
export default emails.reducer;
