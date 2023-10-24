import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { JelouApiV1 } from "@apps/shared/modules";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { updateStoredParams, updateRoomById } from "@apps/redux/store";
import SidebarElement from "../sidebar-element/SidebarElement";
import Validator from "validatorjs";
import es from "validatorjs/src/lang/es";

import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import first from "lodash/first";
import toLower from "lodash/toLower";

import { useTranslation, withTranslation } from "react-i18next";

const ConversationSidebar = (props) => {
    const { storeParams, setStoreParams, savedData, setSavedData, settings, setSidebarChanged, currentRoom, setShowConversationSidebarMobile } =
        props;
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [verifyParams, setVerifyParams] = useState([]);
    const [verifyStatus, setVerifyStatus] = useState(false);
    const [settingsArray, setSettingsArray] = useState([]);
    const [errorArray, setErrorArray] = useState([]);

    const dispatch = useDispatch();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    useEffect(() => {
        const currentChatRoom = get(currentRoom, "archived", false);
        if (currentChatRoom) {
            if (!isEmpty(settings) && isEmpty(verifyParams)) {
                setVerifyParams(settings);
            }
        }
    }, [currentRoom]);

    useEffect(() => {
        const settings = props.settings;
        getVerify(settings);
        setSidebarChanged(storeParamsChanged());
    }, [storeParams]);

    useEffect(() => {
        getSettings();
    }, [currentRoom]);

    useEffect(() => {
        const currentChatRoom = get(currentRoom, "archived", false);
        if (!currentChatRoom) {
            if (!isEmpty(settings) && isEmpty(verifyParams)) {
                setVerifyParams(props.settings);
            }
        }
    }, [currentRoom, settings, verifyParams]);

    useEffect(() => {
        getSettings();
    }, [currentRoom]);

    Validator.useLang(lang);

    const notify = () => {
        toast.success(
            <div className="flex items-center justify-between">
                <div className="flex">
                    <div className="text-15">{t("pma.Los datos fueron guardados correctamente")}</div>
                </div>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
            }
        );
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
        setStoreParams({
            ...storeParams,
            [name]: evt.value,
        });
    };

    const handleSubmit = async () => {
        try {
            const { appId, senderId } = currentRoom;
            const keyObj = Object.keys(storeParams);
            let trimParams = {};
            keyObj.forEach((key) => {
                if (typeof storeParams[key] === "string") {
                    if (toLower(key) === "name" || toLower(key) === "names") {
                        updateName(storeParams[key].trim());
                    }
                    trimParams = { ...trimParams, [key]: storeParams[key].trim() };
                } else {
                    trimParams = { ...trimParams, [key]: storeParams[key] };
                }
            });
            setLoading(true);
            notify();
            const { data } = await JelouApiV1.post(`bots/${appId}/users/${senderId.replace("@c.us", "")}/storedParams/legacy`, trimParams);
            const userData = get(data, "data", []);
            setLoading(false);
            setSavedData({ ...storeParams });
            setSidebarChanged(true);
            dispatch(updateStoredParams(userData));
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error(t("Ocurrió un error al guardar los datos por favor intenta nuevamente"), {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };

    const updateName = async (name) => {
        const { appId, id } = currentRoom;
        if (isEmpty(appId) || isEmpty(id)) return;
        JelouApiV1.post(`bots/${appId}/rooms/${id}/update`, { names: name })
            .then(({ data }) => {
                dispatch(updateRoomById({ ...currentRoom, names: name }));
            })
            .catch((err) => {
                console.log("error", err);
            });
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

        let dependantArray = [];
        settings.forEach((setting) => {
            const isObligatory = get(setting, "rules.isObligatory", false);
            const isDependent = get(setting, "rules.isDependent", false);
            if (isObligatory) {
                if (!storeParams[setting.name]) {
                    props.setStatus(false);
                    setVerifyStatus(false);
                }
                if (get(setting, "rules.rules")) {
                    rulesArray = { ...rulesArray, [setting.name]: get(setting, "rules.rules", "required") };
                    dataArray = { ...dataArray, [setting.name]: storeParams[setting.name] };
                }
            }
            if (get(setting, "rules.rules")) {
                errorArray = { ...errorArray, [setting.name]: get(setting, "rules.rules", "required") };
                dataErrorArray = { ...dataErrorArray, [setting.name]: storeParams[setting.name] };
            }
            if (isDependent) {
                dependantArray.push(setting.name);
            }
        });
        let validation = new Validator(dataArray, rulesArray, { required_if: "Campo requerido" });

        const veredict = validation.passes();

        Validator.setMessages("es", es);
        let errVal = new Validator(dataErrorArray, errorArray, { required_if: "Campo requerido" });
        errVal.fails();
        setErrorArray(errVal.errors.errors);
        const errors = errVal.errors.errors;
        const dependantVeredict = !getDependantError(errors, dependantArray);

        props.setStatus(veredict * dependantVeredict);
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
                return;
            }
        });
        return value;
    };

    /**
     * Send the error message text. If it has the error atribute.
     *
     */
    const getErrorMessage = (elementData, setting, rule) => {
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

    const storeParamsChanged = () => {
        return isEqual(savedData, storeParams);
    };

    /**
    This function gets all the settings that are not textbox for the new design
    */
    const getSettings = () => {
        let arraySettings = [];
        props.settings.map((setting) => {
            arraySettings.push(setting);
            return setSettingsArray(arraySettings);
        });
    };

    const hasValidationsErrors = () => {
        let hasErrors = true;
        settingsArray.map((setting) => {
            if (!isEmpty(getErrorMessage(storeParams[setting.name], setting, get(setting, "rules")))) {
                hasErrors = false;
            } else {
                hasErrors = true;
                return hasErrors;
            }
            return hasErrors;
        });
        return hasErrors;
    };

    const activeButton = !props.sidebarChanged && verifyStatus && hasValidationsErrors();

    // conversation sidebar archived room
    if (currentRoom?.archived) {
        return (
            <div className="relative mt-26 flex h-full flex-col overflow-y-auto rounded-r-xl bg-white p-2 sm:mt-0 mid:hidden">
                <div className="text-gray-400">
                    <span className="block px-6 pb-5 pt-3 text-base font-bold leading-normal text-gray-400">{t("Detalles de la conversación")}</span>
                </div>
                <div className="flex h-full w-full flex-col p-6">
                    <div className="flex flex-col justify-between bg-white">
                        {settingsArray.map((setting, index) => {
                            return (
                                <div key={index}>
                                    <SidebarElement {...setting} key={index} storeParams={storeParams} readOnly={true}></SidebarElement>
                                </div>
                            );
                        })}
                        <div className="fixed bottom-0 left-0 flex w-full items-center justify-start bg-white p-3 py-3 md:p-6">
                            <button
                                onClick={() => setShowConversationSidebarMobile(false)}
                                className={"rounded-full bg-gray-10 p-4 text-13 font-bold text-gray-400"}>
                                {t("pma.Cerrar")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // conversation sidebar chat room
    return (
        <div className="relative mt-32 flex h-full flex-col overflow-y-auto rounded-r-xl bg-white p-2 sm:mt-0 mid:hidden">
            <div className="mb-16 flex w-full flex-col overflow-y-auto px-6 md:p-6">
                <span className="block pb-6 text-base font-bold leading-normal text-gray-400">{t("pma.Detalles de la conversación")}</span>
                <div className="flex flex-col bg-white">
                    {settingsArray.map((setting, index) => {
                        return (
                            <div key={index}>
                                <SidebarElement
                                    {...setting}
                                    key={index}
                                    onChange={handleChange}
                                    handleSelect={handleSelect}
                                    storeParams={storeParams}
                                    getErrorMessage={() => getErrorMessage(storeParams[setting.name], setting, get(setting, "rules"))}
                                    readOnly={false}></SidebarElement>
                            </div>
                        );
                    })}
                    <div className="fixed bottom-0 left-0 flex w-full items-center justify-between bg-white p-3 py-3 md:p-6">
                        <button
                            onClick={() => setShowConversationSidebarMobile(false)}
                            className={"rounded-full bg-gray-10 p-4 text-13 font-bold text-gray-400"}>
                            {t("pma.Cerrar")}
                        </button>
                        {loading ? (
                            <button className="btn-primary">
                                <BeatLoader size={"0.5rem"} color="#ffff" />
                            </button>
                        ) : (
                            <button
                                onClick={activeButton ? handleSubmit : null}
                                className={activeButton ? "btn-primary" : "btn-inactive"}
                                disabled={!activeButton}>
                                {t("pma.Guardar")}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(ConversationSidebar);
