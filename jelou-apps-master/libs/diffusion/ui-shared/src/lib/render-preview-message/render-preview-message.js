import { CopyIcon, ErrorIcon, AlertCircleYellow } from "@apps/shared/icons";
import get from "lodash/get";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import { BeatLoader } from "react-spinners";

import { formatTemplateMessage } from "@apps/shared/utils";
import { LinkIcon, PhoneIcon } from "@heroicons/react/solid";
import Tippy from "@tippyjs/react";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import AutoSizer from "react-virtualized-auto-sizer";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const RenderPreviewMessage = (props) => {
    const { paramsNew, inputNames, mediaUrl = "", isPreviewImageUploaded, renderBeatLoader } = props;
    const [numPages, setNumPages] = useState(null);
    let array = isEmpty(paramsNew) ? [] : paramsNew;
    const minutesExp = get(props.template, "extraSettings.codeExpirationMinutes", 0);

    const isImage = (url) => {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(`${url}`.toLowerCase());
    };
    const isMediaUrlImage = isImage(mediaUrl);

    const hasButtons = () => {
        const data = get(props, "template.buttons.buttons", []);
        const dataOld = get(props, "template.buttons.buttonText", []);
        if (data.length > dataOld.length) {
            if (isNull(data)) {
                return false;
            } else if (isArray(data)) {
                return data.length > 0;
            }
            return false;
        } else {
            if (isNull(dataOld)) {
                return false;
            } else if (isArray(dataOld)) {
                return dataOld.length > 0;
            }
            return false;
        }
    };
    const hasButtonsFlag = hasButtons();

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

    const previewButtons = (selectedHsm) => {
        let { buttons = [], buttonText = [] } = get(selectedHsm, "buttons", { buttons: [{ text: "N/A" }] });
        const length = buttons.length > buttonText.length ? buttons.length : buttonText.length;
        if (buttonText.length > buttons.length) {
            buttons = buttonText.map((text) => {
                return {
                    text: text,
                };
            });
        }
        switch (length) {
            case 1:
                return <div className="mt-2 flex max-w-lg justify-center rounded-[0.625rem] bg-white/[.9] px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">{buttons[0].text}</div>;
            case 2:
                return (
                    <div className="mt-2 flex w-full max-w-lg space-x-2">
                        {buttons.map((text, index) => {
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
                            {buttons.map((text, index) => {
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
                        <div className="flex justify-center rounded-[0.625rem] bg-white/[.9] px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">{buttons[2].text}</div>
                    </div>
                );
        }
    };

    const previewButtonsOpt = (selectedHsm) => {
        let { buttons } = selectedHsm.buttons;
        return (
            <div style={{ overflowWrap: "anywhere" }} className="my-1 flex justify-center rounded-[0.625rem] bg-white px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">
                <CopyIcon className="stroke-current text-whatsapp-blue" width="1rem" height="1rem" />
                <div className="pl-1">{buttons[0].text}</div>
            </div>
        );
    };

    const previewActions = (selectedHsm) => {
        let { buttons } = selectedHsm.buttons;
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

    const ParamsFormat = (props) => {
        const parseTemplate = (template, params) => {
            let tempString = template;
            if (!isEmpty(params)) {
                params.forEach((param) => {
                    tempString = tempString.replace(`{{${param.param}}}`, `{{ ${param.label} }}`);
                });
                return tempString;
            }
            return template;
        };
        return formatTemplateMessage(parseTemplate(props.template || "", array), "break-words max-w-full text-base whitespace-normal px-2");
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const format_message = ParamsFormat(props.template, array);

    const IMAGE = props.template.type === "IMAGE";
    const DOCUMENT = props.template.type === "DOCUMENT";
    const HSM_QUICKREPLY = props.template.type === "HSM_QUICKREPLY";
    const VIDEO = props.template.type === "VIDEO";

    const ACTION_QUICKREPLY = `${get(props, "template.interactiveAction", "")}`.toUpperCase() === "QUICK_REPLY";
    const ACTION_CALL = `${get(props, "template.interactiveAction", "")}`.toUpperCase() === "CALL_TO_ACTION";
    const ACTION_OTP = `${get(props, "template.interactiveAction", "")}`.toUpperCase() === "OTP";

    return (
        <div className="img-whatsapp mx-auto block h-full max-h-xsm max-w-lg flex-col justify-center overflow-auto rounded-lg bg-opacity-50 py-8 px-4 text-sm">
            <div className="m-auto max-w-lg">
                <div className="flex flex-col rounded-right-bubble bg-white/[.9] px-4 py-2 leading-relaxed text-black shadow-preview">
                    {IMAGE && !isMediaUrlImage && (
                        <div className="mt-2 flex h-10 items-center rounded-[0.8125rem] text-sm font-extrabold text-red-700">
                            <div className="mr-2">
                                <ErrorIcon stroke="#c53030" strokeWidth="2" />
                            </div>
                            {inputNames.noPreview}
                        </div>
                    )}
                    {IMAGE && isMediaUrlImage && (
                        <>
                            {!isPreviewImageUploaded && <BeatLoader size={"0.5rem"} color="#00B3C7" />}
                            <img
                                // ref={ref}
                                onLoad={props.handleUploadImage}
                                className="max-h-[10rem] w-full rounded-lg object-cover p-0.25"
                                src={props.mediaUrl}
                                alt="preview"
                            ></img>
                        </>
                    )}
                    {VIDEO && mediaUrl && (
                        <video
                            // ref={ref}
                            onLoad={props.handleUploadImage}
                            className="max-h-[10rem] w-full rounded-lg object-cover p-0.25"
                            alt="preview"
                            controls
                        >
                            <source src={props.mediaUrl} type="video/mp4"></source>
                            Your browser does not support the video tag.
                        </video>
                    )}
                    {DOCUMENT && (
                        <div className="max-h-[10rem] w-full overflow-hidden rounded-lg object-cover p-0.25" alt="preview document">
                            { mediaUrl ? (
                                    <AutoSizer disableHeight>
                                        {({ width }) => (
                                                <Document file={mediaUrl} onLoadSuccess={onDocumentLoadSuccess} loading={renderBeatLoader}>
                                                {[...Array(numPages).keys()].map((i) => (
                                                    <Page key={i} pageNumber={i + 1} width={width} />
                                                ))}
                                                </Document>
                                        )}
                                    </AutoSizer>
                                ): (    
                                    <div className="mt-2 flex h-10 items-center rounded-[0.8125rem] text-sm font-extrabold text-red-700">
                                        <div className="mr-2">
                                            <ErrorIcon stroke="#c53030" strokeWidth="2" />
                                        </div>
                                        {inputNames.noPreview}
                                    </div> 
                                )
                            }
                        </div>
                    )}

                    <div className={IMAGE || DOCUMENT || VIDEO ? "mt-1" : ""}>
                        <h5 className="py-2 pl-2 text-15 font-bold">{props.template.header}</h5>
                        {format_message}
                        <h6 className="py-2 pl-2 text-xs text-gray-400">{minutesExp !== 0 ? ParamsFooterFormat(props.template.footer) : props.template.footer}</h6>
                    </div>
                </div>
            </div>
            {/* {(HSM_QUICKREPLY || hasButtonsFlag) && previewButtons(props.template.buttons)} */}
            {(HSM_QUICKREPLY || hasButtonsFlag) && ACTION_QUICKREPLY && previewButtons(props.template)}
            {(HSM_QUICKREPLY || hasButtonsFlag) && ACTION_CALL && previewActions(props.template)}
            {(HSM_QUICKREPLY || hasButtonsFlag) && ACTION_OTP && previewButtonsOpt(props.template)}
        </div>
    );
};

const customComparator = (prevProps, nextProps) => {
    return nextProps.isPreviewImageUploaded === prevProps.isPreviewImageUploaded;
};

export default React.memo(RenderPreviewMessage, customComparator);
