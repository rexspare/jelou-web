/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import first from "lodash/first";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import { ComboboxSelect, TextFilter } from "@apps/shared/common";

const Options = (props) => {
    const { option, flows, removeOption, updateOption } = props;
    const { t } = useTranslation();
    const { title, flowId } = option;
    const [flow, setFlow] = useState();

    useEffect(() => {
        const flow = flows.find((flow) => flow.id === parseInt(flowId, 10));
        setFlow(flow);
    }, [flowId]);

    // useEffect(() => {
    //     if (!isEmpty(flows) && option.flowId === "") {
    //         const flowFirst = first(flows);
    //         if (flowFirst) {
    //             updateOption(option.id, {
    //                 ...option,
    //                 flowId: flowFirst.id,
    //                 flowName: flowFirst.title,
    //             });
    //         }
    //     }
    // }, [flows, option]);

    const handleInput = (target) => {
        const tmpOpt = {
            ...option,
        };
        if (typeof target === "string") {
            tmpOpt.title = target;
        }

        updateOption(option.id, tmpOpt);
    };

    const handleFlow = (value) => {
        const tmpOpt = {
            ...option,
        };
        tmpOpt.flowId = value.id;
        tmpOpt.flowName = get(value, "title");
        setFlow(value);
        updateOption(option.id, tmpOpt);
    };

    return (
        <div className="border-options relative mb-4 flex max-w-xl items-center rounded-md p-3">
            <div className="mr-1 flex flex-1 flex-col">
                <TextFilter filter={"text"} onChange={handleInput} background={"#fff"} label={t("Options.name")} value={title} />
            </div>
            <div className="relative ml-1 flex flex-1 flex-col">
                <ComboboxSelect
                    options={flows}
                    value={flow}
                    label={t("FlowPicker.selectFlow")}
                    handleChange={handleFlow}
                    name={"input"}
                    background={"#fff"}
                    hasCleanFilter={false}
                />
            </div>
            <button
                className="absolute top-0 right-0 -mt-2 -mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 text-opacity-75 shadow-md hover:text-red-500"
                onClick={() => removeOption(option.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Options;
