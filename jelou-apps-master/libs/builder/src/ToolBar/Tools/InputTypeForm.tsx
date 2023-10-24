import React from "react";

import { InputSelector } from "@builder/common/inputs";
import { SelectOption } from "@builder/modules/workflow/doamin/workflow.domain";
import { StepLayout } from "@builder/pages/Home/ToolKits/modals/CreateEditTool/StepLayout";
import { InputsTypes, MainDataInput } from "@builder/pages/Home/ToolKits/types.toolkits";
import { CREATE_INPUT_STEP, DEFAULT_OBJECT, INPUTS_NAME, INPUTS_TYPES, INPUTS_TYPES_OPTIONS, LIST_OPTIONS } from "../constants.toolbar";
import ObjectOptionsInput from "./ObjectOptions.input";
import OptionsMenu from "./options.menu";

type optionListType = {
    value: InputsTypes;
    label: string;
};

export interface IAppProps {
    handlePrimaryClick: (arg: string) => void;
    handleSecondaryClick: (step: string) => void;
    inputsErrors: Record<string, string>;
    input: MainDataInput;
    setInputConfig: React.Dispatch<React.SetStateAction<MainDataInput>>;
    isUpdate: boolean;
    isLoading?: boolean;
}

export default function InputTypeForm(props: IAppProps) {
    const { handlePrimaryClick, handleSecondaryClick, inputsErrors, input, setInputConfig, isUpdate, isLoading } = props;

    const handleType = (option: optionListType) => {
        const { value } = option;
        switch (value) {
            case INPUTS_TYPES.STRING:
            case INPUTS_TYPES.BOOLEAN:
            case INPUTS_TYPES.NUMBER: {
                const newInput = { ...input };
                delete newInput.configuration;
                setInputConfig((preState) => ({ ...preState, type: value }));
                break;
            }
            case INPUTS_TYPES.ENUM:
                setInputConfig((preState) => ({ ...preState, type: value, configuration: { enumList: [] } }));
                break;
            case INPUTS_TYPES.LIST:
                setInputConfig((preState) => ({ ...preState, type: value, configuration: { type: "" } }));
                break;
            case INPUTS_TYPES.OBJECT:
                setInputConfig((preState) => ({ ...preState, type: value, configuration: { objectList: [DEFAULT_OBJECT] } }));
                break;
            default:
                break;
        }
    };

    const handleAddOption = (option: SelectOption) => {
        const enumList = input.configuration?.enumList || [];
        const newEnumList = [...enumList, option];
        setInputConfig((prevState) => ({ ...prevState, configuration: { enumList: newEnumList } }));
    };

    const handleTypeArray = (option: SelectOption) => {
        const newInput = { ...input, configuration: { type: option.value } };
        setInputConfig(newInput);
    };

    const addObject = () => {
        const objectList = input.configuration?.objectList || [];
        const id = objectList.length;
        setInputConfig((prevState) => ({ ...prevState, configuration: { objectList: [...objectList, { ...DEFAULT_OBJECT, id }] } }));
    };

    return (
        <StepLayout
            title="Tipo de input"
            primaryLabel={isUpdate ? "Actualizar" : "Crear"}
            onPrimaryClick={() => handlePrimaryClick(CREATE_INPUT_STEP.INPUT_TYPE)}
            onSecondaryClick={() => handleSecondaryClick(CREATE_INPUT_STEP.INPUT_TYPE)}
            secondaryLabel="Atrás"
            isLoading={isLoading}
        >
            <InputSelector
                defaultValue={input?.type}
                hasError={inputsErrors[INPUTS_NAME.TYPE]}
                label="Tipo"
                name={INPUTS_NAME.TYPE}
                options={INPUTS_TYPES_OPTIONS}
                placeholder="Selecciona un tipo"
                onChange={handleType}
            />
            {input?.type === INPUTS_TYPES.ENUM && <OptionsMenu input={input} onChange={handleAddOption} setInputConfig={setInputConfig} />}
            {input?.type === INPUTS_TYPES.LIST && (
                <InputSelector label="Tipo de lista" placeholder="Selecciona el tipo de lista" options={LIST_OPTIONS} name={INPUTS_NAME.TYPE} onChange={handleTypeArray} />
            )}
            {input?.type === INPUTS_TYPES.OBJECT && <ObjectOptionsInput input={input} setInputConfig={setInputConfig} inputsErrors={inputsErrors} addObject={addObject} />}
        </StepLayout>
    );
}
