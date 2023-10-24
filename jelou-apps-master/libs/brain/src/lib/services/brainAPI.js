import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useParams } from "react-router-dom";

import { JelouApiV1 } from "@apps/shared/modules";
import { WorkflowAPI } from "libs/builder/src/libs/builder.http";
import { TesterRepository } from "../Components/TesterChat/conversationTester/TesterRespository";
import { HTTP_BRAIN, HTTP_BRAIN_KNOWLEGE } from "../module/http-brain";
import { useFileUploader } from "./hooks";

/** Brains (Datastores) */

export const useDataStores = ({ itemsPerPage, pageNumber }) => {
    const queryClient = useQueryClient();
    const KEY = ["datastores", itemsPerPage, pageNumber];

    const revalidate = () => {
        queryClient.invalidateQueries(KEY);
    };

    const getDataStores = async ({ limit, page }) => {
        const { data } = await HTTP_BRAIN.get("/brains", {
            params: {
                limit,
                page,
            },
        });

        return {
            data: get(data, "data", []),
            meta: get(data, "meta", {}),
        };
    };

    const query = useQuery(KEY, () => getDataStores({ limit: itemsPerPage, page: pageNumber }));

    return {
        ...query,
        revalidate,
    };
};

export function useCreateDatastore({ datastoreInfo }) {
    const queryClient = useQueryClient();

    const createBrain = async () => {
        const { data } = await HTTP_BRAIN.post("/brains", datastoreInfo);
        return data?.data ?? data;
    };

    return useMutation(createBrain, {
        onSuccess: () => {
            queryClient.invalidateQueries(["datastores"]);
        },
    });
}

export function useUpdateDatastore({ datastoreId, datastoreInfo }) {
    const queryClient = useQueryClient();

    const updateBrain = async () => {
        const { data } = await HTTP_BRAIN.put(`/brains/${datastoreId}`, datastoreInfo);
        return data?.data ?? data;
    };

    return useMutation(updateBrain, {
        onSuccess: () => {
            queryClient.invalidateQueries(["datastores", datastoreId]);
        },
    });
}

export function useDeleteDatastore({ datastoreId }) {
    const queryClient = useQueryClient();

    const deleteBrain = async () => {
        const { data } = await HTTP_BRAIN.delete(`/brains/${datastoreId}`);
        return data?.data ?? data;
    };

    return useMutation(deleteBrain, {
        onSuccess: () => {
            queryClient.invalidateQueries(["datastores", datastoreId]);
        },
    });
}

export const updateDatastoreSettings = async ({ datastoreId, settings }) => {
    const { data } = await HTTP_BRAIN.patch(`/brains/${datastoreId}`, settings);
    return data.data;
};

/** Knowledges (Datasources) */

export function useDatasources({ datastoreId, fetchData, limit, page }) {
    const getKnowledges = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.get(`/brains/${datastoreId}/knowledge`, {
            params: {
                limit,
                page,
            },
        });
        return data;
    };

    return useQuery(["datasources", datastoreId, limit, page], getKnowledges, {
        enabled: fetchData,
        refetchInterval: 5000,
    });
}

export function useOneDatasource() {
    const { datastoreId, datasourceId } = useParams();

    const getKnowledge = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.get(`/brains/${datastoreId}/knowledge/${datasourceId}`);
        return data.data;
    };

    return useQuery(["datasource", datastoreId, datasourceId], getKnowledge, {
        refetchOnWindowFocus: false,
    });
}

export function useCreateDatasource({ datastoreId, datasourceInfo }) {
    const queryClient = useQueryClient();

    const createKnowledge = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.post(`/brains/${datastoreId}/knowledge`, datasourceInfo);
        return data?.data ?? data;
    };

    return useMutation(createKnowledge, {
        onSuccess: () => {
            queryClient.invalidateQueries(["datasources", datastoreId]);
        },
    });
}

