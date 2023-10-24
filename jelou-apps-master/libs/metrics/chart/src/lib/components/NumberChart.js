import React from "react";
import GrowthPercent from "./GrowthPercent";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";

const NumberChart = (props) => {
    const { data, period, fullscreen } = props;
    const { value, growthType, growthPercentage } = data;

    return (
        <div className="relative flex h-full w-full flex-col items-center justify-center">
            <div className="mb-auto flex flex-1 items-center">
                <h1 className={`${fullscreen ? `text-9xl` : `text-6xl`} mb-8 font-bold text-gray-400`}>
                    {isNull(value) || isUndefined(value) ? "0" : value.toLocaleString()}
                </h1>
            </div>
            <div className={`${fullscreen ? `mb-4 text-2xl` : `mb-0`} bottom-0 left-0 mt-auto flex w-full items-center justify-center`}>
                <GrowthPercent growthType={growthType} period={period} growthPercentage={growthPercentage} />
            </div>
        </div>
    );
};

export default NumberChart;
