import { END_TOOL_NODE_LIST, TOOL_NODE_LIST } from "../constants.toolbar";
import { ActionsList } from "./ItemsList.toolbar";

export const ToolsToolkitPanel = () => {
    return (
        <section className="absolute left-[0.6rem] top-[5rem] z-10 flex flex-col gap-y-2">
            <div className="flex w-14 flex-col items-center rounded-4 bg-white p-1 shadow-[4px_4px_5px_rgba(184,_189,_201,_0.25)] transition-all duration-300 ease-out">
                <ActionsList list={END_TOOL_NODE_LIST} showText showTooltip={false} />
            </div>
            <div className="flex w-14 flex-col items-center rounded-4 bg-white p-1 shadow-[4px_4px_5px_rgba(184,_189,_201,_0.25)] transition-all duration-300 ease-out">
                <ActionsList list={TOOL_NODE_LIST} showText showTooltip={false} />
            </div>
        </section>
    );
};
