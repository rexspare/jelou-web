// import styles from "./plugins-oscus-sidebar.module.scss";
import React, { useState, useEffect } from "react";
import EventEmitter from "./EventEmitter";
import { settings } from "./Data/mokData";
import { BeatLoader } from "react-spinners";
import { JelouApiV1 } from "./Services";
import get from "lodash/get";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import Validator from "validatorjs";
import es from "validatorjs/src/lang/es";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SidebarElement from "./Sidebar/SidebarElement";

const CUSTOMER_MODEL = {
    name: "",
    parish: "",
    city: "",
    province: "",
    email: "",
    code: "",
};

const selectEmptyData = { parish: "", province: "", city: "" };

export function PluginsOscusSidebar(props) {
    const [storeParams, setStoreParams] = useState({});
    const [eventEmit] = useState(new EventEmitter());
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [settingsArray, setSettingsArray] = useState([]);
    const [savedData, setSavedData] = useState(null);
    const [errorArray, setErrorArray] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [loadingCostumer, setLoadingCostumer] = useState(true);
    const [verifyParams, setVerifyParams] = useState([]);
    const [verifyStatus, setVerifyStatus] = useState(false);
    const [newClient, setNewClient] = useState(true);
    const [selectValues, setSelectValues] = useState(selectEmptyData);

    useEffect(() => {
        getToken();
    }, []);

    useEffect(() => {
        getVerify([...settings]);
        props.setSidebarChanged(storeParamsChanged());
        isEmpty(storeParams) ? setLoadingCostumer(true) : setLoadingCostumer(false);
    }, [storeParams]);

    useEffect(() => {
        !isEmpty(token) && getProvinces();
        if (!isEmpty(token)) {
            !isEmpty(props.storeParams) && fetchStoreParams();
            !isEmpty(settings) && isEmpty(verifyParams) && setVerifyParams(settings);
        }
    }, [props.storeParams, token]);

    useEffect(() => {
        const { appId, senderId } = props.currentRoom;
        if (!!appId && !!senderId && !isEmpty(props.storeParams)) {
            fetchStoreParams();
        }
        if (!isEmpty(settings) && isEmpty(verifyParams)) {
            setVerifyParams(settings);
        }
    }, [props.currentRoom.id]); // CADA QUE CAMBIE DE ROOM

    useEffect(() => {
        getSettings();
        getStoreParams();
        // setStoreParams([]);
    }, [props.currentRoom]);

    /* useEffect(() => {
        if (!isEmpty(token)) {
            getProvinces();
            !isEmpty(props.storeParams) && fetchStoreParams();
        }
    }, [token]); */

    const getToken = async () => {
        try {
            const body = {
                grant_type: "password",
                client_id: "oscussoft",
                username: "chatbot",
                client_secret: "c053df24-9efa-4398-b27c-d4ca11a23f44",
                password: "(H4780T@",
            };
            const params = { url: "https://acceso.oscus.coop/auth/realms/OscusRealm/protocol/openid-connect/token" };

            const { data } = await axios.post(`https://proxy.jelou.ai/dev/oscus`, body, {
                params,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            setToken(get(data, "access_token", ""));
        } catch (error) {
            console.log(error);
        }
    };

    const getProvinces = async () => {
        try {
            const params = { url: `https://acceso.oscus.coop/clientes/api/clientes/provincias` };
            const { data } = await axios.get(`https://proxy.jelou.ai/dev/oscus/services`, {
                params,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!isEmpty(data) && data?.status !== 400) {
                const list = [];
                data.anexo.forEach((province) => list.push({ value: province.codigo, label: province.nombre }));
                setProvinces([...list]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getCities = async (provincia) => {
        try {
            const params = { url: `https://acceso.oscus.coop/clientes/api/clientes/cantones/${provincia}` };
            const { data } = await axios.get(`https://proxy.jelou.ai/dev/oscus/services`, {
                params,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!isEmpty(data)) {
                const list = [];
                data.anexo.forEach((city) => list.push({ value: city.secuencial.toString(), label: city.nombre }));
                setCities([...list]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getZones = async (city) => {
        try {
            const params = { url: `https://acceso.oscus.coop/clientes/api/clientes/zonas/${city}` };
            const { data } = await axios.get(`https://proxy.jelou.ai/dev/oscus/services`, {
                params,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!isEmpty(data)) {
                const list = [];
                data.anexo.forEach((zone) => list.push({ value: zone.codigo, label: zone.nombre }));
                setZones([...list]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchStoreParams = async () => {
        try {
            if (!props.readOnly) {
                loadCustomerInfo(get(props.storeParams, "legalId", ""));
            } else {
                setSavedData({ ...props.storeParams }); // To make it strict
                !isEmpty(get(props.storeParams, "province", "")) && getCities(get(props.storeParams, "province"));
                !isEmpty(get(props.storeParams, "city", "")) && getZones(get(props.storeParams, "city"));
                setStoreParams({ ...props.storeParams }); // Same as above 👯
            }
        } catch (error) {
            console.log(error);
        }
    };

    const storeParamsChanged = () => {
        return isEqual(savedData, storeParams);
    };

    const loadData = (data) => {
        getCities(get(data, "provincia").toString().trim());
        getZones(get(data, "canton").toString().trim());
    };

    const updateCostumerData = (data, legalId) => {
        const list = {
            legalId,
            name: `${get(data, "nombres")} ${get(data, "apellidos")}`,
            parish: get(data, "parroquia").toString().trim(),
            city: get(data, "canton").toString().trim(),
            province: get(data, "provincia").toString().trim(),
            email: get(data, "correoElectronico", ""),
        };

        setSelectValues({
            parish: get(data, "parroquia").toString().trim(),
            city: get(data, "canton").toString().trim(),
            province: get(data, "provincia").toString().trim(),
        });

        if (!isEmpty(get(data, "telefono", ""))) {
            list.phone = { ...get(data, "telefono") };
        }

        setStoreParams({
            ...props.storeParams,
            ...list,
        });
        setSavedData({
            ...props.storeParams,
            ...list,
        });
        setLoadingCostumer(false);
    };

    const loadCustomerInfo = async (legalId) => {
        try {
            const params = {
                url: `https://acceso.oscus.coop/clientes/api/clientes/${legalId}`,
                tid: "C",
                usr: "chatbot",
            };
            const { data } = await axios.get(`https://proxy.jelou.ai/dev/oscus/services`, {
                params,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!isEmpty(data)) {
                const codigo = get(data, "correcto", false);
                if (codigo) {
                    setLoadingCostumer(true);
                    updateCostumerData(get(data, "anexo"), legalId);
                    loadData(get(data, "anexo"));
                    setNewClient(false);
                } else {
                    setNewClient(true);
                    setSavedData({ ...props.storeParams, ...CUSTOMER_MODEL });
                    setStoreParams({ ...props.storeParams, ...CUSTOMER_MODEL });
                }
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al leer datos de usuario", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 9000,
            });
            console.log(error);
            setNewClient(true);
            setSavedData({ ...props.storeParams, ...CUSTOMER_MODEL }); // To make it strict
            setStoreParams({ ...props.storeParams, ...CUSTOMER_MODEL });
        }
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setStoreParams({
            ...storeParams,
            [name]: value,
        });
        if (name === "legalId") {
            !newClient && setStoreParams({ legalId: value });
            value.length === 10 && loadCustomerInfo(value);
        }
    };

    const handleSelect = (evt, moreInfo) => {
        const { name } = moreInfo;

        setStoreParams({
            ...storeParams,
            [name]: evt.value,
        });
        setSelectValues({ ...selectValues, [name]: evt.value });
        name === "province" && getCities(evt.value);
        name === "city" && getZones(evt.value);
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

    const notify = () => {
        toast.success(
            <div className="flex items-center justify-between">
                <div className="flex">
                    <svg className="-mt-px ml-4 mr-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                            fill="#0CA010"
                        />
                    </svg>
                    <div className="text-15">Los datos fueron guardados correctamente</div>
                </div>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 8000,
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

        Validator.setMessages("es", es);
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
        const set = settings;
        getVerify([...set]);
        return setSettingsArray(set);
    };

    const getStoreParams = async () => {
        try {
            const appId = get(props, "currentRoom.appId", "");
            const senderId = get(props, "currentRoom.senderId", "");

            const { clientId, clientSecret } = props.company;
            const auth = {
                username: clientId,
                password: clientSecret,
            };
            const { data } = await axios.get(`https://api.jelou.ai/v1/bots/${appId}/users/${senderId.replace("@c.us", "")}/storedParams/legacy`, {
                auth,
            });
            setStoreParams({ ...data.data });
        } catch (error) {
            console.log(error);
        }
    };

    const createProspecto = async () => {
        try {
            const params = { url: `https://acceso.oscus.coop/clientes/api/clientes/prospecto` };
            const body = {
                cedula: get(storeParams, "legalId", ""),
                codigoDactilar: get(storeParams, "code", ""),
                observaciones: get(storeParams, "observations", ""),
                numero: get(storeParams, "phone", ""),
                modo: 2,
            };

            const { data } = await axios.post(`https://proxy.jelou.ai/dev/oscus/services`, body, {
                params,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!isEmpty(data)) {
                get(data, "correcto")
                    ? notify()
                    : toast.error(get(data, "informacion", "Ha ocurrido un error al crear el propecto"), {
                          position: toast.POSITION.BOTTOM_RIGHT,
                          autoClose: 9000,
                      });
            }
        } catch (error) {
            console.log(error);
            toast.error("Ha ocurrido un error", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 9000,
            });
        }
    };

    const handleSubmit = async () => {
        try {
            const { appId, senderId } = props.currentRoom;
            setLoading(true);
            const keyObj = Object.keys(storeParams);
            let trimParams = {};
            keyObj.forEach((key) => {
                if (typeof storeParams[key] === "string") {
                    trimParams = { ...trimParams, [key]: storeParams[key].trim() };
                } else {
                    trimParams = { ...trimParams, [key]: storeParams[key] };
                }
            });
            const { clientId, clientSecret } = props.company;
            const auth = {
                username: clientId,
                password: clientSecret,
            };
            await JelouApiV1.post(`/v1/bots/${appId}/users/${senderId.replace("@c.us", "")}/storedParams/legacy`, trimParams, {
                auth,
            });
            newClient ? createProspecto() : notify();
            setLoading(false);
            setSavedData({ ...storeParams });
            setStoreParams({ ...storeParams });
            emitOnSafe(trimParams);
            props.setSidebarChanged(true);
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Ha ocurrido un error", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 9000,
            });
        }
    };

    const emitOnValidate = (data) => {
        eventEmit.emit("onValidate", { data: data });
    };

    const emitOnSafe = (data) => {
        eventEmit.emit("onSafe", { data: data });
    };

    const activeButton = !props.sidebarChanged && verifyStatus && !props.readOnly;

    return (
        <div>
            {props.showSidebar && (
                <div className="flex w-full">
                    <div className="hidden w-full flex-col bg-white mid:flex">
                        {loadingCostumer ? (
                            <div className="text-grey px-6 pt-4 text-sm">Cargando datos ...</div>
                        ) : (
                            <div className="flex justify-center">
                                <div
                                    className={`max-w-150 rounded-xs px-6 text-center text-xs font-semibold text-white ${
                                        newClient ? "bg-orange" : " bg-primary"
                                    }`}>
                                    {newClient ? "NO ES CLIENTE" : "CLIENTE OSCUS"}
                                </div>
                            </div>
                        )}
                        <div className="hidden h-full w-full flex-col overflow-y-auto md:flex md:p-6">
                            <div className="flex flex-col justify-between bg-white">
                                {settingsArray &&
                                    !isEmpty(provinces) &&
                                    settingsArray.map((setting, index) => {
                                        return (
                                            <div key={index}>
                                                {setting.name !== "parish" && setting.name !== "city" && setting.name !== "province" ? (
                                                    (get(setting, "show") === "both" || (get(setting, "show") === "newClient" && newClient)) && (
                                                        <SidebarElement
                                                            {...setting}
                                                            key={index}
                                                            onChange={handleChange}
                                                            handleSelect={handleSelect}
                                                            storeParams={storeParams}
                                                            getErrorMessage={() => getErrorMessage(setting, get(setting, "rules"))}
                                                            readOnly={props.readOnly ? true : setting.lock && !newClient}
                                                        />
                                                    )
                                                ) : (
                                                    <SidebarElement
                                                        {...setting}
                                                        options={setting.name === "province" ? provinces : setting.name === "city" ? cities : zones}
                                                        key={index}
                                                        handleSelect={handleSelect}
                                                        storeParams={storeParams}
                                                        selectValues={selectValues}
                                                        getErrorMessage={() => getErrorMessage(setting, get(setting, "rules"))}
                                                        readOnly={props.readOnly ? true : setting.lock && !newClient}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
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
                            <ToastContainer autoClose closeOnClick />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default PluginsOscusSidebar;
