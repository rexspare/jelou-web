import { ArchivedIcon, ChatIcon, ChatOutlineIcon } from "@apps/shared/icons";
import React from "react";

import { useTranslation } from "react-i18next";

const HsmTab = (props) => {
    const { currentOption, setCurrentOption } = props;
    const { t } = useTranslation();

    const currentNavTab = {
        TEXT: 1,
        FILE: 2,
    };

    return (
        <div className="relative flex flex-1 flex-col bg-white">
            <div className="main-content flex flex-1 flex-col bg-white">
                <div className="flex h-12 w-full">
                    <div
                        className={`flex-1 cursor-pointer border-b-2 ${
                            currentOption === currentNavTab.TEXT ? "border-primary-200 text-gray-400" : "border-border-light text-gray-400"
                        }`}>
                        <div
                            className="flex h-full w-full items-center"
                            onClick={() => {
                                setCurrentOption(currentNavTab.TEXT);
                            }}>
                            <dl>
                                <div className="flex items-center">
                                    {currentOption === currentNavTab.TEXT ? (
                                        <ChatIcon className="mx-2 h-5 w-5 fill-current text-primary-200 mid:h-4 mid:w-4" />
                                    ) : (
                                        <ChatOutlineIcon className="mx-2 h-5 w-5 fill-current mid:h-4 mid:w-4" />
                                    )}
                                    <div className="flex text-base font-medium">{t("pma.Enviar mensaje")}</div>
                                </div>
                            </dl>
                        </div>
                    </div>
                    <div
                        className={`hidden flex-1 cursor-pointer border-b-2 md:flex ${
                            currentOption === currentNavTab.FILE ? "border-primary-200 text-gray-400" : "border-border-light text-gray-400"
                        }`}>
                        <div className="flex h-full w-full items-center" onClick={() => setCurrentOption(currentNavTab.FILE)}>
                            <dl>
                                <div className="flex items-center">
                                    {currentOption === currentNavTab.FILE ? (
                                        <ArchivedIcon className="mx-2 h-4 w-5 fill-current text-primary-200 mid:mr-1 mid:h-4  mid:w-5 xxl:mr-2 xxl:h-4 xxl:w-5" />
                                    ) : (
                                        <ArchivedIcon className="mx-2 h-4 w-5 fill-current mid:mr-1 mid:h-4 mid:w-5 xxl:mr-2 xxl:h-4 xxl:w-5" />
                                    )}
                                    <div className="flex text-base font-medium">{t("pma.Archivo")}</div>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HsmTab;
