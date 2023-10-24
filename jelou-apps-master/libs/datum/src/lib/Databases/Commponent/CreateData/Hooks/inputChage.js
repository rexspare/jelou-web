import dayjs from "dayjs";
import { TYPES_COLUMN } from "./../../../../constants";

export const INITIAL_STATE = {};

export function reducer(state, action) {
    switch (action.type) {
        case TYPES_COLUMN.double: {
            const data = { ...state, [action.name]: parseFloat(Number(action.value).toFixed(2)) };
            return data;
        }

        case TYPES_COLUMN.integer: {
            const data = { ...state, [action.name]: Number(action.value) };
            return data;
        }

        case TYPES_COLUMN.dateTime: {
            const data = {
                ...state,
                [action.name]: dayjs(action.value).format("YYYY-MM-DDTHH:mm:ss"),
            };
            return data;
        }

        case TYPES_COLUMN.time: {
            const data = {
                ...state,
                [action.name]: action.value + ":00",
            };
            return data;
        }

        case TYPES_COLUMN.boolean:
        case TYPES_COLUMN.keyword:
        case TYPES_COLUMN.text:
        case TYPES_COLUMN.date: {
            const data = { ...state, [action.name]: action.value };
            return data;
        }

        case TYPES_COLUMN.file: {
            const urlArray = state[action.name] ? state[action.name].split(",") : [];
            urlArray.push(action.value);
            const urlsToString = urlArray.join();

            const data = { ...state, [action.name]: urlsToString };
            return data;
        }

        case TYPES_COLUMN.file + "url": {
            const urlArray = state[action.name] ? state[action.name].split(",") : [];
            const urls = [...new Set(urlArray.concat(action.value))];
            const urlsToString = urls.join();

            const data = { ...state, [action.name]: urlsToString };
            return data;
        }

        case TYPES_COLUMN.file + "remove": {
            const urlArray = state[action.name] ? state[action.name].split(",") : [];
            const urlFilters = urlArray.filter((url) => url !== action.value);
            const urlsToString = urlFilters.join();

            const data = { ...state, [action.name]: urlsToString };
            return data;
        }

        default:
            return state;
    }
}
