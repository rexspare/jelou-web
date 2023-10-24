import * as React from "react";
import { MainDataInput } from "../../pages/Home/ToolKits/types.toolkits";
import ObjectInputType from "./ObjectInput.type";

export interface ObjectOptionsProps {
    input: MainDataInput;
    setInputConfig: React.Dispatch<React.SetStateAction<MainDataInput>>;
    inputsErrors: Record<string, string>;
    addObject: () => void;
}

export default function ObjectOptionsInput(props: ObjectOptionsProps) {
    const { input, setInputConfig, inputsErrors, addObject } = props;
    const { configuration } = input;
    const { objectList = [] } = configuration || {};

    return (
        <div className="flex h-[23rem] flex-col overflow-y-auto">
            <div className="flex flex-col space-y-5 overflow-y-auto">
                {objectList.map((object) => {
                    const { id } = object;
                    return (
                        <ObjectInputType
                            key={id}
                            object={object}
                            objectList={objectList}
                            setInputConfig={setInputConfig}
                            inputsErrors={inputsErrors}
                        />
                    );
                })}
            </div>
            <button className="sticky bottom-0 flex w-56 py-3 text-primary-200" onClick={addObject}>
                + Agregar contenido
            </button>
        </div>
    );
}
