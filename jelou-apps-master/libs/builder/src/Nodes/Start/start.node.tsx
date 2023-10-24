import { useContext } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

import { PlayIconFilling } from "@builder/Icons";
import { InputsTools } from "@builder/ToolBar/Tools/Inputs.tools";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { START_PREFIX } from "@builder/constants.local";
import { useOnConnect } from "@builder/hook/customConnection.hook";
import { TITLE_NODES } from "@builder/modules/Nodes/domain/constants";
import { FromPageContext } from "@builder/pages/Workflow";
import { FROM_PAGE } from "@builder/pages/constants.home";

export const StartNode = ({ data, id }: NodeProps) => {
    const fromPage = useContext(FromPageContext);
    const isToolsView = fromPage === FROM_PAGE.TOOL;

    const title = TITLE_NODES.START;

    const { setEdges } = useReactFlow();
    const onConnect = useOnConnect();

    return (
        <div className="relative">
            <article className="shadow-nodo min-w-8 max-w-64 flex-col rounded-12 border-2 border-primary-200 bg-gray-230">
                <header className={`grid h-12 items-center bg-teal-5 pl-5 ${isToolsView ? "rounded-t-12" : "rounded-12"}`}>
                    <h3 className="flex items-center gap-2 text-primary-200">
                        <PlayIconFilling />
                        <span className="font-semibold">{title}</span>
                    </h3>
                </header>
                <Switch>
                    <Switch.Case condition={isToolsView}>
                        <>
                            <section className="bg-gray-230 p-5">
                                <div className="border-b-2 border-b-[#CDD7E7] pb-4 text-center text-xs text-gray-400 ">
                                    Inicia el flujo declarando toda la información que necesitará tu herramienta, <b>agregando inputs</b>
                                </div>
                            </section>
                            <InputsTools />
                        </>
                    </Switch.Case>
                </Switch>
            </article>

            <Handle id={`${START_PREFIX}${id}`} onConnect={onConnect(setEdges)} type="source" position={Position.Right} className="targetsHandles !-right-[0.5rem]" />
        </div>
    );
};
