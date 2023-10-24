import { useQuery } from "@tanstack/react-query";

import { getAllOperatorsForCompany } from "@builder/services/operators";
import { getAllTeamForCompany } from "@builder/services/teams";

export const OPERATORS_QUERY_KEY = "allOperators";
export const TEAMS_QUERY_KEY = "allTeams";

type Props = {
    companyId: number;
};

export function useQueryTeamsPMANode({ companyId }: Props) {
    return useQuery([TEAMS_QUERY_KEY, companyId], () => getAllTeamForCompany(companyId), {
        enabled: Boolean(companyId),
        refetchOnWindowFocus: false,
    });
}

export function useQueryOperatorsPMANode({ companyId }: Props) {
    return useQuery([OPERATORS_QUERY_KEY, companyId], () => getAllOperatorsForCompany(companyId), {
        enabled: Boolean(companyId),
        refetchOnWindowFocus: false,
    });
}