export function useUpdateDatasource({ datastoreId, datasourceId, newDatasourceInfo }) {
    const queryClient = useQueryClient();

    const updateKnowledge = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.patch(`/brains/${datastoreId}/knowledge/${datasourceId}`, newDatasourceInfo);

        return data?.data ?? data;
    };

    return useMutation(updateKnowledge, {
        onSuccess: () => {
            queryClient.invalidateQueries(["datasources", datastoreId, datasourceId]);
            queryClient.invalidateQueries(["datasource", datastoreId, datasourceId]);
        },
    });
}

export function useDeleteDatasource({ datastoreId, datasourceId }) {
    const queryClient = useQueryClient();

    const deleteKnowledge = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.delete(`/brains/${datastoreId}/knowledge/${datasourceId}`);

        return data?.data ?? data;
    };

    return useMutation(deleteKnowledge, {
        onSuccess: () => {
            queryClient.invalidateQueries(["datasources", datastoreId, datasourceId]);
        },
    });
}

/** Skills */

const getSkills = async ({ apiKey }) => {
    const { data } = await WorkflowAPI.get(`/skills?disablePagination=true`, {
        headers: {
            "X-Api-Key": apiKey,
        },
    });
    return data;
};
export function useSkills({ limit, page, apiKey }) {
    return useQuery(["skills", limit, page], () => getSkills({ apiKey }), {
        refetchOnWindowFocus: false,
    });
}

export function useSkill({ apiKey, id }) {
    const getSkill = async () => {
        const { data } = await WorkflowAPI.get(`/skills/${id}`, {
            headers: {
                "X-Api-Key": apiKey,
            },
        });
        return data.data;
    };

    return useQuery(["skill", apiKey, id], getSkill, {
        enabled: !isEmpty(apiKey) && !isEmpty(id),
        refetchOnWindowFocus: false,
    });
}

/** Channels */

const getChannels = async ({ datastoreId, limit, page }) => {
    const { data } = await HTTP_BRAIN_KNOWLEGE.get(`/brains/${datastoreId}/channels`, {
        params: {
            limit,
            page,
        },
    });
    return data;
};
export function useChannels({ datastoreId, limit, page }) {
    return useQuery(["channels", datastoreId, limit, page], () => getChannels({ datastoreId, limit, page }), {
        enabled: !isEmpty(datastoreId),
        refetchOnWindowFocus: false,
    });
}

export function useChannel({ datastoreId, channelId }) {
    const getChannel = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.get(`/brains/${datastoreId}/channels/${channelId}`);
        return data.data;
    };

    return useQuery(["channel", datastoreId, channelId], getChannel, {
        enabled: !isEmpty(datastoreId) && !isEmpty(channelId),
        refetchOnWindowFocus: false,
    });
}

export function useCreateChannel({ datastoreId, body }) {
    const queryClient = useQueryClient();

    const createChannel = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.post(`/brains/${datastoreId}/channels`, body);
        return data?.data ?? data;
    };

    return useMutation(createChannel, {
        onSuccess: () => {
            queryClient.invalidateQueries(["channels"], datastoreId);
        },
    });
}

export function useUpdateChannel({ datastoreId, channelId }) {
    const queryClient = useQueryClient();

    // const updateKnowledge = async (body) => {
    //     const { data } = await HTTP_BRAIN_KNOWLEGE.patch(`/brains/${datastoreId}/channels/${channelId}`, body);

    //     return data?.data ?? data;
    // };

    // return useMutation(updateKnowledge, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(["channels", datastoreId, channelId]);
    //     },
    // });
    return useMutation({
        mutationFn: async (body) => {
            const { data } = await HTTP_BRAIN_KNOWLEGE.patch(`/brains/${datastoreId}/channels/${channelId}`, body);

            return data?.data ?? data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["channels", datastoreId, channelId]);
        },
    });
}

export function useDeleteChannel({ datastoreId, channelId, body }) {
    const queryClient = useQueryClient();

    const deleteKnowledge = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.delete(`/brains/${datastoreId}/channels/${channelId}`, { data: body });

        return data?.data ?? data;
    };

    return useMutation(deleteKnowledge, {
        onSuccess: () => {
            queryClient.invalidateQueries(["channels", datastoreId, channelId]);
        },
    });
}

