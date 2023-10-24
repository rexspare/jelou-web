/* eslint-disable react-hooks/exhaustive-deps */
// import './SelectStyle.scss';
import { FileDrop } from "react-file-drop";

import { BarLoader, BeatLoader } from "react-spinners";

import { formatMessage } from "@apps/shared/utils";

import get from "lodash/get";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";

import { ComboboxSelect } from "@apps/shared/common";
import { CancelIcon } from "@apps/shared/icons";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import AutoSizer from "react-virtualized-auto-sizer";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const acceptImage = [".png", ".jpg"];
const acceptDoc = [".pdf"];
const acceptVideo = [".mp4"];

const SelectMessage = (props) => {
    const {
        handleChange,
        hsmArray,
        handleHSM,
        selectedHsm,
        template,
        loading,
        nextStep,
        handleCompany,
        subCompanies,
        loadingBots,
        loadingHsm,
        currentCompany,
        setParamSelected,
        clickFilePicker,
        mediaFileName,
        handleDocFile,
        loadingMedia,
        mediaUrlMessage,
        setMediaUrlMessage,
        setMediaUrlType,
        currentBot,
        bots,
        removeDocFile,
        showButtons,
        setResponseType,
        checkTypeFile,
        onDocumentLoadSuccess,
        numPages,
        previewActions,
        previewButtonsOpt,
        hasButtonsFlag,
        ParamsFooterFormat,
    } = props;

    const { t } = useTranslation();
    const enable = selectedHsm.type !== "HSM" ? !isEmpty(mediaFileName) && !isEmpty(mediaUrlMessage) : !isEmpty(get(selectedHsm, "elementName", []));

    const HSM_QUICKREPLY = selectedHsm.type === "HSM_QUICKREPLY";
    const ACTION_QUICKREPLY = `${get(selectedHsm, "interactiveAction", "")}`.toUpperCase() === "QUICK_REPLY";
    const ACTION_CALL = `${get(selectedHsm, "interactiveAction", "")}`.toUpperCase() === "CALL_TO_ACTION";
    const ACTION_OTP = `${get(selectedHsm, "interactiveAction", "")}`.toUpperCase() === "OTP";

    const gotNext = () => {
        selectedHsm.buttonParams = selectedHsm.buttonParams ?? [];
        if (selectedHsm.params || !isEmpty(selectedHsm.buttonParams)) {
            const extraParamsLength = has(selectedHsm, "buttonParams") ? selectedHsm.buttonParams.length : 0;
            setParamSelected(new Array(selectedHsm.params.length + extraParamsLength + 1).fill(0));
        } else {
            setParamSelected([0]);
        }
        HSM_QUICKREPLY || ACTION_QUICKREPLY || ACTION_CALL || ACTION_OTP ? setResponseType("BUTTONS") : setResponseType("");
        nextStep(2);
    };

    const gotPrevious = () => {
        nextStep(0);
    };

    const onDrop = (files) => {
        const dropFile = { target: { files: files } };
        handleDocFile(dropFile);
    };

    const inputAcceptType = (type) => {
        switch (type) {
            case 1:
                return acceptImage;
            case 2:
                return acceptDoc;
            case 3:
                return acceptVideo;
            default:
                return "";
        }
    };
    const mediaUrlType = (type) => {
        switch (type) {
            case 1:
                setMediaUrlType("image");
                break;
            case 2:
                setMediaUrlType("document");
                break;
            case 3:
                setMediaUrlType("video");
                break;
            default:
                setMediaUrlType("");
        }
    };

    useEffect(() => {
        mediaUrlType(checkTypeFile());
        if (checkTypeFile() === 0) {
            setMediaUrlMessage(null);
        }
    }, [selectedHsm]);

    return (
        <div className="min-h-1/2 flex w-full flex-row" id="select-campaign">
            <span className="w-20" />
            <div className="w-full pb-4 pr-2">
                <div className="mb-2">
                    <p className="text-2xl font-bold text-gray-400">{t("selectMessage.selectMessage")}</p>
                    <p className="mt-2 text-sm text-gray-450">{t("selectMessage.messageInitial")}</p>
                </div>
                <div className="flex flex-col">
                    <div className="border-options mx-auto flex w-full rounded-md py-6 px-4 xxl:px-8" style={{ backgroundColor: "#FAFCFF" }}>
                        <div className="flex w-full flex-row justify-between">
                            <div className="mr-5 flex w-1/2 flex-col">
                                {subCompanies.length > 1 && (
                                    <div className="mb-10">
                                        <ComboboxSelect
                                            options={subCompanies}
                                            value={!isEmpty(currentCompany) ? currentCompany : ""}
                                            label={t("selectMessage.company")}
                                            handleChange={handleCompany}
                                            name={"bot"}
                                            background={"#FAFCFF"}
                                            hasCleanFilter={false}
                                            // clearFilter={clearFilterBot}
                                        />
                                    </div>
                                )}
                                {bots.length > 1 && (
                                    <div className="mb-10">
                                        {/* <p className="text-left text-15 font-bold text-gray-400">{t("selectMessage.selectBot")}</p> */}
                                        {loadingBots ? (
                                            <div className="border-b flex h-11 w-full flex-row items-center justify-center border-gray-35">
                                                <BarLoader size={"1.875rem"} color="#00b3c7" />
                                            </div>
                                        ) : (
                                            <ComboboxSelect
                                                options={bots}
                                                value={currentBot}
                                                label={t("selectMessage.botSelect")}
                                                handleChange={handleChange}
                                                name={"bot"}
                                                background={"#FAFCFF"}
                                                hasCleanFilter={false}
                                                // clearFilter={clearFilterBot}
                                            />
                                        )}
                                    </div>
                                )}

                                <div className="mb-6">
                                    {/* <p className="text-left text-base font-bold text-gray-400">{t("selectMessage.selectMessage")}</p> */}
                                    {loadingHsm ? (
                                        <div className="border-b flex h-11 w-full flex-row items-center justify-center border-gray-35">
                                            <BarLoader size={"1.875rem"} color="#00b3c7" />
                                        </div>
                                    ) : !isEmpty(get(selectedHsm, "name", [])) ? (
                                        <ComboboxSelect
                                            options={hsmArray}
                                            value={selectedHsm}
                                            label={t("selectMessage.message")}
                                            handleChange={handleHSM}
                                            name={"bot"}
                                            background={"#FAFCFF"}
                                            hasCleanFilter={false}
                                            // clearFilter={clearFilterBot}
                                        />
                                    ) : (
                                        <div className="border-b mb-16 flex flex-row items-center border-gray-35">
                                            {" "}
                                            <div className="mr-2 flex h-12 w-full items-center truncate py-2 px-5 text-15 font-normal text-gray-450">{t("selectMessage.notFoundHsm")}</div>
                                        </div>
                                    )}
                                </div>
                                {checkTypeFile() !== 0 && (
                                    <div className="my-2 h-48 rounded-lg border-2 border-dotted border-gray-60 bg-hover-conversation">
                                        <p className="mt-2 ml-2 text-left text-base font-bold text-gray-400">
                                            {t("selectMessage.attach")} {checkTypeFile() === 1 && t("selectMessage.image")}
                                            {checkTypeFile() === 2 && t("selectMessage.document")}
                                            {checkTypeFile() === 3 && t("selectMessage.video")}
                                        </p>
                                        <FileDrop className="w-full" onDrop={(files) => onDrop(files)}>
                                            <div className="flex">
                                                <div className="ml-5 mt-4 flex flex-col overflow-hidden	" style={{ color: "#9CB4CD" }}>
                                                    <p className="text-sm font-medium lg:text-justify">
                                                        {checkTypeFile() === 1 && `JPG/PNG`}
                                                        {checkTypeFile() === 2 && `PDF`}
                                                        {checkTypeFile() === 3 && `MP4`}
                                                    </p>
                                                    <input className="hidden" type="file" name="avatar" accept={inputAcceptType(checkTypeFile())} onChange={handleDocFile} id="file-picker" />
                                                    <p className="text-sm font-medium lg:text-justify">{t("selectMessage.searchFile")}</p>
                                                    <button
                                                        className="mx-24 my-2 h-12 w-40 cursor-pointer justify-items-center rounded-full bg-gray-border py-2 text-base font-medium text-gray-75 hover:bg-primary-200 hover:text-white focus:outline-none focus:ring-4"
                                                        onClick={() => clickFilePicker()}
                                                    >
                                                        {t("selectMessage.search")}
                                                    </button>
                                                    {loadingMedia ? (
                                                        <div className="mt-4 flex h-auto w-full flex-row items-center justify-center">
                                                            <BarLoader size={"2.25rem"} color="#00b3c7" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-11/12 text-sm font-medium lg:text-justify" style={{ color: "#9CB4CD" }}>
                                                            <div className="flex flex-row">
                                                                {mediaFileName ? (
                                                                    <>
                                                                        <p className="overflow-hidden truncate">{mediaFileName}</p>
                                                                        <button
                                                                            className="ml-2"
                                                                            onClick={() => {
                                                                                removeDocFile();
                                                                            }}
                                                                        >
                                                                            <CancelIcon />
                                                                        </button>
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </FileDrop>
                                    </div>
                                )}
                            </div>
                            <div className="ml-5 flex h-full w-1/2 flex-col">
                                <div className="text-left text-15 font-bold text-gray-400">{t("selectMessage.preview")}</div>
                                <div className="img-whatsapp flex h-full flex-col justify-center rounded-lg bg-opacity-50 py-8 px-4 text-sm">
                                    <div className="max-w-lg">
                                        <div className="rounded-left-bubble bg-white px-4 py-2 leading-relaxed text-black shadow-preview">
                                            {checkTypeFile() === 1 && mediaUrlMessage && (
                                                <>
                                                    {false && <BeatLoader size={"0.5rem"} color="#00B3C7" />}
                                                    <img
                                                        // onLoad={handleUploadImage}
                                                        className="max-h-[10rem] w-full rounded-lg object-contain p-0.25"
                                                        src={mediaUrlMessage}
                                                        alt="preview"
                                                    ></img>
                                                </>
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
                                                {formatMessage(template)}
                                                <h6 className="py-2 text-xs text-gray-400">{ParamsFooterFormat(selectedHsm.footer)}</h6>
                                            </div>
                                        </div>
                                        {(HSM_QUICKREPLY || hasButtonsFlag) && ACTION_QUICKREPLY && showButtons(selectedHsm.buttons)}
                                        {(HSM_QUICKREPLY || hasButtonsFlag) && ACTION_CALL && previewActions(selectedHsm.buttons)}
                                        {(HSM_QUICKREPLY || hasButtonsFlag) && ACTION_OTP && previewButtonsOpt(selectedHsm.buttons)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto mt-2 flex w-full justify-end">
                        <button className="mt-3 h-12 w-40 rounded-full text-sm font-bold text-gray-450 focus:outline-none focus:ring-4" onClick={gotPrevious}>
                            {t("buttons.back")}
                        </button>
                        <button
                            className={`button-primary mt-3 h-12 w-40 !rounded-full text-sm text-white focus:outline-none focus:ring-4 ${enable ? "bg-primary-200" : "cursor-not-allowed bg-gray-60"}`}
                            onClick={gotNext}
                            disabled={!enable}
                        >
                            {loading ? <BeatLoader color={"white"} /> : t("buttons.next")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectMessage;
