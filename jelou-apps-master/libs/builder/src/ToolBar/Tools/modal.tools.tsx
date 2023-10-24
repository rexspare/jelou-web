import { useState } from "react";

import { CloseIcon, InputsIcon } from "@builder/Icons";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { InputSelector, TextAreaInput, TextInput } from "@builder/common/inputs";
import { Output } from "@builder/modules/OutputTools/domain/outputs.domain";
import { Input } from "@builder/pages/Home/ToolKits/types.toolkits";
import { INPUTS_NAME, INPUTS_TYPES_OPTIONS } from "../constants.toolbar";

type InputsOutputModalProps = {
    isOpen: boolean;
    onClose: () => void;
    handleCreateInputClick: () => void;
    isLoading: boolean;
    inputsErrors: Record<string, string>;
    formRef: React.RefObject<HTMLFormElement>;
    inputOutput: Input | Output | null;
    configRef?: React.RefObject<HTMLFormElement | null>;
};

type optionList = {
    value: string;
    label: string;
};

export const InputsOutputModal = ({ isOpen, onClose, handleCreateInputClick, inputsErrors, isLoading, formRef, inputOutput }: InputsOutputModalProps) => {
    const isUpdate = Boolean(inputOutput);
    const nameModal = "input"
    const IconModal = InputsIcon

    const [titleLabel, primaryButtonLabel] = isUpdate ? [`Editar ${nameModal}`, "Actualizar"] : [`Nuevo ${nameModal}`, "Crear"];
    
    const [type, setType] = useState<optionList>();

    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
    };

    return (
        <ModalHeadless
            showClose={false}
            className="w-full max-w-[25rem] overflow-hidden"
            secondaryBtnLabel="Cancelar"
            isOpen={isOpen}
            closeModal={onClose}
            handleClick={handleCreateInputClick}
            isDisable={false}
            loading={isLoading}
            primaryBtnLabel={primaryButtonLabel}
        >
            <header className="flex h-14 justify-between bg-primary-350 px-7 text-primary-200">
                <div className="flex items-center gap-3">
                    <IconModal />
                    <h2 className="text-base font-medium">{titleLabel}</h2>
                </div>
                <button onClick={onClose}>
                    <CloseIcon />
                </button>
            </header>

            <form className="grid gap-4 overflow-y-auto px-7 py-3 text-gray-400" ref={formRef} onSubmit={handleSubmit}>
                <TextInput defaultValue={inputOutput?.displayName} hasError={inputsErrors[INPUTS_NAME.DISPLAY_NAME]} label="Nombre" name={INPUTS_NAME.DISPLAY_NAME} placeholder="Ingresa el nombre" />
                <TextInput defaultValue={inputOutput?.name} hasError={inputsErrors[INPUTS_NAME.NAME]} label="Variable" name={INPUTS_NAME.NAME} placeholder="Ingresa la variable" />
                <InputSelector
                    defaultValue={inputOutput?.type}
                    hasError={inputsErrors[INPUTS_NAME.TYPE]}
                    label="Tipo"
                    name={INPUTS_NAME.TYPE}
                    options={ INPUTS_TYPES_OPTIONS}
                    placeholder="Selecciona un tipo"
                    value={type}
                    onChange={(e) => {
                        setType(e);
                    }}
                />
                <TextAreaInput defaultValue={inputOutput?.description} hasError={inputsErrors[INPUTS_NAME.DESCRIPTION]} label="Descripción" name={INPUTS_NAME.DESCRIPTION} placeholder="" />
            </form>
        </ModalHeadless>
    );
};
