import { TEAMS_SETTINGS } from "@apps/shared/constants";
import { CheckCircleIcon } from "@apps/shared/icons";
import { Disclosure, Tab, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";

export function TeamsSettingsMenu(props) {
    const { settingsSection, handleChangeSection } = props;
    const { t } = useTranslation();

    const sectionMatch = (section) => {
        if (section === settingsSection) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className="w-64 rounded-l-1 border-r-0.5 border-gray-5 bg-white xl:w-[22rem] base:w-70">
            <div className="relative flex h-[4.78rem] flex-1 items-center rounded-t-1 border-b-0.5 border-gray-25 bg-white"></div>
            <div className="">
                <Tab.Group>
                    <Disclosure defaultOpen={true}>
                        {({ open }) => (
                            <div className="">
                                <Disclosure.Button className="flex w-full items-center space-x-2 border-b-0.5 border-gray-5 px-5 py-3">
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
                                                    handleChangeSection(TEAMS_SETTINGS.GENERAL);
                                                }}
                                            >
                                                {({ selected }) => (
                                                    <div
                                                        className={`flex w-full items-center border-b-0.5 border-y-gray-5 px-5 py-6 ${
                                                            sectionMatch(TEAMS_SETTINGS.GENERAL) ? "border-r-5 border-x-primary-200 bg-teal-5" : null
                                                        }`}
                                                    >
                                                        <CheckCircleIcon
                                                            className={sectionMatch(TEAMS_SETTINGS.GENERAL) ? "text-gray-400" : "text-gray-400 text-opacity-65"}
                                                            width="1.2rem"
                                                            height="1.2rem"
                                                        />
                                                        <p className={`ml-4 truncate text-base font-bold ${sectionMatch(TEAMS_SETTINGS.GENERAL) ? "text-gray-400" : "text-gray-400 text-opacity-65"}`}>
                                                            {t("General")}
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
                </Tab.Group>
            </div>
        </div>
    );
}
export default TeamsSettingsMenu;
