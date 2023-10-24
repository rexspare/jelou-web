import React from "react";
import { BeatLoader } from "react-spinners";
import isNumber from "lodash/isNumber";
import isEmpty from "lodash/isEmpty";
import { DownloadIcon } from "@apps/shared/icons";

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
        loadingDownload,
        downloadReport,
        t,
    } = props;

    return (
        <div className={`flex ${title3 ? "grid-cols-3" : ""} mb-4 justify-between space-x-4 rounded-1 bg-white px-6`}>
            <div>
                <div
                    className={`group flex w-fit items-center rounded-[0.5rem] px-4 py-1 ${
                        marked1 ? "bg-primary-200 bg-opacity-15" : "hover:bg-primary-200 hover:bg-opacity-15"
                    }`}
                    onClick={() => showFirstTab()}>
                    <div className="flex items-center px-5 py-2">
                        <dl>
                            {loading ? (
                                <div className="mt-1 text-start leading-9">
                                    <BeatLoader color={"#00B3C7"} size={10} />
                                </div>
                            ) : (
                                <div className={`flex items-center`}>
                                    {isNumber(title1Number) && <dd className="mr-3  text-xl font-bold leading-9 text-primary-200">{title1Number}</dd>}
                                    <dt className="truncate  text-lg font-bold text-gray-400 opacity-50">{title1}</dt>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
                <div className={`inline-flex h-full cursor-pointer rounded-table ${marked2}`} onClick={() => showSecondTab()}>
                    <div className="flex items-center px-5 py-2">
                        <dl>
                            {loading ? (
                                <div className="mt-1 text-start leading-9">
                                    <BeatLoader color={"#00B3C7"} size={10} />
                                </div>
                            ) : (
                                <div className={`flex items-center`}>
                                    {isNumber(title2Number) && <dd className="mr-3  text-xl font-bold leading-9 text-primary-200">{title2Number}</dd>}
                                    <dt className="breakwords  text-lg font-bold text-gray-400 opacity-50">{title2}</dt>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
                {!isEmpty(title3) && (
                    <div className={`cursor-pointer rounded-table border-b-4 border-gray-200 ${marked3}`} onClick={() => showThirdTab()}>
                        <div className="px-5 py-2 xxl:px-10 xxl:py-7">
                            <dl>
                                {loading ? (
                                    <div className="mt-1 text-start leading-9">
                                        <BeatLoader color={"#00B3C7"} size={10} />
                                    </div>
                                ) : (
                                    <div className={`flex items-center`}>
                                        {isNumber(title3Number) && title3Number > 0 && (
                                            <dd className="mr-3  text-xl font-bold leading-9 text-gray-400">{title3Number}</dd>
                                        )}
                                        <dt className="breakwords  text-lg font-bold text-gray-400 opacity-50">{title3}</dt>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <div className="hidden h-full justify-end bg-white py-4 sm:flex ">
                    <div className="border-l flex items-center border-[#979aa7] pl-4 pr-6">
                        <button
                            className="border-l flex h-[30px]  w-[30px] appearance-none items-center justify-center rounded-full border-[#979aa7] bg-primary-200 focus:outline-none"
                            onClick={() => downloadReport(true)}>
                            <span className="flex text-white">
                                <DownloadIcon width="1.2rem" height="1.12rem" strokeWidth="1.5" fill="currentColor" stroke="currentColor" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Tabs;
