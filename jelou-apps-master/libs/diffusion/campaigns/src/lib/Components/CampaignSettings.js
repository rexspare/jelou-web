import first from "lodash/first";
import get from "lodash/get";
import has from "lodash/has";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import orderBy from "lodash/orderBy";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

/* Components */
import { RESPONSE_TYPES } from "@apps/shared/constants";
import { JelouApiV1 } from "@apps/shared/modules";
import AditionalParams from "./AditionalParams";
import ButtonsPicker from "./ButtonsPicker";
import ConfirmationSetting from "./ConfirmationSetting";
import DeleteSetting from "./DeleteSetting";
import FlowPicker from "./FlowPicker";
import OptionsPicker from "./OptionsPicker";
import ResponseTypePicker from "./ResponseTypePicker";
import SettingsHeader from "./Settings";

const CampaignSettings = (props) => {
    const {
        currentBot,
        nextStep,
        response,
        setResponse,
        handleOptionConfig,
        responseType,
        setResponseType,
        ttl,
        setTtl,
        setShowOptions,
        flowId,
        setFlowId,
        options,
        setOptions,
        ttlValue,
        setTtlValue,
        arrayColumn,
        storeParams,
        setStoreParams,
        setShowParams,
        currentCompany,
        selectedHsm,
        arrayButton,
        setArrayButton,
        setShowButtons,
        steps,
        setSettingConfig,
        settingConfig,
        setFlowBack,
        flowBack,
        setStepBack4,
        stepBack4,
        setFlowsBack,
        flowsBack,
        setSteps,
    } = props;
    const [flows, setFlows] = useState([]);
    const [name, setName] = useState("");
    const [flow, setFlow] = useState({});
    const [firstFlow, setFirstFlow] = useState([]);
    const { t } = useTranslation();
    const [configName, setConfigName] = useState("");
    const [toUpdate, setToUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [configurations, setConfigurations] = useState([]);
    const [configuration, setConfiguration] = useState([]);
    const [selectedConfiguration, setSelectedConfiguration] = useState(false);
    const [loading, setLoading] = useState(false);
    const [repeatedName, setRepeatedName] = useState(false);
    const [enable, setEnable] = useState(false);
    const [enableNext, setEnableNext] = useState(true);
    const [campaignConfigurationId, setCampaignConfigurationId] = useState("");
    const [campaignConfigurationName, setCampaignConfigurationName] = useState("");
    const ACTION_QUICKREPLY = `${get(selectedHsm, "interactiveAction", "")}`.toUpperCase() === "QUICK_REPLY";
    // const ACTION_CALL = `${get(selectedHsm, "interactiveAction", "")}`.toUpperCase() === "CALL_TO_ACTION";
    //?Flags Setp 4
    const [onSelectStep4, setOnSelectStep4] = useState(false);
    const [flagFlowPicker, setFlagFlowPicker] = useState(false);
    const [flagSwitchPick, setFlagSwitchPick] = useState(false);

    useEffect(() => {
        getFlows();
        getConfigurations();
        setFlowId(get(first(flows), "id"));
        setFlow(first(flows));
    }, [currentBot]);

    useEffect(() => {
        if (configName.length > 3 && validateNameConfig()) {
            setEnable(true);
        } else {
            setEnable(false);
        }
    }, [configName]);

    const getFlows = async () => {
        try {
            const { clientId: username, clientSecret: password } = currentCompany;
            const { data } = await JelouApiV1.get(`/bots/${currentBot.id}/flows`, {
                params: {
                    shouldPaginate: false,
                },
                auth: {
                    username,
                    password,
                },
            });
            if (!isEmpty(data)) {
                let newFlow = [];
                let orderFlow = get(data, "results").filter((flow) => flow.status === 1);
                orderFlow = orderBy(orderFlow, ["title"], ["asc"]);
                orderFlow.map((op) => newFlow.push({ ...op, name: op.title }));
                setFlows(newFlow);
                const firstFlow = first(flows);
                setFirstFlow(firstFlow);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getConfigurations = async () => {
        try {
            const { clientId: username, clientSecret: password } = currentCompany;
            const { data } = await JelouApiV1.get(`/bots/${currentBot.id}/campaigns/configurations`, {
                params: {
                    shouldPaginate: false,
                },
                auth: {
                    username,
                    password,
                },
            });
            if (!isEmpty(data)) {
                let settings = get(data, "data.results").filter((setting) => setting.state);
                settings = orderBy(settings, ["name"], ["asc"]);
                setConfigurations(settings);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const newConfiguration = () => {
        const data = { name: configName, configuration: response };
        const { clientId: username, clientSecret: password } = currentCompany;
        const header = {
            auth: {
                username,
                password,
            },
        };
        JelouApiV1.post(`/bots/${currentBot.id}/campaigns/configurations`, data, header)
            .then((res) => {
                toast.success(t("Configuración creada de manera exitosa"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                setCampaignConfigurationId(res.data.data.id);
                setCampaignConfigurationName(res.data.data.name);
            })
            .catch((er) => {
                toast.error(t("Error al crear nueva configuración"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                console.log(er, " error");
            });
    };

    const updateConfiguration = async () => {
        const data = { name: configName, configuration: response };
        const { clientId: username, clientSecret: password } = currentCompany;
        const header = {
            auth: {
                username,
                password,
            },
        };
        JelouApiV1.patch(`/bots/${currentBot.id}/campaigns/configurations/${configuration.id}`, data, header)
            .then((res) => {
                toast.success(t("Se ha actualizado los cambios de la configuración"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                setCampaignConfigurationId(res.data.data.id);
                setCampaignConfigurationName(res.data.data.name);
            })
            .catch((er) => {
                console.log(er, " error");
                toast.error(t("Error al actualizar la configuración"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            });
    };

    const removeConfiguration = async () => {
        setLoading(true);
        const id = get(configuration, "id", "");
        const { clientId: username, clientSecret: password } = currentCompany;
        const header = {
            auth: {
                username,
                password,
            },
        };
        JelouApiV1.delete(`/bots/${currentBot.id}/campaigns/configurations/${id}`, header)
            .then(() => {
                toast.success(t("La configuración ha sido eliminada de manera exitosa"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                setConfigurations(configurations.filter((config) => config.id !== configuration.id));
                setResponseType(null);
                setOptions([]);
                setFlowId(null);
                setResponse([]);
                setStoreParams([]);
                setConfigName("");
                setLoading(false);
                setOpenDelete(false);
                setConfiguration([]);
                setSelectedConfiguration(false);
            })
            .catch((er) => {
                console.log(er, " error");
                toast.error(t("Error al eliminar la configuración"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                setLoading(false);
                setOpenDelete(false);
            });
        setLoading(false);
        setToUpdate(false);
        setOpenDelete(false);
    };

    const getFlowQuestion = async (questionId) => {
        try {
            const { clientId: username, clientSecret: password } = currentCompany;
            const { data } = await JelouApiV1.get(`/bots/${currentBot.id}/flows/${questionId}`, {
                auth: {
                    username,
                    password,
                },
            });
            if (!isEmpty(data)) {
                const flowId = get(data, "data.flowId");
                setFlowId(flowId);
                const flow = flows.find((flow) => flow.id === flowId);
                setFlow(flow);
                handleOptionConfig(getTitle(flowId));
            }
        } catch (error) {
            console.log(error, " error");
        }
    };

    const getTitle = (flowId) => {
        const flow = flows.find((flow) => flow.id === parseInt(flowId, 10));
        const title = get(flow, "title");
        return title;
    };

    const showConfigurations = (setting) => {
        if (has(setting, "setFlow")) {
            const flowId = get(setting, "setFlow.id");
            const flow = flows.find((flow) => flow.id === parseInt(flowId, 10));
            setResponseType(RESPONSE_TYPES.FLOW);
            setFlowId(flowId);
            setFlow(flow);
        } else if (has(setting, "setState.options")) {
            const ttl = get(setting, "setState.ttl");
            const opt = get(setting, "setState.options");
            const temp = [];
            opt.forEach((o, i) => {
                const flow = flows.find((flow) => flow.id === parseInt(o.flowId, 10));
                const flowName = get(flow, "title");
                const option = {
                    id: uuidv4(),
                    flowName: flowName,
                    index: temp.length + 1,
                    type: "flow",
                    flowId: o.flowId,
                    title: o.title,
                };
                temp.push(option);
            });
            setOptions(temp);
            setResponseType(RESPONSE_TYPES.OPTIONS);
            convertDuration(ttl);
        } else if (has(setting, "setState.inputId")) {
            setResponseType(RESPONSE_TYPES.INPUT);
            const questionId = get(setting, "setState.inputId");
            getFlowQuestion(questionId);
            const ttl = get(setting, "setState.ttl");
            convertDuration(ttl);
        } else if (isArray(setting)) {
            setResponseType(RESPONSE_TYPES.BUTTONS);
            setResponse(setting);
            setArrayButton(setting);
        }
        // if (!has(setting, "setFlow") && !has(setting, "setState") && !isArray(configuration)) {
        //     setResponseType(null);
        // }
        const params = get(setting, "setStoreParams");
        if (!isEmpty(params)) {
            showParams(params);
        } else {
            setStoreParams([]);
        }
    };

    const handleConfigurations = (target) => {
        setOnSelectStep4(true);
        setFlowBack(null);
        const setting = configurations.find((config) => config.id === Number(target.id));
        setSettingConfig(setting);
        const configuration = get(setting, "configuration");
        const name = get(setting, "name", "");

        setConfiguration(setting);
        setResponse(configuration);
        setConfigName(name);
        showConfigurations(configuration);
        setSelectedConfiguration(true);
        setToUpdate(true);
        setCampaignConfigurationName(name);
        setCampaignConfigurationId(get(setting, "id", ""));
    };

    const showParams = (storeParams) => {
        const store = storeParams;
        const keys = Object.keys(store);
        let param = [];
        keys.forEach((key) => {
            const value = get(store, key);
            if (!isObject(value)) {
                const string = value.split("{");
                const name = string[1].split("}");
                const arrayParam = arrayColumn.find((column) => column.name === name[0]);
                const storeParam = {
                    id: uuidv4(),
                    nameField: key,
                    index: param.length + 1,
                    field: name[0],
                    fieldNumber: get(arrayParam, "id", 0),
                };
                param.push(storeParam);
            }
        });
        setStoreParams(param);
    };

    const updateResponse = () => {
        const storeParams = parseStore();

        if (responseType === RESPONSE_TYPES.OPTIONS && options) {
            const setPayloadOptions = parseOption();
            setOptionResponse(setPayloadOptions, storeParams);
            setShowOptions(options);
        }
        if (responseType === RESPONSE_TYPES.INPUT && response) {
            setResponse({
                ...(!isEmpty(storeParams) ? { setStoreParams: storeParams } : {}),
                setState: {
                    ...response.setState,
                    ttl: ttl,
                },
            });
        }
        if (responseType === RESPONSE_TYPES.FLOW && response) {
            setResponse({
                ...(!isEmpty(storeParams) ? { setStoreParams: storeParams } : {}),
                setFlow: {
                    ...response.setFlow,
                },
            });
        }
        if (responseType === RESPONSE_TYPES.BUTTONS) {
            setResponse(arrayButton);
        }
        if (!isEmpty(storeParams) && isEmpty(responseType)) {
            setResponse({ setStoreParams: storeParams });
        }
    };

    const save = () => {
        setLoading(true);
        if (toUpdate) {
            updateConfiguration();
        } else {
            newConfiguration();
            setToUpdate(true);
        }
        getConfigurations();
        setLoading(false);
        setOpen(false);
    };

    const gotNext = () => {
        setStepBack4(false);
        nextStep(4);
        const storeParams = parseStore();
        if (responseType === RESPONSE_TYPES.OPTIONS && options) {
            const setPayloadOptions = parseOption();
            setResponse({
                setState: {
                    ttl: ttl,
                    type: "options",
                    options: setPayloadOptions,
                },
                ...(!isEmpty(storeParams) ? { setStoreParams: storeParams } : {}),
                campaignConfigurationId: campaignConfigurationId,
                campaignConfigurationName: campaignConfigurationName,
            });
            setShowOptions(options);
        }
        if (responseType === RESPONSE_TYPES.INPUT && response) {
            setResponse({
                ...(!isEmpty(storeParams) ? { setStoreParams: storeParams } : {}),
                setState: {
                    ...response.setState,
                    ttl: ttl,
                },
                campaignConfigurationId: campaignConfigurationId,
                campaignConfigurationName: campaignConfigurationName,
            });
        }
        if (responseType === RESPONSE_TYPES.FLOW && response) {
            setResponse({
                ...(!isEmpty(storeParams) ? { setStoreParams: storeParams } : {}),
                setFlow: {
                    ...response.setFlow,
                },
                campaignConfigurationId: campaignConfigurationId,
                campaignConfigurationName: campaignConfigurationName,
            });
        }
        if (responseType === RESPONSE_TYPES.BUTTONS) {
            setShowButtons(
                arrayButton.map((button) => {
                    const flow = flows.find((flow) => flow.id === parseInt(button.flowId));
                    return { ...button, flowName: flow.title };
                })
            );
            setResponse({ ...(!isEmpty(storeParams) ? { setStoreParams: storeParams } : {}), arrayButton });
        }
        if (!isEmpty(storeParams) && isEmpty(responseType)) {
            setResponse({
                setStoreParams: storeParams,
                campaignConfigurationId: campaignConfigurationId,
                campaignConfigurationName: campaignConfigurationName,
            });
        }
    };

    const goPrev = () => {
        nextStep(2);
        setResponse([]);
    };

    const generateOption = () => {
        const option = {
            id: uuidv4(),
            flowName: "",
            index: options.length + 1,
            type: "flow",
            flowId: "",
            title: "",
        };
        setOptions([...options, option]);
    };

    const removeOption = (id) => {
        setOptions((options) => options.filter((option) => option.id !== id));
    };

    const updateOption = (id, optTemp) => {
        setOptions((options) => {
            return options.map((option) => {
                if (option.id === id) {
                    return {
                        ...option,
                        ...optTemp,
                    };
                }
                return option;
            });
        });
    };

    const generateStoreParams = () => {
        const storeParam = {
            id: uuidv4(),
            nameField: "",
            index: storeParams.length + 1,
            field: "",
            fieldNumber: 0,
        };
        setStoreParams([...storeParams, storeParam]);
    };

    const removeStoreParams = (id) => {
        setStoreParams((params) => params.filter((param) => param.id !== id));
    };

    const updateStoreParams = (id, optTemp) => {
        setStoreParams((storeParams) => {
            return storeParams.map((storeParam) => {
                if (storeParam.id === id) {
                    return {
                        ...storeParam,
                        ...optTemp,
                    };
                }
                return storeParam;
            });
        });
    };

    const setFirstResponse = (flows) => {
        const firstFlow = first(flows);
        setResponse({
            setFlow: {
                id: firstFlow.id,
            },
        });
    };

    const setOptionResponse = (options, params) => {
        setResponse({
            setState: {
                ttl: ttl,
                type: "options",
                options: options,
            },
            ...(!isEmpty(params) ? { setStoreParams: params } : {}),
        });
    };

    const parseOption = () => {
        const tmp = JSON.parse(JSON.stringify(options));
        if (tmp) {
            var results = [];
            for (var i = 0, len = tmp.length; i < len; i++) {
                delete tmp[i].id;
                delete tmp[i].flowName;
                results.push(tmp[i]);
            }
            return results;
        } else {
            return [];
        }
    };

    const parseStore = () => {
        setShowParams(storeParams.filter((param) => param.fieldNumber !== 0));
        const tmp = JSON.parse(JSON.stringify(storeParams));
        var obj = {};
        if (tmp) {
            tmp.forEach((temp) => {
                if (temp.fieldNumber !== 0) {
                    const name = temp.nameField;
                    const field = temp.field;
                    temp[name] = field;
                    obj[name] = `{` + field + `}`;
                }
            });

            return obj;
        } else {
            return [];
        }
    };

    const convertDuration = (ttl) => {
        setTtl(ttl);
        const res1 = ttl % 86400;
        const res2 = ttl % 3600;
        const res3 = ttl % 60;
        if (res1 === 0 && ttl / 86400 !== 1) {
            const number = ttl / 86400;
            setTtlValue({ number: number, unit: "Dias" });
        } else if (res2 === 0) {
            const number = ttl / 3600;
            setTtlValue({ number: number, unit: "Horas" });
        } else if (res3 === 0) {
            const number = ttl / 60;
            setTtlValue({ number: number, unit: "Minutos" });
        }
    };

    const convertTtl = (tmpTtl) => {
        let total = 0;
        switch (tmpTtl.unit) {
            case "Dias":
                total = tmpTtl.number * 86400;
                break;
            case "Minutos":
                total = tmpTtl.number * 60;
                break;
            case "Horas":
                total = tmpTtl.number * 3600;
                break;
            default:
                break;
        }
        setTtl(total);
    };

    const handleDuration = ({ target }) => {
        const { value, name } = target;
        const tmpTtl = {
            ...ttlValue,
        };
        if (name === "duration") {
            tmpTtl.unit = value;
        }

        if (name === "number") {
            tmpTtl.number = value;
        }
        setTtlValue(tmpTtl);
        convertTtl(tmpTtl);
    };

    const handleConfigurationName = ({ target }) => {
        const { value } = target;
        setConfigName(value);
    };

    const setFlowResponse = (flow) => {
        setResponse({
            setFlow: {
                id: flow.id,
            },
        });
    };

    const addConfiguration = () => {
        setConfigName("");
        setConfiguration(null);
        setResponseType(null);
        setResponse([]);
        setStoreParams([]);
        setSelectedConfiguration(true);
        setToUpdate(false);
        setFlow("");
        setOptions([]);
        setTtlValue({ number: 24, unit: "Horas" });
    };

    const validateNameConfig = () => {
        if (!toUpdate) {
            const equalName = configurations.find((config) => config.name === configName);
            if (equalName) {
                setRepeatedName(true);
                return false;
            }
            setRepeatedName(false);
            return true;
        }
        return true;
    };

    const statesForBackStep = ({ settingConfig, configuration, name }) => {
        setConfiguration(settingConfig);
        setResponse(configuration);
        setConfigName(name);
        showConfigurations(configuration);
        setSelectedConfiguration(true);
        setToUpdate(true);
        setCampaignConfigurationName(name);
        setCampaignConfigurationId(get(settingConfig, "id", ""));
    };
    useEffect(() => {
        if (!isEmpty(flow)) {
            setFlowBack(flow);
        }
    }, [flow]);
    useEffect(() => {
        if (!isEmpty(flows)) {
            setFlowsBack(flows);
        }
    }, [flows]);

    useEffect(() => {
        const isBtnResponse = ACTION_QUICKREPLY;
        if (isBtnResponse) setSelectedConfiguration(true);
        !isEmpty(response) && isEmpty(arrayButton) && isBtnResponse && setArrayButton(response);
    }, [response, arrayButton]);

    //? back step 4
    useEffect(() => {
        const configuration = get(settingConfig, "configuration");
        const flagFlow = responseType === RESPONSE_TYPES.FLOW;
        const flagOpc = responseType === RESPONSE_TYPES.OPTIONS;
        const flagButtons = responseType === RESPONSE_TYPES.BUTTONS;
        const flagInputs = responseType === RESPONSE_TYPES.INPUT;
        const flagOpcInputs = flagOpc || flagInputs;

        const name = get(settingConfig, "name", "");
        if (!!stepBack4 && !onSelectStep4 && !flagSwitchPick) {
            if (!!flagFlow && !flagFlowPicker) {
                statesForBackStep({ configuration, name, settingConfig });
            }
            if (!!flagButtons || !!flagInputs) {
                statesForBackStep({ configuration, name, settingConfig });
            }
            if (!!flagOpc || !!flagOpcInputs) {
                statesForBackStep({ configuration, name, settingConfig });
                setFlows(flowsBack);
            }
        }
    }, [steps, onSelectStep4, settingConfig, flowBack, responseType, stepBack4, flow, flowsBack]);

    useEffect(() => {
        let notFlowSelected = false;
        if (!isEmpty(arrayButton) && Array.isArray(arrayButton)) {
            arrayButton?.forEach((btn) => {
                const emptyFlow = get(btn, "flowId");
                if (emptyFlow === "-1" || (emptyFlow === "" && ACTION_QUICKREPLY && responseType === RESPONSE_TYPES.BUTTONS)) {
                    notFlowSelected = true;
                    // setEnableNext(false);
                }
            });
        }

        if (notFlowSelected) setEnableNext(false);
        else setEnableNext(true);
    }, [arrayButton]);

    useEffect(() => {
        let optionNotCompleted = false;
        options.forEach((opt) => {
            const optionTitle = get(opt, "title", "");
            const optionFlow = get(opt, "flowId", "");
            if ((isEmpty(optionTitle) && responseType === RESPONSE_TYPES.OPTIONS && options) || (isEmpty(`${optionFlow ? optionFlow : ""}`) && responseType === RESPONSE_TYPES.OPTIONS && options)) {
                optionNotCompleted = true;
            }
        });
        if (optionNotCompleted) setEnableNext(false);
        else setEnableNext(true);
    }, [options]);

    return (
        <div className="relative w-full pl-16">
            <SettingsHeader
                configuration={configuration}
                configurations={configurations}
                handleConfigurations={handleConfigurations}
                selectedConfiguration={selectedConfiguration}
                addConfiguration={addConfiguration}
            />
            {selectedConfiguration && (
                <>
                    <div className="my-8">
                        <p className="mb-4 text-xl font-bold text-gray-400">{t("CampaignSettings.configurationName")}</p>
                        <div className="flex flex-row">
                            <input className="input relative max-w-sm" value={configName} autoFocus={true} placeholder={t("CampaignSettings.nameConfiguration")} onChange={handleConfigurationName} />
                            {repeatedName && <p className="font-base absolute ml-2 mt-12 text-sm text-red-400">{t("CampaignSettings.repeatedConfiguration")}</p>}
                            {toUpdate && (
                                <button
                                    className="hover:text-red-grad-500 z-0 my-1 -ml-10 flex items-center justify-center rounded-full bg-white text-gray-400 text-opacity-75 shadow-sm"
                                    onClick={() => setOpenDelete(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="mb-2 text-xl font-bold text-gray-400">{t("CampaignSettings.respond")}</p>

                    <ResponseTypePicker
                        setResponseType={setResponseType}
                        responseType={responseType}
                        setResponse={setResponse}
                        ACTION_QUICKREPLY={ACTION_QUICKREPLY}
                        setFlagSwitchPick={setFlagSwitchPick}
                    />

                    {responseType && (responseType === RESPONSE_TYPES.FLOW || responseType === RESPONSE_TYPES.INPUT) && (
                        <FlowPicker
                            steps={steps}
                            setSteps={setSteps}
                            currentBot={currentBot.id}
                            responses={responseType}
                            flow={flow}
                            setFlow={setFlow}
                            flows={flows}
                            response={response}
                            setResponse={setResponse}
                            getFlows={getFlows}
                            firstFlow={firstFlow}
                            setFirstResponse={setFirstResponse}
                            handleDuration={handleDuration}
                            ttl={ttl}
                            handleOptionConfig={handleOptionConfig}
                            getTitle={getTitle}
                            ttlValue={ttlValue}
                            setFlowResponse={setFlowResponse}
                            setFlagFlowPicker={setFlagFlowPicker}
                        />
                    )}

                    {responseType && responseType === RESPONSE_TYPES.OPTIONS && (
                        <OptionsPicker
                            setFlowId={setFlowId}
                            currentBot={currentBot.id}
                            updateOption={updateOption}
                            flows={flows}
                            flowId={flowId}
                            generateOption={generateOption}
                            removeOption={removeOption}
                            options={options}
                            setOptions={setOptions}
                            response={response}
                            setResponse={setResponse}
                            name={name}
                            setName={setName}
                            flow={flow}
                            setFlow={setFlow}
                            handleOptionConfig={handleOptionConfig}
                            handleDuration={handleDuration}
                            ttlValue={ttlValue}
                        />
                    )}

                    {ACTION_QUICKREPLY && responseType === RESPONSE_TYPES.BUTTONS && (
                        <ButtonsPicker buttonsObj={selectedHsm.buttons} flows={flows} flowId={flowId} setArrayButton={setArrayButton} arrayButton={arrayButton} />
                    )}

                    <p className="mb-2 mt-5 text-xl font-bold text-gray-400">{t("CampaignSettings.addtionalParams")}:</p>
                    <AditionalParams
                        arrayParams={arrayColumn}
                        storeParams={storeParams}
                        generateStoreParams={generateStoreParams}
                        updateStoreParams={updateStoreParams}
                        removeStoreParams={removeStoreParams}
                    />
                </>
            )}

            <div className="flex w-full justify-end space-x-1">
                <button className="h-12 w-40 rounded-full text-sm font-bold text-gray-450 focus:outline-none focus:ring-4" onClick={goPrev}>
                    {t("buttons.back")}
                </button>
                <button
                    className={`h-12 w-40 rounded-full text-sm font-bold text-white focus:outline-none focus:ring-4 ${
                        enable ? "bg-primary-50 text-primary-200" : "cursor-not-allowed bg-gray-60 text-white"
                    }`}
                    onClick={() => {
                        setOpen(true);
                        updateResponse();
                    }}
                    disabled={!enable}
                >
                    {t("buttons.save")}
                </button>

                <button
                    className={`button-primary h-12 w-40 !rounded-full text-sm text-white focus:outline-none focus:ring-4 ${
                        // true ?
                        "bg-primary-200"
                        // : "cursor-not-allowed bg-gray-60"
                    }`}
                    disabled={!enableNext}
                    onClick={gotNext}
                >
                    {t("buttons.next")}
                </button>
            </div>
            <ConfirmationSetting open={open} setOpen={setOpen} save={save} loading={loading} />
            <DeleteSetting openDelete={openDelete} setOpenDelete={setOpenDelete} removeConfiguration={removeConfiguration} loading={loading} configuration={configuration} />
        </div>
    );
};

export default CampaignSettings;
