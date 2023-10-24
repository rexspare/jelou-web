import get from "lodash/get";
import words from "lodash/words";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import { BarLoader } from "react-spinners";
import { withTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Select from "../react-select/react-select";
import FormModal from "../form-modal/form-modal";
import { JelouApiV1 } from "@apps/shared/modules";
import { addHSM } from "@apps/redux/store";
import { formatMessage, checkIfOperatorIsOnline } from "@apps/shared/utils";

const style = {
    valueContainer: (base) => ({
        ...base,
        paddingLeft: "0.125rem!important",
        paddingRight: 0,
    }),
    singleValue: (base) => ({
        fontSize: "0.8125rem!important",
        fontWeight: "500!important",
        color: "#727C94!important",
    }),
    control: (base, state) => ({
        ...base,
        border: "0 !important",
        boxShadow: "0 !important",
        background: "#F2F7FD",
        color: "#727C94",
    }),
};

const QuickReplyModal = (props) => {
    const { onClose, copyToClipBoard, setShowPreview, setMessage, sendCustomText, statusOperator, setShowDisconnectedModal } = props;
    const dispatch = useDispatch();

    const [params, setParams] = useState([]);
    const [paramsValue, setParamsValue] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hsmError, setHsmError] = useState(false);

    const [templateMessage, setTemplateMessage] = useState("");
    const [templatePreview, setTemplatePreview] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");

    const hsm = useSelector((state) => state.hsm);
    const currentRoom = useSelector((state) => state.currentRoom);
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);
    const canEdit = get(company, "properties.operatorView.canEditTemplates", false);

    useEffect(() => {
        const botId = get(currentRoom, "appId", get(currentRoom, "bot.id", null));

        getHSM(botId);
    }, [currentRoom]);

    /**
     * Will search for every element inside the paramsValue object. Trim the value
     * Returns true if a param got an empty value. returns True if all are filled or there's no one to fill
     */
    const isAParamEmpty = () => {
        const values = Object.keys(paramsValue);
        let valuesFilled = false;
        values.forEach((value) => {
            const val = paramsValue[value].trim();
            if (isEmpty(val)) {
                valuesFilled = true;
            }
        });
        return valuesFilled;
    };

    const PreviewMessage = (props) => {
        const parseTemplate = (template, params) => {
            let tempString = template;
            if (!isEmpty(params)) {
                params.forEach((param) => {
                    tempString = tempString.replace(`{{${param.param}}}`, props.paramValue[param.label] || `{{${param.param}}}`);
                });
                return tempString;
            }
            return template;
        };
        const parseTemplateImages = (template, params, mediaUrl) => {
            let tempString = template;
            if (!isEmpty(params)) {
                params.forEach((param) => {
                    tempString = tempString.replace(`{{${param.param}}}`, props.paramValue[param.label] || `{{${param.param}}}`);
                });
                return { caption: tempString, mediaUrl: mediaUrl };
            }
            return { caption: template, mediaUrl: mediaUrl };
        };

        if (props.mediaUrl) {
            return parseTemplateImages(props.template || "", props.params, props.mediaUrl);
        } else {
            return parseTemplate(props.template || "", props.params);
        }
    };

    const PreviewMessageFormat = (props) => {
        const parseTemplate = (template, params) => {
            let tempString = template;
            if (!isEmpty(params)) {
                params.forEach((param) => {
                    tempString = tempString.replace(`{{${param.param}}}`, props.paramValue[param.label] || `{{${param.param}}}`);
                });
                return tempString;
            }
            return template;
        };
        return formatMessage(parseTemplate(props.template || "", props.params));
    };

    const RenderPreviewMessage = (props) => {
        const parsedTemplate = PreviewMessageFormat(props);
        if (!isEmpty(props.mediaUrl)) {
            return (
                <div className="max-w-lg">
                    <div className="flex flex-col rounded-right-bubble-sm bg-whatsapp-100 px-4 py-2 leading-relaxed text-black shadow-preview">
                        <img className="max-h-md rounded-lg object-contain" src={props.mediaUrl} alt="preview"></img>
                        <div className="mt-1">{parsedTemplate}</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="max-w-lg">
                    <div className="rounded-right-bubble-sm bg-whatsapp-100 px-4 py-2 leading-relaxed text-black shadow-preview">{parsedTemplate}</div>
                </div>
            );
        }
    };

    const handleChange = ({ target }) => {
        const { value, name } = target;
        setParamsValue({ ...paramsValue, [name]: value });
    };
    const parseHsmToOption = (hsmArray) => {
        return hsmArray.map((hsm) => {
            return { value: `${hsm.displayName}`, label: hsm.displayName, template: words(hsm.body) };
        });
    };

    const handleSelect = (obj) => {
        const newHsm = hsm.find((hsm) => {
            return hsm.displayName === obj.value;
        });
        const { params, body: template } = newHsm;
        let newParams = {};

        setTemplateMessage(template);
        setMediaUrl(get(newHsm, "mediaUrl", ""));
        setTemplatePreview(obj);
        setParams(params);

        params.forEach((param) => {
            newParams = { ...newParams, [param.label]: "" };
        });
        setParamsValue(newParams);
    };

    const getHSM = async (botId) => {
        setIsLoading(true);
        const { teams: teamIds } = userSession;
        await JelouApiV1.get(`/companies/${company.id}/macros/templates`, {
            params: {
                ...(!isEmpty(teamIds) ? { teams: teamIds } : {}),
                bots: [botId],
                isVisible: 1,
                shouldPaginate: false,
                joinMacros: true,
            },
        })
            .then((res) => {
                const { data } = res;
                const { data: results } = data;
                let hsmTemp = results;
                if (isEmpty(results)) {
                    dispatch(addHSM(hsmTemp));
                    setIsLoading(true);
                } else {
                    const firstHsm = first(hsmTemp);
                    const { params, body: template } = firstHsm;
                    dispatch(addHSM(hsmTemp));
                    parseHsmToOption(hsmTemp);
                    const value = first(parseHsmToOption(hsmTemp));
                    setTemplateMessage(template);
                    setTemplatePreview(value);
                    setMediaUrl(get(firstHsm, "mediaUrl", ""));
                    setParams(params);
                    params.map((param) => {
                        setParamsValue({ ...paramsValue, [param.label]: "" });
                        return true;
                    });
                }
                setIsLoading(false);
                setHsmError(false);
            })
            .catch((err) => {
                console.log("==== ERROR!", err);
                setHsmError(true);
                setIsLoading(false);
            });
    };

    const handleSubmit = async () => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        const msgPayload = {
            params: params,
            template: templateMessage,
            paramValue: paramsValue,
            setTemplate: (template) => {
                setTemplateMessage(template);
            },
            ...(!isEmpty(mediaUrl) && { mediaUrl: mediaUrl }),
        };

        let message = mediaUrl
            ? {
                  type: "IMAGE",
                  ...PreviewMessage(msgPayload),
              }
            : { type: "TEXT", text: PreviewMessage(msgPayload) };

        sendCustomText(message);
        onClose();
        return;
    };

    const handleEdit = async () => {
        const msgPayload = {
            params: params,
            template: templateMessage,
            paramValue: paramsValue,
            ...(!isEmpty(mediaUrl) && { mediaUrl: mediaUrl }),
        };

        let message = mediaUrl
            ? {
                  type: "IMAGE",
                  ...PreviewMessage(msgPayload),
              }
            : { type: "TEXT", text: PreviewMessage(msgPayload) };

        setMessage(message);

        if (mediaUrl) {
            setShowPreview(true);
        } else {
            copyToClipBoard(message.text);
        }
        onClose();
    };

    const hasParams = isAParamEmpty();
    const { t } = props;

    return (
        <FormModal title={t("pma.Mensajes Rápidos")} onClose={onClose} canOverflow={true}>
            <div className="flex flex-col">
                <div className="flex w-full flex-col md:flex-row">
                    <div className="mr-0 flex flex-col md:mr-12">
                        <div className="mb-8 flex flex-col sm:mb-12 mid:w-325">
                            <label className="block pb-2 font-bold text-gray-400 md:pb-6">{t("pma.Elige la plantilla")}</label>
                            {isLoading ? (
                                <div className="flex h-12 w-full flex-row items-center justify-center border-b-default border-gray-35">
                                    <BarLoader size={"1.875rem"} color="#00b3c7" />
                                </div>
                            ) : !isEmpty(hsm) ? (
                                <>
                                    <label className="pb-2 text-sm font-bold text-gray-400 md:mt-1 md:pb-6">{t("pma.Plantilla")}</label>
                                    <Select
                                        style={style}
                                        className="h-8 w-full"
                                        onChange={handleSelect}
                                        options={parseHsmToOption(hsm)}
                                        value={templatePreview}
                                        placeholder={t("pma.Seleccionar mensaje rápido")}
                                    />
                                </>
                            ) : hsmError ? (
                                <div className="flex flex-row items-center border-b-default border-gray-35">
                                    <div className="flex h-12 w-full items-center truncate py-2 text-15 font-normal text-gray-400 ">{t("pma.No se encontró mensaje rápido")}</div>
                                </div>
                            ) : (
                                <div className="flex flex-row items-center border-b-default border-gray-35">
                                    <div className="flex h-12 w-full items-center truncate py-2 text-15 font-normal text-gray-400">{t("pma.No se encontró mensaje rápido")}</div>
                                </div>
                            )}
                        </div>
                        <div className={`mb-8 w-full sm:mb-0 md:w-auto ${isEmpty(params) && !isEmpty(hsm) && "hidden"}`}>
                            <div className={`flex flex-col`}>
                                <div className={`flex flex-col sm:flex-row sm:space-x-3`}>
                                    {!isEmpty(params) && !isEmpty(hsm) ? (
                                        <div className="">
                                            <label className="mb-1 block text-sm font-bold text-gray-400 md:mb-8 md:mt-1">{t("pma.Parámetros")}</label>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div className="flex w-full flex-col space-y-2">
                                        {!isEmpty(params) &&
                                            !isEmpty(hsm) &&
                                            params.map((param, index) => {
                                                return (
                                                    <div className="flex flex-col" key={index}>
                                                        <input
                                                            type="text"
                                                            placeholder={`${t("pma.Escribe")} ${param.label} {{${param.param}}}`}
                                                            value={get(paramsValue, `${param.label}`, "")}
                                                            name={param.label}
                                                            onChange={handleChange}
                                                            className="h-8 w-full rounded-lg border-transparent bg-gray-10 px-3 text-13 font-medium text-gray-400 focus:border-primary-200 focus:ring-primary-200"
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {!isEmpty(hsm) && (
                            <div className="order-1 mt-2 space-y-2">
                                <label className="mb-1 block font-bold text-gray-400 md:mb-6">{t("pma.Vista Previa")}</label>
                                <div className="img-whatsapp rounded-7.5 bg-opacity-50 px-4 py-8 text-sm md:w-325">
                                    <RenderPreviewMessage
                                        params={params}
                                        template={templateMessage}
                                        paramValue={paramsValue}
                                        mediaUrl={mediaUrl}
                                        setTemplate={(template) => {
                                            setTemplateMessage(template);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-modal-footer mt-0 flex w-full flex-col items-center justify-center rounded-b-lg pt-4 sm:flex-row md:justify-end md:pt-8">
                    <button className="btn-inactive-outline order-3 mt-1 w-40 focus:outline-none sm:mr-4 sm:mt-0 sm:w-32 md:order-1" onClick={onClose}>
                        {t("pma.Cancelar")}
                    </button>
                    {canEdit && (
                        <button
                            onClick={handleEdit}
                            disabled={!(!hsmError && !hasParams && !isEmpty(hsm))}
                            className={`btn-primary-inverted order-2 mt-1 w-40 font-bold focus:outline-none sm:mr-4 sm:mt-0 sm:w-32 md:order-2`}
                        >
                            {t("pma.Editar")}
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={!(!hsmError && !hasParams && !isEmpty(hsm))}
                        className={`btn-primary order-1 mt-1 w-40 font-bold focus:outline-none sm:mt-0 sm:w-32 md:order-3`}
                    >
                        {t("pma.Enviar")}
                    </button>
                </div>
            </div>
        </FormModal>
    );
};
export default withTranslation()(QuickReplyModal);
