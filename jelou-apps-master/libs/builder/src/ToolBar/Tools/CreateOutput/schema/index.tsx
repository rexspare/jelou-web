import debounce from "lodash/debounce";
import { useState } from "react";
import { v4 } from "uuid";

import { CloseIcon1 } from "@apps/shared/icons";
import { PlusIconRounded, SpinnerIcon } from "@builder/Icons";
import { DiclosureHeadless } from "@builder/common/Headless/Disclosure";
import { renderMessage } from "@builder/common/Toastify";
import { EditorCode } from "@builder/common/code/Editor.code";
import { TextInput } from "@builder/common/inputs";
import { OUTPUTS_INPUTS_NAMES, OutputsSchemaValues, type Output } from "@builder/modules/OutputTools/domain/outputs.domain";
import { flattenObject } from "./generateschema.output";
import { useOutputsSchema } from "./schema.hook";

const defautlValue = `{

}`;

type Props = {
    outputData: Partial<Output>;
    outputIdToUpdate?: string;
    goBack: () => void;
    onClose: () => void;
};

export function Schema({ goBack, outputData, onClose, outputIdToUpdate }: Props) {
    const { addVariable, handleCreateOutput, handleDeletefield, handleInputChange, schemaValues, setSchemaValues, handleUpdateOutput } = useOutputsSchema({ onClose, outputData });

    const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);
    const [editorValue, setEditorValue] = useState("");

    const handleCreateOuputOnClick = () => {
        setIsLoadingCreate(true);

        if (outputIdToUpdate) {
            handleUpdateOutput(outputIdToUpdate).finally(() => setIsLoadingCreate(false));
            return;
        }

        handleCreateOutput().finally(() => setIsLoadingCreate(false));
    };

    const handleEditorChange = debounce((value: string) => setEditorValue(value), 500);

    const handleGenerateSchemaClick = () => {
        setIsLoadingGenerate(true);

        let value;
        try {
            value = JSON.parse(editorValue);
        } catch (error) {
            renderMessage("Se debe ingresar un JSON válido", "error");
            setIsLoadingGenerate(false);
            return;
        }

        const schema = flattenObject(value);

        const schemaValue: OutputsSchemaValues[] = Object.entries(schema).map(([key, value]) => ({
            id: v4(),
            name: value,
            variable: key,
        }));

        setSchemaValues(schemaValue);
        setIsLoadingGenerate(false);
    };

    const labelButton = outputIdToUpdate ? "Actualizar" : "Crear";

    return (
        <main className="flex h-[40rem] flex-col justify-between px-7 text-gray-400">
            <div className="overflow-scroll pr-2">
                <h3 className="mb-6 text-base font-semibold text-gray-400">Define tu output</h3>

                <DiclosureHeadless LabelButton="Proveer esquema" idButton="data" defaultOpen={false} classNameButton="text-sm mb-2 font-semibold text-gray-610">
                    <p className="mb-2 text-13 text-gray-400">
                        Si ya tienes la estructura que devolverá tu <span className="font-semibold">output</span>. Puedes proveerla en este espacio para generarla automáticamente. Si no, también
                        puedes crearla en los campos de abajo.
                    </p>
                    <div className="mb-4 overflow-hidden rounded-4 border-1 border-gray-330">
                        <EditorCode onChange={handleEditorChange} defaultValue={defautlValue} defaultLanguage="json" height="12rem" />
                    </div>
                    <div className="flex w-full justify-end">
                        <button onClick={handleGenerateSchemaClick} className="flex items-center gap-2 rounded-full border-1 border-primary-200 px-4 py-1 text-sm font-semibold text-primary-200">
                            Generar esquema
                            {isLoadingGenerate ? <SpinnerIcon width={14} /> : ""}
                        </button>
                    </div>
                </DiclosureHeadless>

                <h4 className="my-4 text-sm font-semibold text-gray-610">Esquema de salida</h4>

                <ul>
                    <li className="grid grid-cols-2">
                        <span className="font-semibold text-gray-610">Variable</span>
                        <span className="font-semibold text-gray-610">Nombre</span>
                    </li>

                    <div className="mb-2 grid max-h-[26rem] gap-2">
                        {schemaValues &&
                            schemaValues.map(({ id, name, variable }) => (
                                <li key={id} className="grid grid-cols-[repeat(2,_1fr)_0.8rem] items-center gap-x-2 [&_input]:placeholder:font-medium [&_#ChevronDownIcon]:w-6">
                                    <div>
                                        <TextInput defaultValue={variable} onChange={handleInputChange(id)} name={OUTPUTS_INPUTS_NAMES.VARIABLE} placeholder="Variable" />
                                    </div>

                                    <div>
                                        <TextInput defaultValue={name} onChange={handleInputChange(id)} name={OUTPUTS_INPUTS_NAMES.NAME} placeholder="Nombre del campo" />
                                    </div>
                                    <button type="button" onClick={handleDeletefield(id)}>
                                        <CloseIcon1 width="10px" height="10px" fill="currentColor" />
                                    </button>
                                </li>
                            ))}
                    </div>
                </ul>
            </div>

            <footer className="flex h-16 items-center justify-between gap-x-3">
                <button onClick={addVariable} className="flex items-center gap-x-2 break-words text-sm font-semibold text-primary-200">
                    <PlusIconRounded />
                    Agregar campo de salida
                </button>
                <div className="flex gap-4">
                    <button type="button" onClick={goBack} className="h-8 min-w-1 rounded-20 bg-primary-700 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40">
                        Atrás
                    </button>

                    <button
                        onClick={handleCreateOuputOnClick}
                        disabled={isLoadingCreate}
                        type="submit"
                        className="flex h-8 w-28 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isLoadingCreate ? <SpinnerIcon /> : labelButton}
                    </button>
                </div>
            </footer>
        </main>
    );
}
