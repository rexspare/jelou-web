import { DashboardServer } from "@apps/shared/modules";
import get from "lodash/get";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { setPermissions } from "./permissions";
import { addTeams } from "./teams";
import { addTeamScopes } from "./teamScopes";
import { setStatusOperator } from "./statusOperator";
import dayjs from "dayjs";

const initialState = {};

export const getUserSession = createAsyncThunk("userSession/getUserSession", async (type, thunkAPI, signal) => {
    const dispatch = thunkAPI.dispatch;
    const {
        data: { data },
    } = await DashboardServer.get(`/auth/me`).catch((error) => {
        console.log("getUserSession", error);
    });
    const operatorActive = data?.operatorActive;
    const monitorAllTeams = get(data, "monitorAllTeams", false);

    dispatch(setPermissions(get(data, "permissions", [])));
    dispatch(addTeamScopes(monitorAllTeams ? [] : get(data, "teamScopes", [])));
    dispatch(addTeams(get(data, "teams", [])));
    dispatch(setStatusOperator(operatorActive));
    try {
        dayjs.tz.setDefault(data?.timezone);
    } catch (err) {
        console.log("Error ", err);
    }
    return data;
});

export const userSession = createSlice({
    name: "userSession",
    initialState,
    reducers: {
        setUserSession: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        updateUserSession: (state, action) => {
            const payload = action.payload;
            return { ...current(state), ...payload };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUserSession.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { setUserSession, updateUserSession } = userSession.actions;

export default userSession.reducer;
