import { UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import get from "lodash/get";

import { PERSONAL_VARIABLES_KEY_RQ, SYSTEM_VARIABLES_KEY_RQ } from "@builder/constants.local";
import * as VariablesService from "@builder/services/variables";
import { CreateNewVariableParams, Properties, Variable, VariableType } from "../models/variables";

type Props = {
    workflowId: string;
    enableQuery: boolean;
};

type VariablesTypes = {
    systemVariables: Variable[];
    personalVariables: Variable[];
    isLoadingVariables: boolean;
    createNewVariableMutation: UseMutateFunction<Variable, unknown, CreateNewVariableParams, unknown>;
    deleteVariableMutation: UseMutateFunction<void, unknown, string, unknown>;
    refreshSystemVariables: () => void;
    refreshPersonalVariables: () => void;
    syncSystemVariables: () => Promise<Variable[]>;
};

export enum VariablesName {
    JELOU_PAY_APP_ID = "JELOU_PAY_APP",
    JELOU_PAY_GATEWAY_ID = "JELOU_PAY_GATEWAY",
    JELOU_PAY_BEARER_TOKEN = "JELOU_PAY_TOKEN",
    JELOU_ECOMMERCE_APP_ID = "JELOU_ECOMMERCE_APP",
}

export default function useVariables({ workflowId, enableQuery }: Props): VariablesTypes {
    const properties = useSelector<{ company: { properties: Properties } }>((state) => state.company.properties) as Properties;

    const queryClient = useQueryClient();

    const refreshSystemVariables = useCallback(() => {
        if (!workflowId) return;

        queryClient.invalidateQueries([SYSTEM_VARIABLES_KEY_RQ, workflowId]);
    }, [workflowId]);

    const refreshPersonalVariables = useCallback(() => {
        if (!workflowId) return;

        queryClient.invalidateQueries([PERSONAL_VARIABLES_KEY_RQ, workflowId]);
    }, [workflowId]);

    const { data: systemVariables, isLoading: systemVariablesLoading } = useQuery(
        [SYSTEM_VARIABLES_KEY_RQ, workflowId],
        () => VariablesService.getVariablesByTypes(String(workflowId), [VariableType.System]),
        {
            enabled: enableQuery,
            refetchOnWindowFocus: false,
        }
    );

    const { data: personalVariables, isLoading: personalVariablesLoading } = useQuery(
        [PERSONAL_VARIABLES_KEY_RQ, workflowId],
        () => VariablesService.getVariablesByTypes(workflowId, [VariableType.Secret, VariableType.Default]),
        {
            enabled: enableQuery,
            refetchOnWindowFocus: false,
        }
    );

    const { mutate: createNewVariableMutation } = useMutation((params: CreateNewVariableParams) => VariablesService.createNewVariable(String(workflowId), params));
    const { mutate: deleteVariableMutation } = useMutation((variableId: string) => VariablesService.deleteVariable(String(workflowId), variableId));

    const syncSystemVariables = useCallback(() => {
        const jelouEcommerceAppId = get(properties, "shopCredentials.jelou_ecommerce.app_id", "");
        const jelouPayAppId = get(properties, "shopCredentials.jelou_pay.app_id", "");
        const bearerToken = get(properties, "shopCredentials.jelou_pay.bearer_token", "");
        const gatewayId = get(properties, "shopCredentials.jelou_pay.gateway_id", "");

        const VARIABLES_NAME = [
            { name: VariablesName.JELOU_ECOMMERCE_APP_ID, value: jelouEcommerceAppId, type: VariableType.System },
            { name: VariablesName.JELOU_PAY_APP_ID, value: jelouPayAppId, type: VariableType.System },
            { name: VariablesName.JELOU_PAY_BEARER_TOKEN, value: bearerToken, type: VariableType.System },
            { name: VariablesName.JELOU_PAY_GATEWAY_ID, value: gatewayId, type: VariableType.System },
        ] as CreateNewVariableParams[];

        const systemVariablesNames = systemVariables?.map((variable) => variable.name);
        const newSystemVariables = VARIABLES_NAME.filter((rawVariable) => !systemVariablesNames?.includes(rawVariable.name) && rawVariable.value);
        const promises = newSystemVariables.map((variable) => VariablesService.createNewVariable(workflowId, variable));

        return Promise.all(promises);
    }, [properties.shopCredentials, systemVariables, workflowId]);

    return {
        systemVariables: systemVariables as Variable[],
        personalVariables: personalVariables as Variable[],
        isLoadingVariables: personalVariablesLoading || systemVariablesLoading,
        refreshPersonalVariables,
        refreshSystemVariables,
        createNewVariableMutation,
        deleteVariableMutation,
        syncSystemVariables,
    };
}
