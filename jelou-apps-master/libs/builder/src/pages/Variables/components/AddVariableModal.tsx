import { useState } from "react";

import { PlusIcon } from "@builder/Icons";
import { HeaderModalBtns } from "@builder/common/Headless/HeaderModalBtns";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { InputSelector, TextInput } from "@builder/common/inputs";
import { Option } from "@builder/common/inputs/types.input";

import { ModalFooterBtns } from "../../Home/shared/Layouts/ModalFooterBtns";
import { CreateNewVariableParams, VariableType } from "../models/variables";
import { TextHideInput } from "./VariableList";

type Props = {
    isOpen: boolean;
    closeModal: () => void;
    onCreateNewVariable?: (values: CreateNewVariableParams) => void;
};

const AddVariableModal = ({ isOpen, closeModal, onCreateNewVariable = () => null }: Props) => {
    const [variableName, setVariableName] = useState<string>("");
    const [variableValue, setVariableValue] = useState<string>("");
    const [variablePrivacy, setVariablePrivacy] = useState<VariableType>(VariableType.Default);
    const enableConfirmButton = variableName.length && variableValue.length;
    const isSecretVariable = variablePrivacy === VariableType.Secret;

    const handleChangeVariableName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariableName(event.target.value);
    };

    const handleChangeVariableValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVariableValue(event.target.value);
    };

    const handleChangePrivacyOption = (value: Option<VariableType>) => {
        setVariablePrivacy(value.value);
    };

    const handleCreateVariable = () => {
        onCreateNewVariable({ name: variableName, value: variableValue, type: variablePrivacy });
        closeModal();
    };

    const privacyOptions: Array<Option<VariableType>> = [
        { label: "Default", value: VariableType.Default },
        { label: "Secret", value: VariableType.Secret },
    ];

    return (
        <ModalHeadless isOpen={isOpen} closeModal={closeModal} primaryBtnLabel="Crear variable" secondaryBtnLabel="Cancelar" showClose={false} showBtns={false}>
            <HeaderModalBtns Icon={PlusIcon} onClose={closeModal} title="Creación de una variable personal" colors="bg-[#F2FBFC] text-primary-200" />
            <main className="flex flex-col gap-y-6 px-8 pt-4 text-gray-400">
                <p className="text-base font-normal">Ingresa la siguiente información para crear la variable personal</p>

                <section className="grid grid-rows-3 gap-y-2">
                    <TextInput name="variableName" label="Nombre de la variable" value={variableName} placeholder="API_KEY_VARIABLE" hasError="" onChange={handleChangeVariableName} />
                    {isSecretVariable ? (
                        <TextHideInput value={variableValue} label="Valor de la variable" name="variableValue" autoComplete="off" placeholder="API_KEY_VALUE" onChange={handleChangeVariableValue} />
                    ) : (
                        <TextInput
                            name="variableValue"
                            label="Valor de la variable"
                            defaultValue={variableValue}
                            value={variableValue}
                            placeholder="API_KEY_VALUE"
                            hasError=""
                            onChange={handleChangeVariableValue}
                        />
                    )}
                    <InputSelector hasError="" label="Tipo" name="privacy" placeholder="" defaultValue={variablePrivacy} options={privacyOptions} onChange={handleChangePrivacyOption} />
                </section>

                <ModalFooterBtns
                    colors="bg-primary-200"
                    primaryLabel="Crear variable"
                    onCancel={closeModal}
                    secondaryLabel="Cancelar"
                    disabled={!enableConfirmButton}
                    onSubmit={handleCreateVariable}
                />
            </main>
        </ModalHeadless>
    );
};

export default AddVariableModal;
