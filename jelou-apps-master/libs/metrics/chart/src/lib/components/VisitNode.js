import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { CheckPointNodeIcon } from "@apps/shared/icons";
import get from "lodash/get";
import { useTranslation } from "react-i18next";

const nodeIdleStyle = "relative mb-2 flex w-[14rem] rounded-lg border-2 border-white bg-white p-2 shadow-lg hover:border-primary-100";
const nodeActiveStyle = "relative mb-2 flex w-[14rem] rounded-lg border-2 border-primary-100 bg-white p-2 shadow-lg";

function VisitNode({ data }) {
    const bgColor = parseFloat(data.percent) > 75 ? "bg-[#D9F6F2]" : parseFloat(data.percent) > 25 ? "bg-[#fff6e1]" : "bg-[#fdefed]";
    const textColor = parseFloat(data.percent) > 75 ? "text-green-960" : parseFloat(data.percent) > 25 ? "text-[#645530]" : "text-[#EC5F4F]";
    const iconColor = parseFloat(data.percent) > 75 ? "#209F8B" : parseFloat(data.percent) > 25 ? "#645530" : "#EC5F4F";
    const isSource = data.isSource;
    const { t } = useTranslation();

    const label = get(data, "label", "");
    const total = get(data, "total", "");
    const percent = get(data, "percent", "");

    return (
        <>
            <Handle type="target" position={Position.Left} className="invisible" />
            <div className={data.active ? nodeActiveStyle : nodeIdleStyle}>
                <span className="px-2 text-left text-sm font-semibold text-gray-400">{label}</span>
                <div
                    className={`border h-fit absolute left-0 bottom-[-43px] flex w-full items-center rounded-lg border-[#DCDEE4] p-2 px-3 shadow-lg ${bgColor}`}>
                    <CheckPointNodeIcon fill={iconColor} className="mr-2 h-4 w-4" />
                    <div className="flex flex-1 items-center justify-between">
                        <span className={`${textColor} text-xs`}>
                            {total} {t("plugins.visitas")}
                        </span>
                        <span className={`${textColor} text-xs`}>{percent}%</span>
                    </div>
                </div>
            </div>
            {isSource && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="focus:cursor-default hover:cursor-default pointer-events-none -right-2 z-20 -mt-1 h-4 w-4 select-none border-2 border-white bg-[#72787E]"
                />
            )}
        </>
    );
}

export default VisitNode;
