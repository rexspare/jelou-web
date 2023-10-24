import { useState } from "react";

import { ListBoxHeadless, type ListBoxElement } from "@builder/common/Headless/Listbox";
import { InputErrorMessage, TextAreaInput, TextInput } from "@builder/common/inputs";
import { CREATE_OUTPUT_STEP, OUTPUT_TYPES_OPTIONS } from "@builder/modules/OutputTools/domain/contants.output";
import { OUTPUTS_INPUTS_NAMES, Output } from "@builder/modules/OutputTools/domain/outputs.domain";

import { validateInputsOutputsError } from "../../utils.toolbar";

type MainDataOutput = {
    defaultOutput: Partial<Output> | null;
    nextStep: (nextStep: CREATE_OUTPUT_STEP, data: Partial<Output>) => void;
    onClose: () => void;
};

type InputsErrors = Record<OUTPUTS_INPUTS_NAMES, string>;
const INIT_INPUT_ERRORS = {} as InputsErrors;

export function MainData({ defaultOutput, nextStep, onClose }: MainDataOutput) {
    const [typeOutput, setTypeOutput] = useState<ListBoxElement | undefined>(() => {
        return OUTPUT_TYPES_OPTIONS.find((type) => type.value === defaultOutput?.type);
    });

    const [inputsErrors, setInputsErrors] = useState<InputsErrors>(INIT_INPUT_ERRORS);

    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        const formData = new FormData(evt.currentTarget);
        const output: Output = Object.fromEntries(formData as unknown as Iterable<[object, FormDataEntryValue]>);

        validateInputsOutputsError(output)
            .then((validatedOutput) => {
                setInputsErrors(INIT_INPUT_ERRORS);
                nextStep(CREATE_OUTPUT_STEP.SCHEMA, {
                    ...(defaultOutput?.schema ? { schema: defaultOutput.schema } : {}),
                    ...validatedOutput,
                } as Output);
            })
            .catch((error) => setInputsErrors(error));
    };

    return (
        <main className="text-gray-400">
            <h3 className="mb-6 pl-7 text-base font-semibold text-gray-400">Datos Generales</h3>
            <form className="flex h-[37rem] flex-col justify-between px-7" onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    <TextInput
                        defaultValue={defaultOutput?.displayName}
                        hasError={inputsErrors[OUTPUTS_INPUTS_NAMES.DISPLAY_NAME]}
                        label="Nombre"
                        name={OUTPUTS_INPUTS_NAMES.DISPLAY_NAME}
                        placeholder="Nombre del output"
                    />

                    <TextInput
                        defaultValue={defaultOutput?.name}
                        hasError={inputsErrors[OUTPUTS_INPUTS_NAMES.NAME]}
                        label="Variable"
                        name={OUTPUTS_INPUTS_NAMES.NAME}
                        placeholder="Variable con la que podrás recuperar este output"
                    />

                    <div className={`${!typeOutput ? "[&_button]:text-gray-330" : ""} [&_#ChevronDownIcon]:w-8`}>
                        <ListBoxHeadless
                            label="Tipo"
                            list={OUTPUT_TYPES_OPTIONS}
                            name={OUTPUTS_INPUTS_NAMES.TYPE}
                            placeholder="Selecciona el tipo de output"
                            slideover
                            value={typeOutput}
                            setValue={setTypeOutput}
                        />
                        {inputsErrors[OUTPUTS_INPUTS_NAMES.DESCRIPTION] && <InputErrorMessage hasError={inputsErrors[OUTPUTS_INPUTS_NAMES.DESCRIPTION]} />}
                    </div>

                    <TextAreaInput
                        defaultValue={defaultOutput?.description}
                        hasError={inputsErrors[OUTPUTS_INPUTS_NAMES.DESCRIPTION]}
                        label="Descripción"
                        name={OUTPUTS_INPUTS_NAMES.DESCRIPTION}
                        placeholder="Escribe el motivo de este output"
                    />
                </div>
                <footer className="flex h-16 items-center justify-end gap-x-3">
                    <button type="button" onClick={onClose} className="h-8 min-w-1 rounded-20 bg-primary-700 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40">
                        Cerrar
                    </button>

                    <button
                        type="submit"
                        className="flex h-8 min-w-1 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Siguiente
                    </button>
                </footer>
            </form>
        </main>
    );
}