export function useOnPremiseCheckStatusJob({ channelId }) {
    const queryClient = useQueryClient();

    const productionCloud = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.get(`channels/${channelId}/whatsapp/on_premise/check_status`);

        return data?.data ?? data;
    };

    return useMutation(productionCloud, {
        onSuccess: () => {
            queryClient.invalidateQueries(["productionCloud", channelId]);
        },
    });
}

export function useProductionCloud({ datastoreId, channelId, body }) {
    const queryClient = useQueryClient();
    const phoneNumber = get(body, "metadata.properties.provider.displayPhoneNumber", "");
    body.metadata.properties.provider.displayPhoneNumber = phoneNumber.replace("+", "");

    const productionCloud = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.patch(`/brains/${datastoreId}/channels/${channelId}`, body);

        return data?.data ?? data;
    };

    return useMutation(productionCloud, {
        onSuccess: () => {
            queryClient.invalidateQueries(["productionCloud", datastoreId, channelId]);
        },
    });
}

export function useProductionOnPremise({ channelId, body }) {
    const queryClient = useQueryClient();

    const productionOnPremise = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.post(`/channels/${channelId}/whatsapp/on_premise`, body);

        return data?.data ?? data;
    };

    return useMutation(productionOnPremise, {
        onSuccess: () => {
            queryClient.invalidateQueries(["productionOnPremise"]);
        },
    });
}

export function useSendChannelToProductionOnPremise({ channelName }) {
    const queryClient = useQueryClient();
    const appName = channelName
        .normalize("NFD") // Separa las marcas de acento y diéresis de sus vocales base
        .replace(/[\u0300-\u036f]/g, "") // Elimina marcas de acento, diéresis, etc.
        .replace(/ñ/g, "n") // Reemplaza la letra "ñ" con "n"
        .replace(/[^\w\s-]/g, " "); // Reemplaza cualquier carácter especial por un espacio

    const body = {
        appName,
        contactEmail: "operaciones@jelou.ai",
        contactName: "Alberto Vera",
        contactNumber: "593986401199",
        userName: "Jelou",
        provider: "gupshup",
    };

    const productionOnPremise = async () => {
        const { data } = await JelouApiV1.post(`/bots/build/whatsapp`, body);

        return data?.data ?? data;
    };

    return useMutation(productionOnPremise, {
        onSuccess: () => {
            queryClient.invalidateQueries(["channels, channel"]);
        },
    });
}

/** Flows */

export function useFlowsPerChannel({ referenceId, fetchData, refetchInterval = 5000, refetchOnWindowFocus = true }) {
    const getFlows = async () => {
        const { data } = await JelouApiV1.get(`/bots/${referenceId}/flows?shouldPaginate=true&state=true`);
        return {
            data: get(data, "results", []),
            meta: get(data, "pagination", {}),
        };
    };

    return useQuery(["flowsPerChannel", referenceId], getFlows, {
        enabled: fetchData,
        refetchInterval,
        refetchOnWindowFocus,
    });
}

export function useFlowsPerDatasource({ datastoreId, datasourceId, fetchData }) {
    const getFlows = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.get(`/brains/${datastoreId}/knowledge/${datasourceId}`);
        return data;
    };

    return useQuery(["flowsPerDatasource", datastoreId, datasourceId], getFlows, {
        enabled: fetchData,
        refetchInterval: 5000,
    });
}

export const getFlowsByChannel = async ({ referenceId }) => {
    try {
        const { data } = await JelouApiV1.get(`/bots/${referenceId}/flows?shouldPaginate=true&state=true`);
        return {
            data: get(data, "results", []),
            meta: get(data, "pagination", {}),
        };
    } catch (err) {
        console.log(err);
    }
};

/** Swaps */

export function useGetSwaps({ referenceId }) {
    const getSwaps = async () => {
        const { data } = await JelouApiV1.get(`/bots/+593963219808001/testers?fallbackId=${referenceId}`);
        return data;
    };

    return useQuery(["swaps", referenceId], getSwaps, {
        enabled: !isEmpty(referenceId),
        // refetchInterval: 1000,
    });
}

