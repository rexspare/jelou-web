import { Menu, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";

import { DeleteIcon, EditCard, MoreOptionsIcon } from "@apps/shared/icons";
import DeleteDatabaseModal from "../Modals/DeleteDatabase";

const DatabaseCardOptions = (props) => {
    const { databaseName, databaseId, showDeleteOption, showUpdateOption, setShowDeleteModal, showDeleteModal, showModalEditCards } = props;

    const { t } = useTranslation();

    return (
        <>
            <Menu as="div">
                <Menu.Button as="button" className="h-9 w-7">
                    <MoreOptionsIcon width="12" height="4" className="fill-current" />
                </Menu.Button>
                <Transition
                    as="section"
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items as="ul" className="absolute right-0 z-120 flex w-36 flex-col items-center overflow-hidden rounded-10 bg-white shadow-menu">
                        {showDeleteOption && (
                            <Menu.Item
                                as="li"
                                className="flex w-full cursor-pointer items-center justify-center border-1 border-transparent border-b-gray-border px-3 hover:bg-primary-200 hover:bg-opacity-10"
                            >
                                <DeleteIcon width="30" height="18" />
                                <button
                                    className="w-full py-2 pl-[0.5rem] pr-[1rem] text-left text-13 text-gray-400 hover:text-primary-200 focus:outline-none"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    {t("dataReport.delete")}
                                </button>
                            </Menu.Item>
                        )}
                        {showUpdateOption && (
                            <Menu.Item
                                as="li"
                                className="flex w-full cursor-pointer items-center justify-center border-1 border-transparent border-b-gray-border px-3 hover:bg-primary-200 hover:bg-opacity-10"
                            >
                                <EditCard width="30" height="18" />
                                <button onClick={showModalEditCards} className="w-full py-2 pl-[0.5rem] pr-[1rem] text-left text-13 text-gray-400 hover:text-primary-200 focus:outline-none">
                                    {t("datum.editCard")}
                                </button>
                            </Menu.Item>
                        )}
                    </Menu.Items>
                </Transition>
            </Menu>
            {showDeleteModal && <DeleteDatabaseModal closeModal={() => setShowDeleteModal(false)} databaseId={databaseId} databaseName={databaseName} isShow={showDeleteModal} />}
        </>
    );
};

export default DatabaseCardOptions;
