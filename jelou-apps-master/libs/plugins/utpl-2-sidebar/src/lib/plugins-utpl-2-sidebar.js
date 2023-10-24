import styles from "./plugins-utpl-2-sidebar.module.scss";
import React, { useState, useEffect } from "react";
import EventEmitter from "./EventEmitter";
import { settings, extraSettings, outbound, inbound, subClassInbound, subClassOutbound } from "./Data/mokData";
import { MOTIVOS } from "./Data/motivosData";
import { TIPO, SUBTIPO, MOTIVO, RESULTADO } from "./Data/inboundData";

import { BeatLoader } from "react-spinners";
import { JelouApiV1 } from "./Services";
import get from "lodash/get";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import Validator from "validatorjs";
import es from "validatorjs/src/lang/es";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SidebarElement from "./Sidebar/SidebarElement";
import { toLower } from "lodash";

export function Utpl2Sidebar(props) {
    const [storeParams, setStoreParams] = useState({});
    const [eventEmit] = useState(new EventEmitter());
    const [loading, setLoading] = useState(false);

    const [settingsArray, setSettingsArray] = useState([]);
    const [savedData, setSavedData] = useState(null);
    const [errorArray, setErrorArray] = useState([]);
    const [motivosArray, setMotivosArray] = useState([]);

    const [tipoArray, setTipoArray] = useState([]);
    const [subtipoArray, setSubtipoArray] = useState([]);
    const [motivoArray, setmotivoArray] = useState([]);
    const [resultadoArray, setResultadoArray] = useState([]);
    const [rulesInbound, setRulesInbound] = useState(subClassInbound.slice(0, 1));

    const [verifyParams, setVerifyParams] = useState([]);
    const [verifyStatus, setVerifyStatus] = useState(false);
    const [sidebarToSave, setSidebarToSave] = useState(false);

    useEffect(() => {
        const { appId, senderId } = props.currentRoom;
        if (!!appId && !!senderId) {
            fetchStoreParams();
        }
        if (!isEmpty(settings) && isEmpty(verifyParams)) {
            setVerifyParams(settings);
        }
    }, [props.currentRoom]);

    useEffect(() => {
        // if outbound else inbound
        const classRules = isInTeam(props.teams, 159)
            ? [...outbound, ...subClassOutbound]
            : isInTeam(props.teams, 158)
            ? [...inbound, ...rulesInbound]
            : [];
        getVerify([...settings, ...extraSettings, ...classRules]);
        console.log("here123", storeParamsChanged());
        setSidebarToSave(!storeParamsChanged());
        props.setSidebarChanged(storeParamsChanged());
    }, [storeParams]);

    useEffect(() => {
        if (isInTeam(props.teams, 158)) {
            setInboundValues(storeParams);
        }
    }, [props.teams]);

    useEffect(() => {
        fetchStoreParams();
    }, [props.storeParams]);

    useEffect(() => {
        getSettings();
    }, [props.currentRoom]);

    const setInboundValues = (values) => {
        const { categoria, tipo, subtipo, motivo } = values;
        if (categoria) {
            setTipo(categoria);
            if (tipo) {
                setSubtipo(tipo);
                if (subtipo) {
                    setMotivo(subtipo);
                    if (motivo) {
                        setResultado(motivo);
                    }
                }
            }
        }
    };

    const fetchStoreParams = async () => {
        try {
            setSavedData({ ...props.storeParams }); // To make it strict
            setStoreParams({ ...props.storeParams }); // Same as above 👯
            const hasNomenclatura = get(props.storeParams, "nomenclatura", false);
            if (hasNomenclatura) {
                setNomenclatura(hasNomenclatura);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const storeParamsChanged = () => {
        return isEqual(savedData, storeParams);
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setStoreParams({
            ...storeParams,
            [name]: value,
        });
    };

    const handleSelect = (evt, moreInfo) => {
        const { name } = moreInfo;
        switch (toLower(name)) {
            case "nomenclatura":
                setNomenclatura(evt.value);
                break;
            case "categoria":
                setSubtipo([]);
                setmotivoArray([]);
                setResultadoArray([]);
                setTipo(evt.value);
                break;
            case "tipo":
                setmotivoArray([]);
                setResultadoArray([]);
                setSubtipo(evt.value);
                break;
            case "subtipo":
                setResultadoArray([]);
                setMotivo(evt.value);
                break;
            case "motivo":
                setResultado(evt.value);
                break;
            default:
                break;
        }
        setStoreParams({
            ...storeParams,
            [name]: evt.value,
        });
    };

    const setNomenclatura = (value) => {
        const hasMotivo = get(storeParams, "motivos", false);
        if (hasMotivo) {
            const isInArray = MOTIVOS[value].find((motivo) => hasMotivo === motivo.value);
            if (!isInArray) {
                delete storeParams.motivos;
            }
        }
        setMotivosArray(MOTIVOS[value]);
    };

    const setTipo = (value) => {
        const hasTipo = get(storeParams, "tipo", false);
        if (hasTipo) {
            const isInArray = TIPO[value].find((tipo) => hasTipo === tipo.value);
            if (!isInArray) {
                delete storeParams.tipo;
            }
        }
        setTipoArray(TIPO[value]);
    };

    const setSubtipo = (value) => {
        const hasSubtipo = get(storeParams, "subtipo", false);
        const subtipoValue = get(SUBTIPO, `${value}`, []);
        if (hasSubtipo) {
            const isInArray = subtipoValue.find((subtipo) => hasSubtipo === subtipo.value);
            if (!isInArray) {
                delete storeParams.subtipo;
            }
        }

        if (!isEmpty(subtipoValue)) {
            setRulesInbound(subClassInbound.slice(0, 2));
        }
        setSubtipoArray(subtipoValue);
    };

    const setMotivo = (value) => {
        const hasMotivo = get(storeParams, "motivo", false);
        const motivoValue = get(MOTIVO, `${value}`, []);
        if (isEmpty(motivoValue)) {
            setResultadoArray([]);
        }
        if (hasMotivo) {
            const isInArray = motivoValue.find((motivo) => hasMotivo === motivo.value);
            if (!isInArray) {
                delete storeParams.motivo;
            }
        }
        if (!isEmpty(motivoValue)) {
            setRulesInbound(subClassInbound.slice(0, 3));
        }
        setmotivoArray(motivoValue);
    };

    const setResultado = (value) => {
        const hasResultado = get(storeParams, "resultado", false);
        const resultadoValue = get(RESULTADO, `${value}`, []);
        if (hasResultado) {
            const isInArray = resultadoValue.find((resultado) => hasResultado === resultado.value);
            if (!isInArray) {
                delete storeParams.resultado;
            }
        }
        if (!isEmpty(resultadoValue)) {
            setRulesInbound(subClassInbound.slice(0, 4));
        }
        setResultadoArray(resultadoValue);
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
                    <div className="text-15">{"Los datos fueron guardados correctamente"}</div>
                </div>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
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
        let messages = Validator.getMessages("en");
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
        // if outbound else inbound
        const classRules = isInTeam(props.teams, 159) ? [...outbound, ...subClassOutbound] : [...inbound, ...rulesInbound];
        getVerify([...set, ...extraSettings, ...classRules]);
        return setSettingsArray(set);
    };

    const handleSubmit = async () => {
        try {
            const { appId, senderId } = props.currentRoom;
            setLoading(true);
            const keyObj = Object.keys(storeParams);
            let trimParams = {};
            keyObj.forEach((key) => {
                if (typeof storeParams[key] === "string") {
                    if (toLower(key) === "name" || toLower(key) === "names") {
                        props.updateName(storeParams[key].trim());
                    }
                    trimParams = { ...trimParams, [key]: storeParams[key].trim() };
                } else {
                    trimParams = { ...trimParams, [key]: storeParams[key] };
                }
            });
            notify();
            const { clientId, clientSecret } = props.company;
            const auth = {
                username: clientId,
                password: clientSecret,
            };
            const { data } = await JelouApiV1.post(`/v1/bots/${appId}/users/${senderId.replace("@c.us", "")}/storedParams/legacy`, trimParams, {
                auth,
            });
            setLoading(false);
            setSavedData({ ...storeParams });
            setStoreParams({ ...storeParams });
            emitOnSafe(trimParams);
            props.setSidebarChanged(true);
            props.dispatch(props.updateUserData(data.data));
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Ocurrió algún problema", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };

    const emitOnValidate = (data) => {
        eventEmit.emit("onValidate", { data: data });
    };

    const emitOnSafe = (data) => {
        eventEmit.emit("onSafe", { data: data });
    };

    const isInTeam = (teamArray, teamId) => {
        const filtered = teamArray.filter((team) => team.id === teamId);
        return !isEmpty(filtered);
    };

    // const activeButton = props.sidebarChanged && verifyStatus;
    const activeButton = sidebarToSave && verifyStatus;
    const teams = get(props, "teams");

    return (
        props.showSidebar && (
            <div className="flex w-full">
                <div className="hidden w-full flex-col bg-white mid:flex">
                    <div className="hidden h-full w-full flex-col overflow-y-auto md:flex md:p-6">
                        <div className="flex flex-col justify-between bg-white">
                            {settingsArray &&
                                settingsArray.map((setting, index) => {
                                    return (
                                        <div key={index}>
                                            <SidebarElement
                                                {...setting}
                                                key={index}
                                                onChange={handleChange}
                                                handleSelect={handleSelect}
                                                storeParams={storeParams}
                                                getErrorMessage={() => getErrorMessage(setting, get(setting, "rules"))}
                                                readOnly={setting.readOnly || false || props.readOnly}
                                            />
                                        </div>
                                    );
                                })}
                            {/* outbound team*/}
                            {/* {isInTeam(teams, 159) &&
                                outbound.map((setting, index) => {
                                    return (
                                        <div key={`extras-${index}`}>
                                            <SidebarElement
                                                {...setting}
                                                key={`extra-${index}`}
                                                onChange={handleChange}
                                                handleSelect={handleSelect}
                                                storeParams={storeParams}
                                                getErrorMessage={() => getErrorMessage(setting, get(setting, "rules"))}
                                                readOnly={setting.readOnly || false || props.readOnly}
                                            />
                                        </div>
                                    );
                                })} */}
                            {/* outbound team*/}
                            {!isEmpty(motivosArray) && isInTeam(teams, 159) && (
                                <SidebarElement
                                    name="motivos"
                                    label="Motivo"
                                    key="motive-select"
                                    type="select"
                                    options={motivosArray}
                                    storeParams={storeParams}
                                    rules={{ isObligatory: true }}
                                    handleSelect={handleSelect}
                                    onChange={handleSelect}
                                    id={"sel-motivo"}
                                    getErrorMessage={() => getErrorMessage(subClassOutbound[0], get(subClassOutbound[0], "rules"))}
                                    readOnly={props.readOnly}
                                />
                            )}
                            {/* inbound team*/}
                            {/* {isInTeam(teams, 158) &&
                                inbound.map((setting, index) => {
                                    return (
                                        <div key={`inpbounds-${index}`}>
                                            <SidebarElement
                                                {...setting}
                                                key={`inpbound-${index}`}
                                                onChange={handleChange}
                                                handleSelect={handleSelect}
                                                storeParams={storeParams}
                                                getErrorMessage={() => getErrorMessage(setting, get(setting, "rules"))}
                                                readOnly={setting.readOnly || false || props.readOnly}
                                            />
                                        </div>
                                    );
                                })} */}
                            {/* inbound team */}
                            {!isEmpty(tipoArray) && isInTeam(teams, 158) && (
                                <SidebarElement
                                    name="tipo"
                                    label="Tipo"
                                    key="tipo-select"
                                    type="select"
                                    options={tipoArray}
                                    storeParams={storeParams}
                                    rules={{ isObligatory: true }}
                                    handleSelect={handleSelect}
                                    onChange={handleSelect}
                                    id={"sel-tipo"}
                                    getErrorMessage={() => getErrorMessage(subClassInbound[0], get(subClassInbound[0], "rules"))}
                                    readOnly={props.readOnly}
                                />
                            )}
                            {/* inbound team */}
                            {!isEmpty(subtipoArray) && isInTeam(teams, 158) && (
                                <SidebarElement
                                    name="subtipo"
                                    label="Subtipo"
                                    key="subtipo-select"
                                    type="select"
                                    options={subtipoArray}
                                    storeParams={storeParams}
                                    rules={{ isObligatory: true }}
                                    handleSelect={handleSelect}
                                    onChange={handleSelect}
                                    id={"sel-subtipo"}
                                    getErrorMessage={() => getErrorMessage(subClassInbound[1], get(subClassInbound[1], "rules"))}
                                    readOnly={props.readOnly}
                                />
                            )}
                            {/* inbound team */}
                            {!isEmpty(motivoArray) && isInTeam(teams, 158) && (
                                <SidebarElement
                                    name="motivo"
                                    label="Motivo"
                                    key="motivo-select"
                                    type="select"
                                    options={motivoArray}
                                    storeParams={storeParams}
                                    rules={{ isObligatory: true }}
                                    handleSelect={handleSelect}
                                    onChange={handleSelect}
                                    id={"sel-motivo"}
                                    getErrorMessage={() => getErrorMessage(subClassInbound[2], get(subClassInbound[2], "rules"))}
                                    readOnly={props.readOnly}
                                />
                            )}
                            {/* inbound team */}
                            {!isEmpty(resultadoArray) && isInTeam(teams, 158) && (
                                <SidebarElement
                                    name="resultado"
                                    label="Resultado"
                                    key="resultado-select"
                                    type="select"
                                    options={resultadoArray}
                                    storeParams={storeParams}
                                    rules={{ isObligatory: true }}
                                    handleSelect={handleSelect}
                                    onChange={handleSelect}
                                    id={"sel-resultado"}
                                    getErrorMessage={() => getErrorMessage(subClassInbound[3], get(subClassInbound[3], "rules"))}
                                    readOnly={props.readOnly}
                                />
                            )}
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
                        <ToastContainer autoClose={false} closeOnClick={true} />
                    </div>
                </div>
            </div>
        )
    );
}

export default Utpl2Sidebar;
