/** @typedef {import('reactflow').Node<HttpNodeData>} Node */

/**
 * @template T
 * @typedef {[ T, import('react').Dispatch<import('react').SetStateAction<T>>]} useState
 */

import { debounce, get } from "lodash";
import { nanoid } from "nanoid";
import { useReactFlow } from "reactflow";

import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import { MultiForm } from "../Body/MultipartForm/MultiForm";

export const HeadersHttpConfig = ({ nodeId }) => {
    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId);

    const headerList = get(currentNode, "data.configuration.headers", []);
    const { updateLocalNode } = useCustomsNodes();

    /** @param {HttpForm[]} newData */
    const updateMultipartConfig = (newData) => {
        const node = getNode(nodeId);
        const configuration = get(node, "data.configuration", {});

        const newConfiguration = {
            ...configuration,
            headers: newData,
        };

        updateLocalNode(currentNode.id, { configuration: newConfiguration });
    };

    /** @param {string} id */
    const handleDeleteMultiFormData = (id) => () => {
        if (headerList.length === 1) return;

        const newState = headerList.filter((multiForm) => multiForm.id !== id);
        updateMultipartConfig(newState);
    };

    const handleAddMultipartForm = () => {
        const newMultipartFormData = {
            id: nanoid(),
            key: null,
            value: null,
            enabled: true,
        };

        const newState = [...headerList, newMultipartFormData];
        updateMultipartConfig(newState);
    };

    /**
     * @param {string} itermId the id of the item to update
     * @param {React.MutableRefObject<HTMLFormElement>} formRef the form ref
     */
    const debounceEvent = (itermId, formRef) =>
        debounce((e) => {
            const formData = new FormData(formRef.current);
            const /** @type {HttpForm} */ data = Object.fromEntries(formData);

            data.enabled = Boolean(data.enabled);

            // validateHttpForm(data)
            //   .then(() => {
            const newState = headerList.map((multiForm) => (multiForm.id === itermId ? { ...multiForm, ...data } : multiForm));
            updateMultipartConfig(newState);
            // })
            // .catch(() => null);
        }, 500);

    return (
        <>
            <div className="h-[40vh] overflow-y-auto xxl:h-[50vh]">
                {headerList.map((queryParam) => {
                    const disableDeleteBtn = headerList.length === 1;

                    return (
                        <MultiForm key={queryParam.id} debounceEvent={debounceEvent} disableDeleteBtn={disableDeleteBtn} handleDeleteMultiFormData={handleDeleteMultiFormData} multiForm={queryParam} />
                    );
                })}
            </div>
            <button onClick={handleAddMultipartForm} className="mt-4 pl-6 text-13 font-semibold text-teal-953">
                + Agregar header
            </button>
        </>
    );
};
