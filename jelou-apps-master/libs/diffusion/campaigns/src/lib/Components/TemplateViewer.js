import { useEffect, useState } from "react";

import CampaignDone from "./CampaignDone";
import CampaignSettings from "./CampaignSettings";
import SelectCampaignName from "./SelectCampaignName";
import SelectDestination from "./SelectDestination";
import SelectMessage from "./SelectMessage";
import SelectSend from "./SelectSend";

import Stepper from "./Stepper";

import { CopyIcon } from "@apps/shared/icons";
import first from "lodash/first";
import get from "lodash/get";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";

import { RESPONSE_TYPES } from "@apps/shared/constants";
import { formatMessage } from "@apps/shared/utils";
import { RadioGroup } from "@headlessui/react";
import { LinkIcon, PhoneIcon } from "@heroicons/react/solid";
import Tippy from "@tippyjs/react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import { ToastContainer } from "react-toastify";
import AutoSizer from "react-virtualized-auto-sizer";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const acceptString = ".csv";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const TemplateViewer = (props) => {
    const {
        steps,
        stepIndex,
        nextStep,
        handleCampaign,
        campaignName,
        setCampaignName,
        bots,
        currentBot,
        hsmArray,
        handleHSM,
        hsmValue,
        selectedHsm,
        handleChange,
        loading,
        handleCompany,
        subCompanies,
        loadingBots,
        loadingHsm,
        currentCompany,
        paramSelected,
        setParamSelected,
        setSelectAllParams,
        clickFilePicker,
        mediaFileName,
        handleDocFile,
        loadingMedia,
        mediaUrlMessage,
        setMediaUrlMessage,
        setMediaUrlType,
        setMediaFileName,
        handleFile,
        fileName,
        fileData,
        handleAsigned,
        selectAllParams,
        loadingFile,
        setLoadingFile,
        response,
        setResponse,
        handleOptionConfig,
        responseType,
        setResponseType,
        ttl,
        setTtl,
        showOptions,
        setShowOptions,
        flowId,
        setFlowId,
        duration,
        setDuration,
        storeParams,
        setStoreParams,
        setShowParams,
        showParams,
        campaignDate,
        setCampaignDate,
        selected,
        setSelected,
        sendHSM,
        settings,
        setOpen,
        open,
        fileSize,
        setCampaignTime,
        resetValues,
        removeFileDropped,
        removeDocFile,
        arrayButton,
        setArrayButton,
        setShowButtons,
        showButtons,
        setSteps,
    } = props;
    const { t } = useTranslation();
    const [options, setOptions] = useState([]);
    const [ttlValue, setTtlValue] = useState({ number: 24, unit: "Horas" });
    const [arrayColumn, setArrayColumn] = useState([]);
    const [numPages, setNumPages] = useState(0);
    const [hasButtonsFlag, setHasButtonsFlag] = useState(false);
    //? state step back 4
    const [settingConfig, setSettingConfig] = useState(null);
    const [flowBack, setFlowBack] = useState(null);
    const [stepBack4, setStepBack4] = useState(false);
    const [flowsBack, setFlowsBack] = useState([]);
    const minutesExp = get(selectedHsm, "extraSettings.codeExpirationMinutes", 0);

    const ParamsFooterFormat = (footerText) => {
        const parseTemplate = (footerText, minutes) => {
            let footerMinutes = "";
            if (!isEmpty(minutes)) {
                footerMinutes = footerText.replace("N", minutes);
            } else {
                footerMinutes = footerText;
            }

            return footerMinutes;
        };

        const minutes = isNaN(minutesExp) ? "0" : minutesExp.toString();

        return parseTemplate(footerText || "", minutes);
    };

    const hasButtons = () => {
        const data = get(selectedHsm, "buttons.buttons", get(selectedHsm, "buttons.buttonText", []));
        if (isNull(data)) {
            return false;
        } else if (isArray(data)) {
            return data.length > 0;
        }
        return false;
    };

    useEffect(() => {
        if (!isEmpty(selectedHsm)) {
            setHasButtonsFlag(hasButtons());

            const allParams = !isEmpty(selectedHsm.buttonParams) ? [...selectedHsm.params, ...selectedHsm.buttonParams] : selectedHsm.params;

            if (!isEmpty(allParams)) {
                setSelectAllParams(false);
            } else {
                setSelectAllParams(true);
            }
        }
    }, [selectedHsm]);

    const checkTypeFile = () => {
        if (selectedHsm.type === "IMAGE") {
            return 1;
        }
        if (selectedHsm.type === "DOCUMENT") {
            return 2;
        }
        if (selectedHsm.type === "VIDEO") {
            return 3;
        }
        return 0;
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    const previewButtonsOpt = (selectedHsm) => {
        let { buttons } = selectedHsm;
        return (
            <div style={{ overflowWrap: "anywhere" }} className="my-1 flex justify-center rounded-[0.625rem] bg-white px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">
                <CopyIcon className="stroke-current text-whatsapp-blue" width="1rem" height="1rem" />
                <div className="pl-1">{buttons[0].text}</div>
            </div>
        );
    };
    const previewActions = (selectedHsm) => {
        let { buttons } = selectedHsm;
        if (buttons.length > 1 && buttons[0].type === "URL") {
            buttons = [buttons[1], buttons[0]];
        }
        return (
            <div className="mt-2 flex max-w-lg flex-col">
                {buttons.map((actionBtn, index) => {
                    if (actionBtn.type === "PHONE_NUMBER") {
                        return (
                            <Tippy content={actionBtn.phone_number} theme="normal" placement="bottom">
                                <div
                                    key={`${index}-btn-action`}
                                    className={`${
                                        buttons.length > 1 ? "mb-2" : ""
                                    } flex items-center justify-center rounded-[0.625rem] bg-white/[.9] px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview`}
                                >
                                    <PhoneIcon width={16} height={16} className="mr-1" />
                                    {actionBtn.text}
                                </div>
                            </Tippy>
                        );
                    } else if (actionBtn.type === "URL") {
                        return (
                            <Tippy content={actionBtn.url} theme="normal" placement="bottom">
                                <div
                                    key={`${index}-btn-action`}
                                    className="flex items-center justify-center rounded-[0.625rem] bg-white/[.9] px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview"
                                >
                                    <LinkIcon width={16} height={16} className="mr-1" />
                                    {actionBtn.text}
                                </div>
                            </Tippy>
                        );
                    }
                    return <div></div>;
                })}
            </div>
        );
    };

    const previewButtons = (selectedHsm) => {
        const buttonsList = get(selectedHsm, "buttons", get(selectedHsm, "buttonText"));

        const length = buttonsList.length;
        switch (length) {
            case 1:
                return <div className="mt-2 flex max-w-lg justify-center rounded-[0.625rem] bg-white/[.9] px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">{buttonsList[0].text}</div>;
            case 2:
                return (
                    <div className="mt-2 flex w-full max-w-lg space-x-2">
                        {buttonsList.map((text, index) => {
                            return (
                                <div key={`btn-2-${index}`} className="flex w-1/2 justify-center rounded-[0.625rem] bg-white/[.9] px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">
                                    {text.text}
                                </div>
                            );
                        })}
                    </div>
                );
            default:
                return (
                    <div className="mt-2 flex max-w-lg flex-col">
                        <div className="mb-2 flex w-full space-x-2">
                            {buttonsList.map((text, index) => {
                                if (index === 2) {
                                    return null;
                                }
                                return (
                                    <div key={`btn-${index}`} className="flex w-1/2 justify-center rounded-[0.625rem] bg-white/[.9] px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">
                                        {text.text}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-center rounded-[0.625rem] bg-white/[.9] px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">{buttonsList[2].text}</div>
                    </div>
                );
        }
    };

    const renderStep = () => {
        switch (stepIndex) {
            case 0:
                return (
                    <div id="selectCampaignName" className="py-8">
                        <SelectCampaignName handleCampaign={handleCampaign} nextStep={nextStep} campaignName={campaignName} campaignDate={campaignDate} setCampaignDate={setCampaignDate} />
                    </div>
                );
            case 1:
                return (
                    <div id="selectMessage" className={`pt-8 ${stepIndex < 1 ? "invisible" : "fadeIn"}`}>
                        <SelectMessage
                            bots={bots || []}
                            currentBot={currentBot}
                            hsmArray={hsmArray}
                            handleHSM={handleHSM}
                            hsmValue={hsmValue}
                            selectedHsm={selectedHsm}
                            params={get(props, "selectedHsm.params", [])}
                            handleChange={handleChange}
                            template={selectedHsm.template}
                            nextStep={nextStep}
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
                            removeDocFile={removeDocFile}
                            showButtons={previewButtons}
                            previewActions={previewActions}
                            previewButtonsOpt={previewButtonsOpt}
                            setResponseType={setResponseType}
                            checkTypeFile={checkTypeFile}
                            onDocumentLoadSuccess={onDocumentLoadSuccess}
                            numPages={numPages}
                            hasButtonsFlag={hasButtonsFlag}
                            ParamsFooterFormat={ParamsFooterFormat}
                        />
                    </div>
                );
            case 2:
                return (
                    <div id="selectDestination" className={`py-8 px-10 ${stepIndex < 2 ? "invisible" : "fadeIn"}`}>
                        <SelectDestination
                            acceptString={acceptString}
                            handleFile={handleFile}
                            clickFilePicker={clickFilePicker}
                            fileName={fileName}
                            nextStep={nextStep}
                            selectedHsm={selectedHsm}
                            options={first(fileData)}
                            fileRows={fileData}
                            handleAsigned={handleAsigned}
                            handleChange={handleChange}
                            paramSelected={paramSelected}
                            setParamSelected={setParamSelected}
                            selectAllParams={selectAllParams}
                            setSelectAllParams={setSelectAllParams}
                            loadingFile={loadingFile}
                            setLoadingFile={setLoadingFile}
                            setArrayColumn={setArrayColumn}
                            removeFileDropped={removeFileDropped}
                        />
                    </div>
                );
            case 3:
                return (
                    <div id="selectMessage" className={`pt-8 ${stepIndex < 3 ? "invisible" : "fadeIn"}`}>
                        <CampaignSettings
                            currentBot={currentBot}
                            steps={steps}
                            setSteps={setSteps}
                            nextStep={nextStep}
                            response={response}
                            setResponse={setResponse}
                            handleOptionConfig={handleOptionConfig}
                            responseType={responseType}
                            setResponseType={setResponseType}
                            ttl={ttl}
                            setTtl={setTtl}
                            showOptions={showOptions}
                            setShowOptions={setShowOptions}
                            flowId={flowId}
                            setFlowId={setFlowId}
                            duration={duration}
                            setDuration={setDuration}
                            options={options}
                            setOptions={setOptions}
                            ttlValue={ttlValue}
                            setTtlValue={setTtlValue}
                            arrayColumn={arrayColumn}
                            setStoreParams={setStoreParams}
                            storeParams={storeParams}
                            setShowParams={setShowParams}
                            currentCompany={currentCompany}
                            selectedHsm={selectedHsm}
                            arrayButton={arrayButton}
                            setArrayButton={setArrayButton}
                            setShowButtons={setShowButtons}
                            settingConfig={settingConfig}
                            setSettingConfig={setSettingConfig}
                            setFlowBack={setFlowBack}
                            flowBack={flowBack}
                            setStepBack4={setStepBack4}
                            stepBack4={stepBack4}
                            setFlowsBack={setFlowsBack}
                            flowsBack={flowsBack}
                        />
                    </div>
                );
            case 4:
                return (
                    <div id="selectSend" className={`py-8 ${stepIndex < 4 ? "invisible" : "fadeIn"}`}>
                        <SelectSend
                            nextStep={nextStep}
                            campaignDate={campaignDate}
                            setCampaignDate={setCampaignDate}
                            selected={selected}
                            setSelected={setSelected}
                            sendHSM={sendHSM}
                            settings={settings}
                            setOpen={setOpen}
                            open={open}
                            selectedHsm={selectedHsm}
                            fileSize={fileSize}
                            setCampaignTime={setCampaignTime}
                            campaignName={campaignName}
                            setStepBack4={setStepBack4}
                        />
                    </div>
                );
            case 5:
                return (
                    <div id="CampaignDone" className={`mt-6 ${stepIndex < 5 ? "invisible" : "fadeIn"}`}>
                        <CampaignDone campaign={campaignName} steps={steps} setSteps={setSteps} setCampaignName={setCampaignName} resetValues={resetValues} />
                    </div>
                );
            default:
                break;
        }
    };

    const renderStepComplete = (step) => {
        switch (step.number) {
            case "1":
                return <dd className="mt-1 text-lg text-gray-400 sm:col-span-2 sm:mt-0">{step.inputData}</dd>;
            case "2": {
                const HSM_QUICKREPLY = selectedHsm.type === "HSM_QUICKREPLY";
                const ACTION_QUICKREPLY = `${get(selectedHsm, "interactiveAction", "")}`.toUpperCase() === "QUICK_REPLY";
                const ACTION_CALL = `${get(selectedHsm, "interactiveAction", "")}`.toUpperCase() === "CALL_TO_ACTION";
                const ACTION_OTP = `${get(selectedHsm, "interactiveAction", "")}`.toUpperCase() === "OTP";
                return (
                    <div>
                        <div className="mt-6 flex flex-1 justify-between sm:mt-0 sm:flex-row sm:justify-start">
                            <div className="flex h-full flex-col">
                                <div className="text-left text-15 font-bold text-gray-400">{"Vista Previa"}</div>
                                <div className="img-whatsapp flex h-full max-w-sm flex-col justify-center rounded-lg bg-opacity-50 py-8 px-4 text-sm">
                                    <div className="max-w-lg">
                                        <div className="rounded-left-bubble bg-white px-4 py-2 leading-relaxed text-black shadow-preview">
                                            {checkTypeFile() === 1 && mediaUrlMessage && (
                                                <img
                                                    // onLoad={handleUploadImage}
                                                    className="max-h-[10rem] w-full rounded-lg object-contain p-0.25"
                                                    src={mediaUrlMessage}
                                                    alt="preview"
                                                />
                                            )}
                                            {checkTypeFile() === 3 && mediaUrlMessage && (
                                                <video
                                                    // onLoad={handleUploadImage}
                                                    className="max-h-[14rem] w-full rounded-lg object-contain p-0.25"
                                                    alt="preview"
                                                    controls
                                                >
                                                    <source src={mediaUrlMessage} type="video/mp4"></source>
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                            {checkTypeFile() === 2 && mediaUrlMessage && (
                                                <div className="max-h-[10rem] w-full overflow-hidden rounded-lg object-contain p-0.25" alt="preview document">
                                                    <AutoSizer disableHeight>
                                                        {({ width }) => (
                                                            <Document
                                                                file={mediaUrlMessage}
                                                                onLoadSuccess={onDocumentLoadSuccess}
                                                                // loading={renderBeatLoader}
                                                            >
                                                                {[...Array(numPages).keys()].map((i) => (
                                                                    <Page key={i} pageNumber={i + 1} width={width} />
                                                                ))}
                                                                <Page key={1} pageNumber={1} />
                                                            </Document>
                                                        )}
                                                    </AutoSizer>
                                                </div>
                                            )}
                                            <div className={checkTypeFile() === 1 || checkTypeFile() === 2 ? "mt-1" : ""}>
                                                <h5 className="py-2 text-15 font-bold">{selectedHsm.header}</h5>
                                                {formatMessage(selectedHsm.template)}
                                                <h6 className="py-2 text-xs text-gray-400">{ParamsFooterFormat(selectedHsm.footer)}</h6>
                                            </div>
                                        </div>
                                        {(HSM_QUICKREPLY || hasButtonsFlag) && ACTION_QUICKREPLY && previewButtons(selectedHsm.buttons)}
                                        {(HSM_QUICKREPLY || hasButtonsFlag) && ACTION_CALL && previewActions(selectedHsm.buttons)}
                                        {(HSM_QUICKREPLY || hasButtonsFlag) && ACTION_OTP && previewButtonsOpt(selectedHsm.buttons)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            case "3": {
                const allParams = !isEmpty(selectedHsm.buttonParams) ? [...selectedHsm.params, ...selectedHsm.buttonParams] : selectedHsm.params;

                return (
                    <div className="mr-5 flex w-4/5 flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <p className="mb-3 text-xl font-bold text-gray-400">{t("templateViewer.receiptsTable")}</p>
                                <div className="border-options mb-5 overflow-hidden sm:rounded-lg">
                                    <table className="divide-y min-w-full divide-gray-200">
                                        <thead className="border-b-1 border-gray-100 border-opacity-25 bg-gray-38 bg-opacity-40 font-medium">
                                            <tr>
                                                {[{ param: "0", label: t("templateViewer.phone") }].concat(allParams).map((param, index) => {
                                                    return (
                                                        <th
                                                            key={index.toString()}
                                                            scope="col"
                                                            className="h-10 px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400 text-opacity-75"
                                                        >
                                                            {get(param, "label")}
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fileData.slice(1, fileData.length > 5 ? 6 : fileData.length).map((row, index) => (
                                                <tr key={index.toString()} className={`${index % 2}` ? `bg-white` : `bg-gray-400/25`}>
                                                    {paramSelected.map((field, fieldIndex) =>
                                                        fieldIndex === 0 ? (
                                                            <td key={fieldIndex.toString()} className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-475">
                                                                {row[0]}
                                                            </td>
                                                        ) : field === 0 ? (
                                                            <td key={fieldIndex.toString()} className="whitespace-nowrap px-4 py-4 text-sm text-gray-600"></td>
                                                        ) : (
                                                            <td key={fieldIndex.toString()} className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                                                                {row[field]}
                                                            </td>
                                                        )
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <span className="mt-2 text-base text-gray-400">{t("templateViewer.total")} </span>
                                <span className="text-semibold mt-2 text-gray-400">{fileData.length - 1}</span>
                            </div>
                        </div>
                    </div>
                );
            }
            case "4":
                return (
                    <div>
                        {responseType === RESPONSE_TYPES.FLOW ? (
                            <div className="mb-4 text-base text-gray-400">
                                <div className="mb-4 font-semibold">{t("templateViewer.flow")}:</div>
                                {step.inputData}
                            </div>
                        ) : responseType === RESPONSE_TYPES.INPUT ? (
                            <div className="mb-4 text-base text-gray-400">
                                <div className="mb-4 font-semibold">{t("templateViewer.question")}:</div>
                                {step.inputData}
                            </div>
                        ) : responseType === RESPONSE_TYPES.OPTIONS ? (
                            <div className="my-2 text-base text-gray-900">
                                <div className="font-semibold text-gray-400">{t("templateViewer.options")}:</div>
                                <div className="border-options my-4 sm:rounded-lg">
                                    <table className="divide-y min-w-full divide-gray-200">
                                        <thead className="bg-gray-10">
                                            <tr>
                                                <th className="h-10 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 text-opacity-75">{t("templateViewer.name")}</th>
                                                <th className="h-10 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 text-opacity-75">{t("templateViewer.flow")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {showOptions.map((option) => (
                                                <tr key={option.id}>
                                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-475">{option.title}</td>
                                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-475">{option.flowName}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : responseType === RESPONSE_TYPES.BUTTONS ? (
                            <div className="my-2 text-base text-gray-900">
                                <div className="font-semibold text-gray-400">{t("templateViewer.buttons")}:</div>
                                <div className="border-options my-4 sm:rounded-lg">
                                    <table className="divide-y min-w-full divide-gray-200">
                                        <thead className="bg-gray-10">
                                            <tr>
                                                <th className="h-10 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 text-opacity-75">{t("templateViewer.name")}</th>
                                                <th className="h-10 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 text-opacity-75">{t("templateViewer.flow")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {showButtons.map((button, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-400">{button.action}</td>
                                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-400">{button.flowName}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : null}
                        {responseType === RESPONSE_TYPES.INPUT || responseType === RESPONSE_TYPES.OPTIONS ? (
                            <div className="mb-4 text-base text-gray-400">
                                <div className="mb-4 font-semibold">{t("templateViewer.duration")}:</div> {ttlValue.number} {ttlValue.unit}
                            </div>
                        ) : null}
                        {showParams.length !== 0 ? (
                            <div className="my-4 text-base text-gray-375">
                                <div className="font-semibold text-gray-400">{t("templateViewer.additionParams")}:</div>
                                <div className="border-options my-5 sm:rounded-lg">
                                    <table className="divide-y min-w-full divide-gray-200">
                                        <thead className="bg-gray-10">
                                            <tr>
                                                <th className="h-10 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 text-opacity-75">{t("templateViewer.fieldName")}</th>
                                                <th className="h-10 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 text-opacity-75">{t("templateViewer.field")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {showParams.map((param) => (
                                                <tr key={param.id}>
                                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-400">{param.nameField}</td>
                                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium italic text-gray-400">{`{` + param.field + `}`}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : null}
                    </div>
                );
            case "5":
                return (
                    <RadioGroup value={selected} onChange={setSelected}>
                        <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
                        <RadioGroup.Option
                            key={selected.name}
                            value={selected}
                            className="relative z-10 flex cursor-pointer rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-md border-1 border-indigo-200 bg-indigo-50 p-4 focus:outline-none"
                        >
                            <>
                                <span
                                    className="ring-2 mt-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-1 border-transparent bg-primary-200 ring-offset-2"
                                    aria-hidden="true"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                </span>
                                <div className="ml-3 flex flex-col">
                                    <RadioGroup.Label as="span" className="block text-sm font-medium text-primary-200">
                                        {selected.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description as="span" className="block text-sm text-gray-textsecondary">
                                        {selected.description}
                                    </RadioGroup.Description>
                                </div>
                            </>
                        </RadioGroup.Option>
                    </RadioGroup>
                );
            default:
                break;
        }
    };
    return (
        <div className="my-8 w-full max-w-6xl rounded-md bg-white">
            <br />

            <div className="mb-12">
                <div className="flex items-center">
                    <div className="text-4xl font-bold leading-loose text-gray-400">{t("templateViewer.hello")}</div>
                    <span role="img" aria-label="hi" className="text-3xl font-bold text-gray-400">
                        👋
                    </span>
                </div>
                <div className="mt-2 text-lg font-medium text-gray-450">{t("templateViewer.startCampaign")}</div>
            </div>

            <div className="mt-8">
                <nav aria-label="Progress">
                    <ol className="">
                        {/* overflow-hedden */}
                        {steps.map((step, stepIdx) => (
                            <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? "pb-10" : "", "relative")}>
                                {step.status === "complete" ? (
                                    <>
                                        {stepIdx !== steps.length - 1 ? (
                                            <>
                                                <div className="-ml-px absolute top-0 left-4 mt-5 h-full w-0.25 bg-primary-200" aria-hidden="true" />
                                                <div className="-ml-py absolute top-0 left-4 mt-5 h-0.25 w-6 bg-primary-200" aria-hidden="true" />
                                            </>
                                        ) : null}
                                        <div className="group relative ml-4 flex items-center">
                                            <span className="flex h-9 items-center">
                                                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary-200 text-white">{step.number}</span>
                                            </span>
                                            <span className="ml-4 flex min-w-0 flex-col">
                                                <span className="text-xs font-bold uppercase tracking-wide text-gray-400">{step.name}</span>
                                                <span className="text-sm text-gray-400 text-opacity-75">{step.description}</span>
                                            </span>
                                        </div>
                                        <div className="ml-16 mt-6 flex flex-1 justify-between sm:flex-row sm:justify-start">{renderStepComplete(step)}</div>
                                    </>
                                ) : step.status === "current" ? (
                                    <>
                                        {stepIdx !== steps.length - 1 ? (
                                            <>
                                                <div className="-ml-px absolute top-0 left-4 mt-5 h-full w-0.25 bg-gray-300" aria-hidden="true" />
                                                <div className="-ml-py absolute top-0 left-4 mt-5 h-0.25 w-8 bg-gray-300" aria-hidden="true" />
                                            </>
                                        ) : (
                                            <div className="-ml-py absolute top-0 left-4 mt-5 h-0.25 w-6 bg-primary-200" aria-hidden="true" />
                                        )}
                                        <div className="group relative ml-4 flex items-center" aria-current="step">
                                            <span className="flex h-9 items-center" aria-hidden="true">
                                                <Stepper number={step.number}></Stepper>
                                            </span>
                                            <span className="ml-4 flex min-w-0 flex-col">
                                                <span className="text-xs font-bold uppercase tracking-wide text-primary-200">{step.name}</span>
                                                <span className="text-sm text-gray-400 text-opacity-75">{step.description}</span>
                                            </span>
                                        </div>
                                        {stepIdx === 6 && <div className="-ml-py absolute top-4 left-4 mt-4 h-0.25 w-4 bg-primary-200" aria-hidden="true" />}
                                        {renderStep()}
                                    </>
                                ) : (
                                    <>
                                        {stepIdx !== steps.length - 1 ? (
                                            <div className="-ml-px absolute top-0 left-4 mt-5 h-full w-0.25 bg-gray-300" aria-hidden="true" />
                                        ) : (
                                            <div className="-ml-py absolute top-0 left-4 mt-5 h-0.25 w-4 bg-gray-300" aria-hidden="true" />
                                        )}
                                        <div className="group relative ml-4 flex items-center">
                                            <span className="flex h-9 items-center" aria-hidden="true">
                                                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                                                    <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                                                </span>
                                            </span>
                                            <span className="ml-4 flex min-w-0 flex-col">
                                                <span className="text-xs font-bold uppercase tracking-wide text-gray-400 text-opacity-75">{step.name}</span>
                                                <span className="text-sm text-gray-400 text-opacity-75">{step.description}</span>
                                            </span>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
            <ToastContainer />
            <br />
            <br />
            <br />
        </div>
    );
};

export default TemplateViewer;