export async function getSwaps({ referenceId }) {
    try {
        const { data } = await JelouApiV1.get(`/bots/+593963219808001/testers?fallbackId=${referenceId}`);
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function createSwap({ phone, referenceId }) {
    try {
        const { data } = await JelouApiV1.post(`/bots/+593963219808001/testers/${phone}`, {
            fallbackId: referenceId,
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function deleteSwap({ phone }) {
    try {
        const { data } = await JelouApiV1.delete(`/bots/+593963219808001/testers/${phone}`);
        return data;
    } catch (err) {
        console.log(err);
    }
}

/** Sources  */

export function useSources({ datasourceId, fetchSources }) {
    const getSources = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.get(`/knowledge/${datasourceId}/sources`);
        return data;
    };

    return useQuery(["sources", datasourceId], getSources, { enabled: fetchSources && Boolean(datasourceId) });
}

export function useDeleteSource({ datasourceId, sourceId }) {
  const eliminateSource = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.delete(`/knowledge/${datasourceId}/sources/${sourceId}`);
        return data?.data ?? data;
    };

    return useMutation(eliminateSource);
}

/** Blocks  */

export function useBlocks({ sourceId, fetchData }) {
    const fetchBlocks = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.get(`/sources/${sourceId}/blocks`);
        return data;
    };

    return useQuery(["blocks", sourceId], fetchBlocks, {
        enabled: fetchData,
        refetchOnWindowFocus: false,
    });
}

export function useOneBlock({ sourceId, fetchData, blockId = "" }) {
    const fetchBlock = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.get(`/sources/${sourceId}/blocks/${blockId}`);
        return data;
    };

    return useQuery(["blocks", sourceId, blockId], fetchBlock, {
        enabled: fetchData,
        refetchOnWindowFocus: false,
        retry: false,
    });
}

export function useUpdateBlock({ sourceId, blockId, blockInfo }) {
    const queryClient = useQueryClient();

    const updateActualBlock = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.patch(`/sources/${sourceId}/blocks/${blockId}`, blockInfo);
        return data;
    };

    return useMutation(updateActualBlock, {
        onSuccess: () => {
            queryClient.invalidateQueries(["blocks", sourceId]);
        },
    });
}

export function useDeleteBlock({ sourceId, blockId }) {
    const queryClient = useQueryClient();

    const eliminateBlock = async () => {
        const { data } = await HTTP_BRAIN_KNOWLEGE.delete(`/sources/${sourceId}/blocks/${blockId}`);
        return data;
    };

    return useMutation(eliminateBlock, {
        onSuccess: () => {
            queryClient.invalidateQueries(["blocks", sourceId, blockId]);
        },
    });
}

/** Tester chat */

export function useChatHistory({ datastoreId, userId, showTesterChat }) {
    const testerRepository = new TesterRepository();

    return useQuery(["chatLogs", datastoreId], () => testerRepository.getHistory({ datastoreId, userId: String(userId) }), {
        refetchOnWindowFocus: false,
        enabled: Boolean(datastoreId) && Boolean(userId) && Boolean(showTesterChat),
    });
}

/** Upload a file & get its URL */
export function useGetFileUrl({ file, companyId }) {
    const queryClient = useQueryClient();

    // if (!file) {
    //     return Promise.reject("File is empty");
    // }

    const url = `/companies/${companyId}/datum/upload`;
    const JWT = localStorage.getItem("jwt");

    const useUploadFile = async () => {
        try {
            const response = await useFileUploader(
                {
                    url,
                    apiToken: JWT,
                },
                { file }
            );
            return response.data;
        } catch (error) {
            throw new Error("Failed uploading file: " + error.message);
        }
    };

    return useMutation(useUploadFile, {
        onSuccess: (data) => {
            const newData = { url: data };
            queryClient.setQueryData(["url"], newData);
        },
    });
}
