/**
 * @template T
 * @typedef {[T, import('react').Dispatch<import('react').SetStateAction<T>>]} State
 */

import { debounce, get } from "lodash";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useReactFlow } from "reactflow";

import { HTTP_INPUTS_NAMES, INITIAL_STATE_MULTIPART_FORM } from "@builder/modules/Nodes/Http/constants.http";
import { useCustomsNodes } from "libs/builder/src/hook/customNodes.hook";
import { validateHttpForm } from "../../lib.http-config";

/** @param {Node} dataNode the node to update */
export const useMultiPartFormHttp = (dataNode) => {
    /** @type {Node} */
    const currentNode = useReactFlow().getNode(dataNode.id) || dataNode;

    /** @type {State<HttpForm[]>} */
    const [multipartFormData, setMultipartFormData] = useState(get(currentNode, "data.configuration.body.content") ?? INITIAL_STATE_MULTIPART_FORM);

    const { updateLocalNode } = useCustomsNodes();

    /** @param {HttpForm[]} newData */
    const updateMultipartConfig = (newData) => {
        const newConfiguration = {
            ...currentNode.data.configuration,
            body: {
                ...currentNode.data.configuration.body,
                content: newData,
            },
        };

        updateLocalNode(currentNode.id, { configuration: newConfiguration });
    };

    const handleAddMultipartForm = () => {
        const newMultipartFormData = {
            id: nanoid(),
            key: null,
            value: null,
            enabled: true,
        };

        const newState = [...multipartFormData, newMultipartFormData];
        setMultipartFormData(newState);
        updateMultipartConfig(newState);
    };

    /** @param {string} id */
    const handleDeleteMultiFormData = (id) => () => {
        if (multipartFormData.length === 1) return;

        const newState = multipartFormData.filter((multiForm) => multiForm.id !== id);
        setMultipartFormData(newState);
        updateMultipartConfig(newState);
    };

    /**
     * @param {string} itermId
     * @param {HttpForm} data
     */
    const updateMultiPartForm = (itermId, data) => {
        const newState = multipartFormData.map((multiForm) => (multiForm.id === itermId ? { ...multiForm, ...data } : multiForm));
        setMultipartFormData(newState);
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

            data[HTTP_INPUTS_NAMES.MULTIPART_FORM_CHECKBOX] = data[HTTP_INPUTS_NAMES.MULTIPART_FORM_CHECKBOX] === "on";

            validateHttpForm(data)
                .then(() => updateMultiPartForm(itermId, data))
                .catch(() => null);
        }, 800);

    return { multipartFormData, debounceEvent, handleAddMultipartForm, handleDeleteMultiFormData };
};
