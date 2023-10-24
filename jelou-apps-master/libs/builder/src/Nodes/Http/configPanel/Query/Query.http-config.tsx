import type { Node } from "reactflow";

import get from "lodash/get";
import { useReactFlow } from "reactflow";

import { CopyIcon } from "@builder/Icons";
import { TippyWrapper } from "@builder/common/Tippy.custom";
import { Http } from "@builder/modules/Nodes/Http/http.domain";
import { MultiForm } from "../Body/MultipartForm/MultiForm";
import { useQueryHttpConfigFuncs } from "./hook.query-http";

type QueryHttpConfigProps = {
    nodeId: string;
};

export const QueryHttpConfig = ({ nodeId }: QueryHttpConfigProps) => {
    const currentNode = useReactFlow().getNode(nodeId) as Node<Http>;
    const { url } = get(currentNode, "data.configuration", { url: "" });

    const { debounceEvent, queryParamsList, searchParamsURL, handleCopyQueryParams, handleAddMultipartForm, handleDeleteMultiFormData } = useQueryHttpConfigFuncs({ nodeId });

    const URLWithQuerys = url && searchParamsURL ? `${url}?${searchParamsURL}` : url;

    return (
        <>
            <div className="mt-6 ml-6 flex items-center gap-4">
                <h1 className="text-lg font-bold text-gray-400">Previsualiza tu URL</h1>
                <TippyWrapper content="Copiar">
                    <div className="cursor-pointer hover:text-primary-200" onClick={() => handleCopyQueryParams(URLWithQuerys)}>
                        <CopyIcon />
                    </div>
                </TippyWrapper>
            </div>
            <p className="m-6 flex h-10 w-[42rem] items-center truncate rounded-10 bg-primary-700/75 pl-3 text-gray-400">
                {url ? URLWithQuerys : "Por favor configura la URL para poder previsualizarla"}
            </p>
            <div className="h-[30vh] overflow-y-auto xxl:h-[40vh]">
                {queryParamsList.map((queryParam) => {
                    const disableDeleteBtn = queryParamsList.length === 1;

                    return (
                        <MultiForm key={queryParam.id} debounceEvent={debounceEvent} disableDeleteBtn={disableDeleteBtn} handleDeleteMultiFormData={handleDeleteMultiFormData} multiForm={queryParam} />
                    );
                })}
            </div>
            <button onClick={handleAddMultipartForm} className="mt-4 pl-6 text-13 font-semibold text-teal-953">
                + Agregar query
            </button>
        </>
    );
};
