import { CloseIcon2, ErrorIcon, PlusIcon2, SearchIcon, WebhookIcon, WebhookInitIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import { Modal } from "../Modals/Index";
import { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import { DebounceInput } from "react-debounce-input";
import WebhookForm from "./WebhookForm";
import ViewWebhook from "./ViewWebhook";
import DeleteModalWebhook from "./DeleteModalWebhook";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import isNumber from "lodash/isNumber";
import { JelouApiV1 } from "@apps/shared/modules";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { SidebarSkeleton } from "@apps/shared/common";

import { useParams } from "react-router-dom";
import { useDataBases } from "../../../services/databases";

const WebhookModal = ({
    webhookEvents = [],
    closeModal = () => null,
    isShow = false,
    companyId = "",
    webhooks,
    search,
    setSearch,
    loadingWebhooks,
    refetchWebhooks,
} = {}) => {
    const { t } = useTranslation();
    const [section, setSection] = useState("initial");
    const [selectedWebhook, setSelectedWebhook] = useState({});
    const [isCurrent, setIsCurrent] = useState("");
    const [openModalDeleteWebhook, setOpenModalDeleteWebhook] = useState(false);
    const [untitledWebhook, setUntitledWebhook] = useState("Untitled Trigger");
    const databases = useSelector((state) => state.databases);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const { databaseId } = useParams();
    const { LoadAllDatabases } = useDataBases();
    const defaultDatabase = databases.find((db) => db.id === Number(databaseId));

    const onChange = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        LoadAllDatabases();
    }, []);

    const handleSection = () => {
        switch (section) {
            case "initial":
                return (
                    <div className="flex w-full flex-col items-center justify-center self-center">
                        <WebhookInitIcon width="19rem" height="13rem" />
                        <span className="mt-4 text-xl text-gray-400/75 lg:text-2xl">{t("datum.triggersConfigure")}</span>
                        <span className="text-center text-15 font-normal text-gray-400/65 lg:text-base">
                            {t("datum.Recibe alertas de las suscripciones configuradas")}
                        </span>
                    </div>
                );
            case "new_webhook":
            case "edit_webhook":
                return (
                    <WebhookForm
                        section={section}
                        setSection={setSection}
                        webhook={selectedWebhook}
                        submitWebhook={submitWebhook}
                        updateWebhook={updateWebhook}
                        webhookEvents={webhookEvents}
                        loadingUpdate={loadingUpdate}
                        loadingCreate={loadingCreate}
                        defaultDatabase={defaultDatabase}
                        changeUntitledName={changeUntitledName}
                        setOpenModalDeleteWebhook={setOpenModalDeleteWebhook}
                    />
                );
            case "view_webhook":
                return (
                    <ViewWebhook
                        webhook={selectedWebhook}
                        setSection={setSection}
                        setSelectedWebhook={setSelectedWebhook}
                        setOpenModalDeleteWebhook={setOpenModalDeleteWebhook}
                        webhookEvents={webhookEvents}
                    />
                );
            default:
                break;
        }
    };

    const submitWebhook = (webhook) => {
        if (!isNumber(companyId)) return;
        setLoadingCreate(true);
        const { name, database, url, subscriptions } = webhook;
        const { id: databaseId } = database;
        JelouApiV1.post(`companies/${companyId}/webhooks `, {
            name,
            entity: "DATUM",
            entityId: databaseId.toString(),
            url,
            subscriptions,
        })
            .then(({ data }) => {
                const { id } = data;
                setSelectedWebhook({ ...webhook, id });
                setIsCurrent(id);
                setSection("view_webhook");
                refetchWebhooks();
                notify("Disparador creado correctamente");
                setLoadingCreate(false);
            })
            .catch((err) => {
                const msg = get(err, `error.clientMessages.${lang}`, "Error al crear el webhook");
                notifyError(msg);
                setLoadingCreate(false);
            });
    };

    const updateWebhook = (webhook) => {
        if (!isNumber(companyId)) return;
        setLoadingUpdate(true);
        const { name, database, url, subscriptions } = webhook;
        const { id: databaseId } = database;
        JelouApiV1.put(`companies/${companyId}/webhooks/${webhook.id}`, {
            name,
            entity: "DATUM",
            entityId: databaseId.toString(),
            url,
            subscriptions,
        })
            .then(() => {
                setSelectedWebhook({ ...webhook, subscriptions, id: webhook.id });
                setSection("view_webhook");
                refetchWebhooks();
                notify("Disparador actualizado correctamente");
                setLoadingUpdate(false);
            })
            .catch((err) => {
                const msg = get(err, `error.clientMessages.${lang}`, "Error al actualizar el webhook");
                notifyError(msg);
                setLoadingUpdate(false);
            });
    };

    const deleteWebhook = (webhook) => {
        if (!isNumber(companyId)) return;
        setLoadingDelete(true);
        const { id: webhookId } = webhook;
        JelouApiV1.delete(`companies/${companyId}/webhooks/${webhookId}`)
            .then(() => {
                setOpenModalDeleteWebhook(false);
                refetchWebhooks();
                setSection("initial");
                notify("Disparador eliminado correctamente");
                setLoadingDelete(false);
            })
            .catch((err) => {
                setOpenModalDeleteWebhook(false);
                const msg = get(err, `error.clientMessages.${lang}`, "Error al eliminar el webhook");
                notifyError(msg);
                setLoadingDelete(false);
            });
    };

    function changeUntitledName(value) {
        setUntitledWebhook(value);
    }

    let loadingSkeleton = [];

    for (let i = 0; i < 8; i++) {
        loadingSkeleton.push(<SidebarSkeleton key={i} />);
    }

    const showHooks = (webhook, index) => {
        const { id = "", name = "", url = "", actions = [], state, entityId } = webhook;
        const database = databases.find((db) => db.id.toString() === entityId.toString());
        let _events = {};
        actions.map((id) => {
            return (_events[id] = true);
        });

        const _webhook = {
            id,
            name,
            url,
            database,
            state,
            subscriptions: actions, // array of Ids
            urlValid: true,
            events: _events,
        };

        return (
            <button
                key={index}
                onClick={() => {
                    setSection("view_webhook");
                    setSelectedWebhook(_webhook);
                    setIsCurrent(id);
                }}
                className={`my-auto flex h-[5rem] flex-col justify-center border-b-1 border-gray-100/25 px-5 text-sm text-gray-400/75 hover:bg-gray-10 lg:h-[5.5rem] lg:px-8 lg:text-base ${
                    isCurrent === id ? "border-r-8 border-r-primary-200 bg-[#E6F7F9]" : "bg-white"
                }`}>
                <span className="w-full truncate text-left font-semibold text-gray-400">{name}</span>
                <span className="h-6 w-full truncate text-left text-13 font-medium text-gray-400/75 lg:text-15">{url}</span>
            </button>
        );
    };

    const showWebhookList = () => {
        if (loadingWebhooks) {
            return <div className="flex flex-col">{loadingSkeleton}</div>;
        }
        if (isEmpty(webhooks)) {
            return <div className="my-8 flex items-center justify-center">{t("datum.noTriggersFound")}</div>;
        }
        return (
            <div className="flex flex-col">
                {databaseId && (
                    <>
                        {webhooks
                            .filter((wh) => wh.entityId === databaseId)
                            .map((webhook, index) => {
                                return showHooks(webhook, index);
                            })}
                    </>
                )}
                {!databaseId && (
                    <>
                        {webhooks.map((webhook, index) => {
                            return showHooks(webhook, index);
                        })}
                    </>
                )}
            </div>
        );
    };

    return (
        <>
            <Modal isShow={isShow} widthModal="w-[110vh] mid:w-[120vh] custom:w-[150vh]">
                <section className="relative inline-block h-full w-full transform overflow-hidden rounded-20 bg-white text-left font-bold text-gray-400 shadow-xl transition-all">
                    <header className="flex h-14 w-full items-center justify-between bg-primary-40 px-5 text-xl text-primary-200 lg:h-15 lg:px-8 lg:text-2xl">
                        <div className="flex items-center space-x-3 px-3">
                            <WebhookIcon width="1.5rem" height="1.5rem" />
                            <span>{t("datum.triggers")}</span>
                        </div>
                        <button
                            aria-label="Close"
                            className="w-12"
                            onClick={(evt) => {
                                closeModal();
                                evt.preventDefault();
                            }}>
                            <CloseIcon2 width={"1.2rem"} height={"1.2rem"} fillOpacity={0.5} />
                        </button>
                    </header>
                    <main className="flex h-[70vh]">
                        <div className="flex h-full w-2/5 max-w-[40%] flex-col border-r-1 border-gray-100/25 text-primary-200">
                            <div className="flex flex-col space-y-5 border-b-1 border-gray-100/25 p-5 lg:p-6">
                                <div className="text-15 font-bold text-primary-200 lg:text-lg">{t("datum.createdTriggers")}</div>
                                <div className="mb-2 flex items-center space-x-3 lg:mb-4">
                                    <div className="relative flex flex-1 items-center bg-white">
                                        <div className="absolute left-2">
                                            <SearchIcon width="0.9375rem" height="0.9375rem" />
                                        </div>
                                        <DebounceInput
                                            autoFocus={true}
                                            className="flex-1 font-medium outline-none focus:ring-[#a6b4d0]"
                                            style={{
                                                border: "0.0625rem solid rgba(166, 180, 208, 0.60)",
                                                borderRadius: "1.5em",
                                                resize: "none",
                                                height: "2rem",
                                                padding: "1rem 0.5rem 1rem 2.5rem",
                                                fontSize: "0.75rem",
                                                color: "#727C94",
                                            }}
                                            minLength={2}
                                            value={search}
                                            debounceTimeout={500}
                                            placeholder={`${t("datum.searchTriggers")}`}
                                            onChange={onChange}
                                        />
                                    </div>
                                    <Tippy content={t("datum.createTrigger")} placement={"right"} theme="jelou">
                                        <button
                                            onClick={() => {
                                                setSection("new_webhook");
                                                setSelectedWebhook({});
                                                setIsCurrent("");
                                                setUntitledWebhook("");
                                            }}>
                                            <PlusIcon2 className="h-6 w-6 text-white lg:h-8 lg:w-8" fill="currentColor" />
                                        </button>
                                    </Tippy>
                                </div>
                            </div>
                            {section === "new_webhook" && (
                                <div className="flex items-center space-x-2 border-b-1 border-gray-100/25 p-3 px-4 text-sm text-gray-100 lg:space-x-4 lg:p-5 lg:px-7 lg:text-base">
                                    <WebhookIcon width="1.5rem" height="1.5rem" fill="#A6B4D0" />
                                    <span className="w-full truncate">{isEmpty(untitledWebhook) ? t("datum.untitledTrigger") : untitledWebhook}</span>
                                </div>
                            )}
                            <div className="no-scrollbar overflow-y-auto">{showWebhookList()}</div>
                        </div>
                        <section className="flex w-3/4 overflow-y-auto">{handleSection()}</section>
                    </main>
                </section>
                <ToastContainer />
            </Modal>
            <DeleteModalWebhook
                closeModal={() => setOpenModalDeleteWebhook(false)}
                isShow={openModalDeleteWebhook}
                deleteWebhook={deleteWebhook}
                webhook={selectedWebhook}
                loadingDelete={loadingDelete}
            />
        </>
    );
};

const notify = (msg) => {
    toast.success(
        <div className="flex items-center space-x-3">
            <svg className="mr-2" width="1.563rem" height="1.563rem" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                    fill="#0CA010"
                />
            </svg>
            <div className="text-left text-base text-green-200">{msg}</div>
        </div>,
        {
            position: toast.POSITION.BOTTOM_RIGHT,
        }
    );
};

const notifyError = (error) => {
    toast.error(
        <div className="flex items-center">
            <ErrorIcon width={"1.375rem"} stroke="#EC5F4F" />
            <div className="text-smoke-red ml-3 text-base">{error}</div>
        </div>,
        {
            position: toast.POSITION.BOTTOM_RIGHT,
        }
    );
};

export default WebhookModal;
