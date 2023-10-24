/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import DurationPicker from "./DurationPicker";
import Options from "./Options";

const OptionsPicker = (props) => {
    const { flows, generateOption, options, removeOption, updateOption, flowId, handleDuration, ttlValue, flow, setFlow } = props;
    return (
        <div className="mb-6">
            {options.map((option) => (
                <Options
                    option={option}
                    key={option.id}
                    removeOption={removeOption}
                    flows={flows}
                    updateOption={updateOption}
                    flowId={flowId}
                    flow={flow}
                    setFlow={setFlow}
                />
            ))}

            <div className="flex max-w-xl flex-1 justify-end">
                <button className="flex h-10 w-10 items-center justify-center" onClick={generateOption}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600 hover:text-primary-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>
            <DurationPicker ttlValue={ttlValue} handleDuration={handleDuration} />
        </div>
    );
};

export default OptionsPicker;
