import { useRef } from "react";

import { BurgerIcon, CloseIcon } from "@builder/Icons";
import { CheckboxInput, TextInput } from "@builder/common/inputs";
import { HTTP_INPUTS_NAMES } from "@builder/modules/Nodes/Http/constants.http";

/**
 * This component is used to render the form of the multipart form data
 * also it uses for the query params and the url encoded form data
 * @param {{
 * debounceEvent: (id: string, formRef: React.MutableRefObject<HTMLFormElement>) => (e: React.ChangeEvent<HTMLInputElement>) => void,
 * multiForm: HttpForm
 * disableDeleteBtn: boolean
 * handleDeleteMultiFormData: (id: string) => () => void
 * }} props
 */
export const MultiForm = ({ multiForm, debounceEvent, disableDeleteBtn, handleDeleteMultiFormData }) => {
    const formRef = useRef();
    const { id, key, value, enabled } = multiForm;

    return (
        <form ref={formRef} className="grid h-20 grid-cols-[1rem_1rem_17rem_17rem_1rem] items-center justify-start gap-3 border-y-1 border-gray-230 px-6 text-[#D5D8DF]">
            <BurgerIcon />
            <CheckboxInput name={HTTP_INPUTS_NAMES.MULTIPART_FORM_CHECKBOX} defaultChecked={enabled} onChange={debounceEvent(id, formRef)} />
            <TextInput name={HTTP_INPUTS_NAMES.MULTIPART_FORM_KEY} hasError="" label="" defaultValue={key} placeholder="Nombre de la variable" onChange={debounceEvent(id, formRef)} />
            <TextInput hasError="" label="" name={HTTP_INPUTS_NAMES.MULTIPART_FORM_VALUE} defaultValue={value} placeholder="Valor de la variable" onChange={debounceEvent(id, formRef)} />
            <button type="button" onClick={handleDeleteMultiFormData(id)} className="disabled:cursor-not-allowed disabled:text-opacity-50" disabled={disableDeleteBtn}>
                <CloseIcon />
            </button>
        </form>
    );
};
