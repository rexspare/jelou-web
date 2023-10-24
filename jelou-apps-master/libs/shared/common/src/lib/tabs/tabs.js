import React from "react";
import { BeatLoader } from "react-spinners";
import isNumber from "lodash/isNumber";
import isEmpty from "lodash/isEmpty";

const Tabs = (props) => {
    const {
        marked1,
        marked2,
        marked3,
        showFirstTab,
        showSecondTab,
        showThirdTab,
        loading,
        title1,
        title2,
        title3,
        title3Number,
        title1Number,
        title2Number,
        backgroundColor = "transparent",
        borderBottomLeftRadius = "0px",
        borderBottomRightRadius = "0px",
        isBold = false,
        padding = "default",
    } = props;

    const getPadding = {
        sm: "px-1 lg:px-1 xxl:px-2",
        md: "p-1 px-2 lg:px-4 xxl:px-3",
        default: " p-1 px-3 lg:px-5 xxl:px-4",
    };
    return (
        <div className={`flex flex-wrap`} style={{ backgroundColor, borderBottomLeftRadius, borderBottomRightRadius }}>
            <button className={"bg-transparent " + getPadding[padding]} onClick={showFirstTab}>
                <dl>
                    {loading ? (
                        <div className="mt-1 text-15 leading-9">
                            <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                        </div>
                    ) : (
                        <div
                            className={`group flex w-fit items-center rounded-[0.5rem] px-4 py-3 font-semibold ${
                                marked1 ? "bg-primary-200 bg-opacity-15" : "hover:bg-primary-200 hover:bg-opacity-15"
                            }`}>
                            {isNumber(title1Number) && (
                                <dd
                                    className={`mr-1 text-15 font-bold xxl:text-lg ${
                                        marked1 ? "text-primary-200 " : "text-gray-400 group-hover:text-primary-200"
                                    }`}>
                                    {title1Number}
                                </dd>
                            )}
                            <dt
                                className={`truncate text-15 ${isBold && "font-bold"} xxl:text-lg ${
                                    marked1 ? "text-primary-200" : " text-gray-400 group-hover:text-primary-200"
                                }`}>
                                {title1}
                            </dt>
                        </div>
                    )}
                </dl>
            </button>
            {!isEmpty(title2) && (
                <button className={"bg-transparent " + getPadding[padding]} onClick={showSecondTab}>
                    <dl>
                        {loading ? (
                            <div className="mt-1 text-15 leading-9">
                                <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                            </div>
                        ) : (
                            <div
                                className={`group flex w-fit items-center rounded-[0.5rem] px-4 py-3 font-semibold ${
                                    marked2 ? "bg-primary-200 bg-opacity-15" : "hover:bg-primary-200 hover:bg-opacity-15"
                                }`}>
                                {isNumber(title2Number) && (
                                    <dd
                                        className={`mr-1 text-15 font-bold xxl:text-lg ${
                                            marked2 ? "text-primary-200 " : "text-gray-400 group-hover:text-primary-200"
                                        }`}>
                                        {title2Number}
                                    </dd>
                                )}
                                <dt
                                    className={`truncate text-15  ${isBold && "font-bold"} xxl:text-lg ${
                                        marked2 ? "text-primary-200" : " text-gray-400 group-hover:text-primary-200"
                                    }`}>
                                    {title2}
                                </dt>
                            </div>
                        )}
                    </dl>
                </button>
            )}
            {!isEmpty(title3) && (
                <button className={"bg-transparent " + getPadding[padding]} onClick={showThirdTab}>
                    <dl>
                        {loading ? (
                            <div className="mt-1 text-15 leading-9">
                                <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                            </div>
                        ) : (
                            <div
                                className={`group flex w-fit items-center rounded-[0.5rem] px-4 py-3 font-semibold ${
                                    marked3 ? "bg-primary-200 bg-opacity-15" : "hover:bg-primary-200 hover:bg-opacity-15"
                                }`}>
                                {isNumber(title3Number) && (
                                    <dd
                                        className={`mr-1 text-15 font-bold xxl:text-lg ${
                                            marked3 ? "text-primary-200 " : "text-gray-400 group-hover:text-primary-200"
                                        }`}>
                                        {title3Number}
                                    </dd>
                                )}
                                <dt
                                    className={`truncate text-15  ${isBold && "font-bold"} xxl:text-lg ${
                                        marked3 ? "text-primary-200" : " text-gray-400 group-hover:text-primary-200"
                                    }`}>
                                    {title3}
                                </dt>
                            </div>
                        )}
                    </dl>
                </button>
            )}
        </div>
    );
};

export default Tabs;
