import { DeleteIcon } from "@apps/shared/icons";
import * as React from "react";

import { CheckboxInput, InputSelector, TextInput } from "@builder/common/inputs";
import { SelectOption } from "@builder/modules/workflow/doamin/workflow.domain";
import { MainDataInput, ObjectList } from "@builder/pages/Home/ToolKits/types.toolkits";
import { INPUTS_NAME, INPUT_TYPE_OBJECT } from "../constants.toolbar";

export interface ObjectInputProps {
    object: ObjectList;
    objectList: ObjectList[];
    setInputConfig: React.Dispatch<React.SetStateAction<MainDataInput>>;
    inputsErrors: Record<string, string>;
}

export default function ObjectInputType(props: ObjectInputProps) {
    const { object, objectList, setInputConfig, inputsErrors } = props;
    const { displayName, name, type, id, required } = object;

    const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = ev.target;
        const inputValue = name === INPUTS_NAME.REQUIRED ? Boolean(checked) : value;
        const updatedObjectList = [...objectList];
        updatedObjectList[id] = {
            ...updatedObjectList[id],
            [name]: inputValue,
        };
        setInputConfig((prevState) => ({ ...prevState, configuration: { objectList: updatedObjectList } }));
    };

    const handleSelectorObject = (option: SelectOption) => {
        const updatedObjectList = [...objectList];
        updatedObjectList[id] = {
            ...updatedObjectList[id],
            type: option.value,
        };
        setInputConfig((prevState) => ({ ...prevState, configuration: { objectList: updatedObjectList } }));
    };

    const handleDelete = () => {
        const updatedObjectList = objectList.filter((item) => item.id !== id);
        setInputConfig((prevState) => ({ ...prevState, configuration: { objectList: updatedObjectList } }));
    };

    return (
        <div className="relative rounded-12 border-1 border-gray-34 p-4 pt-6">
            <button onClick={handleDelete} className="absolute top-0 right-0 z-10 m-2 cursor-pointer rounded-full border-1 border-red-600 p-[0.375rem]">
                <DeleteIcon stroke="#e53e3e" />
            </button>
            <TextInput
                defaultValue={displayName}
                hasError={inputsErrors[INPUTS_NAME.DISPLAY_NAME]}
                label="Nombre del campo"
                name={INPUTS_NAME.DISPLAY_NAME}
                placeholder="Nombre del campo"
                onChange={handleInput}
            />
            <TextInput defaultValue={name} hasError={inputsErrors[INPUTS_NAME.NAME]} label="Variable" name={INPUTS_NAME.NAME} placeholder="Nombre de la variable" onChange={handleInput} />
            <InputSelector
                defaultValue={type}
                hasError={inputsErrors[INPUTS_NAME.TYPE]}
                label="Tipo"
                name={INPUTS_NAME.TYPE}
                options={INPUT_TYPE_OBJECT}
                placeholder="Tipo de campo"
                onChange={handleSelectorObject}
            />
            <label className="flex items-center gap-2 pt-3">
                <CheckboxInput className="checked:text-primary-200" defaultChecked={required === undefined ? true : required} name={INPUTS_NAME.REQUIRED} onChange={handleInput} />
                <span className="font-light text-gray-400">Mantener campo como requerido</span>
            </label>
        </div>
    );
}
