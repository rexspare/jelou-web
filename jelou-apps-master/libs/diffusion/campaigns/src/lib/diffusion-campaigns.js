import dayjs from "dayjs";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import toUpper from "lodash/toUpper";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { JelouApiV1 } from "@apps/shared/modules";
import * as XLSX from "xlsx";
import TemplateViewer from "./Components/TemplateViewer";

const Campaigns = (props) => {
    const { t } = useTranslation();
    const { steps, settings, setSteps } = props;

    const fecha = new Date();
    const [hsmValue, setHsmValue] = useState(null);
    const [selectedHsm, setSelectedHsm] = useState({
        template: t("campaigns.template"),
        params: [],
    });
    const [options, setOptions] = useState([]);
    const [hsmArray, setHsmArray] = useState([]);
    const [file, setFile] = useState(null);
    const [flowId, setFlowId] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [paramsValue, setParamsValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingBots, setLoadingBots] = useState(false);
    const [loadingHsm, setLoadingHsm] = useState(false);
    const [loadingFile, setLoadingFile] = useState({ value: false });
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [maxReach, setMaxReach] = useState(0);
    const [step, setStep] = useState(0);
    const [bots, setBots] = useState([]);
    const [currentBot, setCurrentBot] = useState([]);
    const [campaignDate, setCampaignDate] = useState(fecha);
    const [campaignTime, setCampaignTime] = useState(dayjs(fecha).format("h:mm A"));
    const [selected, setSelected] = useState(settings[0]);
    const [paramSelected, setParamSelected] = useState([]);
    const [selectAllParams, setSelectAllParams] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingMedia, setLoadingMedia] = useState(false);
    const [mediaFileName, setMediaFileName] = useState("");
    const [mediaUrlMessage, setMediaUrlMessage] = useState(null);
    const [mediaUrlType, setMediaUrlType] = useState(null);
    const [response, setResponse] = useState([]);
    const [responseType, setResponseType] = useState(null);
    const [showOptions, setShowOptions] = useState([]);
    const [showButtons, setShowButtons] = useState([]);
    const [ttl, setTtl] = useState(86400);
    const [showParams, setShowParams] = useState([]);
    const [storeParams, setStoreParams] = useState([]);
    const [company, setCompany] = useState([]);
    const [currentCompany, setCurrentCompany] = useState([]);
    const [campaignName, setCampaignName] = useState("");
    const [subCompanies, setSubCompanies] = useState("");
    const [arrayButton, setArrayButton] = useState([]);

    useEffect(() => {
        if (isEmpty(company)) {
            getCompany();
        }
    }, []);
    useEffect(() => {
        if (!isEmpty(company)) {
            getSubcompanies();
        }
    }, [company]);

    useEffect(() => {
        if (!isEmpty(currentCompany)) {
            getBots();
        }
    }, [currentCompany]);

    useEffect(() => {
        getHSM(currentBot);
        setParamsValue(null);
    }, [currentBot]);

    const nextStep = (value) => {
        if (maxReach < value) {
            setMaxReach(value);
        }
        if (step < value) {
            const stepsList = [...steps];

            stepsList[step] = {
                name: steps[step].name,
                description: steps[step].description,
                status: "complete",
                number: steps[step].number,
                inputData: steps[step].inputData,
            };
            stepsList[value] = {
                name: steps[value].name,
                description: steps[value].description,
                status: "current",
                number: steps[value].number,
                inputData: steps[value].inputData,
            };
            setSteps(stepsList);
        } else {
            const stepsList = [...steps];
            stepsList[step] = {
                name: steps[step].name,
                description: steps[step].description,
                status: "upcoming",
                number: steps[step].number,
                inputData: steps[step].inputData,
            };
            stepsList[value] = {
                name: steps[value].name,
                description: steps[value].description,
                status: "current",
                number: steps[value].number,
                inputData: steps[value].inputData,
            };
            setSteps(stepsList);
            // steps[step].status = "upcoming";
            // steps[value].status = "current";
        }
        setStep(value);
    };

    const handleCampaign = ({ target }) => {
        const { value } = target;
        const stepsList = [...steps];
        stepsList[0] = {
            name: steps[0].name,
            description: steps[0].description,
            status: steps[0].status,
            number: steps[0].number,
            inputData: value,
        };
        // steps[0].inputData = value;
        setSteps(stepsList);
        setCampaignName(value);
    };

    const handleCompany = (company) => {
        setCurrentCompany(company);
    };

    const clickFilePicker = () => {
        // Sorry for this method... but it may be the easiest one 👯
        const filePicker = document.getElementById("file-picker");
        filePicker.click();
    };

    const getCompany = async () => {
        try {
            JelouApiV1.get(`/company`).then((response) => {
                if (!isEmpty(response.data)) {
                    setCompany(response.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getSubcompanies = async () => {
        let subCompanies = [];
        try {
            const { clientId: username, clientSecret: password, id } = company;
            JelouApiV1.get(`/company/${id}/subcompanies`, {
                auth: {
                    username,
                    password,
                },
            })
                .then((response) => {
                    const { results } = response.data;
                    results.forEach((company) => {
                        const botCount = get(company, "botCount", 0);
                        if (botCount !== 0 && company.state === 1) {
                            subCompanies.push(company);
                        }
                        subCompanies = orderBy(subCompanies, ["name"], ["asc"]);
                    });
                    setSubCompanies(subCompanies);
                    setCurrentCompany(first(subCompanies));
                })
                .catch((err) => {
                    if (err && err.message) {
                        console.log(err.message);
                    }
                });
        } catch (error) {
            console.log(error);
        }
    };

    const getBots = async () => {
        try {
            setLoadingBots(true);
            setLoadingHsm(true);
            const { clientId: username, clientSecret: password } = currentCompany;
            if (!isEmpty(username) && !isEmpty(password)) {
                const { data } = await JelouApiV1.get(`/bots`, {
                    auth: {
                        username,
                        password,
                    },
                });
                if (!isEmpty(data)) {
                    const filteredBots = data.filter(
                        (bot) => bot.companyId === currentCompany.id && bot.state === 1 && toUpper(bot.type) === "WHATSAPP"
                    );
                    setBots(filteredBots);
                    setCurrentBot(first(filteredBots));
                }
                setLoadingHsm(false);
                setLoadingBots(false);
            }
            setLoadingHsm(false);
            setLoadingBots(false);
        } catch (error) {
            setLoadingBots(false);
            console.log(error);
        }
    };

    const handleHSM = (hsmElement) => {
        setSelectedHsm(hsmElement);
        setHsmValue(hsmElement.elementName);
        setParamsValue(null);
    };

    const handleChange = (bot) => {
        getHSM(bot);
        setParamsValue({ ...paramsValue, [bot.name]: bot.id });
        setCurrentBot(bot);
    };

    const getHSM = async (bot) => {
        try {
            setLoadingHsm(true);
            if (!isEmpty(bot)) {
                const { data } = await JelouApiV1.get(`/whatsapp/${bot.id}/hsm`, {
                    params: {
                        status: "APPROVED",
                        isVisible: 1,
                    },
                });
                const hsmData = data.filter((hsm) => hsm.type !== "QUICKREPLY");

                if (!isEmpty(hsmData)) {
                    let uniqueId = [];
                    let uniqueParsedData = [];
                    hsmData.forEach((element) => {
                        if (!uniqueId.includes(element.elementName)) {
                            uniqueId.push(element.elementName);
                            uniqueParsedData.push({
                                id: element.elementName,
                                name: element.displayName,
                                ...element,
                            });
                        }
                    });
                    const firstHsm = first(uniqueParsedData);
                    setSelectedHsm(firstHsm);
                    setHsmArray(uniqueParsedData);
                    setHsmValue(firstHsm.elementName);
                } else {
                    setSelectedHsm({
                        template: "No se encontró hsm para envío",
                        params: [],
                    });
                    setHsmArray([]);
                }
                setLoadingHsm(false);
            }
            setLoadingHsm(false);
        } catch (error) {
            setLoadingHsm(false);
            console.log("error ==> ", error);
        }
    };

    const handleOptionConfig = (target) => {
        const stepsList = [...steps];
        stepsList[3] = {
            name: steps[3].name,
            description: steps[3].description,
            status: steps[3].status,
            number: steps[3].number,
            inputData: target,
        };

        // steps[3].inputData = target;
        setSteps(stepsList);
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

                setMediaFileName(filename);
                setMediaUrlMessage(url);
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

    const uploadFile = (formData) => {
        const config = {
            headers: {
                Authorization:
                    "Basic cFM1T2lrUUt2SFUzM1YyaUN2STdVc0NnTGtaTzZFOUY6VHl4ZXhsUl9EUk53MEV4LWd2ZmZZcldaUmhZc3U0amM1LU9MbU5PS2pkQXVRMlY2YW95WFEyVXAybVA3aUFhbg==",
                "content-type": "multipart/form-data",
            },
        };
        return JelouApiV1.post(`/bots/${currentBot.id}/images/upload/`, formData, config)
            .then(({ data }) => {
                return data;
            })
            .catch(({ err }) => {
                return err;
            });
    };

    const removeDocFile = () => {
        document.getElementById("file-picker").value = null;
        setMediaFileName(null);
        setMediaUrlMessage(null);
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
            if (file.name.slice(-3) !== "csv") {
                toast.error("Archivo seleccionado no soportado", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                //setLoadingFile({ value: false });
                return;
            } else {
                setFileName(`${file.name}`);
            }

            const stepsList = [...steps];
            stepsList[1] = {
                name: steps[1].name,
                description: steps[1].description,
                status: steps[1].status,
                number: steps[1].number,
                inputData: file.name,
            };
            // steps[1].inputData = file.name;
            setSteps(stepsList);

            setLoadingFile({ value: true });
            setParamSelected(
                paramSelected.map((param) => {
                    return 0;
                })
            );
            reader.addEventListener("load", (evt) => {
                /* Parse data */
                const result = get(evt, "target.result");
                const bstr = result;
                const wb = XLSX.read(bstr, { type: "binary" });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array to json*/

                let dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
                setFileSize(dataParse.length - 1); //To ignore the first values
                // const total = parseInt(messagesCount.available, 10) - dataParse.length;
                // if (total < 0) {
                //     toast.error("Archivo supera cantidad de envíos", {
                //         position: toast.POSITION.BOTTOM_RIGHT,
                //     });
                // }
                setFileData(dataParse);

                let arrayData = first(dataParse).map((data, index) => {
                    return { id: index, name: data };
                });
                arrayData.shift();
                setOptions(arrayData);
                // setParams([...first(dataParse)]); used before when there was a test send
                setParamsValue(null);
            });
            if (file) {
                reader.readAsBinaryString(file);
            }
            // setLoadingFile({ value: false });
        } catch (error) {
            setLoadingFile({ value: false });
            console.log("error ==> ", error);
        }
    };

    const removeFileDropped = () => {
        document.getElementById("file-picker").value = null;
        setFile(null);
        setFileName(null);
        setFileData(null);
        setOptions([]);
    };

    const handleAsigned = () => {
        // getHSM(botSelected);
        setParamsValue({ ...paramsValue, ...first(fileData).map() });
    };

    const parseParamsValue = () => {
        if (isEmpty(fileData)) {
            return;
        }
        if (paramSelected) {
            let orderArray = [...paramSelected];
            !isEmpty(selectedHsm.buttonParams) && orderArray.pop();
            orderArray.shift();
            return orderArray.map((value, index) => {
                const element = first(fileData)[value];
                return { param: index + 1, column: element };
            });
        } else {
            return [];
        }
    };

    const parseDynamicParams = () => {
        if (isEmpty(fileData)) {
            return;
        }
        if (paramSelected && !isEmpty(selectedHsm.buttonParams)) {
            let orderArray = [paramSelected.pop()];

            return orderArray.map((value, index) => {
                const element = first(fileData)[value];
                return { param: index + 1, column: element };
            });
        } else {
            return [];
        }
    };

    const resetValues = () => {
        setStep(0);
        setOpen(false);
        setFileName("");
        setOptions([]);
        setParamsValue([]);
        setStoreParams([]);
        setFileData(null);
        setCampaignTime(null);
        setMediaFileName([]);
        setMediaUrlMessage(null);
    };

    const sendHSM = () => {
        let formdata = new FormData();
        formdata.append("file", file);
        const id = get(currentBot, "id");
        const elementName = selectedHsm.elementName;
        const parameters = parseParamsValue();
        const dynamicParameters = parseDynamicParams();
        const ACTION_QUICKREPLY = `${get(selectedHsm, "interactiveAction", "")}`.toUpperCase() === "QUICK_REPLY";
        setLoading(true);
        if (selected.opcion === 1) {
            if (parameters) {
                if (campaignName !== "") {
                    formdata.append("campaignName", campaignName);
                }
                formdata.append("companyId", currentCompany.id);
                formdata.append("botId", id);
                formdata.append("elementName", elementName);
                formdata.append("params", JSON.stringify(parameters));
                !isEmpty(selectedHsm.buttonParams) && formdata.append("dynamicUrlParameter", JSON.stringify(dynamicParameters));
                if (mediaUrlMessage) {
                    formdata.append("type", mediaUrlType);
                    formdata.append("mediaUrl", mediaUrlMessage);
                }
                if (response && ACTION_QUICKREPLY) {
                    const arrayButton = get(response, "arrayButton", []);
                    const actions = get(response, "setStoreParams", {});

                    formdata.append("buttonPayloads", JSON.stringify(arrayButton));
                    if (!isEmpty(actions)) {
                        formdata.append("actions", JSON.stringify({ setStoreParams: { ...actions } }));
                    }
                } else if (response) {
                    formdata.append("actions", JSON.stringify(response));
                }

                const header = {
                    headers: { "content-type": "multipart/form-data" },
                };

                JelouApiV1.post(`/hsm/file`, formdata, header)
                    .then(() => {
                        setLoading(false);
                        setParamsValue(null);
                        setCampaignName("");
                        setResponse([]);
                        setOptions(null);
                        nextStep(5);
                        setMaxReach(0);
                    })
                    .catch((er) => {
                        console.log(er, " error");
                        const { response } = er;
                        const { data } = response;
                        const err = get(data, "message", t("campaigns.error"));
                        const errr = first(err);
                        toast.error(errr, {
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        } else if (selected.opcion === 2) {
            //2020-08-01T07:00:00-05:00 YYYY-MM-DD
            const schDate = dayjs(campaignDate).format("YYYY-MM-DD");
            const schTime = campaignTime.split(":");
            const scheduleDate = schDate.concat("T");
            const scheduleTime = schTime[0].concat(":").concat(schTime[1]).concat(":00-05:00");
            const schedule = scheduleDate.concat(scheduleTime);

            if (parameters) {
                if (campaignName !== "") {
                    formdata.append("campaignName", campaignName);
                }
                formdata.append("companyId", currentCompany.id);
                formdata.append("botId", id);
                formdata.append("elementName", elementName);
                formdata.append("params", JSON.stringify(parameters));
                !isEmpty(selectedHsm.buttonParams) && formdata.append("dynamicUrlParameter", JSON.stringify(dynamicParameters));
                formdata.append("date", schedule);
                if (mediaUrlMessage) {
                    formdata.append("type", mediaUrlType);
                    formdata.append("mediaUrl", mediaUrlMessage);
                }
                if (response && ACTION_QUICKREPLY) {
                    const arrayButton = get(response, "arrayButton", []);
                    const actions = get(response, "setStoreParams", {});

                    formdata.append("buttonPayloads", JSON.stringify(arrayButton));
                    if (!isEmpty(actions)) {
                        formdata.append("actions", JSON.stringify({ setStoreParams: { ...actions } }));
                    }
                } else if (response) {
                    formdata.append("actions", JSON.stringify(response));
                }

                const header = {
                    headers: { "content-type": "multipart/form-data" },
                };

                JelouApiV1.post(`/hsm/file`, formdata, header)
                    .then(() => {
                        setLoading(false);
                        setParamsValue(null);
                        // dispatch(addCount(fileSize));
                        setCampaignName("");
                        setResponse([]);
                        setOptions(null);
                        nextStep(5);
                        setMaxReach(0);
                    })
                    .catch((er) => {
                        console.log(er, " error");
                        const { response } = er;
                        const { data } = response;
                        const err = get(data, "message", t("campaigns.error"));
                        const errr = first(err);
                        toast.error(errr, {
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="main-content flex w-full flex-col justify-between px-10 lg:flex-row">
            <TemplateViewer
                steps={steps}
                setSteps={setSteps}
                stepIndex={step}
                nextStep={nextStep}
                handleCampaign={handleCampaign}
                campaignName={campaignName}
                setCampaignName={setCampaignName}
                bots={bots}
                currentBot={currentBot}
                options={options}
                hsmArray={hsmArray}
                handleHSM={handleHSM}
                hsmValue={hsmValue}
                selectedHsm={selectedHsm}
                handleChange={handleChange}
                loading={loading}
                handleCompany={handleCompany}
                subCompanies={subCompanies}
                loadingBots={loadingBots}
                loadingHsm={loadingHsm}
                currentCompany={currentCompany}
                paramSelected={paramSelected}
                setParamSelected={setParamSelected}
                setSelectAllParams={setSelectAllParams}
                clickFilePicker={clickFilePicker}
                mediaFileName={mediaFileName}
                handleDocFile={handleDocFile}
                loadingMedia={loadingMedia}
                mediaUrlMessage={mediaUrlMessage}
                setMediaUrlMessage={setMediaUrlMessage}
                setMediaUrlType={setMediaUrlType}
                setMediaFileName={setMediaFileName}
                setLoading={setLoading}
                setLoadingFile={setLoadingFile}
                handleFile={handleFile}
                fileName={fileName}
                fileData={fileData}
                handleAsigned={handleAsigned}
                selectAllParams={selectAllParams}
                loadingFile={loadingFile}
                showParams={showParams}
                setShowParams={setShowParams}
                campaignDate={campaignDate}
                setCampaignDate={setCampaignDate}
                selected={selected}
                setSelected={setSelected}
                sendHSM={sendHSM}
                settings={settings}
                open={open}
                setOpen={setOpen}
                fileSize={fileSize}
                responseType={responseType}
                storeParams={storeParams}
                showOptions={showOptions}
                ttl={ttl}
                setTtl={setTtl}
                flowId={flowId}
                setFlowId={setFlowId}
                response={response}
                setResponse={setResponse}
                setResponseType={setResponseType}
                setShowOptions={setShowOptions}
                setStoreParams={setStoreParams}
                setCampaignTime={setCampaignTime}
                handleOptionConfig={handleOptionConfig}
                resetValues={resetValues}
                removeFileDropped={removeFileDropped}
                removeDocFile={removeDocFile}
                arrayButton={arrayButton}
                setArrayButton={setArrayButton}
                setShowButtons={setShowButtons}
                showButtons={showButtons}
            />
        </div>
    );
};

export default Campaigns;
