import { DotsMenu } from "@apps/shared/icons";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

const DropDownMenu = (props) => {
    const { setOpenDuplicateModal, setOpenRestoreConfigModal } = props;

    const { t } = useTranslation();

    return (
        <Menu as="div" className="relative right-0 flex w-9 cursor-pointer">
            <Menu.Button className="w-full">
                <DotsMenu width="9" height="19" />
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
                <Menu.Items className="absolute right-3 z-120 ml-7 w-36 overflow-hidden rounded-[9px] bg-white shadow-menu">
                    {/* <Menu.Item>
                        <div className="flex flex-col">
                            <button
                                className="border-b-1 border-gray-200 py-2 px-3 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none "
                                onClick={() => setOpenDuplicateModal(true)}>
                                {t("Duplicar Configuración")}
                            </button>
                        </div>
                    </Menu.Item> */}

                    <Menu.Item>
                        <div className="flex flex-col">
                            <button
                                onClick={() => setOpenRestoreConfigModal(true)}
                                className="py-2  px-4 text-left text-13 font-bold text-gray-400 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 focus:outline-none"
                                // onClick={() => handleDeleteSchedule()}
                            >
                                {t("common.ResetSett")}
                            </button>
                        </div>
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default DropDownMenu;
