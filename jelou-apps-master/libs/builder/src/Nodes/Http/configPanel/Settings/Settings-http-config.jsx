/** @typedef {import('reactflow').Node<HttpNodeData>} Node */

import { debounce, get } from "lodash";
import { useReactFlow } from "reactflow";

import { CheckboxInput, InputSelector, NumberInput } from "@builder/common/inputs";
import { useCustomsNodes } from "@builder/hook/customNodes.hook";
import {
    HTTP_SETTINGS_NAMES,
    HTTP_SETTINGS_PROXY_OPTIONS_NAMES,
    HTTP_SETTINGS_RETRY_OPTIONS_NAMES,
    PROXY_OPTIONS,
    RETRY_CONDITION_OPTIONS,
    RETRY_DELAY_OPTIONS,
} from "@builder/modules/Nodes/Http/constants.http";

export const SettingsHttpConfig = ({ nodeId }) => {
    const { updateLocalNode } = useCustomsNodes();

    const { getNode } = useReactFlow();
    const currentNode = getNode(nodeId);

    const { timeout, sslCertificate, retryOptions = {}, proxyOptions = {} } = get(currentNode, "data.configuration.settings");
    const { enabled: enabledRetry = false, retries = 0, retryCondition = "", shouldResetTimeout = false, retryDelay = "", milliseconds = 0 } = retryOptions;
    const { enabled: enabledProxy = false, proxyOptions: proxyDefault = "" } = proxyOptions;

    const getReturnName = ({ name, value, checked }) => {
        switch (name) {
            case HTTP_SETTINGS_NAMES.SSL:
            case HTTP_SETTINGS_RETRY_OPTIONS_NAMES.ENABLE_RETRIES:
            case HTTP_SETTINGS_RETRY_OPTIONS_NAMES.SHOULD_RESET_TIMEOUT:
            case HTTP_SETTINGS_PROXY_OPTIONS_NAMES.ENABLE_PROXY:
                return Boolean(checked);
            case HTTP_SETTINGS_NAMES.TIMEOUT:
            case HTTP_SETTINGS_RETRY_OPTIONS_NAMES.RETRIES:
            case HTTP_SETTINGS_RETRY_OPTIONS_NAMES.TIME_BETWEEN_RQ:
                return Number(value);
            default:
                return Number(value);
        }
    };

    const handleChangeSelector = (optionSelected, name) => {
        const currentNode = getNode(nodeId);
        const configuration = currentNode.data.configuration;

        const value = optionSelected.value;
        const label = optionSelected.label;
        let newConfiguration = {};
        switch (name) {
            case HTTP_SETTINGS_PROXY_OPTIONS_NAMES.PROXY_OPTIONS:
                newConfiguration = {
                    ...configuration,
                    settings: {
                        ...configuration.settings,
                        proxyOptions: {
                            ...configuration.settings?.proxyOptions,
                            ...value,
                            [name]: label,
                        },
                    },
                };
                break;

            default:
                newConfiguration = {
                    ...configuration,
                    settings: {
                        ...configuration.settings,
                        retryOptions: {
                            ...configuration.settings?.retryOptions,
                            [name]: value,
                        },
                    },
                };
                break;
        }

        updateLocalNode(currentNode.id, { configuration: newConfiguration });
    };

    /** @type { import('lodash').DebouncedFunc<(e: React.ChangeEvent<HTMLInputElement>) => void> } */
    const handleChange = debounce((e, isProxy = false) => {
        const { name, checked, value } = e.target;

        const currentNode = getNode(nodeId);
        const configuration = currentNode.data.configuration;
        let newConfiguration = {};

        const isRetryOption = Object.values(HTTP_SETTINGS_RETRY_OPTIONS_NAMES).includes(name);
        const returnName = getReturnName({ name, value, checked });

        if (isProxy) {
            newConfiguration = {
                ...configuration,
                settings: {
                    ...configuration.settings,
                    proxyOptions: {
                        ...configuration.settings?.proxyOptions,
                        [name]: returnName,
                    },
                },
            };
        } else if (isRetryOption) {
            newConfiguration = {
                ...configuration,
                settings: {
                    ...configuration.settings,
                    retryOptions: {
                        ...configuration.settings?.retryOptions,
                        [name]: returnName,
                    },
                },
            };
        } else {
            newConfiguration = {
                ...configuration,
                settings: {
                    ...configuration.settings,
                    [name]: returnName,
                },
            };
        }

        updateLocalNode(currentNode.id, { configuration: newConfiguration });
    }, 500);

    return (
        <div className="h-[30vh] overflow-y-auto lg:h-[50vh] xxl:h-[50vh] 3xl:h-[60vh]">
            {/* SSL CERTIFICATE */}
            <div className="grid gap-3 p-6">
                <label className="flex items-center gap-3">
                    <CheckboxInput name={HTTP_SETTINGS_NAMES.SSL} defaultChecked={sslCertificate} onChange={handleChange} />
                    <span className="block select-none font-medium">Activar certificado SSL</span>
                </label>
                <label>
                    <span className="mb-1 block font-medium">
                        Timeout <small>(ms)</small>
                    </span>
                    <NumberInput hasError="" placeholder="3000" label="" name={HTTP_SETTINGS_NAMES.TIMEOUT} defaultValue={String(timeout)} onChange={handleChange} />
                </label>
            </div>
            {/* RETRY OPTIONS */}
            <div className="grid gap-3 p-6">
                <label className="flex items-center gap-3">
                    <CheckboxInput name={HTTP_SETTINGS_RETRY_OPTIONS_NAMES.ENABLE_RETRIES} defaultChecked={enabledRetry} onChange={handleChange} />
                    <span className="block select-none font-medium">Activar reintentos</span>
                </label>
                <label>
                    <span className="mb-1 block font-medium">Reintentos</span>
                    <NumberInput
                        hasError=""
                        placeholder="Ingrese el número de reintentos"
                        label=""
                        name={HTTP_SETTINGS_RETRY_OPTIONS_NAMES.RETRIES}
                        defaultValue={String(retries)}
                        onChange={handleChange}
                    />
                </label>
                <label className="mb-3 grid w-full grid-cols-[11rem_auto] items-end gap-3">
                    <span className="select-none self-center font-medium">Condición de reintento</span>
                    <InputSelector
                        hasError=""
                        defaultValue={retryCondition}
                        name={HTTP_SETTINGS_RETRY_OPTIONS_NAMES.RETRY_CONDITION}
                        options={RETRY_CONDITION_OPTIONS}
                        placeholder="Selecciona una condición"
                        onChange={(e) => handleChangeSelector(e, HTTP_SETTINGS_RETRY_OPTIONS_NAMES.RETRY_CONDITION)}
                    />
                </label>
            </div>
            {/* RETRY OPTIONS */}
            <div className="grid gap-3 p-6 py-3">
                <label className="flex items-center gap-3">
                    <CheckboxInput name={HTTP_SETTINGS_RETRY_OPTIONS_NAMES.SHOULD_RESET_TIMEOUT} defaultChecked={shouldResetTimeout} onChange={handleChange} />
                    <span className="block select-none font-medium">Restablecer tiempo de espera</span>
                </label>
                <label className="mb-3 grid w-full grid-cols-[9rem_auto] items-end gap-3">
                    <span className="select-none self-center font-medium">Reintenar retraso</span>
                    <InputSelector
                        hasError=""
                        defaultValue={retryDelay}
                        name={HTTP_SETTINGS_RETRY_OPTIONS_NAMES.RETRY_DELAY}
                        options={RETRY_DELAY_OPTIONS}
                        placeholder="Selecciona un delay"
                        onChange={(e) => handleChangeSelector(e, HTTP_SETTINGS_RETRY_OPTIONS_NAMES.RETRY_DELAY)}
                    />
                </label>
                <label>
                    <span className="mb-1 block font-medium">
                        Tiempo entre solicitudes <small>(ms)</small>
                    </span>
                    <NumberInput
                        hasError=""
                        placeholder="3000"
                        label=""
                        disabled={retryDelay !== "custom_delay"}
                        name={HTTP_SETTINGS_RETRY_OPTIONS_NAMES.TIME_BETWEEN_RQ}
                        defaultValue={String(milliseconds)}
                        onChange={handleChange}
                    />
                </label>
            </div>
            {/* PROXY OPTIONS */}
            <div className="grid w-full grid-cols-[9rem_auto] items-end gap-3 p-6">
                <label className="flex items-center gap-3 self-center">
                    <CheckboxInput name={HTTP_SETTINGS_PROXY_OPTIONS_NAMES.ENABLE_PROXY} defaultChecked={enabledProxy} onChange={(e) => handleChange(e, true)} />
                    <span className="block select-none font-medium">Activar Proxy</span>
                </label>
                <InputSelector
                    hasError=""
                    defaultValue={proxyDefault}
                    name={HTTP_SETTINGS_PROXY_OPTIONS_NAMES.PROXY_OPTIONS}
                    options={PROXY_OPTIONS}
                    placeholder="Selecciona un proxy"
                    onChange={(e) => handleChangeSelector(e, HTTP_SETTINGS_PROXY_OPTIONS_NAMES.PROXY_OPTIONS)}
                />
            </div>
        </div>
    );
};
