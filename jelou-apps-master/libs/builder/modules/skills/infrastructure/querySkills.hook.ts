import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { SkillsRepository } from "@builder/modules/skills/infrastructure/skills.repository";
import { SKILLS_QUERY_KEY } from "@builder/pages/constants.home";

const skillsRepository = new SkillsRepository();

export function useQuerySkills() {
    const queryClient = useQueryClient();

    const {
        data = [],
        isLoading,
        isError,
        error,
    } = useQuery(SKILLS_QUERY_KEY, () => skillsRepository.getAll(), {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const invalidateSkills = () => {
        queryClient.invalidateQueries(SKILLS_QUERY_KEY);
    };

    return {
        data,
        isLoading,
        isError,
        error,
        invalidateSkills,
    };
}

export function useQueryOneSkill() {
    const { serviceId } = useParams();
    const queryClient = useQueryClient();

    const ONE_QUERY_KEY = [SKILLS_QUERY_KEY, serviceId];
    const { data, isLoading, isError, error } = useQuery(ONE_QUERY_KEY, () => skillsRepository.getOne(Number(serviceId)), {
        enabled: Boolean(serviceId),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const invalidateSkills = () => {
        queryClient.invalidateQueries(ONE_QUERY_KEY);
    };

    return {
        data,
        isLoading,
        isError,
        error,
        invalidateSkills,
    };
}
