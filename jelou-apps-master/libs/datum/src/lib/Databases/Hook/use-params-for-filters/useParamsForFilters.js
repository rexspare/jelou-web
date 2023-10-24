import { useReducer } from "react";

const INITIAL_STATE = {};

const ACTIONS = {
    SET_QUERY_SEARCH: "SET_QUERY_SEARCH",
    TO_RESET_SEARCH: "RESET_SEARCH",
    SET_DATE: "SET_DATE",
    TO_RESET_DATE: "RESET_DATE",
    SET_SELECT: "SET_SELECT",
    TO_RESET_SELECT: "RESET_SELECT",
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_QUERY_SEARCH: {
            const { searchBy = false, search } = action;
            const enableGlobalSearch = Boolean(searchBy) === false;

            return {
                ...state,
                search: search,
                globalSearch: enableGlobalSearch,
                ...(enableGlobalSearch ? {} : { searchBy }),
            };
        }
        case ACTIONS.TO_RESET_SEARCH: {
            const { searchBy, search, globalSearch, ...rest } = state;
            return rest;
        }
        case ACTIONS.SET_DATE: {
            const { dateFrom, dateTo, key } = action;

            return {
                ...state,
                [`${key}From`]: dateFrom,
                [`${key}To`]: dateTo,
            };
        }
        case ACTIONS.TO_RESET_DATE: {
            const { [`${action.key}From`]: _, [`${action.key}To`]: __, ...rest } = state;
            return rest;
        }
        case ACTIONS.SET_SELECT: {
            const { key, value } = action;

            return {
                ...state,
                [key]: value,
            };
        }
        case ACTIONS.TO_RESET_SELECT: {
            const { [action.key]: _, ...rest } = state;
            return rest;
        }
        default:
            return state;
    }
}

export function useParamsForFilters() {
    const [state, dispatchForFilters] = useReducer(reducer, INITIAL_STATE);
    return { state, dispatchForFilters };
}

export const setSearchAction = ({ search, searchBy }) => ({
    type: ACTIONS.SET_QUERY_SEARCH,
    search,
    searchBy,
});

export const resetSearchAction = () => ({
    type: ACTIONS.TO_RESET_SEARCH,
});

export const setDateFilterAction = ({ key, dateFrom, dateTo }) => ({
    type: ACTIONS.SET_DATE,
    dateFrom,
    dateTo,
    key,
});

export const resetDateFilterAction = ({ key }) => ({
    type: ACTIONS.TO_RESET_DATE,
    key,
});

export const setSelectFilterAction = ({ key, value }) => ({
    type: ACTIONS.SET_SELECT,
    key,
    value,
});

export const resetSelectFilterAction = ({ key }) => ({
    type: ACTIONS.TO_RESET_SELECT,
    key,
});
