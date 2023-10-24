import React from "react";
import Tippy from "@tippyjs/react";
import { Whatsapp, Facebook } from "@apps/shared/icons";
import toUpper from "lodash/toUpper";
import { useTranslation } from "react-i18next";

const SettingsHeader = (props) => {
    const { bot } = props;
    const { t } = useTranslation();

    return (
        <div>
            <nav className="relative hidden justify-center bg-white shadow-sm sm:flex">
                <div className="absolute left-0 top-0 ml-6 flex h-full items-center justify-center px-6 text-lg font-medium">
                    <span>
                        {toUpper(bot.type) === "FACEBOOK" ? (
                            <Facebook width="1.625rem" height="1.625rem" />
                        ) : (
                            <Whatsapp width="1.625rem" height="1.625rem" />
                        )}
                    </span>
                    <span className="ml-3 text-gray-400">{bot.name}</span>
                </div>
                <div className="mx-auto px-4 sm:px-6 lg:px-20">
                    <div className="flex h-16 justify-between">
                        <div className="flex w-full">
                            <div className="hidden h-full w-full justify-between sm:flex">
                                <nav className="flex">
                                    <Tippy content={t("botsSettingsHeader.soon")} placement={"bottom"}>
                                        <button
                                            aria-current="page"
                                            className="group inline-flex cursor-not-allowed items-center border-b-3 border-transparent px-6 font-bold leading-5 text-gray-400 text-opacity-75 opacity-50 focus:outline-none">
                                            <span className="mx-auto">Bot</span>
                                        </button>
                                    </Tippy>
                                    <div className="w-px h-full bg-gray-500 opacity-10"></div>
                                    <button
                                        disabled={true}
                                        className=" inline-flex items-center border-b-3 border-primary-200 px-6 font-bold leading-5 text-gray-400 text-opacity-75">
                                        <span className="mx-auto">{t("botsSettingsHeader.settings")}</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default SettingsHeader;
