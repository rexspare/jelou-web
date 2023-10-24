import { isEmpty } from "lodash";
import React from "react";

import { CheckboxInput, TextAreaInput, TextInput } from "@builder/common/inputs";
import { StepLayout } from "@builder/pages/Home/ToolKits/modals/CreateEditTool/StepLayout";
import { MainDataInput } from "@builder/pages/Home/ToolKits/types.toolkits";
import { CREATE_INPUT_STEP, INPUTS_NAME } from "../constants.toolbar";

type optionList = {
    value: string;
    label: string;
};

export interface MainDataProps {
    handlePrimaryClick: (arg: string) => void;
    inputsErrors: Record<string, string>;
    input: MainDataInput;
    optionsList?: Array<optionList>;
    setOptionsList?: React.Dispatch<React.SetStateAction<optionList[]>>;
    handleSecondaryClick: (arg: string) => void;
    setInputConfig: React.Dispatch<React.SetStateAction<MainDataInput>>;
}

export default function MainDataForm(props: MainDataProps) {
    const { handlePrimaryClick, inputsErrors, input, handleSecondaryClick, setInputConfig } = props;

    const handleInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const valueName = name === INPUTS_NAME.REQUIRED ? (event.target as HTMLInputElement).checked : value;
        setInputConfig((prevState) => {
            const configuration = prevState.configuration ?? {};
            return {
                ...prevState,
                [name]: valueName,
                configuration,
            };
        });
    };

    const { displayName, name, description, required } = input;

    const enabled = !isEmpty(displayName) && !isEmpty(name) && !isEmpty(description);

    return (
        <StepLayout
            title="Datos principales"
            //   isLoading={isLoadingAction}
            primaryLabel={"Siguiente"}
            onPrimaryClick={() => handlePrimaryClick(CREATE_INPUT_STEP.MAIN_DATA)}
            onSecondaryClick={() => handleSecondaryClick(CREATE_INPUT_STEP.MAIN_DATA)}
            secondaryLabel="Cancelar"
            disabled={!enabled}
        >
            <TextInput
                defaultValue={displayName}
                hasError={inputsErrors[INPUTS_NAME.DISPLAY_NAME]}
                label="Nombre"
                name={INPUTS_NAME.DISPLAY_NAME}
                placeholder="Ingresa el nombre"
                onChange={handleInput}
            />
            <TextInput defaultValue={name} hasError={inputsErrors[INPUTS_NAME.NAME]} label="Variable" name={INPUTS_NAME.NAME} placeholder="Ingresa la variable" onChange={handleInput} />
            <TextAreaInput defaultValue={description} hasError={inputsErrors[INPUTS_NAME.DESCRIPTION]} label="Descripción" name={INPUTS_NAME.DESCRIPTION} placeholder="" onChange={handleInput} />
            <label className="flex items-center gap-2">
                <CheckboxInput className="checked:text-primary-200" defaultChecked={required} name={INPUTS_NAME.REQUIRED} onChange={handleInput} />
                <span className="font-light text-gray-400">Mantener campo como requerido</span>
            </label>
        </StepLayout>
    );
}
