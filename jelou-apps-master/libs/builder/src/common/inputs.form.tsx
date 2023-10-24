import { get, isUndefined, toLower } from "lodash";
import { useState } from "react";

import { SpinnerIcon } from "@builder/Icons";
import OptionsArray from "@builder/ToolBar/Tools/OptionsArray";
import OptionsObject from "@builder/ToolBar/Tools/OptionsObject";
import { INPUTS_TYPES } from "@builder/ToolBar/constants.toolbar";
import { Input } from "@builder/pages/Home/ToolKits/types.toolkits";

import { Switch } from "./Headless/conditionalRendering";
import { CheckboxInput } from "./inputs/Checkbox.input";
import { NumberInput } from "./inputs/Number.Input";
import { InputSelector } from "./inputs/Selector.Input";
import { TextInput } from "./inputs/Text.Input";

type InputsFormProps = {
    inputs: Input[];
    primaryAction: (inputs: Record<string, unknown>) => void;
    primaryActionLabel: string;
    secondaryAction: () => void;
    secondaryActionLabel: string;
    isLoadingPrimaryAction: boolean;
    defaultValues?: Record<string, unknown>;
    inputFormDataTest?: Record<any, any>;
    setInputFormDataTest?: React.Dispatch<React.SetStateAction<Record<any, any>>>;
};

export const InputsForm = ({
    inputs,
    primaryActionLabel,
    secondaryActionLabel,
    isLoadingPrimaryAction = false,
    primaryAction = () => null,
    secondaryAction = () => null,
    defaultValues = {},
    inputFormDataTest,
    setInputFormDataTest,
}: InputsFormProps) => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const { errors, input } = getInputsData({ formData, inputs });
        setInputFormDataTest && setInputFormDataTest(input);
        setErrors(errors);

        if (Object.keys(errors).length > 0) return;

        setErrors({});
        primaryAction(input);
    };

    return (
        <form onSubmit={handleSubmit} className="grid h-full w-full grid-rows-[max-content] gap-4 overflow-y-scroll rounded-b-lg border-x-1 border-b-1 bg-white p-6 text-gray-400 shadow">
            <span className="sr-only">form test tools</span>
            <ul className="flex flex-col gap-4 px-1">
                {inputs.map((input) => {
                    const { id, type, name, displayName, configuration = {} } = input;

                    const configOptions = get(configuration, "enumList") ?? [];
                    const configArray = get(configuration, "type", "");
                    const configObject = get(configuration, "objectList") ?? [];

                    let listOption = [];
                    if (type === INPUTS_TYPES.LIST && inputFormDataTest && inputFormDataTest[name]) {
                        listOption = inputFormDataTest[name].map((option: any) => ({ value: option, label: option }));
                    }

                    return (
                        <li key={id} className="flex flex-col gap-2">
                            <Switch>
                                <Switch.Case condition={type === INPUTS_TYPES.STRING}>
                                    <TextInput
                                        defaultValue={(inputFormDataTest && inputFormDataTest[name]) || (defaultValues[name] as string)}
                                        hasError={errors[name]}
                                        name={name}
                                        label={displayName}
                                        labelClassName="text-sm font-semibold block"
                                        placeholder={`Escribe aquí tu ${toLower(displayName)}`}
                                    />
                                </Switch.Case>
                                <Switch.Case condition={type === INPUTS_TYPES.NUMBER}>
                                    <NumberInput
                                        name={name}
                                        defaultValue={inputFormDataTest ? inputFormDataTest[name] : (defaultValues[name] as string)}
                                        hasError={errors[name]}
                                        label={displayName}
                                        labelClassName="text-sm font-semibold block"
                                        placeholder={`Escribe aquí tu ${toLower(displayName)}`}
                                    />
                                </Switch.Case>
                                <Switch.Case condition={type === INPUTS_TYPES.BOOLEAN}>
                                    <CheckboxInput
                                        defaultChecked={inputFormDataTest ? Boolean(inputFormDataTest[name]) : Boolean(defaultValues[name])}
                                        hasError={errors[name]}
                                        className="checked:text-primary-200"
                                        name={name}
                                        label={displayName}
                                        labelClassName="text-sm font-semibold block"
                                    />
                                </Switch.Case>
                                <Switch.Case condition={type === INPUTS_TYPES.ENUM && configOptions.length > 0}>
                                    <InputSelector
                                        options={configOptions}
                                        placeholder={`Escoga su ${toLower(displayName)}`}
                                        name={name}
                                        label={displayName}
                                        hasError={errors[name]}
                                        defaultValue={listOption}
                                    />
                                </Switch.Case>
                                <Switch.Case condition={type === INPUTS_TYPES.LIST}>
                                    <OptionsArray label={displayName} typeInput={configArray} variable={name} hasError={errors[name]} defaultValue={inputFormDataTest && inputFormDataTest[name]} />
                                </Switch.Case>
                                <Switch.Case condition={type === INPUTS_TYPES.OBJECT && configObject.length > 0}>
                                    <OptionsObject label={displayName} variable={name} optionsObject={configObject} errors={errors} defaultValue={inputFormDataTest && inputFormDataTest[name]} />
                                </Switch.Case>
                                <Switch.Default>
                                    <p className="text-13 font-normal text-gray-400">Este input no es válido: {type}</p>
                                </Switch.Default>
                            </Switch>
                        </li>
                    );
                })}
            </ul>

            <footer className="flex justify-end gap-2 self-end">
                <button type="button" onClick={secondaryAction} className="h-8 w-24 rounded-20 bg-primary-700 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40">
                    {secondaryActionLabel}
                </button>
                <button type="submit" className="flex h-8 w-24 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
                    {isLoadingPrimaryAction ? <SpinnerIcon /> : primaryActionLabel}
                </button>
            </footer>
        </form>
    );
};

