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
    } = props;
    return (
        <div className={`flex flex-wrap`} style={{ backgroundColor, borderBottomLeftRadius, borderBottomRightRadius }}>
            <button className="rounded-tl-xl bg-transparent px-3 py-2 lg:px-5 lg:py-4 xxl:p-4" onClick={showFirstTab}>
                <dl>
                    {loading ? (
                        <div className="mt-1 text-15 leading-9">
                            <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                        </div>
                    ) : (
                        <div
                            className={`group flex w-fit items-center rounded-[0.5rem] px-4 py-1 ${
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
                <button className="bg-transparent px-3 py-2 lg:px-5 lg:py-4 xxl:p-4" onClick={showSecondTab}>
                    <dl>
                        {loading ? (
                            <div className="mt-1 text-15 leading-9">
                                <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                            </div>
                        ) : (
                            <div
                                className={`group flex w-fit items-center rounded-[0.5rem] px-4 py-1 ${
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
                <button className="bg-transparent px-3 py-2 lg:px-5 lg:py-4 xxl:p-4" onClick={showThirdTab}>
                    <dl>
                        {loading ? (
                            <div className="mt-1 text-15 leading-9">
                                <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                            </div>
                        ) : (
                            <div
                                className={`group flex w-fit items-center rounded-[0.5rem] px-4 py-1 ${
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
