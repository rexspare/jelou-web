// import styles from "./plugins-datafast-sidebar.module.scss";
import React, { useState, useEffect } from "react";
import EventEmitter from "./EventEmitter";
import { settings } from "./Data/mokData";

import { JelouApiV1 } from "./Services";

import { BeatLoader } from "react-spinners";
import HistoryIcon from "./Icon/HistoryIcon";
import get from "lodash/get";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import toUpper from "lodash/toUpper";
import axiosRetry from "axios-retry";
import Validator from "validatorjs";
import es from "validatorjs/src/lang/es";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SidebarElement from "./Sidebar/SidebarElement";
import SelectSettings from "./Sidebar/SelectSettings";
import TextBoxSettings from "./Sidebar/TextBoxSettings";
import axios from "axios";
import { Transition } from "@tailwindui/react";

const PARAMS_TEMPLATE = {
    Apellido: "",
    CategoriaCRM: "",
    Celular: "",
    Contacto: "",
    Correo: "",
    Descripcion: "",
    Direccion: "",
    Horario: "",
    MID: "",
    Nombre: "",
    Origen: "",
    Producto: "",
    RUC: "",
    RazonSocial: "",
    RucEnMora: "",
    Segmento: "",
    TID: "",
    Telefono: "",
    accionType: "",
    asignationType: "",
    cityName: "",
    legalId: "",
    name: "",
    option: "",
    phone: "",
    plate: "",
    service_type: "",
    solucion: "",
    teamCRM: "",
    team: "NUEVO",
};

