import { useCallback,useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { usePopper } from "react-popper";

import { EditIcon, RefreshIcon, UploadIcon, WebhookIcon } from "@apps/shared/icons";
import CreateDataFromFile from "./BulkDataLoad";
import CreateDataManually from "./Manually/Manually";

import { useOnClickOutside, useWebhookEvents, useWebhooks } from "@apps/shared/hooks";
import { ClipLoader } from "react-spinners";

import TriggerModal from "../TriggersV2/components/TriggerModal";
import { Menu, Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";

export function ButtonCreateData({ oneDataBase, loadingRefresh, getData }) {
    const [isShow, setShow] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [popperRef] = useState(null);
    const [referenceRef] = useState(null);
    const { attributes } = usePopper(referenceRef, popperRef);
    const dropdownRef = useRef();


    useOnClickOutside(dropdownRef, () => setOpen(false));

    const closeModalFromCreation = useCallback(() => setShow(false), []);

    function openModalFromCreation() {
        setShow(true);
    }

    const openMenu = (e) => {
      setOpen(!open);
    };

    const closeModalFromUpload = useCallback(() => setIsOpen(false), []);

    function openModalFromUpload() {
        setIsOpen(true);
    }

    const { t } = useTranslation();
    const permissions = useSelector((state) => state.permissions);

    const { id: companyId } = useSelector((state) => state.company);
    const databasePermission = permissions.find((permission) => permission === "datum:create_database");
    const databasePermissionCreate = permissions.find((permission) => permission === "datum:create_rows");

    const [search, setSearch] = useState("");
    const [showTriggersModal, setShowTriggersModal] = useState(false);

    const { isLoading: isLoadingWebhookEvents, isFetching: isFetchingWebhookEvents, data: webhookEvents = [] } = useWebhookEvents({ companyId });

    const {
        isLoading: isLoadingWebhooks,
        isFetching: isFetchingWebhooks,
        data: webhooks = [],
        refetch: refetchWebhooks,
    } = useWebhooks({ companyId, search });

    return (
        <div className="relative flex items-center gap-3">
            <Tippy content={t("hsm.refresh")} theme={"tomato"} placement={"bottom"}>
                <button
                    disabled={loadingRefresh}
                    onClick={() => {getData(false, true)}}
                    className="flex h-9 items-center space-x-2 whitespace-nowrap rounded-20 border-transparent bg-gray-35 px-3 text-base font-bold text-gray-425 outline-none mid:px-5">
                    <RefreshIcon width="1rem" height="1rem" stroke={"inherit"} className={`${loadingRefresh ? "animate-spinother" : ""}`} />
                </button>
            </Tippy>

            {databasePermission && (
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => {
                            setShowTriggersModal(true);
                            refetchWebhooks();
                        }}
                        disabled={isLoadingWebhookEvents || isFetchingWebhookEvents}
                        className="flex h-9 items-center space-x-2 whitespace-nowrap rounded-20 border-transparent bg-primary-40 px-3 text-base font-bold text-primary-200 outline-none mid:px-5">
                        {isLoadingWebhookEvents || isFetchingWebhookEvents ? (
                            <ClipLoader size={"1rem"} color={"#00B3C7"} />
                        ) : (
                            <WebhookIcon width="1rem" height="1rem" />
                        )}
                        <span className="hidden mid:flex">{t("datum.triggers.title")}</span>
                    </button>
                    {databasePermissionCreate && (
                          <Menu as="div">
                            <Menu.Button
                                className="button-gradient whitespace-nowrap items-center flex flex-row justify-center !w-full !py-1 !px-5">
                                <span className="mr-3 text-xl font-light">+</span>
                                {t("datum.createRegister")}
                            </Menu.Button>
                            <Menu.Items  className="absolute right-0 top-10 z-50 mt-2 flex w-40 flex-col overflow-hidden rounded-xl bg-white shadow-option">
                                <Menu.Item>
                                    <button
                                        className="flex items-center p-4 text-left text-13 font-normal text-gray-610 hover:bg-gray-10 focus:outline-none "
                                        onClick={openModalFromCreation}>
                                        <EditIcon className="mr-3" width={15} height={15} fill="#727C94"/>
                                        {t("datum.manually")}
                                    </button>
                                </Menu.Item>
                                <Menu.Item>
                                    <button
                                        className="flex items-center p-4 text-left font-normal text-13 text-gray-610 hover:bg-gray-10 focus:outline-none"
                                        onClick={openModalFromUpload}>
                                        <UploadIcon className="mr-3" width="1rem" height="1.325rem" fill="none"/>
                                        {t("datum.uploadFile")}
                                    </button>
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>

                  )}
                </div>
            )}
            {showTriggersModal && (
                <TriggerModal
                    search={search}
                    webhooks={webhooks}
                    companyId={companyId}
                    setSearch={setSearch}
                    isShow={showTriggersModal}
                    webhookEvents={webhookEvents}
                    refetchWebhooks={refetchWebhooks}
                    closeModal={() => setShowTriggersModal(false)}
                    loadingWebhooks={isLoadingWebhooks || isFetchingWebhooks}
                />
            )}

            {/* <button
                type="button"
                onClick={openModalFromUpload}
                className="flex h-[2.4rem] items-center gap-2 whitespace-nowrap rounded-full bg-blue-250 px-6 text-base font-bold text-white">
                <DownloadIcon className="rotate-180" width="0.813rem" height="0.875rem" fill="white" /> {t("datum.fromAFile")}
            </button> */}

            {isOpen && <CreateDataFromFile isOpen={isOpen} closeModal={closeModalFromUpload} oneDataBase={oneDataBase} />}
            {isShow && <CreateDataManually isShow={isShow} closeModal={closeModalFromCreation} oneDataBase={oneDataBase} />}
        </div>
    );
}
