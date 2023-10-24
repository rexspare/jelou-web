import { CheckCircleIcon, CloseIcon, DiaryIcon, MessageIcon, SearchIcon } from "@apps/shared/icons";
import { Disclosure, Tab, Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";

const GeneralSettings = (props) => {
    const { t, settingsSection, handleChangeSection } = props;

    const [showCRM, setShowCRM] = useState(true);

    const sectionMatch = (section) => {
        if (section === settingsSection) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className="rounded-l-1  border-r-0.5 border-gray-25 bg-white xl:w-[22rem] base:w-70">
            <div className="relative flex h-[4.78rem] flex-1 items-center rounded-t-1 border-b-0.5 border-gray-25 bg-white"></div>
            <div className="">
                <Tab.Group>
                    <Disclosure defaultOpen={true}>
                        {({ open }) => (
                            <div className="">
                                <Disclosure.Button className="flex w-full items-center space-x-2 border-b-0.5 border-gray-25 px-5 py-3">
                                    <p className="text-base font-bold text-primary-200">{t("settings.bots.vistualAss")}</p>
                                    <svg viewBox="0 0 20 20" className={`mr-2 h-5 w-5 fill-current text-primary-200 transition-all ${!open ? "rotate-180 transform" : ""} `}>
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </Disclosure.Button>
                                <Transition
                                    show={open}
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <Disclosure.Panel>
                                        <Tab.List>
                                            <Tab
                                                className={"flex w-full"}
                                                onClick={() => {
                                                    handleChangeSection("botsGeneral");
                                                }}
                                            >
                                                {({ selected }) => (
                                                    <div
                                                        className={`flex w-full items-center border-b-0.5 border-y-gray-25 px-5 py-6 ${
                                                            sectionMatch("botsGeneral") ? "border-r-5 border-x-primary-200 bg-teal-5" : null
                                                        }`}
                                                    >
                                                        <CheckCircleIcon className={sectionMatch("botsGeneral") ? "text-gray-400" : "text-gray-400 text-opacity-65"} width="1.2rem" height="1.2rem" />
                                                        <p className={`ml-4 truncate text-base font-bold ${sectionMatch("botsGeneral") ? "text-gray-400" : "text-gray-400 text-opacity-65"}`}>
                                                            {t("settings.bots.generalBots")}
                                                        </p>
                                                    </div>
                                                )}
                                            </Tab>
                                            <Tab
                                                className={"flex w-full"}
                                                onClick={() => {
                                                    handleChangeSection("automaticMessagesVirtualAssitant");
                                                }}
                                            >
                                                {({ selected }) => (
                                                    <div
                                                        className={`flex w-full items-center border-b-0.5 border-y-gray-25 px-5 py-6 ${
                                                            sectionMatch("automaticMessagesVirtualAssitant") ? "border-r-5 border-x-primary-200 bg-teal-5" : null
                                                        }`}
                                                    >
                                                        <MessageIcon
                                                            className={sectionMatch("automaticMessagesVirtualAssitant") ? "text-gray-400" : "text-gray-400 text-opacity-65"}
                                                            fill={sectionMatch("automaticMessagesVirtualAssitant") ? "#727C94" : "#B8BDC9"}
                                                            width="1.3rem"
                                                            height="1.3rem"
                                                        />
                                                        <p
                                                            className={`ml-4 truncate text-base font-bold ${
                                                                sectionMatch("automaticMessagesVirtualAssitant") ? "text-gray-400" : "text-gray-400 text-opacity-65"
                                                            }`}
                                                        >
                                                            {t("settings.bots.automaticMsg")}
                                                        </p>
                                                    </div>
                                                )}
                                            </Tab>
                                        </Tab.List>
                                    </Disclosure.Panel>
                                </Transition>
                            </div>
                        )}
                    </Disclosure>
                    <Disclosure defaultOpen={true}>
                        {({ open }) => (
                            <div className="">
                                <Disclosure.Button className="flex w-full items-center space-x-2 border-b-0.5 border-gray-25 px-5 py-3">
                                    <p className="text-base font-bold text-primary-200">{t("common.multiAgtPanel")}</p>
                                    <svg viewBox="0 0 20 20" className={`mr-2 h-5 w-5 fill-current text-primary-200 transition-all ${!open ? "rotate-180 transform" : ""} `}>
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </Disclosure.Button>
                                <Transition
                                    show={open}
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <Disclosure.Panel>
                                        <Tab.List>
                                            <Tab
                                                className={"flex w-full"}
                                                onClick={() => {
                                                    handleChangeSection("generalPma");
                                                }}
                                            >
                                                {({ selected }) => (
                                                    <div
                                                        className={`flex w-full items-center border-b-0.5 border-y-gray-25 px-5 py-6 ${
                                                            sectionMatch("generalPma") ? "border-r-5 border-x-primary-200 bg-teal-5" : null
                                                        }`}
                                                    >
                                                        <CheckCircleIcon className={sectionMatch("generalPma") ? "text-gray-400" : "text-gray-400 text-opacity-65"} width="1.2rem" height="1.2rem" />
                                                        <p className={`ml-4 truncate text-base font-bold ${sectionMatch("generalPma") ? "text-gray-400" : "text-gray-400 text-opacity-65"}`}>
                                                            {t("settings.bots.generalPma")}
                                                        </p>
                                                    </div>
                                                )}
                                            </Tab>
                                            <Tab
                                                className={"flex w-full"}
                                                onClick={() => {
                                                    handleChangeSection("PmaAutomaticMessages");
                                                }}
                                            >
                                                {({ selected }) => (
                                                    <div
                                                        className={`flex w-full items-center border-b-0.5 border-y-gray-25 px-5 py-6 ${
                                                            sectionMatch("PmaAutomaticMessages") ? "border-r-5 border-x-primary-200 bg-teal-5" : null
                                                        }`}
                                                    >
                                                        <MessageIcon
                                                            className={sectionMatch("PmaAutomaticMessages") ? "text-gray-400" : "text-gray-400 text-opacity-65"}
                                                            fill={sectionMatch("PmaAutomaticMessages") ? "#727C94" : "#B8BDC9"}
                                                            width="1.3rem"
                                                            height="1.3rem"
                                                        />
                                                        <p className={`ml-4 truncate text-base font-bold ${sectionMatch("PmaAutomaticMessages") ? "text-gray-400" : "text-gray-400 text-opacity-65"}`}>
                                                            {t("settings.bots.automaticMsg")}
                                                        </p>
                                                    </div>
                                                )}
                                            </Tab>
                                            {showCRM && (
                                                <Tab
                                                    className={"flex w-full"}
                                                    onClick={() => {
                                                        handleChangeSection("CrmModule");
                                                    }}
                                                >
                                                    {({ selected }) => (
                                                        <div
                                                            className={`flex w-full items-center border-b-0.5 border-y-gray-25 px-5 py-6 ${
                                                                sectionMatch("CrmModule") ? "border-r-5 border-x-primary-200 bg-teal-5" : null
                                                            }`}
                                                        >
                                                            <DiaryIcon className={sectionMatch("CrmModule") ? "text-gray-400" : "text-gray-400 text-opacity-65"} width="1.2rem" height="1.2rem" />
                                                            <p className={`ml-4 truncate text-base font-bold ${sectionMatch("CrmModule") ? "text-gray-400" : "text-gray-400 text-opacity-65"}`}>
                                                                {t("CRM")}
                                                            </p>
                                                        </div>
                                                    )}
                                                </Tab>
                                            )}
                                        </Tab.List>
                                    </Disclosure.Panel>
                                </Transition>
                            </div>
                        )}
                    </Disclosure>
                </Tab.Group>
            </div>
        </div>
    );
};

export default GeneralSettings;