type InputDataProps = {
    formData: FormData;
    inputs: Input[];
};

function getInputsData({ formData, inputs }: InputDataProps) {
    const errors: Record<string, string> = {};
    const input: Record<any, any> = {};
    const namesInputs = inputs.map(({ name, required, type, configuration = {} }) => ({ name, required, type, configuration }));

    const inputMap = new Map(inputs.map((input) => [input.name, input]));

    formData.forEach((value, name) => {
        const [nameObject, nameKey] = name.split(".");
        const inputSetting = inputMap.get(nameObject);
        const inputObject = input[nameObject] || {};

        switch (inputSetting?.type) {
            case INPUTS_TYPES.OBJECT: {
                const objectList = inputSetting.configuration.objectList || [];
                const configType = objectList?.find((obj) => obj.name === nameKey)?.type;
                const valueObject = configType === INPUTS_TYPES.NUMBER ? Number(value) : value;
                input[nameObject] = { ...inputObject, [nameKey]: valueObject };
                break;
            }
            case INPUTS_TYPES.LIST: {
                input[name] = Array.isArray(input[name]) ? [...input[name], value] : [value];
                break;
            }
            case INPUTS_TYPES.NUMBER: {
                const numberValue = Number(value);
                input[name] = numberValue;
                break;
            }
            default: {
                input[name] = value;
                break;
            }
        }
    });

    namesInputs.forEach(({ name, required, type, configuration = {} }) => {
        switch (type) {
            case INPUTS_TYPES.OBJECT: {
                const objectList = configuration.objectList;
                objectList &&
                    objectList.forEach((obj) => {
                        if (obj.type === INPUTS_TYPES.BOOLEAN) {
                            input[name][obj.name] = Boolean(input[name][obj.name]);
                        }
                        if (required && !input[name][obj.name] && obj.type !== INPUTS_TYPES.BOOLEAN) {
                            errors[`${name}.${obj.name}`] = "Este campo es requerido";
                        }
                        if (!required && !input[name][obj.name]) {
                            input[name][obj.name] = "";
                        }
                    });
                break;
            }
            case INPUTS_TYPES.BOOLEAN: {
                input[name] = Boolean(input[name]);
                break;
            }
            default: {
                if (required && !input[name] && type !== INPUTS_TYPES.BOOLEAN) {
                    errors[name] = "Este campo es requerido";
                }
                if (!required && !input[name]) {
                    input[name] = "";
                }
                break;
            }
        }
    });

    return { input, errors };
}
