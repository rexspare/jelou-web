import { actionsList } from "../constants.toolbar";
import { ActionsList } from "./ItemsList.toolbar";

export const ToolsToolkitPanel = () => {
    const actionList = actionsList[1].list;
    const apartAction = actionList.find((action) => action?.apart === true);
    return (
        <div className={`absolute top-[5rem] left-[1rem] z-10 flex transform flex-col space-y-2 rounded-10 bg-transparent p-2 transition-all duration-300 ease-out`}>
            <button className="flex-col items-center rounded-10 bg-white pb-2 pt-[10px] text-9 text-gray-400 shadow-[4px_4px_5px_rgba(184,_189,_201,_0.25)]">
                <ActionsList list={[apartAction]} showText={true} showApart={true} />
            </button>
            <div className="grid items-center gap-4 rounded-10 bg-white py-2 shadow-[4px_4px_5px_rgba(184,_189,_201,_0.25)]">
                <ActionsList list={actionList} showText={true} />
            </div>
        </div>
    );
};
