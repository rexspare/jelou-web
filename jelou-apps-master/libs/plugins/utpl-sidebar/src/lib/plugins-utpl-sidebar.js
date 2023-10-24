// import styles from "./plugins-utpl-sidebar.module.scss";
import React, { useState, useEffect } from "react";
import EventEmitter from "./EventEmitter";
import { settings, extraSettings, extraRules } from "./Data/mokData";
import { MOTIVOS } from "./Data/motivosData";
import { emailByAreas, GRADUATE, UNDERGRADUATE, TYPE_STUDENT } from "./Data/maestriasData";

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

const UTPLsidebar = (props) => {
    const [storeParams, setStoreParams] = useState({});
    const [eventEmit] = useState(new EventEmitter());
    const [loading, setLoading] = useState(false);

    const [settingsArray, setSettingsArray] = useState([]);
    const [savedData, setSavedData] = useState(null);
    const [errorArray, setErrorArray] = useState([]);
    const [motivosArray, setMotivosArray] = useState([]);
    const [graduateArray, setGraduateArray] = useState([]);
    const [undergraduateArray, setUndergraduateArray] = useState([]);
    const [typeStudentArray, setTypeStudentArray] = useState([]);

    const [verifyParams, setVerifyParams] = useState([]);
    const [verifyStatus, setVerifyStatus] = useState(true);
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
        getVerify([...settings, ...extraSettings, ...extraRules]);
        setSidebarToSave(!storeParamsChanged());
        props.setSidebarChanged(storeParamsChanged());
    }, [storeParams]);

    useEffect(() => {
        fetchStoreParams();
    }, [props.storeParams]);

    useEffect(() => {
        getSettings();
    }, [props.currentRoom]);

    useEffect(() => {
        setGraduateArray(getGraduate());
        getUndergraduate();
        getTypeStudent();
    }, []);

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
        if (name === "nomenclatura") {
            setNomenclatura(evt.value);
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
        // const errVal = new Validator(dataErrorArray, errorArray, {
        //     required_if: "Campo requerido",
        // });
        validation.fails();
        setErrorArray(validation.errors.errors);
        const errors = validation.errors.errors;
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
        getVerify([...set, ...extraSettings, ...extraRules]);
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
                    trimParams = {
                        ...trimParams,
                        [key]: storeParams[key].trim(),
                    };
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
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Ocurrió un error al guardar los datos por favor intenta nuevamente", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };
    //
    const getGraduate = () => {
        if (!props.userSession) {
            return [];
        }
        const areas = Object.keys(emailByAreas);
        let allAreas = [];
        areas.forEach((area) => {
            allAreas.push(area);
        });

        let returnedValue = [];
        allAreas.forEach((x) => {
            returnedValue = [...GRADUATE[x], ...returnedValue];
        });
        return returnedValue;
    };

    const getUndergraduate = () => {
        if (!props.userSession) {
            return [];
        }
        setUndergraduateArray(UNDERGRADUATE);
        // let returnedValue = [];
        // UNDERGRADUATE.forEach((x) => {
        //     returnedValue = [...UNDERGRADUATE[x], ...returnedValue];
        // });
        // return returnedValue;
    };

    const getTypeStudent = () => {
        if (!props.userSession) {
            return [];
        }
        setTypeStudentArray(TYPE_STUDENT);
    };

    const emitOnValidate = (data) => {
        eventEmit.emit("onValidate", { data: data });
    };

    const emitOnSafe = (data) => {
        eventEmit.emit("onSafe", { data: data });
    };

    // const activeButton = props.sidebarChanged && verifyStatus;
    const activeButton = sidebarToSave && verifyStatus;

    return (
        <div>
            {props.showSidebar && (
                <div className="flex w-full">
                    <div className="hidden w-full flex-col bg-white mid:flex">
                        <div className="hidden h-full w-full flex-col overflow-y-auto md:flex md:p-6 md:px-3">
                            <div className="flex flex-col justify-between bg-white">
                                {settingsArray &&
                                    settingsArray.map((setting, index) => {
                                        return (
                                            <div key={index}>
                                                <SidebarElement
                                                    {...setting}
                                                    key={index}
                                                    onChange={handleChange}
                                                    placeholder={setting.placeholder}
                                                    handleSelect={handleSelect}
                                                    storeParams={storeParams}
                                                    getErrorMessage={() => getErrorMessage(setting, get(setting, "rules"))}
                                                    readOnly={setting.readOnly || false || props.readOnly}
                                                />
                                            </div>
                                        );
                                    })}
                                {!isEmpty(motivosArray) && (
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
                                        getErrorMessage={() => getErrorMessage(extraRules[0], get(extraRules[0], "rules"))}
                                        readOnly={motivosArray.readOnly || false || props.readOnly}
                                    />
                                )}
                                {!isEmpty(graduateArray) && (
                                    <SidebarElement
                                        name="maestria"
                                        label="Maestría"
                                        key="graduate-select"
                                        type="select"
                                        options={graduateArray}
                                        storeParams={storeParams}
                                        rules={{ isObligatory: false }}
                                        handleSelect={handleSelect}
                                        onChange={handleSelect}
                                        id="sel-graduate"
                                        // getErrorMessage={() =>
                                        //   getErrorMessage(extraRules[1], get(extraRules[1], 'rules'))
                                        // }
                                    />
                                )}
                                {!isEmpty(undergraduateArray) && (
                                    <SidebarElement
                                        name="pregrado"
                                        label="Pregrado"
                                        key="undergraduate-select"
                                        type="select"
                                        options={undergraduateArray}
                                        storeParams={storeParams}
                                        rules={{ isObligatory: false }}
                                        handleSelect={handleSelect}
                                        onChange={handleSelect}
                                        id="sel-undergraduate"
                                        // getErrorMessage={() =>
                                        //   getErrorMessage(extraRules[1], get(extraRules[1], 'rules'))
                                        // }
                                    />
                                )}
                                {!isEmpty(typeStudentArray) && (
                                    <SidebarElement
                                        name="tipoEstudiante"
                                        label="Tipo de estudiante"
                                        key="typeStudent-select"
                                        type="select"
                                        options={typeStudentArray}
                                        storeParams={storeParams}
                                        rules={{ isObligatory: false }}
                                        handleSelect={handleSelect}
                                        onChange={handleSelect}
                                        id="sel-undergraduate"
                                        // getErrorMessage={() =>
                                        //   getErrorMessage(extraRules[1], get(extraRules[1], 'rules'))
                                        // }
                                    />
                                )}
                                {extraSettings.map((setting, index) => {
                                    return (
                                        <div key={index}>
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
                            <ToastContainer autoClose={false} closeOnClick />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default UTPLsidebar;