export function DatafastSidebar(props) {
    const [storeParams, setStoreParams] = useState({});
    const [eventEmit] = useState(new EventEmitter());
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [savedData, setSavedData] = useState(null);
    const [settingsArray, setSettingsArray] = useState([]);
    const [errorArray, setErrorArray] = useState([]);
    const [team, setTeam] = useState("NUEVO");

    const [verifyParams, setVerifyParams] = useState([]);
    const [verifyStatus, setVerifyStatus] = useState(false);

    const [selectedCRM, setSelectedCRM] = useState(null);
    const [teamCRMValue, setTeamCRMValue] = useState(null);
    const [userCRMValue, setUserCRMValue] = useState(null);

    const [asignationTypeValue, setAsignationTypeValue] = useState(null);
    const [action, setAction] = useState(null);
    const [usersCRMOptions, setUsersCRMOptions] = useState([]);
    const [zonasCRM, setZonasCRM] = useState([]);
    const [teamsCRMOptions, setTeamsCRMOptions] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [ticketCRM, setTicketCRM] = useState(null);
    const [loadingZones, setLoadingZones] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [loadingTicket, setLoadingTicket] = useState(false);
    const [roomTickets, setRoomTickets] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    //const tempParams = props.storeParams;
    //    const [tempParams, setTempParams] = useState([]);

    const config = {
        headers: {
            Authorization:
                "Basic cFM1T2lrUUt2SFUzM1YyaUN2STdVc0NnTGtaTzZFOUY6VHl4ZXhsUl9EUk53MEV4LWd2ZmZZcldaUmhZc3U0amM1LU9MbU5PS2pkQXVRMlY2YW95WFEyVXAybVA3aUFhbg==",
        },
    };

    Validator.setMessages("es", es);

    axiosRetry(axios, {
        retries: 3,
    });

    const filterTicketsByRoom = async (roomId) => {
        try {
            const options = {
                method: "post",
                url: "https://api.jelou.ai/v1/company/35/databases/67/query?page=1&shouldPaginate=false",
                headers: {
                    Authorization:
                        "Basic cFM1T2lrUUt2SFUzM1YyaUN2STdVc0NnTGtaTzZFOUY6VHl4ZXhsUl9EUk53MEV4LWd2ZmZZcldaUmhZc3U0amM1LU9MbU5PS2pkQXVRMlY2YW95WFEyVXAybVA3aUFhbg==",
                },
                data: {
                    query: {
                        match: {
                            roomId,
                        },
                    },
                },
            };

            const data = await axios(options);
            setRoomTickets(get(data, "data"));
        } catch (error) {
            console.log("error: ", error);
        }
    };

    useEffect(() => {
        const { id, senderId } = props.currentRoom;
        // Cause the first load of the storeParams return a [] (bug)
        if (!Array.isArray(props.storeParams)) {
            //finding params in sessionStorage if not is creating the sessionStorage register
            const paramsObj = get(sessionStorage, `params-${senderId || id}`, {});
            const parser = !isEmpty(paramsObj) ? JSON.parse(paramsObj) : [];
            const updated = get(parser, "updated", false);
            filterTicketsByRoom(senderId || id);
            if (!updated) {
                if (!isEmpty(props.storeParams)) {
                    //only for the first load for every room
                    sessionStorage.setItem(`params-${senderId || id}`, JSON.stringify(props.storeParams));
                } else {
                    //when the storeParams is empty creates a white template
                    sessionStorage.setItem(`params-${senderId || id}`, JSON.stringify(PARAMS_TEMPLATE));
                }
            }
        }
        if (id) {
            setUpdating(false);
            fetchStoreParams(); //updating the sidebar
        }
    }, [props.storeParams]);

    useEffect(() => {
        if (!isEmpty(settings) && isEmpty(verifyParams)) {
            setVerifyParams(filterStoreParam(settings));
        }
    }, [props.currentRoom]);

    useEffect(() => {
        getSettings();
    }, [team]);

    useEffect(() => {
        getCRMUsersList();
        getCRMTeamsList();
        getCRMCategoriesList();
        getCRMProductsList();
        getSubZonaAfiliador();
    }, []);

    useEffect(() => {
        getVerify(filterStoreParam(settings));
        props.setSidebarChanged(storeParamsChanged());

        if (!isEmpty(storeParams)) {
            setAsignationTypeValue(get(storeParams, "asignationType", null));
            //setTeamCRMValue(get(storeParams, "teamCRM", null));
            //setAction(get(storeParams, "accionType", null));
            const newParams = { ...storeParams, updated: true };
            if (updating) {
                sessionStorage.setItem(`params-${props.currentRoom.senderId}`, JSON.stringify(newParams));
            }
        }
    }, [storeParams]);

    useEffect(() => {
        getSettings();
    }, [props.currentRoom]);

    const getSubZonaAfiliador = async () => {
        setLoadingZones(true);

        try {
            const zonas = [];
            const { data } = await axios.post("https://connectors.jelou.ai/datachat/Chatbot_ConsultaSubZonaAfiliador", {});
            const tempArrayZonas = get(data, "Chatbot_ConsultaSubZonaAfiliadorResult.Respuesta.ArrayOfDFSector.DFSector", []);
            if (!isEmpty(tempArrayZonas)) {
                tempArrayZonas.map((zona) => zonas.push({ label: zona.Nombre, value: zona.Codigo }));
                setZonasCRM(zonas);
            }
            setLoadingZones(false);
        } catch (error) {
            console.log(error);
            setLoadingZones(false);
        }
    };

    const getCRMTeamsList = async () => {
        setLoadingTeams(true);

        try {
            const { data } = await axios.post("https://connectors.jelou.ai/datachat/Chatbot_ConsultarEquiposExistentes", {});

            const tempArrayE = get(data, "Chatbot_ConsultarEquiposExistentesResult.Respuesta.ArrayOfDFEquipos.DFEquipos", []);
            const optionsT = [];
            if (!isEmpty(tempArrayE)) {
                tempArrayE.map((team) => optionsT.push({ label: team.Nombre, value: team.Id }));
            }
            setTeamsCRMOptions(optionsT);
            setLoadingTeams(false);
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const err = get(data, "Chatbot_ConsultarEquiposExistentesResult.Trace", "Ha ocurrido un error");
            toast.error(err, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            setLoadingTeams(false);
        }
    };

    const getCRMUsersList = async () => {
        setLoadingUsers(true);
        try {
            const { data } = await axios.post("https://connectors.jelou.ai/datachat/Chatbot_ConsultarUsuariosCRMActivos", {});
            const tempArray = get(data, "Chatbot_ConsultarUsuariosCRMActivosResult.Respuesta.ArrayOfDFUsuarios.DFUsuarios", []);
            const options = [];
            if (!isEmpty(tempArray)) {
                tempArray.map((user) => options.push({ label: user.Nombre, value: user.CodigoCRM }));
            }
            setUsersCRMOptions(options);
            setLoadingUsers(false);
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const err = get(data, "Chatbot_ConsultarUsuariosCRMActivosResult.Trace", "Ha ocurrido un error");
            toast.error(err, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            setLoadingUsers(false);
        }
    };

    const getCRMCategoriesList = async () => {
        setLoadingCategories(true);

        try {
            const { data } = await axios.post("https://connectors.jelou.ai/datachat/Chatbot_ConsultarCategoriasCRMExistentes", {});
            const tempArray = get(data, "Chatbot_ConsultarCategoriasCRMExistentesResult.Respuesta.ArrayOfDFCategorias.DFCategorias", []);
            const options = [];
            if (!isEmpty(tempArray)) {
                tempArray.map((item) => options.push({ label: item.Nombre, value: item.Codigo }));
            }
            setCategoriesList(options);
            setLoadingCategories(false);
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const err = get(data, "Chatbot_ConsultarCategoriasCRMExistentesResult.Trace", "Ha ocurrido un error!");

            toast.error(err, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            setLoadingCategories(false);
        }
    };

    const getCRMProductsList = async () => {
        setLoadingProducts(true);

        try {
            const { data } = await axios.post("https://connectors.jelou.ai/datachat/Chatbot_ConsultarProductosCRM", {});

            const tempArray = get(data, "Chatbot_ConsultarProductosCRMResult.Respuesta.ArrayOfDFProductos.DFProductos", []);
            const options = [
                {
                    label: "Nombre del Producto",
                    value: "Código del Producto",
                    description: "Descripción",
                },
            ];
            if (!isEmpty(tempArray)) {
                tempArray.map((item) => options.push({ label: item.Nombre, value: item.CodigoProducto, description: item.Nombre }));
            }
            setProductsList(options);
            setLoadingProducts(false);
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const err = get(data, "Chatbot_ConsultarProductosCRMResult.Trace", "Ha ocurrido un error");
            toast.error(err, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            setLoadingProducts(false);
        }
    };

    const fetchStoreParams = async () => {
        try {
            setSavedData({ ...props.storeParams }); // To make it strict
            const paramsTemporal = get(sessionStorage, `params-${props.currentRoom.senderId || props.currentRoom.id}`, {});
            const storageParamsObj = JSON.parse(paramsTemporal);
            setTeam(get(storageParamsObj, "team", "NUEVO"));
            setAction(get(storageParamsObj, "accionType", null));
            setStoreParams({
                ...storageParamsObj,
            });
            setTicketCRM(get(storageParamsObj, "ticket", ""));

            if (props.storeParams.CategoriaCRM) {
                handleCategoria(props.storeParams.CategoriaCRM);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const filterStoreParam = (settings) => {
        const filtered = settings.filter((element) => toUpper(element.team) === toUpper(team) || toUpper(element.team) === "BOTH");
        return filtered;
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setUpdating(true);
        setStoreParams({
            ...storeParams,
            [name]: value,
        });
    };

    const handleSelect = (evt, moreInfo) => {
        const { name } = moreInfo;
        if (name === "CategoriaCRM") {
            handleCategoria(evt.value);
        }
        setUpdating(true);
        setStoreParams({
            ...storeParams,
            [name]: evt.value,
        });
    };

    const handleCategoria = (value) => {
        const label = categoriesList.find((el) => value === el.value).label;
        setSelectedCRM({ id: value, name: label.split("-")[1] });
    };

    /**
     * Send the error message text. If it has the error atribute.
     *
     */
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

    const notify = (text) => {
        toast.success(
            <div className="flex items-center justify-between">
                <div className="flex">
                    <svg className="-mt-px ml-4 mr-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                            fill="#0CA010"
                        />
                    </svg>
                    <div className="text-15">{text}</div>
                </div>

                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10.6491 9.00013L17.6579 1.99094C18.114 1.53502 18.114 0.797859 17.6579 0.341939C17.202 -0.11398 16.4649 -0.11398 16.0089 0.341939L8.99989 7.35114L1.99106 0.341939C1.53493 -0.11398 0.798002 -0.11398 0.342092 0.341939C-0.114031 0.797859 -0.114031 1.53502 0.342092 1.99094L7.35093 9.00013L0.342092 16.0093C-0.114031 16.4653 -0.114031 17.2024 0.342092 17.6583C0.5693 17.8858 0.868044 18 1.16657 18C1.4651 18 1.76363 17.8858 1.99106 17.6583L8.99989 10.6491L16.0089 17.6583C16.2364 17.8858 16.5349 18 16.8334 18C17.132 18 17.4305 17.8858 17.6579 17.6583C18.114 17.2024 18.114 16.4653 17.6579 16.0093L10.6491 9.00013Z"
                        fill="#596859"
                    />
                </svg>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
            }
        );
    };

    /**
     * This will veritfy if all params are correctly filled
     *
     */
    const getVerify = (settings) => {
        let rulesArray = {};
        let dataArray = {};

        let errorArray = {};
        let dataErrorArray = {};

        const dependantArray = [];
        settings.forEach((setting) => {
            const isObligatory = get(setting, "rules.isObligatory", false);
            const isDependent = get(setting, "rules.isDependent", false);
            if (isObligatory) {
                if (!storeParams[setting.name]) {
                    props.setStatus(false); // On validate
                    emitOnValidate(false);
                    setVerifyStatus(false);
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
        emitOnValidate(veredict * dependantVeredict);
        setVerifyStatus(veredict * dependantVeredict);

        return false;
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

    /**
  This function gets all the settings that are not textbox for the new design
  */
    const getSettings = () => {
        const set = filterStoreParam(settings);
        getVerify(set);
        return setSettingsArray(set);
    };

    const fillSettings = () => {
        let fullSettings = { ...storeParams, TID: storeParams.TID || "" };
        const otherSettings = settings.filter((key) => toUpper(key.team) !== toUpper(team) && toUpper(key.team) !== "BOTH");
        otherSettings.forEach((key) => {
            if (toUpper(key.name) === "ORIGEN") {
                fullSettings = { ...fullSettings, origen: "OC" };
            } else {
                fullSettings = {
                    ...fullSettings,
                    [key.name]: "",
                };
            }
        });
        return fullSettings;
    };

    const resolveCase = async (ticket, senderParamsObj) => {
        const res = {
            ticketNumber: ticket,
            titulo: "Problema Resuelto", // Enviar este texto siempre
            observacion: storeParams.solucion === undefined ? storeParams.solucion : "",
            duracion: 0,
        };

        try {
            const { data } = await axios.post("https://connectors.jelou.ai/datachat/Chatbot_ResolverCaso", res);
            let responseSolved = "";
            let traceSolved = "";
            let wasSolved = "No";

            if (toUpper(get(data, "Chatbot_ResolverCasoResult.Codigo")) === "ER") {
                responseSolved = get(data, "Chatbot_ResolverCasoResult.Respuesta", "");
                traceSolved = get(data, "Chatbot_ResolverCasoResult.Trace", "");
                toast.error(get(data, "Chatbot_ResolverCasoResult.Trace", "Ha ocurrido un error"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } else {
                wasSolved = "Si";
                notify(get(data, "Chatbot_ResolverCasoResult.Respuesta", "Caso resuelto exitosamente."));
            }

            try {
                const params = { ...senderParamsObj, responseSolved, traceSolved, wasSolved, actionCrm: "Resolve" };
                await JelouApiV1.post(`/v1/company/35/databases/67/rows`, params, config);
            } catch (error) {
                console.log("error: ", error);
            }

            setLoading(false);
        } catch (error) {
            try {
                const params = { ...senderParamsObj, responseSolved: "", traceSolved: "", wasSolved: "No", actionCrm: "Resolve" };
                await JelouApiV1.post(`/v1/company/35/databases/67/rows`, params, config);
            } catch (error) {
                console.log("error: ", error);
            }

            console.log(error);
            setLoading(false);
        }
    };

    const asignCase = async () => {
        let obj = {
            RUC: storeParams.RUC,
            Nombre: storeParams.Nombre,
            Apellido: storeParams.Apellido,
            RazonSocial: storeParams.RazonSocial,
            Contacto: storeParams.Contacto !== undefined ? storeParams.Contacto : "",
            Telefono: storeParams.Telefono,
            Celular: storeParams.Celular,
            Direccion: storeParams.Direccion !== undefined ? storeParams.Direccion : "",
            Correo: storeParams.Correo !== undefined ? storeParams.Correo : "",
            RucEnMora: storeParams.RucEnMora !== undefined ? storeParams.RucEnMora : "",
            Segmento: storeParams.Segmento !== undefined ? storeParams.Segmento : "",
            MID: storeParams.MID !== undefined ? storeParams.MID : "",
            TID: storeParams.TID !== undefined ? storeParams.TID : "",
            Horario: storeParams.Horario !== undefined ? storeParams.Horario : "",
            Descripcion: storeParams.Descripcion,
            CategoriaCRM: storeParams.CategoriaCRM !== undefined ? storeParams.CategoriaCRM : "",
            Producto: storeParams.Producto !== undefined ? storeParams.Producto : "",
            CreaProspecto: team === "ACTUAL" ? false : true,
            origen: "OC",
            agente: props.userSession.email,
            autor: props.userSession.email,
            equipo: storeParams.equipo !== undefined ? storeParams.equipo : "",
            canton: storeParams.canton !== undefined ? storeParams.canton : "",
            zonaAfiliador: storeParams.zonaAfiliador !== undefined ? storeParams.zonaAfiliador : "",
        };

        if (storeParams.accionType === "RESOLVE") {
            obj.agente = props.userSession.email;
            obj.equipo = "";
        } else if (storeParams.asignationType === "USUARIO" && storeParams.agente !== undefined) {
            obj.equipo = "";
            obj.agente = storeParams.agente;
        }

        try {
            const { appId, senderId } = props.currentRoom;
            const { data } = await axios.post("https://connectors.jelou.ai/datachat/ChatBot_RegistrarCaso", obj);
            const Ticket = get(data, "ChatBot_RegistrarCasoResult.Ticket", "");
            let errorMessage = "";
            let errorTrace = "";
            if (toUpper(get(data, "ChatBot_RegistrarCasoResult.Codigo")) === "ER") {
                errorMessage = get(data, "ChatBot_RegistrarCasoResult.Respuesta", "");
                errorTrace = get(data, "ChatBot_RegistrarCasoResult.Trace", "");
                toast.error(get(data, "ChatBot_RegistrarCasoResult.Respuesta", "Error"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                });
                toast.error(get(data, "ChatBot_RegistrarCasoResult.Trace", "Ha ocurrido un error"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 8000,
                });
                setLoading(false);
            }
            setTicketCRM(Ticket);
            setStoreParams({ ...storeParams, ticket: Ticket });
            setLoadingTicket(false);

            /*SAVING IN STOREPARAMS */

            const sets = { ...fillSettings() };
            const keyObj = Object.keys(sets);
            let trimParams = {};
            keyObj.forEach((key) => {
                if (typeof sets[key] === "string") {
                    trimParams = { ...trimParams, [key]: sets[key].trim() };
                } else {
                    trimParams = { ...trimParams, [key]: sets[key] };
                }
            });
            trimParams = { ...trimParams, ticket: Ticket };
            const { clientId, clientSecret } = props.company;
            const auth = {
                username: clientId,
                password: clientSecret,
            };
            await JelouApiV1.post(`/v1/bots/${appId}/users/${senderId.replace("@c.us", "")}/storedParams/legacy`, trimParams, {
                auth,
            });

            trimParams = { ...trimParams, CreaProspecto: team === "ACTUAL" ? false : true };
            setSavedData(sets);
            setStoreParams(sets);
            emitOnSafe(trimParams);
            props.setSidebarChanged(true);

            /*------------- */

            const senderParamsObj = {
                ...obj,
                clientType: storeParams.team,
                solucion: storeParams.accionType === "RESOLVE" ? get(storeParams, "solucion") : "",
                ticket: Ticket,
                operatorId: props.userSession.id,
                operatorEmail: props.userSession.email,
                roomId: props.currentRoom.senderId,
                accionType: storeParams.accionType,
                asignationType: storeParams.accionType === "ASIGN" ? storeParams.asignationType : "",
                errorMessage,
                errorTrace,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (storeParams.accionType === "RESOLVE" && Ticket !== null) {
                await resolveCase(Ticket, senderParamsObj);
            } else {
                try {
                    await JelouApiV1.post("/v1/company/35/databases/67/rows", senderParamsObj, config);
                } catch (error) {
                    console.log("error: ", error);
                }
                setLoading(false);
            }
            if (get(data, "ChatBot_RegistrarCasoResult.Codigo") === "00") {
                notify(get(data, "ChatBot_RegistrarCasoResult.Respuesta", "Registrado con éxito"));
            }
        } catch (error) {
            console.log("error ticket", error.response);
            if (storeParams.accionType === "RESOLVE") {
                toast.error("No se pudo cerrar el caso. Por favor cerrarlo por medio del CRM", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 8000,
                });
            }
            setLoading(false);
            setLoadingTicket(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setLoadingTicket(true);
            asignCase();
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const err = data.message;
            setLoading(false);
            setLoadingTicket(false);
            toast.error(first(err), {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };

    const emitOnValidate = (data) => {
        // var event = new CustomEvent('onValidate', { detail: data })
        eventEmit.emit("onValidate", { data: data });
    };

    const emitOnSafe = (data) => {
        eventEmit.emit("onSafe", { data: data });
    };

    const changeClient = ({ value }) => {
        setUpdating(true);
        setTeam(value);
        setStoreParams({
            ...storeParams,
            team: value,
        });
    };

    const changeAsignation = ({ value }) => {
        setUpdating(true);
        setStoreParams({
            ...storeParams,
            asignationType: value,
        });
        setUserCRMValue(null);
        setTeamCRMValue(null);
        setAsignationTypeValue(value);
    };

    const changeUser = ({ value }) => {
        setUserCRMValue(value);
        setUpdating(true);
        setStoreParams({
            ...storeParams,
            agente: value,
        });
    };

    const changeTeam = ({ value }) => {
        setTeamCRMValue(value);
        setUpdating(true);
        setStoreParams({
            ...storeParams,
            equipo: value,
        });
    };

    const changeAction = ({ value }) => {
        setUpdating(true);
        setStoreParams({
            ...storeParams,
            accionType: value,
        });
        setAction(value);
    };

    const changeZona = ({ value }) => {
        setUpdating(true);
        setStoreParams({
            ...storeParams,
            zonaAfiliador: value,
        });
    };

    const storeParamsChanged = () => {
        return isEqual(savedData, storeParams);
    };

    const openModal = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const activeButton = !props.sidebarChanged && verifyStatus;

    const clientType = [
        { label: "Nuevo", value: "NUEVO" },
        { label: "Actual", value: "ACTUAL" },
    ];

    const asignationType = [
        { label: "Usuario", value: "USUARIO" },
        { label: "Equipo", value: "EQUIPO" },
    ];

    const actionsOptions = [
        { label: "Asignar Caso", value: "ASIGN" },
        { label: "Resolver Caso", value: "RESOLVE" },
    ];

    return (
        <div>
            {props.showSidebar && (
                <div className="flex w-full">
                    <div className="hidden w-full flex-col bg-white mid:flex">
                        <div className="px-4 pb-4 pt-4 text-gray-400">
                            <div className="relative">
                                <div className="relative text-right">
                                    <button onClick={openModal}>
                                        <div className="flex items-center justify-end space-x-2">
                                            <HistoryIcon />
                                            <span className="cursor-pointer text-xs text-primary-200">Historial de Tickets</span>
                                        </div>
                                    </button>
                                </div>
                                <div className="relative">
                                    <Transition show={open}>
                                        <div className="fixed inset-x-0 top-0 z-50 overflow-auto sm:inset-0 sm:flex sm:items-center sm:justify-center">
                                            <div className="fixed inset-0 transition-opacity">
                                                <div className="absolute inset-0 z-20 bg-smoke-light" />
                                            </div>
                                            <div className="w-full max-w-md transform rounded-lg bg-white px-6 py-5 shadow-modal transition-all">
                                                <div className="flex w-full justify-end">
                                                    <span className="cursor-pointer text-right font-bold text-gray-600" onClick={closeModal}>
                                                        x
                                                    </span>
                                                </div>
                                                <div className="text-primary pb-2 pl-2 text-lg font-bold">Historial de Tickets</div>
                                                <div className="relative p-2 text-xs">
                                                    {!isEmpty(roomTickets) ? (
                                                        <ul>
                                                            {roomTickets.map((ticket, idx) => (
                                                                <li key={idx}> {ticket.ticket}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <div className="text-light pb-3 text-center text-sm font-medium">
                                                            {" "}
                                                            Esta conversación no registra tickets
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                            <span className="block pt-2 text-base font-bold leading-normal text-gray-400 md:text-15 xxl:text-base">
                                Detalles de la conversación
                            </span>
                        </div>
                        <div className="hidden h-full w-full flex-col overflow-y-auto md:flex md:p-6">
                            <div className="flex flex-col justify-between bg-white">
                                <SelectSettings
                                    name="ClientType"
                                    label="Tipo del cliente"
                                    key="client-select"
                                    type="select"
                                    options={clientType}
                                    value={storeParams.team}
                                    onChange={changeClient}
                                    readOnly={props.readOnly}
                                    id="sel-client"
                                />
                                {settingsArray &&
                                    settingsArray.map((setting, index) => {
                                        return (
                                            <div key={index}>
                                                {setting.name !== "CategoriaCRM" && setting.name !== "Producto" && (
                                                    <SidebarElement
                                                        {...setting}
                                                        key={index}
                                                        onChange={handleChange}
                                                        handleSelect={handleSelect}
                                                        storeParams={storeParams}
                                                        getErrorMessage={() => getErrorMessage(setting, get(setting, "rules"))}
                                                        readOnly={setting.readOnly || false || props.readOnly}
                                                    />
                                                )}
                                                {(setting.name === "CategoriaCRM" || setting.name === "Producto") && (
                                                    <SidebarElement
                                                        {...setting}
                                                        options={setting.name === "CategoriaCRM" ? categoriesList : productsList}
                                                        key={index}
                                                        onChange={handleChange}
                                                        handleSelect={handleSelect}
                                                        isLoading={setting.name === "CategoriaCRM" ? loadingCategories : loadingProducts}
                                                        storeParams={storeParams}
                                                        getErrorMessage={() => getErrorMessage(setting, get(setting, "rules"))}
                                                        readOnly={setting.readOnly || false || props.readOnly}
                                                    />
                                                )}

                                                {setting.name === "CategoriaCRM" && selectedCRM !== null && (
                                                    <span htmlFor="medium" className="text-xxs mb-1 block font-medium uppercase text-gray-400">
                                                        {selectedCRM.id} - {selectedCRM.name}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                {team === "NUEVO" && (
                                    <SelectSettings
                                        name="zonaAfiliador"
                                        label="Zona Afiliador"
                                        type="select"
                                        options={zonasCRM}
                                        key="zones-select"
                                        isLoading={loadingZones}
                                        value={storeParams.zonaAfiliador}
                                        onChange={changeZona}
                                        errorCustome={storeParams.zonaAfiliador === null ? "Debe seleccionar una opción" : ""}
                                    />
                                )}

                                <SelectSettings
                                    name="accionType"
                                    label="Acción a realizar"
                                    key="action-type-select"
                                    type="select"
                                    options={actionsOptions}
                                    value={storeParams.accionType}
                                    onChange={changeAction}
                                    readOnly={props.readOnly}
                                    id="sel-action"
                                    errorCustome={action === null ? "Debe seleccionar una opción" : ""}
                                />
                                {action === "ASIGN" && (
                                    <SelectSettings
                                        name="asignationType"
                                        label="Tipo de asignación"
                                        key="asignation-type-select"
                                        type="select"
                                        options={asignationType}
                                        value={storeParams.asignationType}
                                        onChange={changeAsignation}
                                        readOnly={false}
                                        errorCustome={asignationTypeValue === null ? "Debe seleccionar una opción" : ""}
                                        id="sel-asign-type"
                                    />
                                )}

                                {action === "ASIGN" && asignationTypeValue === "EQUIPO" && (
                                    <SelectSettings
                                        name="teamCRM"
                                        label="Asignar a equipo"
                                        key="asignation-team-select"
                                        type="select"
                                        options={teamsCRMOptions}
                                        value={storeParams.equipo}
                                        isLoading={loadingTeams}
                                        onChange={changeTeam}
                                        readOnly={false}
                                        id="sel-asign-team"
                                        errorCustome={teamCRMValue === null ? "Debe seleccionar una opción" : ""}
                                    />
                                )}

                                {action === "ASIGN" && asignationTypeValue === "USUARIO" && (
                                    <SelectSettings
                                        name="userCRM"
                                        label="Asignar a usuario"
                                        key="asignation-user-select"
                                        type="select"
                                        options={usersCRMOptions}
                                        value={storeParams.agente}
                                        isLoading={loadingUsers}
                                        onChange={changeUser}
                                        readOnly={false}
                                        id="sel-asign-user"
                                        errorCustome={userCRMValue === null ? "Debe seleccionar una opción" : ""}
                                    />
                                )}

                                {storeParams.accionType === "RESOLVE" && (
                                    <TextBoxSettings
                                        name="solucion"
                                        id="solucion"
                                        label="Solución"
                                        onChange={handleChange}
                                        value={storeParams.solucion}
                                        errorCustome={!storeParams.solucion ? "Escriba la solución" : ""}
                                    />
                                )}
                            </div>
                            {loadingTicket && <div className="block text-xs font-bold leading-normal text-gray-600">Cargando Ticket....</div>}
                            {ticketCRM !== null && (
                                <span className="block text-13 font-bold leading-normal text-gray-700">
                                    TICKET N. <span> {ticketCRM}</span>
                                </span>
                            )}
                            <div className="flex items-end justify-end bg-white pb-1 pt-12">
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
                                            Guardar
                                        </button>
                                    )
                                )}
                            </div>
                            <ToastContainer autoClose />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default DatafastSidebar;
