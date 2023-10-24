import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import first from "lodash/first";
import castArray from "lodash/castArray";
import { mergeById } from "@apps/shared/utils";
import { JelouApiV1 } from "@apps/shared/modules";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = [];

export const getOperators = createAsyncThunk("operators/getOperators", async (kiaData, { getState }) => {
    const { company, teams, teamScopes } = getState();
    const status = get(kiaData, "state", "");
    const teamId = get(kiaData, "TeamId", "");

    const filteredCategory = get(kiaData, "filteredCategory", "");
    const filteredAgencies = get(kiaData, "filteredAgencies", "");
    const filteredGroups = get(kiaData, "filteredGroups", "");
    const filteredCities = get(kiaData, "filteredCities", "");

    const cleanStoredParams = isEmpty(filteredCategory) && isEmpty(filteredAgencies) && isEmpty(filteredGroups) && isEmpty(filteredCities);

    const ifKia = get(company, "id") === 118;

    const { data } = await JelouApiV1.get(`/company/${company.id}/operators`, {
        params: {
            ...(!isEmpty(teamId) ? { teams: [teamId] } : !isEmpty(teamScopes) ? { teams: [teamScopes] } : !isEmpty(teams) ? { teams: [teams] } : {}),
            ...status,
            active: 1,
            ...(ifKia && !cleanStoredParams
                ? {
                      storedParams: {
                          ...(filteredCategory && filteredCategory.value !== "-1" ? { category: filteredCategory.label } : {}),
                          ...(filteredAgencies && filteredAgencies.value !== "-1" ? { agency: filteredAgencies.label } : {}),
                          ...(filteredGroups && filteredGroups.value !== "-1" ? { group: filteredGroups.label } : {}),
                          ...(filteredCities && filteredCities.value !== "-1" ? { city: filteredCities.label } : {}),
                      },
                  }
                : {}),
        },
    });

    if (!isEmpty(data)) {
        const operatorResult = data.map((operator) => {
            return { name: operator.names, ...operator };
        });
        return operatorResult;
    }

    return data;
});

export const getOperatorsPma = createAsyncThunk("operators/getOperatorsPma", async () => {
    const { data } = await JelouApiV1.get(`/operators`, { params: { active: 1 } }).catch((error) => {
        console.log(error);
    });
    return data;
});

export const operators = createSlice({
    name: "operators",
    initialState,
    reducers: {
        setOperators: (state, action) => {
            const users = action.payload;
            const operators = users.filter((result) => result.isOperator && result.state);
            return operators;
        },
        addOperators: (state, action) => {
            return action.payload;
        },
        deleteOperator: (state, action) => {
            return initialState;
        },
        updateOperators: (state, action) => {
            return mergeById(state, action.payload, "providerId");
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getOperators.fulfilled, (state, action) => {
            return action.payload;
        });
        builder.addCase(getOperatorsPma.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { setOperators, deleteOperator, updateOperators, addOperators } = operators.actions;

export default operators.reducer;
