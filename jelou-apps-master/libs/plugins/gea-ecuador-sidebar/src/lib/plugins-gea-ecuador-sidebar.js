import { Dialog, Transition } from "@headlessui/react";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import toUpper from "lodash/toUpper";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { currentSectionPma } from "@apps/shared/constants";
import { useParams } from "react-router-dom";
import {
    GEA_Service,
    createAssistanceGEALogs,
    getGeaLogs,
    getToken,
    sendContactField,
    sendTerminoField,
    updateAssitanceRecordContact,
    updateAssitanceRecordTermino,
    updateCacheStoreParams,
} from "./Sidebar/Services";
import SidebarElement from "./Sidebar/SidebarElement";

import { useTranslation } from "react-i18next";
import { BeatLoader } from "react-spinners";
import Validator from "validatorjs";
import EventEmitter from "./EventEmitter";
import SelectSettings from "./Sidebar/SelectSettings";

import { CloseIcon, WarningImpersonateIcon } from "@apps/shared/icons";
import { JelouApiPma } from "@apps/shared/modules";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PluginsGeaEcuadorSidebar = (props) => {
    const { showSidebar = true } = props;
    const { section = "chats" } = useParams();

    const [settingsArray, setSettingsArray] = useState([]);
    const [storeParams, setStoreParams] = useState({});
    const [errorArray, setErrorArray] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [verifyStatus, setVerifyStatus] = useState(false);
    const [eventEmit] = useState(new EventEmitter());
    // const [savedData, setSavedData] = useState(null);

    const [contactValue, setContactValue] = useState(null);
    const [terminoValue, setTerminoValue] = useState(null);
    const [id_asistencia, setIdAsistencia] = useState(null);
    const [id_expediente, setIdExpediente] = useState(null);
    // const [loadingSendContact, setLoadingSendContact] = useState(false);
    // const [loadingSendTermino, setLoadingSendTermino] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [sendingContact, setSendingContact] = useState({ value: null, sending: false });
    const [sendingTermino, setSendingTermino] = useState({ value: null, sending: false });
    const [contactSent, setContactSent] = useState(false);
    const [terminoSent, setTerminoSent] = useState(false);

    const cabinaTeam = 603;
    const belongsToCabinaTeam = props.teams.map((team) => team.id).includes(cabinaTeam);

    const { currentRoom } = props;

    const appId = toUpper(section) === currentSectionPma.CHATS ? get(currentRoom, "appId", "") : get(currentRoom, "bot.id", currentRoom?.appId);
    const sender = toUpper(section) === currentSectionPma.CHATS ? get(currentRoom, "senderId") : get(currentRoom, "_id", currentRoom?.senderId);
    const senderId = sender.replace("@c.us", "");

    const contactOptions = [
        { label: "Si, todo bien", value: 1 },
        { label: "No, contactar", value: 2 },
    ];

    const terminoOptions = [
        { label: "Si", value: 1 },
        { label: "No", value: 2 },
    ];

    const userSession = useSelector((state) => state.userSession);
    const userTeams = useSelector((state) => state.userTeams);
    const bots = useSelector((state) => state.bots);
    const company = useSelector((state) => state.company);
    const companyId = get(company, "id", "");

    const { t } = useTranslation();
    const isArchived = get(currentRoom, "archived", false);

    const getSideBarSettings = () => {
        const teamId = first(get(userSession, "teams", []));
        const teamObj = userTeams.find((team) => team.id === teamId);
        const teamSettingsLegacy = get(teamObj, "properties.sidebar_settings", []);
        const teamSettings = get(teamObj, "properties.sidebarSettings", []);

        let bot = {};
        if (currentRoom?.archived) {
            bot = bots.find((bot) => bot.id === currentRoom.bot?.id);
        } else {
            bot = bots.find((bot) => bot.id === currentRoom.appId);
        }
        const botSettings = get(bot, "properties.sidebar_settings", []);
        const companySettings = get(company, "properties.sidebar_settings", []);

        if (!isEmpty(teamSettingsLegacy)) {
            return teamSettingsLegacy;
        }
        if (!isEmpty(teamSettings)) {
            return teamSettings;
        }
        if (!isEmpty(botSettings)) {
            return botSettings;
        }
        if (!isEmpty(companySettings)) {
            return companySettings;
        }
        return [];
    };

    const closeModal = () => {
        setShowWarningModal(false);
    };

    const handleChangeContact = (data) => {
        setSendingContact({
            value: data?.value,
            sending: true,
        });
        setShowWarningModal(true);
    };

    const handleChangeTermino = (data) => {
        setSendingTermino({
            value: data?.value,
            sending: true,
        });
        setShowWarningModal(true);
    };

    const handleSubmitAnswer = (answerType) => {
        if (answerType === "contact") {
            changeContact(sendingContact);
            setSendingContact((prev) => ({ ...prev, sending: false }));
            setShowWarningModal(false);
        }
        if (answerType === "termino") {
            changeTermino(sendingTermino);
            setSendingTermino((prev) => ({ ...prev, sending: false }));

            setShowWarningModal(false);
        }
    };

    const getDependantError = (errorArray, dependantArray) => {
        const objKeys = Object.keys(errorArray);
        let value = false;
        dependantArray.forEach((dependant) => {
            const finder = objKeys.find((error) => error === dependant);
            if (finder) {
                value = true;
            }
        });
        return value;
    };

    const emitOnValidate = (data) => {
        // var event = new CustomEvent('onValidate', { detail: data })
        eventEmit.emit("onValidate", { data: data });
    };

    const handleError = (errorMessage) => {
        switch (errorMessage) {
            case "unauthorized":
                toast.error(t("common.unauthorizedMessageError"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                break;
            case "clientError":
                toast.error(t("common.genericMessageError"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                break;
            case "genericError":
                toast.error(t("common.genericMessageError"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                break;

            default:
                toast.error(errorMessage, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });

                break;
        }
    };
    const getVerify = (settings) => {
        let rulesArray = [];
        let dataArray = [];

        let errorArray = [];
        let dataErrorArray = [];

        const dependantArray = [];
        settings.forEach((setting) => {
            const isObligatory = get(setting, "rules.isObligatory", false);
            const isDependent = get(setting, "rules.isDependent", false);
            if (isObligatory) {
                if (!storeParams[setting.name]) {
                    props.setStatus(false); // On validate
                    emitOnValidate(false);
                    // setVerifyStatus(false);
                }
                if (get(setting, "rules.rules")) {
                    rulesArray = {
                        ...rulesArray,
                        [setting.name]: get(setting, "rules.rules", "required"),
                    };
                    dataArray = {
                        ...dataArray,
                        [setting.name]: storeParams[setting.name],
                    };
                }
            }
            if (get(setting, "rules.rules")) {
                errorArray = {
                    ...errorArray,
                    [setting.name]: get(setting, "rules.rules", "required"),
                };
                dataErrorArray = {
                    ...dataErrorArray,
                    [setting.name]: storeParams[setting.name],
                };
            }
            if (isDependent) {
                dependantArray.push(setting.name);
            }
        });
        const validation = new Validator(dataArray, rulesArray, {
            required_if: "Campo requerido",
        });

        const veredict = validation.passes();

        const errVal = new Validator(dataErrorArray, errorArray, {
            required_if: "Campo requerido",
        });
        errVal.fails();
        setErrorArray(errVal.errors.errors);
        const errors = errVal.errors.errors;
        const messages = Validator.getMessages("en");
        messages.required = "El campo :attribute es requerido.";
        Validator.setMessages("es", messages);
        const dependantVeredict = !getDependantError(errors, dependantArray);

        props.setStatus(veredict * dependantVeredict);
        // emitOnValidate(veredict * dependantVeredict);
        // setVerifyStatus(veredict * dependantVeredict);

        return false;
    };

    const fetchCacheStoreParams = async () => {
        try {
            await JelouApiPma.get(`/v1/bots/${appId}/users/${senderId}/cache`).then(({ data }) => {
                setIdAsistencia(get(data, "asist_curso_id", ""));
                setIdExpediente(get(data, "asist_curso_expediente", ""));

                setStoreParams({
                    ...data,
                    asist_curso_id: get(data, "asist_curso_id", ""),
                    asist_curso_expediente: get(data, "asist_curso_expediente", ""),
                    asist_curso_servicio: get(data, "asist_curso_servicio", ""),
                    asist_curso_cedula: get(data, "asist_curso_cedula", get(data, "identificacion", "")),
                });
            });
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleGEALogCreation = async () => {
        const botId = get(currentRoom, "bot.id", "+593958637937");
        const {
            _userId: referenceId,
            asist_curso_id: assistanceId,
            asist_curso_cedula: legalId,
            placa_vehiculo: licensePlate,
            assistanceManagement,
            asisstanceType,
            asist_curso_servicio: service,
        } = storeParams;

        const createdAt = new Date();
        const updatedAt = new Date();

        const params = {
            referenceId,
            assistanceId,
            legalId,
            licensePlate,
            assistanceManagement,
            asisstanceType,
            service,
            deliveredSurvey: "No enviado",
            surveyStatus: "No enviado",
            createdAt,
            updatedAt,
        };

        try {
            await createAssistanceGEALogs(botId, companyId, params);
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleDataFromLogs = async ({ companyId, id_asistencia }) => {
        try {
            const data = await getGeaLogs({ companyId, id_asistencia });
            if (isEmpty(data)) {
                console.log("No data");
                await handleGEALogCreation();
            }
            const supplierContact = get(data, "supplierContact", "");
            const supplierEnd = get(data, "supplierEnd", "");
            if (supplierContact) {
                setContactSent(true);
            }
            if (supplierEnd) {
                setTerminoSent(true);
            }
            setContactValue(Number(supplierContact));
            setTerminoValue(Number(supplierEnd));
        } catch (error) {
            console.log("error", error);
        }
    };

    const storeParamsChanged = () => {
        // TODO: eliminar cosas innecesarias
        const savedData = null; // Puse esto porque el estado no se estaba seteando, siempre era null
        return isEqual(savedData, storeParams);
    };

    useEffect(() => {
        getVerify(settings);
        props.setSidebarChanged(storeParamsChanged());
    }, [storeParams]);

    useEffect(() => {
        if (!isEmpty(currentRoom)) {
            fetchCacheStoreParams(); // get stored params from user cache
        }
    }, [currentRoom]);

    useEffect(() => {
        if (id_asistencia) {
            handleDataFromLogs({ companyId, id_asistencia });
        }
    }, [id_asistencia]);

    const settings = getSideBarSettings();

    const getSettings = () => {
        let arraySettings = [];
        settings.map((setting) => {
            arraySettings.push(setting);

            return setSettingsArray(arraySettings);
        });
    };
    const handleChange = ({ target }) => {
        const { name, value } = target;
        setStoreParams({
            ...storeParams,
            [name]: value,
        });
    };

    const onCancelAnswer = () => {
        setContactValue("");
        setSendingContact({
            value: null,
            sending: false,
        });
        setSendingTermino({
            value: null,
            sending: false,
        });

        setShowWarningModal(false);
    };

    const changeContact = async ({ value }) => {
        const id_respuesta_contacto = value;
        const params = {
            id_asistencia,
            id_expediente,
            id_respuesta_contacto,
        };

        const cacheParams = {
            appId,
            senderId,
            paramToUpdate: {
                shouldRegisterProviderContact: false,
            },
        };

        // setLoadingSendContact(true);
        try {
            await sendContactField(params);
            await updateAssitanceRecordContact(params);
            await updateCacheStoreParams(cacheParams);

            setContactValue(Number(id_respuesta_contacto));
            setContactSent(true);
            // setLoadingSendContact(false);
        } catch (error) {
            const message = get(error, "message", "");

            handleError(message);

            // setLoading(false);
            // setLoadingSendContact(false);
        }
    };

    const changeTermino = async ({ value }) => {
        const id_respuesta_termino = value;
        const params = {
            id_asistencia,
            id_expediente,
            id_respuesta_termino,
        };
        const cacheParams = {
            appId,
            senderId,
            paramToUpdate: {
                shouldRegisterProviderEnd: false,
            },
        };
        // setLoadingSendTermino(true);
        try {
            await sendTerminoField(params); // it sends the response to the GEA Service
            await updateAssitanceRecordTermino(params); // it updates the assistance record (bitacora de asistencia)
            await updateCacheStoreParams(cacheParams);
            setTerminoValue(Number(id_respuesta_termino));
            setTerminoSent(true);
            // setLoadingSendTermino(false);
        } catch (error) {
            const message = get(error, "message", "");
            handleError(message);

            // setLoading(false);
            // setLoadingSendTermino(false);
        }
    };

    const getErrorMessage = (setting, rule) => {
        const { name, label } = setting;
        const rules = get(rule, "rules", null);
        if (!rules) {
            return null;
        }
        const errorString = first(errorArray[name]);
        if (errorString === undefined) {
            return null;
        }
        const correctedMessage = errorString.replace(name, label);
        return correctedMessage;
    };

    useEffect(() => {
        getSettings();
    }, [currentRoom]);

    useEffect(() => {
        const LogIn_GEA_services = async () => {
            try {
                const expirationDate = new Date(window.localStorage.getItem("gea_ecuador_expiration_token"));
                const token = window.localStorage.getItem("gea_ecuador_token");

                if (!GEA_Service.defaults.headers.common["Authorization"] && token) {
                    GEA_Service.defaults.headers.common["Authorization"] = "Bearer " + token;
                }
                if (expirationDate && token) {
                    if (expirationDate <= new Date()) {
                        const { expiration, accessToken } = await getToken();
                        GEA_Service.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
                        const newExpirationDate = new Date(new Date().getTime() + expiration * 1000);
                        window.localStorage.setItem("gea_ecuador_token", accessToken);
                        window.localStorage.setItem("gea_ecuador_expiration_token", newExpirationDate);
                    }
                } else {
                    const { expiration, accessToken } = await getToken();
                    GEA_Service.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
                    const expirationDate = new Date(new Date().getTime() + expiration * 1000);
                    window.localStorage.setItem("gea_ecuador_token", accessToken);
                    window.localStorage.setItem("gea_ecuador_expiration_token", expirationDate);
                }
            } catch (error) {
                const { response } = error;
                const { data } = response;
                const messageError = get(data, "noticias.mensaje", t("Ha ocurrido un error, por favor intente nuevamente. Si el error persiste, contacte a soporte técnico."));
                toast.error(messageError, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                console.error(error.response);
            }
        };

        LogIn_GEA_services();
    }, [getToken]);

    return (
        <div>
            <Transition appear show={showWarningModal} as={Fragment}>
                <Dialog as="div" className="relative z-100" onClose={closeModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 px-10 text-left align-middle shadow-xl transition-all">
                                    <button className="absolute right-0 top-0 m-8 cursor-pointer fill-current text-gray-480" onClick={closeModal}>
                                        <CloseIcon width="1.2rem" height="1.2rem" />
                                    </button>
                                    <div className="mt-2">
                                        <WarningImpersonateIcon />
                                        <p className="my-4 items-baseline text-xl text-yellow-1040">{t("pma.¿Estás seguro de enviar esta respuesta?")}</p>
                                    </div>

                                    <div className="my-4">
                                        <p className="text-15 text-gray-400">
                                            {t("pma.Una vez enviada la respuesta, no podrás cambiarla. A menos que recibas un error de envío, en cuyo caso podrás cambiarla.")}
                                        </p>
                                    </div>
                                    <div className="my-2 flex items-center justify-between text-sm font-bold">
                                        <button type="button" className="p-3 text-primary-200" onClick={onCancelAnswer}>
                                            {t("buttons.cancel")}
                                        </button>
                                        <button
                                            onClick={() => {
                                                return sendingContact.sending ? handleSubmitAnswer("contact") : handleSubmitAnswer("termino");
                                            }}
                                            className="rounded-full bg-primary-200 p-3 px-5 text-white"
                                        >
                                            {t("buttons.continue")}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {showSidebar && (
                <div className="flex w-full">
                    <div className="hidden w-full flex-col bg-white mid:flex">
                        <div className="hidden h-full w-full flex-col overflow-y-auto md:flex md:p-6">
                            {belongsToCabinaTeam && (
                                <>
                                    <SelectSettings
                                        name="Contacto"
                                        label="Contacto"
                                        key="contact-select"
                                        type="select"
                                        isDisabled={contactSent || sendingContact?.sending || isArchived}
                                        options={contactOptions}
                                        value={contactValue}
                                        onChange={handleChangeContact}
                                        readOnly={props.readOnly}
                                        id="sel-contact"
                                        required
                                    />
                                    {sendingContact?.sending ? (
                                        <div className="flex justify-end">
                                            <BeatLoader color={"#00B3C7"} size={"0.6rem"} />
                                        </div>
                                    ) : contactSent ? (
                                        <div className="text-right text-xs italic text-green-500">{`* ${t("pma.answerSent")}`}</div>
                                    ) : (
                                        <div className="text-right text-xs italic text-red-500">{`* ${t("pma.answerNotSentYet")}`}</div>
                                    )}
                                    <SelectSettings
                                        name="Término"
                                        label="Término"
                                        key="termino-select"
                                        type="select"
                                        options={terminoOptions}
                                        isDisabled={terminoSent || sendingTermino?.sending || isArchived}
                                        value={terminoValue}
                                        onChange={handleChangeTermino}
                                        readOnly={props.readOnly}
                                        id="sel-termino"
                                        required
                                    />
                                    {sendingTermino?.sending ? (
                                        <div className="flex justify-end">
                                            <BeatLoader color={"#00B3C7"} size={"0.6rem"} />
                                        </div>
                                    ) : terminoSent ? (
                                        <div className="text-right text-xs italic text-green-500">{`* ${t("pma.answerSent")}`}</div>
                                    ) : (
                                        <div className="text-right text-xs italic text-red-500">{`* ${t("pma.answerNotSentYet")}`}</div>
                                    )}
                                </>
                            )}
                            <div className="flex flex-col justify-between bg-white">
                                {settingsArray &&
                                    settingsArray.map((setting, index) => {
                                        return (
                                            <div key={index}>
                                                <SidebarElement
                                                    {...setting}
                                                    storeParams={storeParams}
                                                    onChange={handleChange}
                                                    getErrorMessage={() => getErrorMessage(setting, get(setting, "rules"))}
                                                    readOnly={setting.readOnly || false || props.readOnly}
                                                />
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* <div className="absolute bottom-0 left-0 right-0 flex h-16 items-center justify-end bg-white p-6">
                                {loading ? (
                                    <button className="btn-primary">
                                        <BeatLoader size={8} color="#ffff" />
                                    </button>
                                ) : (
                                    !props.readOnly && (
                                        <button
                                            onClick={(evt) => (activeButton ? handleSubmit(evt) : null)}
                                            className={activeButton ? "btn-primary" : "btn-inactive"}
                                            disabled={!activeButton}>
                                            {t("buttons.save")}
                                        </button>
                                    )
                                )}
                            </div> */}
                        </div>
                    </div>
                    {/* <ToastContainer autoClose /> */}
                </div>
            )}
        </div>
    );
};

export default PluginsGeaEcuadorSidebar;
