/* eslint-disable no-extend-native */
import dayjs from "dayjs";
import get from "lodash/get";
import * as XLSX from "xlsx";
import first from "lodash/first";
import ReactDOM from "react-dom";
import orderBy from "lodash/orderBy";
import toLower from "lodash/toLower";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";
import { toast } from "react-toastify";
import lowerCase from "lodash/lowerCase";
import "react-phone-number-input/style.css";
import { useState, useEffect } from "react";
import { FileDrop } from "react-file-drop";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-number-input";
import AutoSizer from "react-virtualized-auto-sizer";
import { BarLoader, BeatLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { Document as DocumentPdf, Page, pdfjs } from "react-pdf";

import { BROADCAST_TYPES } from "@apps/shared/constants";
import { JelouApiV1, JelouApiPma } from "@apps/shared/modules";
import { addHSM, setShowDisconnectedModal } from "@apps/redux/store";
import { AlertIcon, CloseIcon1, JelouLogoIcon } from "@apps/shared/icons";
import { checkIfOperatorIsOnline, formatMessage } from "@apps/shared/utils";

import HsmTab from "./hsm-tab";
import FileInput from "./file-input";
import ParamsInput from "./params-input";
import SelectMobile from "../select-mobile/select-mobile";
import SelectSearch from "../select-search/select-search";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
            return { text: tempString, mediaUrl: mediaUrl };
        }
        return { text: template, mediaUrl: mediaUrl };
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
    return formatMessage(parseTemplate(props.template || "", props.params), "break-words max-w-full text-base whitespace-pre-wrap px-2");
};

const RenderPreviewMessage = (props) => {
    const parsedTemplate = PreviewMessageFormat({ ...props, mediaUrl: props.mediaUrl.value });
    const [numPages, setNumPages] = useState(null);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    if (!isEmpty(props.mediaUrl.value) && props.mediaUrl.type === "IMAGE") {
        return (
            <div className="max-w-lg">
                <div className="flex min-h-[16rem] flex-col rounded-right-bubble-sm bg-whatsapp-100 pb-2 leading-relaxed text-gray-400 shadow-preview">
                    {props.loading ? (
                        <div className=" flex min-h-[8rem] items-center justify-center">
                            <BeatLoader size={10} color={"#00B3C7"} loading={props.loading} css="margin: 0 auto;" />
                        </div>
                    ) : (
                        <img className="h-40 w-full rounded-lg object-cover p-0.25" src={props.mediaUrl.value} alt="preview"></img>
                    )}
                    <div className="mt-1">{parsedTemplate}</div>
                </div>
            </div>
        );
    } else if (!isEmpty(props.mediaUrl.value) && props.mediaUrl.type === "DOCUMENT") {
        return (
            <div className="max-w-lg">
                <div className="flex flex-col rounded-right-bubble-sm bg-whatsapp-100 pb-2 leading-relaxed text-gray-400 shadow-preview">
                    <div className="max-h-40 w-full overflow-auto rounded-lg object-cover p-0.25" alt="preview document">
                        <AutoSizer disableHeight>
                            {({ width }) => (
                                <DocumentPdf file={props.mediaUrl.value} onLoadSuccess={onDocumentLoadSuccess}>
                                    {[...Array(numPages).keys()].map((i) => (
                                        <Page key={i} pageNumber={i + 1} width={width} />
                                    ))}
                                </DocumentPdf>
                            )}
                        </AutoSizer>
                    </div>

                    <div className="mt-1">{parsedTemplate}</div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="max-w-lg">
                <div className="rounded-right-bubble-sm bg-whatsapp-100 px-4 py-2 leading-relaxed text-gray-400 shadow-preview">{parsedTemplate}</div>
            </div>
        );
    }
};

