import * as React from "react";
import { ObjectList } from "../../pages/Home/ToolKits/types.toolkits";
import { OBJECT_TYPE } from "../constants.toolbar";
import { CheckboxInput, NumberInput, TextInput } from "../../common/inputs";
import { toUpper } from "lodash";

export interface OptionsObjectProps {
    label: string;
    variable: string;
    optionsObject: ObjectList[];
    errors: Record<string, string>;
    defaultValue?: Record<string, string>;
}

export default function OptionsObject(props: OptionsObjectProps) {
    const { label, variable, optionsObject, errors, defaultValue } = props;

    return (
        <>
            <span className="mb-1 block text-sm font-semibold">{label}</span>
            <div className="grid gap-5 rounded-12 border-1 border-gray-34 p-4">
                {optionsObject.map((option) => {
                    const { id, name, type, displayName } = option;

                    switch (toUpper(type)) {
                        case OBJECT_TYPE.STRING:
                            return (
                                <TextInput
                                    key={id}
                                    label={displayName}
                                    name={`${variable}.${name}`}
                                    hasError={errors[`${variable}.${name}`]}
                                    placeholder={`Ingresa ${displayName}`}
                                    defaultValue={defaultValue && defaultValue[name]}
                                />
                            );
                        case OBJECT_TYPE.NUMBER:
                            return (
                                <NumberInput
                                    key={id}
                                    defaultValue={defaultValue && defaultValue[name]}
                                    hasError={errors[`${variable}.${name}`]}
                                    label={displayName}
                                    name={`${variable}.${name}`}
                                    labelClassName="text-sm font-semibold block"
                                    placeholder={`Escribe aquí ${displayName}`}
                                />
                            );
                        case OBJECT_TYPE.BOOLEAN:
                            return (
                                <CheckboxInput
                                    key={id}
                                    defaultChecked={defaultValue && Boolean(defaultValue[name])}
                                    hasError={errors[`${variable}.${name}`]}
                                    className="checked:text-primary-200"
                                    name={`${variable}.${name}`}
                                    label={displayName}
                                    labelClassName="text-sm font-semibold block"
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </div>
        </>
    );
}
