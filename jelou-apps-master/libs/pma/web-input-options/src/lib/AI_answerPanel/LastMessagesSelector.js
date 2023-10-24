import { ChevronLeftIcon } from "@apps/shared/icons";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LastMessagesSelector = (props) => {
    const { t } = useTranslation();
    const { selectedHistoryOption, setSelectedHistoryOption, disabled, onChangeOption = null } = props;

    const options = [
        { id: 1, value: 5, label: t("pma.5 mensajes") },
        { id: 2, value: 10, label: t("pma.10 mensajes") },
        { id: 3, value: 15, label: t("pma.15 mensajes") },
    ];
    const lang = localStorage.getItem("lang");
    useEffect(() => {
        const index = options.findIndex((option) => option.value === selectedHistoryOption.value);

        setSelectedHistoryOption(options[index]);
    }, [lang]);

    useEffect(() => {
        setSelectedHistoryOption(options[2]);
    }, []);

    return (
        <div className="flex items-center justify-center">
            <div className="relative pr-1 font-medium">{t("pma.Seleccionar últimos")}:</div>
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button
                    disabled={disabled}
                    className="disabled:hover:cursor-not-Allowed flex items-center space-x-2 rounded-lg border-default border-gray-300 px-2 py-1 font-semibold disabled:cursor-not-allowed"
                >
                    <span className="font-semibold">{selectedHistoryOption?.label}</span>
                    <ChevronLeftIcon className=" -rotate-90 text-gray-400 hover:text-primary-200" width={"0.75em"} />
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
                    <Menu.Items className="divide-y ring-opacity-5 ring-1 absolute left-0 z-20 mt-2 w-full origin-top-left divide-gray-400/75 rounded-md bg-white px-2 shadow-lg ring-transparent focus:outline-none">
                        <div className="flex flex-col px-1 py-1">
                            {options.map((option) => (
                                <Menu.Item
                                    as={"div"}
                                    onClick={() => {
                                        if (onChangeOption) {
                                            onChangeOption();
                                        }
                                        setSelectedHistoryOption(option);
                                    }}
                                    className={"group  py-2 hover:cursor-pointer"}
                                >
                                    <span className={` whitespace-nowrap group-hover:text-primary-200 ${selectedHistoryOption.value === option.value ? "text-primary-200" : ""}`}>{option.label}</span>
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

export default LastMessagesSelector;
