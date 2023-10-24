import * as Sentry from "@sentry/react";
import { DashboardServer, JelouApiV1 } from "@apps/shared/modules";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import isObject from "lodash/isObject";
import get from "lodash/get";
import omit from "lodash/omit";
import { setSession } from "./session";
import { setUserSession } from "./userSession";

const initialState = !!localStorage.jwt;

export const logInUser = createAsyncThunk("sessionActionsPma/logInUser", async (credentials, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    DashboardServer.post(`/auth/login`, credentials).then(({ data: resp }) => {
        const { data } = resp;
        localStorage.setItem("jwt", data.token);
        try {
            window.JSBridge.sendTokenNative(data.User.providerId, data.token); // Android
        } catch (error) {
            console.log("Error on native Android:", error);
        }

        try {
            window.webkit.messageHandlers.jsMessageHandler.postMessage({ userId: data.User.providerId, token: data.token }); //iOS
        } catch (error) {
            console.log("Error on native IOS:", error);
        }

        // Set headers for axios
        axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
        axios.defaults.headers.common["Accept-Language"] = "es";
        axios.defaults.headers.common["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
        localStorage.setItem("operator", JSON.stringify(omit(data.User, ["Company"])));
        dispatch(setUserSession(data.user));
        dispatch(setSession());

        return { status: true, user: data.User };
    });
});

export const logOutUser = createAsyncThunk("sessionActionsPma/logOutUser", async (user, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const sessionId = localStorage.getItem("session");
    const { userSession } = thunkAPI.getState();

    await DashboardServer.post(`/auth/logout`, {
        sessionId,
        ...(get(userSession, "isOperator") ? { logoutOperator: true } : {}),
    });

    dispatch(setUserSession());
    localStorage.removeItem("jwt");
    localStorage.removeItem("operator");
    localStorage.removeItem("pusherTransportTLS");
});

export const sendToken = createAsyncThunk("sessionActionsPma/sendToken", async (token) => {
    const { payload, botId } = token;
    JelouApiV1.post(`//bots/${botId}/token/assign`, payload)
        .then(({ data }) => {
            localStorage.removeItem("storedUrl");
            return data;
        })
        .catch((err) => {
            const responseData = get(err, "response.data");
            Sentry.captureException(new Error(isObject(responseData) ? JSON.stringify(responseData) : responseData));
            return { data: { message: "Ocurrió algún problema con el enlace." } };
        });
});
``;

export const sessionActionsPma = createSlice({
    name: "sessionActionsPma",
    initialState,
    reducers: {
        setUrl: (state, action) => {
            localStorage.setItem("storedUrl", action.payload);
        },
    },
});

export const { setUrl } = sessionActionsPma.actions;

export default sessionActionsPma.reducer;
