import { debounce, get } from "lodash";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useReactFlow, type Node } from "reactflow";

import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { HTTP_INPUTS_NAMES } from "@builder/modules/Nodes/Http/constants.http";
import { Http, HttpForm } from "@builder/modules/Nodes/Http/http.domain";
import { validateHttpForm } from "../lib.http-config";

type UseQueryHttpConfig = {
    nodeId: string;
};

type UseQueryHttpConfigFuncs = {
    nodeId: string;
};

export const useQueryHttpConfig = ({ nodeId }: UseQueryHttpConfig) => {
    const { getNode } = useReactFlow();
    const { updateLocalNode } = useCustomsNodes();

    const updateMultipartConfig = (newData: HttpForm[]) => {
        const node = getNode(nodeId) as Node<Http>;
        const configuration = node.data.configuration;

        const newConfiguration = {
            ...configuration,
            parameters: newData,
        };

        updateLocalNode(node.id, { configuration: newConfiguration });
    };
    return { updateMultipartConfig };
};

export const useQueryHttpConfigFuncs = ({ nodeId }: UseQueryHttpConfigFuncs) => {
    const { updateMultipartConfig } = useQueryHttpConfig({ nodeId });

    const { getNode } = useReactFlow();
    const node = getNode(nodeId) as Node<Http>;

    const [queryParamsList, setQueryParamsList] = useState<HttpForm[]>(get(node, "data.configuration.parameters", []));
    const [searchParamsURL, setSearchParamsURL] = useState<string>(buildSearchParams(queryParamsList));

    const handleDeleteMultiFormData = (id: string) => () => {
        if (queryParamsList.length === 1) return;

        const newState = queryParamsList.filter((multiForm) => multiForm.id !== id);
        setQueryParamsList(newState);
        updateMultipartConfig(newState);
    };

    const handleAddMultipartForm = () => {
        const newMultipartFormData: HttpForm = {
            id: nanoid(),
            key: "",
            value: "",
            enabled: true,
        };

        const newState = [...queryParamsList, newMultipartFormData];
        setQueryParamsList(newState);
        updateMultipartConfig(newState);
    };

    const debounceEvent = (itermId: string, formRef: React.RefObject<HTMLFormElement>) =>
        debounce((e) => {
            const formData = new FormData(formRef.current as HTMLFormElement);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const data = Object.fromEntries(formData.entries());

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data[HTTP_INPUTS_NAMES.MULTIPART_FORM_CHECKBOX] = data[HTTP_INPUTS_NAMES.MULTIPART_FORM_CHECKBOX] === "on";

            validateHttpForm(data)
                .then(() => {
                    const newState = queryParamsList.map((multiForm) => (multiForm.id === itermId ? { ...multiForm, ...data } : multiForm));

                    const newQuerys = buildSearchParams(newState);
                    setSearchParamsURL(newQuerys);

                    setQueryParamsList(newState);
                    updateMultipartConfig(newState);
                })
                .catch(() => null);
        }, 800);

    const handleCopyQueryParams = (URLWithQuerys: string) => {
        navigator.clipboard.writeText(URLWithQuerys);
        renderMessage("Copiado al portapapeles", TYPE_ERRORS.SUCCESS);
    };

    return {
        debounceEvent,
        queryParamsList,
        searchParamsURL,
        handleCopyQueryParams,
        handleAddMultipartForm,
        handleDeleteMultiFormData,
    };
};

const buildSearchParams = (queryParamsList: HttpForm[]) =>
    queryParamsList
        .map(({ key, value, enabled }) => (key && value && enabled ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}` : null))
        .filter(Boolean)
        .join("&");
