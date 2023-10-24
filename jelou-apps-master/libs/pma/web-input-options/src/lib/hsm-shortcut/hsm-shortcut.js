import Fuse from "fuse.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { addHSM } from "@apps/redux/store";
import { SearchIcon } from "@apps/shared/icons";
import { JelouApiV1 } from "@apps/shared/modules";
import { formatMessage } from "@apps/shared/utils";
import { ClipLoader } from "react-spinners";

import { useOnClickOutside } from "@apps/shared/hooks";

const HsmShortCut = (props) => {
    const dispatch = useDispatch();
    const { copyToClipBoard, onClose, company, setDocumentList, setIsShortCutToShowPreview } = props;
    const [params, setParams] = useState([]);
    const [paramsValue, setParamsValue] = useState({});
    const [mediaUrl, setMediaUrl] = useState("");
    const [templateMessage, setTemplateMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const hsm = useSelector((state) => state.hsm);
    const currentRoom = useSelector((state) => state.currentRoom);
    const userSession = useSelector((state) => state.userSession);

    const inputStyle = "input input-tag h-8";

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const shortcutRef = useRef();

    useOnClickOutside(shortcutRef, onClose);

    const callbackRef = useCallback((inputElement) => {
        if (inputElement) {
            setTimeout(function () {
                inputElement.focus();
            }, 100);
        }
    }, []);

    useEffect(() => {
        const botId = get(currentRoom, "appId", get(currentRoom, "bot.id", null));
        getQuickReplies(botId);
    }, [currentRoom]);

    useEffect(() => {
        if (isEmpty(searchTerm) && isEmpty(searchResults) && !isEmpty(hsmArray)) {
            setSearchResults(hsmArray);
        }
    }, [hsm, searchTerm]);

    const PreviewMessage = (props) => {
        const parseTemplate = (template, params) => {
            let tempString = template;
            if (!isEmpty(params)) {
                params.forEach((param) => {
                    tempString = tempString.replace(`{{${param.param}}}`, `{{${param.label}}} `);
                });
                return tempString;
            }
            return template;
        };
        const parseTemplateImages = (template, params, mediaUrl) => {
            let tempString = template;
            if (!isEmpty(params)) {
                params.forEach((param) => {
                    tempString = tempString.replace(`{{${param.param}}}`, `{{${param.param}}}`);
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
        return formatMessage(parseTemplate(props.template || "", props.params), "break-words max-w-full text-10 whitespace-pre-wrap px-2");
    };

    const RenderPreviewMessage = (props) => {
        const parsedTemplate = PreviewMessageFormat(props);
        if (!isEmpty(props.mediaUrl)) {
            return (
                <div className="z-50 max-w-lg">
                    <div className="flex flex-col rounded-right-bubble-sm bg-whatsapp-100 px-4 py-2 leading-relaxed text-black shadow-preview">
                        <img className="max-h-24 rounded-lg object-contain" src={props.mediaUrl} alt="preview"></img>
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

    const [isHovering, setIsHovering] = useState(false);

    const handleHoverEnter = (event) => {
        setIsHovering(true);
        let newHsm = event.target.dataset?.info;
        if (newHsm) {
            newHsm = JSON.parse(newHsm);
            setParams(newHsm.params);
            setTemplateMessage(newHsm.body);
            setParamsValue(newHsm.paramsValue);
            setMediaUrl(newHsm.mediaUrl);
        } else {
            setParams([]);
            setTemplateMessage("");
            setParamsValue({});
            setMediaUrl("");
        }
    };

    const handleHoverOut = () => {
        setIsHovering(false);
    };

    const parseHsmToOption = (hsmArray) => {
        return hsmArray.map((hsm) => {
            return {
                label: hsm.displayName,
                body: hsm.body,
                id: hsm.id,
                params: hsm.params,
                mediaUrl: hsm.mediaUrl,
                paramsValue: setParamsValueArray(hsm),
            };
        });
    };

    const setParamsValueArray = (hsm) => {
        let newParams = {};
        const { params } = hsm;
        if (!isEmpty(params)) {
            params.forEach((param) => {
                newParams = { ...newParams, [param.label]: "" };
            });
        }
        return newParams;
    };

    const getQuickReplies = async (botId) => {
        setIsLoading(true);
        const { teams } = userSession;
        await JelouApiV1.get(`/companies/${company.id}/macros/templates`, {
            params: {
                ...(!isEmpty(teams) ? { teams } : {}),
                bots: [botId],
                isVisible: 1,
                shouldPaginate: false,
                joinMacros: true,
            },
        })
            .then((res) => {
                const { data } = res;
                const { data: results = [] } = data;
                dispatch(addHSM(results));
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("==== ERROR!", err);
                setIsLoading(false);
            });
    };

    const hsmArray = parseHsmToOption(hsm);

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            onClose();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    // Search the name of the hsm and filter the list of hsm
    const searchHsm = ({ target }) => {
        let { value } = target;
        value = value === "/" ? "" : value;
        setSearchTerm(value);

        const fuseOptions = {
            keys: ["label"],
            threshold: 0.0,
        };

        const fuse = new Fuse(hsmArray, fuseOptions);
        const result = fuse.search(value);
        let hsmResults = [];

        result.map((hsm) => {
            return hsmResults.push(hsm.item);
        });
        setSearchResults(hsmResults);
    };

    const handleEdit = async (template) => {
        if (isEmpty(template)) return;
        const results = hsm.find((hs) => hs.id === template.id);

        const msgPayload = {
            params: results?.params || [],
            template: results?.body,
            ...(!isEmpty(results.mediaUrl) && { mediaUrl: results.mediaUrl }),
        };

        let message = results.mediaUrl
            ? {
                  type: "IMAGE",
                  ...PreviewMessage(msgPayload),
              }
            : { type: "TEXT", text: PreviewMessage(msgPayload) };

        if (results.mediaUrl) {
            setIsShortCutToShowPreview(true);
            const newDoc = { mediaUrl: results.mediaUrl, type: "image/png", link: results.mediaUrl, name: results.displayName };
            setDocumentList((preState) => [...preState, newDoc]);
            copyToClipBoard(message.caption);
        } else {
            copyToClipBoard(message.text);
        }
        onClose();
    };

    return (
        <div className="z-50 overflow-auto rounded-12 bg-white" ref={shortcutRef}>
            <div>
                <div className="flex flex-col">
                    <div className="flex max-h-xxsm flex-col overflow-y-auto py-2">
                        <div className="px-4 py-2 text-xs text-primary-200">{t("pma.Mensajes Rápidos")}</div>
                        {isLoading ? (
                            <div className="flex justify-center px-4 py-2 text-13 text-gray-400">
                                <ClipLoader size={"2rem"} color="#00B3C7" />
                            </div>
                        ) : isEmpty(searchResults) ? (
                            <div className="flex px-4 py-2 text-13 text-gray-400">{t("pma.No cuenta con mensajes rápidos")}</div>
                        ) : (
                            searchResults.map((template) => {
                                return (
                                    <div
                                        className="space-x-between flex cursor-pointer flex-row justify-items-start px-4 py-2 text-13 text-gray-400 hover:bg-primary-200 hover:bg-opacity-10"
                                        key={template.id}
                                        onClick={() => handleEdit(template)}
                                        ref={callbackRef}
                                        id={template.id}
                                        data-info={JSON.stringify(template)}
                                        onMouseEnter={handleHoverEnter}
                                        onMouseLeave={handleHoverOut}
                                    >
                                        <span className="pl-1">{template.label}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    {isHovering && (
                        <div className="img-whatsapp absolute left-0 top-0 ml-73 mt-20 w-64 rounded-7.5 bg-white p-4 text-sm">
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
                    )}
                </div>
                <div className="border-tp flex border-gray-100 p-4">
                    <div className="relative w-full">
                        <div className="absolute bottom-0 left-0 top-0 ml-4 flex items-center">
                            <SearchIcon className="fill-current" width="15" height="15" />
                        </div>
                        <div className="z-10">
                            <input autoFocus id="search" type="search" className={inputStyle} placeholder={t("pma.Buscar en mensajes rápidos")} value={searchTerm} onChange={searchHsm} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HsmShortCut;
