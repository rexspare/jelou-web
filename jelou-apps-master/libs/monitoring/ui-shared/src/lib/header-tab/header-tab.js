import React from "react";
import { BeatLoader } from "react-spinners";
import isNumber from "lodash/isNumber";
import isEmpty from "lodash/isEmpty";

const HeaderTab = (props) => {
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
    } = props;

    return (
        <div className={`grid gap-2 ${title3 ? "grid-cols-3" : "grid-cols-2"}`}>
            <div className={`cursor-pointer rounded-table border-b-4 text-center ${marked1}`} onClick={() => showFirstTab()}>
                <div className="p-2 lg:p-5 xxl:px-10 xxl:py-7">
                    <dl>
                        {loading ? (
                            <div className="mt-1 text-start leading-9">
                                <BeatLoader color={"#00B3C7"} size={10} />
                            </div>
                        ) : (
                            <div className={`flex items-center justify-center`}>
                                {isNumber(title1Number) && <dd className="mr-3 text-xl font-bold leading-9 xxl:text-3xl">{title1Number}</dd>}
                                <dt className="truncate text-lg font-bold lg:text-xl xxl:text-2xl">{title1}</dt>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
            <div className={`cursor-pointer rounded-table border-b-4 text-center ${marked2}`} onClick={() => showSecondTab()}>
                <div className="p-2 lg:p-5 xxl:px-10 xxl:py-7">
                    <dl>
                        {loading ? (
                            <div className="mt-1 text-start leading-9">
                                <BeatLoader color={"#00B3C7"} size={10} />
                            </div>
                        ) : (
                            <div className={`flex items-center justify-center`}>
                                {isNumber(title2Number) && <dd className="mr-3 text-xl font-bold leading-9 xxl:text-3xl">{title2Number}</dd>}
                                <dt className="breakwords text-lg font-bold lg:text-xl xxl:text-2xl">{title2}</dt>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
            {!isEmpty(title3) && (
                <div className={`cursor-pointer rounded-table border-b-4 text-center ${marked3}`} onClick={() => showThirdTab()}>
                    <div className="p-2 lg:p-5 xxl:px-10 xxl:py-7">
                        <dl>
                            {loading ? (
                                <div className="mt-1 text-start leading-9">
                                    <BeatLoader color={"#00B3C7"} size={10} />
                                </div>
                            ) : (
                                <div className={`flex items-center justify-center`}>
                                    {isNumber(title3Number) && title3Number > 0 && (
                                        <dd className="mr-3 text-xl font-bold leading-9 xxl:text-3xl">{title3Number}</dd>
                                    )}
                                    <dt className="breakwords text-lg font-bold lg:text-xl xxl:text-2xl">{title3}</dt>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            )}
        </div>
    );
};
export default HeaderTab;
