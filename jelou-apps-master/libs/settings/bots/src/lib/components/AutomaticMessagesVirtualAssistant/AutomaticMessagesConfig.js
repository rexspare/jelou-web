import { CalendarIcon, WhiteEyeIcon } from "@apps/shared/icons";
import { Menu, Transition } from "@headlessui/react";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";

import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

const AutomaticMessagesConfig = (props) => {
    const { handleChangeSetting, generalData, actualBot, settingsBody } = props;

    const { type: botType } = actualBot;

    const { key, displayName, description } = generalData;

    const getValue = (type, key) => {
        const filteredSetting = settingsBody.settings.filter((option) => option.key === key);
        const settingBody = first(filteredSetting);

        if (type === "unity") {
            if (!isEmpty(filteredSetting)) {
                if (!isEmpty(settingBody)) {
                    return settingBody["unity"];
                }

                return;
            }
            return;
        }
        if (type === "number" || type === "string") {
            if (!isEmpty(filteredSetting)) {
                return first(filteredSetting)["value"];
            }
            return "";
        }
        if (type === "checkbox") {
            if (!isEmpty(filteredSetting)) {
                return Boolean(first(filteredSetting)["value"]);
            }
            return;
        }
    };

    const valueIsSet = (key) => {
        const selectedValuesFiltered = settingsBody.settings.filter((selectedValue) => selectedValue.key === key);
        if (!isEmpty(selectedValuesFiltered)) {
            return true;
        } else {
            return false;
        }
    };

    const { t } = useTranslation();

    const getBotBubble = () => {
        switch (botType) {
            case "Whatsapp":
                return (
                    <Menu.Items className="absolute  -right-[9rem] top-4 z-120 ml-7 w-[16rem] overflow-hidden rounded-[9px] bg-gray-950 p-3 shadow-menu xl:top-0 xl:left-1">
                        <Menu.Item as={"div"} className="flex min-h-[8rem] flex-col rounded-r-1 rounded-bl-1  p-3 ">
                            <div className=" h-16 w-40 self-end rounded-1 bg-green-450"></div>
                            <div className="mt-3 flex w-full flex-col self-end rounded-1 bg-white p-3 ">
                                <p className="text-sm text-gray-400">{valueIsSet(key) ? getValue("string", key) : ""}</p>
                                <p className="pt self-end p-1 text-xs text-gray-400 text-opacity-50">{t("settings.minutesAgo")}</p>
                            </div>
                        </Menu.Item>
                    </Menu.Items>
                );

            case "Facebook":
                return (
                    <Menu.Items className="absolute -right-[9rem] top-4 z-120 ml-7 w-[16rem] overflow-hidden rounded-[9px] bg-white px-3 pb-2 shadow-menu xl:top-0 xl:left-1">
                        <Menu.Item as={"div"} className="flex min-h-[8rem] flex-col rounded-r-1 rounded-bl-1 p-3 ">
                            <p className="pt self-center p-1 pb-2 text-xs text-gray-400 text-opacity-50">29 de septiembre, 23:30</p>
                            <div className=" h-12 w-40 self-end rounded-20 bg-blue-1000"></div>
                            <div className="flex items-end ">
                                <div className="mr-2 h-6 w-6 rounded-100 bg-[#F8B68F]"></div>
                                <div className="mt-3 flex w-full flex-1 flex-col self-end rounded-20 bg-gray-80 p-3 ">
                                    <p className="text-sm text-gray-400">{valueIsSet(key) ? getValue("string", key) : ""}</p>
                                </div>
                            </div>
                        </Menu.Item>
                    </Menu.Items>
                );
            case "Facebook_Feed":
                return (
                    <Menu.Items className="absolute -right-[9rem] top-4 z-120 ml-7 w-[16rem] overflow-hidden rounded-[9px] bg-white px-3 pb-2 shadow-menu xl:top-0 xl:left-1">
                        <Menu.Item as={"div"} className="flex min-h-[8rem] flex-col rounded-r-1 rounded-bl-1 p-3 ">
                            <p className="pt self-center p-1 pb-2 text-xs text-gray-400 text-opacity-50">29 de septiembre, 23:30</p>
                            <div className=" h-12 w-40 self-end rounded-20 bg-blue-1000"></div>
                            <div className="flex items-end ">
                                <div className="mr-2 h-6 w-6 rounded-100 bg-[#F8B68F]"></div>
                                <div className="mt-3 flex w-full flex-1 flex-col self-end rounded-20 bg-gray-80 p-3 ">
                                    <p className="text-sm text-gray-400">{valueIsSet(key) ? getValue("string", key) : ""}</p>
                                </div>
                            </div>
                        </Menu.Item>
                    </Menu.Items>
                );
            case "Sms":
                return (
                    <Menu.Items className="absolute -right-[9rem] top-4 z-120 ml-7 w-[16rem] overflow-hidden rounded-[9px] bg-white px-3 pb-2 shadow-menu xl:top-0 xl:left-1">
                        <Menu.Item as={"div"} className="flex min-h-[8rem] flex-col rounded-r-1 rounded-bl-1 p-3 ">
                            <p className="pt self-center p-1 pb-2 text-xs text-gray-400 text-opacity-50">29 de septiembre, 23:30</p>
                            <div className=" h-12 w-40 self-end rounded-t-1 rounded-bl-1 bg-[#6AD06B]"></div>
                            <div className="flex items-end ">
                                <div className="mt-3 flex w-full flex-1 flex-col self-end rounded-t-1 rounded-br-1 bg-gray-80 p-3 ">
                                    <p className="text-sm text-gray-400">{valueIsSet(key) ? getValue("string", key) : ""}</p>
                                </div>
                            </div>
                        </Menu.Item>
                    </Menu.Items>
                );

            case "Instagram":
                return (
                    <Menu.Items className="absolute -right-[9rem] top-4 z-120 ml-7 w-[16rem] overflow-hidden rounded-[9px] bg-white p-2 px-3 shadow-menu xl:top-0 xl:left-1">
                        <Menu.Item as={"div"} className="flex min-h-[8rem] flex-col rounded-r-1 rounded-bl-1 p-3 ">
                            <div className=" h-12 w-40 self-end rounded-20 bg-[#EFEFEF]"></div>
                            <div className="flex items-end ">
                                <div className="mr-2 h-6 w-6 rounded-100 bg-[#F8B68F]"></div>
                                <div className="mt-3 flex w-full flex-1 flex-col self-end rounded-20 border-0.5 border-gray-5 p-3">
                                    <p className="text-sm text-gray-400">{valueIsSet(key) ? getValue("string", key) : ""}</p>
                                </div>
                            </div>
                            <p className="self-center p-1 pt-2 text-xs text-gray-400 text-opacity-50">29 de septiembre, 23:30</p>
                        </Menu.Item>
                    </Menu.Items>
                );
            case "Twitter":
                return (
                    <Menu.Items className="absolute -right-[9rem] top-4 ml-7 w-[16rem] overflow-hidden rounded-[9px] bg-white p-2 px-3 shadow-menu xl:top-0 xl:left-1">
                        <Menu.Item as={"div"} className="flex min-h-[8rem] flex-col rounded-r-1 rounded-bl-1 p-3 ">
                            <div className=" h-12 w-40 self-end rounded-t-1 rounded-bl-1 bg-[#469BE9]"></div>
                            <p className="self-end pt-1 text-xs font-semibold text-gray-400 text-opacity-80">29 septiembre 2022 23:30 p.m.</p>
                            <div className="flex items-end">
                                <div className="mr-2 h-6 w-6 rounded-100 bg-[#F8B68F]"></div>
                                <div className="mt-3 flex w-full flex-1 flex-col self-end rounded-t-1 rounded-br-1 bg-[#F0F3F4] p-3">
                                    <p className="text-sm text-gray-400">{valueIsSet(key) ? getValue("string", key) : ""}</p>
                                </div>
                            </div>
                            <p className="pl-[3rem] pt-1 text-xs font-semibold text-gray-400 text-opacity-80">29 septiembre 2022 23:30 p.m.</p>
                        </Menu.Item>
                    </Menu.Items>
                );

            case "Widget":
                return (
                    <Menu.Items className="absolute -right-[9rem] top-4 z-120 ml-7 w-[16rem] overflow-hidden rounded-[9px] bg-white px-3 py-2 shadow-menu xl:top-0 xl:left-1">
                        <Menu.Item as={"div"} className="flex min-h-[8rem] flex-col rounded-r-1 rounded-bl-1 p-3 ">
                            <div class="flex justify-center border-t-2 border-gray-5 bg-white  p-3 px-2">
                                <div class="-mt-6  bg-white px-2 font-semibold text-gray-400">
                                    <div class="flex items-center rounded-md border-0.5 border-gray-5 bg-white px-2">
                                        <CalendarIcon width="1rem" />
                                        <p className="ml-2 text-base text-gray-475">Hoy</p>
                                    </div>
                                </div>
                            </div>
                            <div className=" h-12 w-40 self-end rounded-t-1 rounded-bl-1 bg-[#E7F6F8]"></div>
                            <div className="flex items-end ">
                                <div className="mt-3 flex w-full flex-1 flex-col self-end rounded-t-1 rounded-br-1 bg-[#F0F3F4] p-3 ">
                                    <p className="text-sm text-gray-400">{valueIsSet(key) ? getValue("string", key) : ""}</p>
                                </div>
                            </div>
                        </Menu.Item>
                    </Menu.Items>
                );

            default:
                break;
        }
    };

    return (
        <div className="flex w-80 flex-col py-3">
            <div className="flex items-center space-x-2 pb-2">
                <p className="text-15 font-bold text-gray-400 text-opacity-80">{t(displayName)}</p>
                <Menu as="div" className="relative right-0 flex w-9 cursor-pointer ">
                    <Menu.Button className="w-full">
                        {({ open }) => (
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-primary-200  ${!open && "bg-opacity-20"}`}>
                                <WhiteEyeIcon width="1rem" height="1rem" className="text-white" />
                            </div>
                        )}
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        {getBotBubble()}
                    </Transition>
                </Menu>
            </div>
            <p className="pb-2 text-sm text-gray-400 text-opacity-80">{description}</p>
            <textarea
                value={valueIsSet(key) ? getValue("string", key) : ""}
                id={key}
                onChange={(event) => {
                    handleChangeSetting(event, "string");
                }}
                className="resize-none rounded-1 border-1 border-gray-5 p-4 text-gray-400"
                rows={3}
            ></textarea>
        </div>
    );
};

export default AutomaticMessagesConfig;
