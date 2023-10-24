import { ListBoxHeadless } from "@builder/common/Headless/Listbox";
import { TextAreaInput, TextInput } from "@builder/common/inputs";

import { CREATE_TOOLKIT_OPTION, TOOLKIT_NAMES_INPUTS } from "@builder/pages/constants.home";
import { ToolkitDataProps } from "../../../types.toolkits";
import { StepLayout } from "../StepLayout";
import { useToolkitData } from "./toolkitData.hook";

export const ToolkitData = ({ onClose, handlePrimaryClick: onPrimaryClick, handleAddData, createdTool }: ToolkitDataProps) => {
    const { formRef, handlePrimaryClick, isDisable, isLoadingCreateToolkit, setToolkitSelected, toolkitSelected, toolkitsOptions } = useToolkitData({ createdTool, handleAddData, onPrimaryClick });

    return (
        <StepLayout
            title="Datos principales"
            secondaryLabel="Cancelar"
            isLoading={isLoadingCreateToolkit}
            onSecondaryClick={onClose}
            subTitle="Escribe los datos de tu herramienta"
            primaryLabel={"Siguiente"}
            disabled={isDisable}
            onPrimaryClick={handlePrimaryClick}
        >
            <ListBoxHeadless slideover setValue={setToolkitSelected} value={toolkitSelected} placeholder="Selecciona un toolkit" label="Toolkits" list={toolkitsOptions} />

            {toolkitSelected?.id === CREATE_TOOLKIT_OPTION.id && (
                <form ref={formRef} className="mt-4 grid gap-1">
                    <TextInput hasError="" name={TOOLKIT_NAMES_INPUTS.NAME} label="Nombre del toolkit" placeholder="Escribe el nombre de la herramienta" />
                    <TextAreaInput name={TOOLKIT_NAMES_INPUTS.DESCRIPTION} label="Descripción del toolkit" placeholder="Escribe una descripción" />
                </form>
            )}
        </StepLayout>
    );
};
