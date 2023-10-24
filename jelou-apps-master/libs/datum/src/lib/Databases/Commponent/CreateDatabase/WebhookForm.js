import React, { useEffect, useState } from "react";
import { FormComboboxSelect, Input } from "@apps/shared/common";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

import { useParams } from "react-router-dom";

const WebhookForm = (props) => {
    const {
        webhook = {},
        submitWebhook = () => null,
        changeUntitledName = () => null,
        updateWebhook = () => null,
        section,
        defaultDatabase,
        setSection,
        setOpenModalDeleteWebhook,
        webhookEvents,
        loadingUpdate,
        loadingCreate,
    } = props;
    const { t } = useTranslation();
    const { databaseId } = useParams();
    const databases = useSelector((state) => state.databases);
    const [disabledForm, setDisabledForm] = useState(true);
    const [newWebhook, setNewWebhook] = useState({ events: [], subscriptions: [] });
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    useEffect(() => {
        setNewWebhook(webhook);
        if (databaseId) {
            setNewWebhook({ ...webhook, database: defaultDatabase });
        }
    }, [webhook]);

    const urlPatternValidation = (URL) => {
        const regex = new RegExp("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?");
        return regex.test(URL);
    };

    const validateEvents = (events) => {
        let eventsId = [];
        const eventsIdArray = Object.keys(events);

        eventsIdArray.forEach((idEvent) => {
            const value = get(events, idEvent);
            if (value) {
                return eventsId.push(parseInt(idEvent));
            }
        });
        return eventsId;
    };

    useEffect(() => {
        const { name = "", url = "", database = "", events = {}, subscriptions = [], urlValid = false } = newWebhook;
        let eventSubscribed;
        if (section === "edit_webhook") {
            eventSubscribed = validateEvents(subscriptions);
        } else {
            eventSubscribed = validateEvents(events);
        }

        if (!isEmpty(name) && !isEmpty(url) && !isEmpty(database) && !isEmpty(eventSubscribed) && urlValid) {
            setDisabledForm(false);
        } else {
            setDisabledForm(true);
        }
    }, [newWebhook]);

    const handleChange = ({ target }) => {
        const { name, value, checked, id } = target;
        const urlValid = !value || urlPatternValidation(value);
        switch (name) {
            case "name":
                changeUntitledName(value);
                setNewWebhook({ ...newWebhook, [name]: value });
                break;
            case "url":
                setNewWebhook({ ...newWebhook, [name]: value, urlValid });
                break;
            case "events":
                setNewWebhook({ ...newWebhook, events: { ...newWebhook.events, [id]: checked } });
                break;
            default:
                break;
        }
    };

    const selectDatabase = (e) => {
        setNewWebhook({ ...newWebhook, database: e });
    };

    const databaseOptions = databases.map((database) => {
        return {
            ...database,
            value: database.id,
        };
    });

    const inputClassName =
        "inputWH h-34 w-full flex-1 rounded-lg border-transparent bg-[#f3f8fe] px-2 text-13 lg:text-15 text-gray-400 outline-none ring-transparent focus:border-transparent focus:ring-transparent";

    return (
        <div className="flex w-full flex-col space-y-6 py-10 px-6 lg:px-12">
            <div className="flex flex-col space-y-3">
                <span className="text-sm text-gray-400/75 lg:text-base">{t("datum.Nombre del Webhook")} *</span>
                <Input
                    id="nombre"
                    autoFocus={true}
                    type="text"
                    className={inputClassName}
                    required={true}
                    name="name"
                    placeholder={t("datum.placeholders.Escribe el nombre para esta configuracion")}
                    onChange={handleChange}
                    value={newWebhook?.name || ""}
                />
            </div>
            <div className="relative flex flex-col space-y-3">
                <span className="text-sm text-gray-400/75 lg:text-base">{t("datum.Base de datos")} *</span>
                <FormComboboxSelect
                    name={"type"}
                    background={"#fff"}
                    hasCleanFilter={false}
                    handleChange={selectDatabase}
                    options={databaseOptions || []}
                    defaultDatabase={defaultDatabase}
                    value={newWebhook?.database || ""}
                    placeholder={t("datum.placeholders.Selecciona una base de datos")}
                    className="inputWH h-34 w-full flex-1 rounded-xs border-transparent bg-primary-700 px-2 text-13 text-gray-400 outline-none ring-transparent focus:border-transparent focus:ring-transparent lg:text-15"
                />
            </div>
            <div className="flex flex-col space-y-3">
                <div className="flex">
                    <span className="text-sm text-gray-400/75 lg:text-base">URL *</span>
                    {!newWebhook?.urlValid && !isEmpty(newWebhook?.url) && (
                        <span className="text-smoke-red ml-4 flex items-center text-13 italic">{t("datum.URL invalida")}</span>
                    )}
                </div>
                <Input
                    id="url"
                    type="text"
                    className={inputClassName}
                    required={true}
                    name="url"
                    placeholder={t("datum.placeholders.Agrega la URL")}
                    onChange={handleChange}
                    value={newWebhook?.url || ""}
                />
            </div>
            <div className="flex flex-col space-y-5">
                <span className="text-base text-primary-200">{t("datum.Que eventos desea subscribirse?")}</span>
                <div className="ml-8 flex flex-col space-y-3">
                    {webhookEvents.map((webhookEvent) => {
                        const { displayNames, name = "", id, state } = webhookEvent;
                        if (!state) return null;
                        const { events = {} } = newWebhook;
                        const isChecked = get(events, `${id}`, false);
                        return (
                            <div key={id} className="flex items-center text-sm font-medium text-gray-400/75 lg:text-base">
                                <label className="text-sm lg:text-base">
                                    <input
                                        onChange={handleChange}
                                        name="events"
                                        type="checkbox"
                                        id={id}
                                        className="mr-3 h-4 w-4 appearance-none rounded-[0.1875rem] border-2 border-gray-100 checked:border-transparent checked:bg-primary-200 hover:checked:bg-primary-200 focus:bg-primary-200 focus:ring-primary-200 focus:checked:bg-primary-200 lg:h-5 lg:w-5"
                                        checked={isChecked}
                                    />
                                    {get(displayNames, `${lang}`, name)}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-end py-7">
                {section === "new_webhook" && (
                    <>
                        <button
                            className="w-24 rounded-20 border-1 border-transparent bg-gray-10 p-2 !text-13 font-bold text-gray-400 focus:outline-none lg:w-32 lg:!text-base"
                            onClick={() => setSection("initial")}>
                            {t("monitoring.Cancelar")}
                        </button>
                        <button
                            className="button-primary ml-4 w-32 !text-sm lg:!text-base"
                            disabled={disabledForm || loadingCreate}
                            onClick={() => {
                                const { events = {} } = newWebhook;
                                const eventSubscribed = validateEvents(events);
                                submitWebhook({ ...newWebhook, subscriptions: eventSubscribed });
                            }}>
                            {loadingCreate ? <ClipLoader size={"1.25rem"} color="white" /> : t("buttons.save")}
                        </button>
                    </>
                )}
                {section === "edit_webhook" && (
                    <div className="flex space-x-4">
                        <button
                            className="w-24 rounded-20 border-1 border-transparent bg-gray-10 p-2 !text-13 font-bold text-gray-400 focus:outline-none lg:w-32 lg:!text-base"
                            disabled={disabledForm}
                            onClick={() => setSection("view_webhook")}>
                            {t("buttons.cancel")}
                        </button>
                        <button
                            className="w-24 rounded-20 border-1 border-transparent bg-primary-600 p-2 !text-13 font-bold text-primary-200 focus:outline-none lg:w-32 lg:!text-base"
                            disabled={disabledForm}
                            onClick={() => setOpenModalDeleteWebhook(true)}>
                            {t("buttons.delete")}
                        </button>
                        <button
                            className="flex w-24 items-center justify-center rounded-20 border-1 border-transparent bg-primary-200 p-2 !text-13 font-bold text-white outline-none lg:w-32 lg:!text-base"
                            disabled={loadingUpdate || disabledForm}
                            onClick={() => {
                                const { events = {} } = newWebhook;
                                const eventSubscribed = validateEvents(events);
                                updateWebhook({ ...newWebhook, subscriptions: eventSubscribed });
                            }}>
                            {loadingUpdate ? <ClipLoader size={"1.25rem"} color="white" /> : t("datum.Actualizar")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebhookForm;