const HsmModal = (props) => {
    const { sendCustomText, setShowModal } = props;
    const { t } = useTranslation();
    const currentRoom = useSelector((state) => state.currentRoom);
    const userSession = useSelector((state) => state.userSession);
    const statusOperator = useSelector((state) => state.statusOperator);
    const company = useSelector((state) => state.company);
    const rooms = useSelector((state) => state.rooms);
    const hsm = useSelector((state) => state.hsm);
    const [template_message, setTemplateMessage] = useState("");
    const [template_preview, setTemplatePreview] = useState("");
    const [bot_template, setBotTemplate] = useState("");
    const [phone, setPhone] = useState("");
    const [mediaUrl, setMediaUrl] = useState({ value: "", type: "" });
    const [currentElementName, setCurrentElementName] = useState("");
    const [params, setParams] = useState([]);
    const [paramsValue, setParamsValue] = useState({});
    const [botId, setBotId] = useState({});
    const [botList, setBotList] = useState([]);
    const [hsmSelected, setHsmSelected] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [flows, setFlows] = useState([]);
    const [successMessage, setSuccessMessage] = useState(t("pma.Tu mensaje ha sido enviado correctamente."));
    const [hsmError, setHsmError] = useState(false);
    const [currentOption, setCurrentOption] = useState(1);
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [loadingFile, setLoadingFile] = useState({ value: false });
    const [options, setOptions] = useState([]);
    const [paramSelected, setParamSelected] = useState([]);
    const [selectAllParams, setSelectAllParams] = useState({ value: false });
    const [hasParams, setHasParams] = useState({ value: false });
    const [flowId, setFlowId] = useState(null);
    const hasMoreBots = botList.length > 1;
    const dispatch = useDispatch();
    const [loadingMedia, setLoadingMedia] = useState(false);

    const fileType = get(mediaUrl, "type", null);

    const handlePhone = (value) => {
        setPhone(value);
    };

    const cleanState = () => {
        setPhone("");
        setLoading(false);
        setHsmError(false);
        setSuccess(false);
        setParams([]);
        setParamsValue({});
        setCurrentElementName("");
        setFile(null);
        setFileData(null);
        setFileName("");
        setFileSize(0);
        setFlowId(null);
    };

    const findUser = (userId, botId) => {
        return rooms.find((room) => (room.senderId === userId || room.senderId === userId + "@c.us") && room.appId === botId);
    };

    useEffect(() => {
        setFlowId(null);
    }, [botId]);

    useEffect(() => {
        JelouApiV1.get("/bots?state=1&type=Whatsapp", {
            params: {
                inProduction: true,
            },
        })
            .then((res) => {
                let arr = [];
                const { data } = res;
                if (!isEmpty(data)) {
                    let roomData = data.find((dat) => dat.id === get(currentRoom, "appId", get(currentRoom, "bot.id", null)));
                    if (isEmpty(roomData)) {
                        roomData = first(data);
                    }
                    setBotTemplate(get(roomData, "id", "untitles"));
                    getHSM(roomData.id);
                    getFlows(roomData.id);
                    if (data.length > 1) {
                        data.map((bot) => {
                            arr.push(...botList, { value: bot.id, label: bot.name });
                            return true;
                        });
                        setBotList(arr);
                    }
                    setBotId(roomData.id);
                } else {
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.log("err", err);
            });
    }, []);

    const setUserCache = (botId, userId) => {
        const { operatorId } = userSession;
        JelouApiV1.post(`/bots/${botId}/users/${userId}/cache`, {
            params: {
                operatorId,
                isBroadcastUser: true,
            },
        }).catch((err) => {
            console.error("==err", err);
        });
    };

    const getHSM = async (botId) => {
        try {
            setIsLoading(true);
            const { teams: teamIds } = userSession;
            const { data } = await JelouApiV1.get(`/bots/${botId}/templates/`, {
                params: {
                    type: [BROADCAST_TYPES.HSM, BROADCAST_TYPES.IMAGE, BROADCAST_TYPES.DOCUMENT],
                    teamIds,
                    isVisible: 1,
                    status: "APPROVED",
                },
            });
            const { results } = data;
            let hsm = results;
            if (isEmpty(results)) {
                dispatch(addHSM(results));
                setHasParams({ value: false });
                setIsLoading(false);
            } else {
                hsm = hsm.filter((element) => {
                    if (element.teamId) {
                        return includes(userSession.teams, parseInt(element.teamId, 10));
                    }
                    return true;
                });
                const firstHsm = first(hsm);
                const { params, template, elementName } = firstHsm;
                setHsmSelected(firstHsm);
                dispatch(addHSM(hsm));
                parseHsmToOption(hsm);
                const { value } = first(parseHsmToOption(hsm));
                setTemplateMessage(template);
                setTemplatePreview(value);
                if (toUpper(firstHsm.type) === "IMAGE" || toUpper(firstHsm.type) === "DOCUMENT") {
                    setMediaUrl({ value: get(firstHsm, "mediaUrl", ""), type: firstHsm.type });
                } else {
                    setMediaUrl({ value: "", type: "" });
                }
                setParams(params);
                setHasParams({ value: !isEmpty(params) });
                setParamSelected(new Array(params.length + 1).fill("0"));
                if (isEmpty(params)) setSelectAllParams({ value: true });
                else setSelectAllParams({ value: false });
                setCurrentElementName(elementName);

                params.map((param) => {
                    setParamsValue({ ...paramsValue, [param.label]: "" });
                    return true;
                });

                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setHsmError(true);
        }
    };

    const parseHsmToOption = (hsmArray) => {
        return hsmArray.map((hsm) => {
            return { value: `${hsm.elementName}`, label: hsm.displayName, template: hsm.template };
        });
    };

    const handleSelect = (obj) => {
        let paramsLocal = [];
        const newHsm = hsm.find((hsm) => {
            return hsm.elementName === obj;
        });

        setHsmSelected(newHsm);

        const { params, template, paramsNumber } = newHsm;
        let newParams = {};

        setTemplateMessage(template);
        setTemplatePreview(obj);
        //check if parameters paramsNumber is greater than 0 to assign params.
        if (paramsNumber > 0) {
            setParams(params);
            paramsLocal = params;
        } else {
            setParams([]);
        }

        setHasParams({ value: !isEmpty(paramsLocal) });
        setParamSelected(new Array(paramsLocal.length + 1).fill("0"));
        if (isEmpty(params)) setSelectAllParams({ value: true });
        else setSelectAllParams({ value: false });

        setCurrentElementName(obj);
        if (toUpper(newHsm.type) === "IMAGE" || toUpper(newHsm.type) === "DOCUMENT") {
            setMediaUrl({ value: get(newHsm, "mediaUrl", ""), type: newHsm.type });
        } else {
            setMediaUrl({ value: "", type: "" });
        }

        paramsLocal.forEach((param) => {
            newParams = { ...newParams, [param.label]: "" };
        });

        setParamsValue(newParams);
    };

    const handleSelectMobile = ({ target }) => {
        const { value } = target;
        const newHsm = hsm.find((hsm) => {
            return hsm.elementName === value;
        });
        const { params, template } = newHsm;
        let newParams = {};
        setHsmSelected(newHsm);

        setTemplateMessage(template);
        setParams(params);
        setHasParams({ value: !isEmpty(params) });
        setParamSelected(new Array(params.length + 1).fill("0"));
        if (isEmpty(params)) setSelectAllParams({ value: true });
        else setSelectAllParams({ value: false });
        setCurrentElementName(value);
        if (toUpper(newHsm.type) === "IMAGE" || toUpper(newHsm.type) === "DOCUMENT") {
            setMediaUrl({ value: get(newHsm, "mediaUrl", ""), type: newHsm.type });
        } else {
            setMediaUrl({ value: "", type: "" });
        }
        params.forEach((param) => {
            newParams = { ...newParams, [param.label]: "" };
        });

        setParamsValue(newParams);
    };

    const handleSelectBot = (obj) => {
        setMediaUrl({ value: "", type: "" });
        if (botId === obj) {
            return;
        }
        getFlows(obj);
        getHSM(obj);
        setBotId(obj);
        setBotTemplate(obj);
    };

    const handleBot = ({ target }) => {
        const { value } = target;
        getHSM(value);
        getFlows(value);
        setBotId(value);
    };

    const parseParamsValue = () => {
        if (isEmpty(fileData)) {
            return;
        }
        if (paramSelected) {
            let orderArray = [...paramSelected];
            orderArray.shift();
            return orderArray.map((value, index) => {
                const element = first(fileData)[parseInt(value)];
                return { param: index + 1, column: element };
            });
        } else {
            return [];
        }
    };

    const getFlows = async (botId) => {
        try {
            const { data } = await JelouApiV1.get(`/bots/${botId}/flows`, {
                params: {
                    shouldPaginate: false,
                    hasBubbles: true,
                    state: true,
                },
            });
            const flows = data.results.map((flow) => {
                return {
                    ...flow,
                    value: flow.id,
                    label: flow.title,
                };
            });
            setFlows(flows);
        } catch (error) {
            console.log(error);
        }
    };

    const getMessage = (msgPayload) => {
        switch (getExtension(mediaUrl.value)) {
            case "jpg":
            case "jpeg":
            case "png":
                return {
                    type: "IMAGE",
                    ...PreviewMessage(msgPayload),
                };
            case "pdf":
            case "doc":
            case "docx":
            case "pptx":
            case "xlsx":
                return {
                    type: "DOCUMENT",
                    ...PreviewMessage(msgPayload),
                };
            default:
                return {
                    type: "TEXT",
                    text: PreviewMessage(msgPayload),
                };
        }
    };

    const handleSubmit = async () => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        setError(false);
        if (currentOption === 1) {
            const phoneNumber = phone.replace("+", "");
            const userExist = findUser(phoneNumber, botId);

            if (userExist) {
                const msgPayload = {
                    params: params,
                    template: template_message,
                    paramValue: paramsValue,
                    language: get(hsmSelected, "language"),
                    setTemplate: setTemplateMessage,
                    ...(!isEmpty(mediaUrl.value) && { mediaUrl: mediaUrl.value }),
                };

                const senderId = `${phoneNumber}@c.us`;
                const groupId = userExist.id;
                const shouldNotBeSent = false;

                sendCustomText(getMessage(msgPayload), groupId, senderId, shouldNotBeSent, botId, props);

                setSuccessMessage(t("pma.Tu mensaje ha sido enviado correctamente."));
                setSuccess(true);
                setLoading(false);

                setTimeout(() => {
                    setShowModal(false);
                    cleanState();
                }, 2000);

                return;
            }

            try {
                setSuccess(false);
                setLoading(true);

                const values = Object.keys(paramsValue);
                Array.prototype.insert = function (index, item) {
                    this.splice(index, 0, item);
                };

                const parameters = [];
                values.forEach((value) => {
                    const ind = params.findIndex((val) => val.label === value);
                    if (paramsValue[value] !== "") parameters.insert(ind, paramsValue[value].trim());
                });
                const origin = "OPERATOR_VIEW";
                const uri = company.id === 124 ? "/v1/whatsapp/hsm" : `/v2/whatsapp/${botId}/hsm`;

                if (toUpper(get(hsmSelected, "type", "")) === "IMAGE" && isEmpty(mediaUrl.value)) {
                    mediaUrl.value = "https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default-image.jpg";
                }

                JelouApiPma.post(uri, {
                    destinations: [phoneNumber],
                    parameters: parameters,
                    elementName: currentElementName,
                    operatorId: userSession.operatorId,
                    ...(company.id === 124 ? { element_name: currentElementName } : {}),
                    bot: botId,
                    language: get(hsmSelected, "language"),
                    origin,
                    ...(toUpper(get(hsmSelected, "type", "")) === "IMAGE" && { type: "image" }),
                    ...(toUpper(get(hsmSelected, "type", "")) === "DOCUMENT" && { type: "document" }),
                    ...(!isEmpty(mediaUrl.value) && { mediaUrl: mediaUrl.value }),
                    ...(flowId && { actions: { setStoreParams: { flowId: Number(flowId) } } }),
                })
                    .then(async () => {
                        const senderId = phoneNumber;
                        setUserCache(botId, senderId);
                        setSuccess(true);
                        setLoading(false);

                        setTimeout(() => {
                            setShowModal(false);
                            cleanState();
                        }, 2000);
                    })
                    .catch((err) => {
                        console.log(err, " error");
                        cleanState();
                        setError(true);
                    });
                setPhone("");
                setParamsValue([]);
            } catch (error) {
                console.error("error", error);
                cleanState();
                setError(true);
            }
        } else {
            setLoading(true);
            let formdata = new FormData();
            formdata.append("file", file);
            const id = botId;
            const elementName = currentElementName;
            const parameters = parseParamsValue();
            const language = get(hsmSelected, "language");
            setSuccess(false);
            ///setLoading(true);
            if (parameters) {
                formdata.append("campaignName", `${userSession.id}_${dayjs(new Date()).format("YYYY-MM-DD_HH:mm:ss")}`);
                formdata.append("botId", id);
                formdata.append("elementName", elementName);
                formdata.append("language", language);
                formdata.append("params", JSON.stringify(parameters));
                if (!isEmpty(mediaUrl.value)) {
                    formdata.append("type", lowerCase(hsmSelected.type));
                    formdata.append("mediaUrl", mediaUrl.value);
                }
                if (!isEmpty(flowId)) {
                    formdata.append(
                        "actions",
                        JSON.stringify({
                            setStoreParams: {
                                flowId: Number(flowId),
                            },
                        })
                    );
                }
                const header = {
                    headers: { "content-type": "multipart/form-data" },
                };

                JelouApiV1.post(`/hsm/file`, formdata, header)
                    .then(() => {
                        setSuccessMessage("Tu archivo ha sido procesado correctamente.");
                        setSuccess(true);
                        setPhone("");
                        setLoading(false);
                        setHsmError(false);
                        setParams([]);
                        setParamsValue({});
                        setCurrentElementName("");
                        setFile(null);
                        setFileData(null);
                        setFileName("");
                        setFileSize(0);
                        setTimeout(() => {
                            setShowModal(false);
                        }, 2000);
                    })
                    .catch((er) => {
                        setError(true);
                        console.log(er, " error");
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        }
    };

    const handleFile = (evt) => {
        try {
            const reader = new FileReader();
            const files = get(evt, "target.files");
            const file = first(files);
            setFile(file);
            if (!file) {
                setFileName("");
                return;
            }
            if (toLower(file.name.slice(-3)) !== "csv") {
                toast.error("Archivo seleccionado no soportado", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                setLoadingFile({ value: false });
                setIsLoading(false);
                return;
            } else {
                setFileName(`${file.name}`);
            }
            setLoadingFile({ value: true });
            setIsLoading(true);
            setParamSelected(paramSelected.fill("0"));
            // check if hsm is already selected and has no parameters
            if (!isEmpty(hsmSelected) && isEmpty(params)) setSelectAllParams({ value: true });
            else setSelectAllParams({ value: false });
            reader.addEventListener("load", (evt) => {
                /* Parse data */
                const result = get(evt, "target.result");
                const bstr = result;
                const wb = XLSX.read(bstr, { type: "binary" });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array to json*/
                let dataParse = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });
                setFileSize(dataParse.length - 1); //To ignore the first values
                // const total = parseInt(messagesCount.available, 10) - dataParse.length;
                // if (total < 0) {
                //     toast.error("Archivo supera cantidad de envíos", {
                //         position: toast.POSITION.BOTTOM_RIGHT,
                //     });
                // }
                setFileData(dataParse);

                let arrayData = first(dataParse).map((data, index) => {
                    return { value: index.toString(), label: data, title: data, name: data };
                });
                arrayData.shift();
                setOptions(arrayData);
                // setParams([...first(dataParse)]); used before when there was a test send
                //setParamsValue(null);
            });
            if (file) {
                reader.readAsBinaryString(file);
            }
        } catch (error) {
            setLoadingFile({ value: false });
            setIsLoading(false);
            console.log("error ==> ", error);
        }
    };

    const selectFlow = (data) => {
        setFlowId(data);
    };

    const selectFlowMobile = ({ target }) => {
        const { value } = target;
        setFlowId(value);
    };

    // get extension from file string
    const getExtension = (file) => {
        const extension = file.split(".").pop();
        return extension;
    };

    const validateExtension = (file) => {
        const extension = getExtension(file);
        const validDocExtensions = ["pdf"];
        const validImageExtensions = ["png", "jpg"];
        const validVideoExtensions = ["mp4"];

        if (fileType === "DOCUMENT" && validDocExtensions.includes(extension)) {
            return true;
        }
        if (fileType === "IMAGE" && validImageExtensions.includes(extension)) {
            return true;
        }
        if (fileType === "VIDEO" && validVideoExtensions.includes(extension)) {
            return true;
        }

        return false;
    };

    const getValidFileTypes = () => {
        switch (fileType) {
            case "DOCUMENT":
                return ".pdf";
            case "IMAGE":
                return ".png, .jpg";
            case "VIDEO":
                return ".mp4";
            default:
                return "";
        }
    };

    const onDrop = (files) => {
        const fileName = get(files, "[0].name");
        if (!validateExtension(fileName)) {
            toast.error(`${t("selectMessage.fileNotSupported")} ${t(`selectMessage.${fileType.toLowerCase()}`)} (${getValidFileTypes()})`, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });

            return;
        }
        const dropFile = { target: { files: files } };
        handleDocFile(dropFile);
    };

    const handleDocFile = async (evt) => {
        try {
            setLoadingMedia(true);
            const { files } = evt.target;
            const file = files[0];
            if (files && files.length) {
                const filename = file.name;
                let fileName = filename.replace(/ /g, "_");
                const path = `images/${fileName}`;

                const url = await prepareFile(file, path);

                setMediaUrl({ ...mediaUrl, value: url });

                setLoadingMedia(false);
            }
        } catch (error) {
            console.log("error ==> ", error);
            setLoadingMedia(false);
        }
        setLoadingMedia(false);
    };

    const prepareFile = async (file, path) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("path", path);

        const url = await uploadFile(formData);

        return url;
    };

    const clickFilePicker = () => {
        // Sorry for this method... but it may be the easiest one 👯
        const filePicker = document.getElementById("file-picker");
        filePicker.click();
    };

    const uploadFile = async (formData) => {
        const config = {
            headers: {
                Authorization: "Basic cFM1T2lrUUt2SFUzM1YyaUN2STdVc0NnTGtaTzZFOUY6VHl4ZXhsUl9EUk53MEV4LWd2ZmZZcldaUmhZc3U0amM1LU9MbU5PS2pkQXVRMlY2YW95WFEyVXAybVA3aUFhbg==",
                "content-type": "multipart/form-data",
            },
        };
        return JelouApiV1.post(`/bots/${botId}/images/upload/`, formData, config)
            .then(({ data }) => {
                return data;
            })
            .catch(({ err }) => {
                return err;
            });
    };

    const inputAcceptType = (type) => {
        const acceptImage = [".png", ".jpg"];
        const acceptDoc = [".pdf"];
        const acceptVideo = [".mp4"];
        switch (type.toUpperCase()) {
            case "IMAGE":
                return acceptImage;
            case "DOCUMENT":
                return acceptDoc;
            case "VIDEO":
                return acceptVideo;
            default:
                return "";
        }
    };

    const getUrlFileImage = (type) => {
        switch (type.toUpperCase()) {
            case "IMAGE":
                return "assets/illustrations/imageFile.svg";
            case "DOCUMENT":
                return "assets/illustrations/docFile.svg";
            case "VIDEO":
                return "assets/illustrations/videoFile.svg";
            default:
                return "assets/illustrations/docFile.svg";
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-x-0 top-0 z-100 px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div className="z-60 max-h-content-mobile transform overflow-y-auto rounded-xl bg-white shadow-modal transition-all md:max-h-content md:min-w-[40rem] md:max-w-2xl mid:max-w-[50rem]">
                <div className="mx-4 mb-3 flex items-center justify-between py-4 sm:mx-8 sm:mb-0 sm:py-4">
                    <div className="flex w-full items-center">
                        <div className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-200 sm:h-10 sm:w-10 md:mr-4`}>
                            <JelouLogoIcon width="2.5rem" height="2.5rem" />
                        </div>
                        <HsmTab currentOption={currentOption} setCurrentOption={setCurrentOption} />
                    </div>
                    <span className="ml-2 md:ml-4" onClick={() => setShowModal(false)}>
                        <CloseIcon1 className="cursor-pointer fill-current text-gray-400" width="1rem" height="1rem" />
                    </span>
                </div>

                {success && (
                    <div className="mb-4 flex h-14 items-center rounded-default bg-whatsapp-200 px-4 font-bold text-whatsapp-350">
                        <svg width="1.563rem" height="1.563rem" className="mr-4" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.0256 8.53367C18.4071 8.91514 18.4071 9.5335 18.0256 9.91478L11.4742 16.4663C11.0928 16.8476 10.4746 16.8476 10.0931 16.4663L6.97441 13.3474C6.59294 12.9662 6.59294 12.3478 6.97441 11.9665C7.35569 11.585 7.97405 11.585 8.35533 11.9665L10.7836 14.3948L16.6445 8.53367C17.0259 8.15239 17.6443 8.15239 18.0256 8.53367ZM25 12.5C25 19.4094 19.4084 25 12.5 25C5.59063 25 0 19.4084 0 12.5C0 5.59063 5.59158 0 12.5 0C19.4094 0 25 5.59158 25 12.5ZM23.0469 12.5C23.0469 6.67019 18.329 1.95312 12.5 1.95312C6.67019 1.95312 1.95312 6.67095 1.95312 12.5C1.95312 18.3298 6.67095 23.0469 12.5 23.0469C18.3298 23.0469 23.0469 18.329 23.0469 12.5Z"
                                fill="#0CA010"
                            />
                        </svg>
                        {t(successMessage)}
                    </div>
                )}
                {error && (
                    <div className="text-red-darker mb-4 flex h-14 items-center rounded-default bg-red-300 px-4 font-bold">
                        <AlertIcon width="1.563rem" height="1.563rem" className="text-red-darker mr-4 fill-current" />
                        {t("pma.Algo ha pasado, inténtalo más tarde.")}
                    </div>
                )}
                <div>
                    <div className="w-full">
                        {currentOption === 1 ? (
                            <div className="flex items-center bg-gray-25 px-4 py-2 sm:px-8 sm:py-4">
                                <label htmlFor="template_id" className="hidden font-bold text-gray-400 sm:block">
                                    {t("pma.Teléfono")}
                                </label>
                                <PhoneInput
                                    value={phone}
                                    defaultCountry="EC"
                                    placeholder={t("pma.Ingresa el número del destinatario")}
                                    onChange={handlePhone}
                                    className="inline-flex h-9 w-full appearance-none text-15 font-medium sm:ml-4"
                                />
                            </div>
                        ) : (
                            <FileInput
                                loadingFile={loadingFile}
                                setLoadingFile={setLoadingFile}
                                setIsLoading={setIsLoading}
                                handleFile={handleFile}
                                fileName={fileName}
                                fileSize={fileSize}
                                fileData={fileData}
                            />
                        )}
                        <div className="flex flex-col space-y-2 p-4 sm:space-x-4 sm:space-y-0 sm:p-8 md:flex-row">
                            <div className={`mb-2 w-full pl-2 sm:pl-4 md:w-auto md:min-w-350 ${hasMoreBots && "md:mr-8"}`}>
                                {loadingFile.value
                                    ? hasMoreBots && (
                                          <div className="mid:w-350 flex flex-col pb-8 md:pb-16">
                                              <label className="block pb-2 text-sm font-bold text-gray-400 sm:text-base md:pb-6">{t("pma.Seleccione bot")}</label>
                                              <div className="flex h-10 w-full flex-row items-center justify-center border-b-default border-gray-35">
                                                  <BeatLoader color={"#00B3C7"} size={"0.75rem"} />
                                              </div>
                                          </div>
                                      )
                                    : hasMoreBots && (
                                          <div className="flex flex-col pb-8 md:pb-16 mid:w-325">
                                              <label className="block pb-2 text-sm font-bold text-gray-400 sm:text-base md:pb-6">{t("pma.Seleccione bot")}</label>
                                              <SelectSearch
                                                  className="hidden w-full text-15 sm:flex mid:w-325"
                                                  options={orderBy(botList, ["label"], ["asc"])}
                                                  onChange={handleSelectBot}
                                                  value={bot_template}
                                                  placeholder={t("pma.Seleccionar bot")}
                                              />
                                              <SelectMobile value={botId} options={orderBy(botList, ["label"], ["asc"])} onChange={handleBot} />
                                          </div>
                                      )}
                                <ParamsInput
                                    params={params}
                                    hsm={hsm}
                                    hasMoreBots={hasMoreBots}
                                    currentOption={currentOption}
                                    options={options}
                                    setHasParams={setHasParams}
                                    paramSelected={paramSelected}
                                    setParamSelected={setParamSelected}
                                    paramsValue={paramsValue}
                                    setParamsValue={setParamsValue}
                                    setSelectAllParams={setSelectAllParams}
                                    isLoading={isLoading}
                                />
                                {!isEmpty(hsm) && !isEmpty(flows) && (
                                    <div>
                                        <label className="block pb-2 text-sm font-bold text-gray-400 sm:text-base md:pb-6">{t("pma.Seleccione flujo (Opcional)")}</label>
                                        <SelectSearch
                                            className="mid:w-350 hidden w-full text-15 sm:flex"
                                            value={flowId}
                                            options={orderBy(flows, ["title"], ["asc"])}
                                            onChange={selectFlow}
                                            placeholder={t("pma.Seleccionar flujo")}
                                        />
                                        <SelectMobile onChange={selectFlowMobile} name="flows" options={flows} placeholder={t("pma.Seleccionar flujo")} />
                                    </div>
                                )}

                                {fileType && (
                                    <>
                                        <div className="mt-10 flex">
                                            <p className="text-sm font-bold text-gray-400 sm:text-base">
                                                {t("pma.changeOrUpload")} <span>{t(`selectMessage.${fileType.toLowerCase()}`).toLowerCase()}</span>
                                            </p>
                                        </div>
                                        <FileDrop className="mt-4 w-full" onDrop={(files) => onDrop(files)}>
                                            <div className="flex">
                                                <div className="flex min-h-[7.5rem] w-full overflow-hidden rounded-xl border-1 border-[#CDD7E7] p-3">
                                                    <img src={getUrlFileImage(fileType)} className="mx-auto h-24 w-24" alt={"imageFile"} loading="lazy" />
                                                    <div className="flex flex-col items-center justify-center">
                                                        <input className="hidden" type="file" name="avatar" accept={inputAcceptType(fileType)} onChange={handleDocFile} id="file-picker" />
                                                        <p className="pl-4 text-xs font-bold  text-gray-400">{t("selectMessage.searchFile")} </p>
                                                        {!loadingMedia && (
                                                            <button
                                                                className=" color-gradient min-w-40 my-2 h-10 cursor-pointer justify-items-center rounded-full px-4 py-2 text-base font-medium text-white hover:bg-primary-200 focus:outline-none focus:ring-4"
                                                                onClick={() => clickFilePicker()}
                                                            >
                                                                {t("selectMessage.search")} {t(`selectMessage.${fileType.toLowerCase()}`).toLowerCase()}
                                                            </button>
                                                        )}
                                                        {
                                                            loadingMedia && (
                                                                <div className="mt-4 flex h-auto w-full flex-row items-center justify-center">
                                                                    <BarLoader size={"2.25rem"} color="#00b3c7" />
                                                                </div>
                                                            )
                                                            //  : (
                                                            //     <div className="w-11/12 text-sm font-medium lg:text-justify" style={{ color: "#9CB4CD" }}>
                                                            //         <div className="flex flex-row">
                                                            //             {mediaFileName ? (
                                                            //                 <>
                                                            //                     <p className="overflow-hidden truncate">{mediaFileName}</p>
                                                            //                     <button
                                                            //                         className="ml-2"
                                                            //                         onClick={() => {
                                                            //                             removeDocFile();
                                                            //                         }}>
                                                            //                         <CancelIcon />
                                                            //                     </button>
                                                            //                 </>
                                                            //             ) : null}
                                                            //         </div>
                                                            //     </div>
                                                            // )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </FileDrop>
                                    </>
                                )}
                            </div>
                            <div className={`flex flex-col pl-2 ${hasMoreBots && "md:pl-4"}`}>
                                <div className="mb-8 flex flex-col md:w-325 md:pb-8">
                                    <label className="mb-1 block text-sm font-bold text-gray-400 sm:text-base md:mb-6">{t("pma.Elige la plantilla")}</label>
                                    {isLoading ? (
                                        <div className="flex h-10 w-full flex-row items-center justify-center border-b-default border-gray-35">
                                            <BeatLoader color={"#00B3C7"} size={"0.75rem"} />
                                        </div>
                                    ) : !isEmpty(hsm) ? (
                                        <>
                                            <SelectSearch
                                                className="hidden w-full text-15 sm:flex md:w-325"
                                                options={parseHsmToOption(hsm)}
                                                onChange={handleSelect}
                                                placeholder={t("pma.Seleccionar plantilla")}
                                                value={template_preview}
                                            />

                                            <SelectMobile options={parseHsmToOption(hsm)} onChange={handleSelectMobile} />
                                        </>
                                    ) : hsmError ? (
                                        <div className="mb-16 flex flex-row items-center border-b-default border-gray-35">
                                            <div className="mr-2 flex h-10 w-full items-center truncate py-2 text-15 font-normal text-gray-450 ">{t("pma.No se encontró hsm")}</div>
                                        </div>
                                    ) : (
                                        <div className="mb-16 flex flex-row items-center border-b-default border-gray-35">
                                            <div className="mr-2 flex h-10 w-full items-center truncate py-2 text-15 font-normal text-gray-450">{t("pma.No se encontró hsm")}</div>
                                        </div>
                                    )}
                                </div>
                                {!isEmpty(hsm) && (
                                    <div className="order-1">
                                        <label className="mr-4 block pb-2 font-bold text-gray-400">{t("pma.Vista Previa")}</label>
                                        <div className="img-whatsapp rounded-7.5 bg-opacity-50 px-4 py-8 text-sm md:w-325">
                                            <RenderPreviewMessage
                                                params={params}
                                                template={template_message}
                                                paramValue={paramsValue}
                                                setTemplate={setTemplateMessage}
                                                mediaUrl={mediaUrl}
                                                loading={loadingMedia}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-modal-footer flex w-full items-center justify-center rounded-b-lg px-4 pb-4 sm:px-8 md:justify-end md:pb-8">
                    <button
                        className="text-14 mr-2 flex h-10 items-center justify-center rounded-full border-transparent bg-gray-10 px-5 font-bold text-gray-400 outline-none"
                        onClick={() => setShowModal(false)}
                    >
                        {t("pma.Cancelar")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={currentOption === 1 ? !(phone && !hsmError && !hasParams.value && !isEmpty(hsm)) : !(!isEmpty(fileName) && !isEmpty(hsm) && selectAllParams.value)}
                        className="text-14 mr-2 flex h-10 min-w-[8rem] items-center justify-center rounded-full border-transparent bg-primary-200 px-5 font-bold text-white outline-none hover:bg-primary-100 disabled:cursor-not-allowed disabled:bg-gray-border disabled:text-gray-75"
                    >
                        {loading ? <BeatLoader size={"0.5rem"} color="#ffff" /> : t("pma.Enviar")}
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("root")
    );
};

export default HsmModal;
