import { Tab } from "@headlessui/react";
import { useState } from "react";

import { HTTP_NAMES_ID } from "@builder/modules/Nodes/Http/constants.http";
import type { TabHeadlessProps } from "./types";

export function TabHeadless({
    titleList = [],
    panelList = [],
    tabSpace = "",
    className = "",
    classNameNav = "",
    classNamePanel = "",
    enableBorder = true,
    queryBadgeNumber = null,
    styleTabNotSelected = "",
    headersBadgeNumber = null,
    styleTabSelected = "text-primary-200",
    classNameList = "flex justify-between px-4",
    classNameSelected = "border-transparent px-2",
}: TabHeadlessProps) {
    const [selected, setSelected] = useState(titleList[0].id);

    const handleSelectTab = (id: number | string) => () => setSelected(id);

    return (
        <Tab.Group as="nav" className={className}>
            <div className={classNameNav}>
                <Tab.List as="ul" className={classNameList}>
                    {titleList &&
                        titleList.length > 0 &&
                        titleList.map((title) => {
                            const { id, label, Icon = null, size, labelClassName = "text-15", type = "tab" } = title;

                            const styleText = selected === id ? styleTabSelected : "text-gray-340";
                            const styleBorder = enableBorder && selected === id ? "border-b-4 border-primary-200 py-3" : classNameSelected;
                            const styleSelected = `${styleText} ${styleBorder} ${styleTabNotSelected}`;

                            const badgeLiStyle = "flex gap-2 items-center pl-0 py-0 pr-0 border-b-0";
                            const numberBadgeStyle = `${selected === id ? "bg-[#CDF3ED] text-teal-953" : ""} w-8 rounded-r-md h-[2.1rem] hover:text-teal-953 px-2 pt-[0.35rem]`;

                            if (type === "button") {
                                return (
                                    <button key={id} onClick={() => console.log(type)} className="gradient h-8 w-max rounded-20 px-4 py-2 text-sm font-bold text-white">
                                        {label}
                                    </button>
                                );
                            } else {
                                return (
                                    <Tab key={id} as="li" className="flex items-center focus:outline-none focus:ring-transparent focus-visible:outline-none focus-visible:ring-transparent">
                                        <button
                                            key={id}
                                            onClick={handleSelectTab(id)}
                                            className={`cursor-pointer font-medium hover:text-primary-200 focus:outline-none focus:ring-transparent focus-visible:outline-none focus-visible:ring-transparent ${
                                                id === HTTP_NAMES_ID.HEADERS || id === HTTP_NAMES_ID.QUERY ? badgeLiStyle : "border-b-3 py-1"
                                            } ${labelClassName} ${styleSelected} ${tabSpace}`}
                                        >
                                            <span className="flex w-full justify-center">{Icon && <Icon width={size} height={size} />}</span>
                                            {label}
                                            {id === HTTP_NAMES_ID.HEADERS && (
                                                <div className={numberBadgeStyle} onClick={handleSelectTab(id)}>
                                                    <span className="font-bold">{headersBadgeNumber}</span>
                                                </div>
                                            )}
                                            {id === HTTP_NAMES_ID.QUERY && (
                                                <div className={numberBadgeStyle} onClick={handleSelectTab(id)}>
                                                    <span className="font-bold">{queryBadgeNumber}</span>
                                                </div>
                                            )}
                                        </button>
                                    </Tab>
                                );
                            }
                        })}
                </Tab.List>
            </div>

            <Tab.Panels as="ul" className={classNamePanel}>
                {panelList &&
                    panelList.length > 0 &&
                    panelList.map((panel) => {
                        const { id, Content } = panel;
                        return (
                            <Tab.Panel key={id} className="h-full w-full">
                                {Content}
                            </Tab.Panel>
                        );
                    })}
            </Tab.Panels>
        </Tab.Group>
    );
}
