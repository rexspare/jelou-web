import { CopyIcon, JelouImg } from "@apps/shared/icons";
import { formatTemplateMessage } from "@apps/shared/utils";
import { LinkIcon, PhoneIcon } from "@heroicons/react/solid";
import Tippy from "@tippyjs/react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React from "react";

const MAX_TEXT = 579;
const MAX_TEXT_WITH_MULTIMEDIA = 239;
const HSM_FILE_TYPE = "HSM";
const NO_TYPE_SELECTED = "NONE";

export function Preview(props) {
    const { t, values, array, mediaUrlMessage, fileType, buttonsHsm, selectedType } = props;
    const content = get(values, "template", "");
    const contentExample = get(values, "templateExample", "");
    const header = get(values, "header", "");
    const footer = get(values, "footer", "");
    const minutesExp = get(values, "extraSettings.codeExpirationMinutes", "");
    const countScroll = content.length + header.length + footer.length;
    const nameBotuttonAuth = get(buttonsHsm[0], "text", "");

    const videoRef = React.useRef();

    React.useEffect(() => {
        if (fileType === ".mp4") videoRef.current?.load();
    }, [mediaUrlMessage, fileType]);

    React.useEffect(() => {
        if (!isEmpty(array)) {
            const paramSet = new Set();
            let textCopy = contentExample;
            let stillHas = textCopy.search(/{{[1-9]}}/);
            for (let i = 0; i < array.length; i++) {
                if (stillHas >= 0) {
                    paramSet.add(textCopy.slice(stillHas, stillHas + 5));
                } else {
                    break;
                }
                textCopy = textCopy.replace(/{{[[1-9]}}/, `param`);
                stillHas = textCopy.search(/{{[1-9]}}/);
            }
        }
    }, []);

    const ParamsFormat = (templateObj) => {
        const parseTemplate = (template, params) => {
            let tempString = template;
            if (!isEmpty(params)) {
                params.forEach((param) => {
                    if (!isEmpty(param.example)) {
                        tempString = tempString.replaceAll(`{{${param.param}}}`, `{{${param.example}}}`);
                    }
                });
                return tempString;
            }
            return template;
        };
        return formatTemplateMessage(parseTemplate(templateObj || "", array), "break-words max-w-full text-15 whitespace-pre-wrap");
    };

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

    const previewContent = () => {
        return !isEmpty(content) || !isEmpty(header) || !isEmpty(footer) ? (
            <React.Fragment>
                <h5 className="py-2 text-15 font-bold">{header}</h5>
                <div className="text-15">{ParamsFormat(contentExample)}</div>
                <h6 className="py-2 text-xs text-gray-400">{ParamsFooterFormat(footer)}</h6>
            </React.Fragment>
        ) : (
            <p> {t("hsm.createTemplateModal.labelContent")}</p>
        );
    };
    const previewButtons = () => {
        const length = buttonsHsm.length;
        switch (length) {
            case 0:
                return <div></div>;
            case 1:
                return (
                    <div style={{ overflowWrap: "anywhere" }} className="my-1 flex justify-center rounded-[0.625rem] bg-white px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">
                        {buttonsHsm[0].text}
                    </div>
                );
            case 2:
                return (
                    <div className="my-2 flex w-full space-x-2">
                        {buttonsHsm.map((text, index) => {
                            return (
                                <div
                                    key={`button-${index}`}
                                    style={{ overflowWrap: "anywhere" }}
                                    className="flex w-1/2 justify-center rounded-[0.625rem] bg-white px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview"
                                >
                                    {text.text}
                                </div>
                            );
                        })}
                    </div>
                );
            default:
                return (
                    <div className="my-1 flex flex-col">
                        <div className=" mb-2 flex w-full space-x-2">
                            {buttonsHsm.map((text, index) => {
                                if (index === 2) {
                                    return null;
                                }
                                return (
                                    <div
                                        key={`${index}`}
                                        style={{ overflowWrap: "anywhere" }}
                                        className="flex w-1/2 justify-center rounded-[0.625rem] bg-white px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview"
                                    >
                                        {text.text}
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ overflowWrap: "anywhere" }} className="flex justify-center rounded-[0.625rem] bg-white px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">
                            {buttonsHsm[2].text}
                        </div>
                    </div>
                );
        }
    };

    const previewActions = () => {
        return (
            <div className="my-1 flex max-w-lg flex-col">
                {buttonsHsm.map((actionBtn, index) => {
                    if (actionBtn.type === "PHONE_NUMBER") {
                        return (
                            <Tippy content={actionBtn.phone_number} theme="normal" placement="bottom">
                                <div
                                    key={`${index}-btn-action`}
                                    className={`${
                                        buttonsHsm.length > 1 ? "mt-1" : ""
                                    } mb-[0.15rem] flex items-center justify-center rounded-[0.625rem] bg-white/[.9] px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview`}
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
                                    className="mb-[0.15rem] flex items-center justify-center rounded-[0.625rem] bg-white/[.9] px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview"
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
    const previewButtonsOpt = () => {
        return (
            <div style={{ overflowWrap: "anywhere" }} className="my-1 flex justify-center rounded-[0.625rem] bg-white px-4 py-2 text-15 font-medium text-whatsapp-blue shadow-preview">
                <CopyIcon className="stroke-current text-whatsapp-blue" width="1rem" height="1rem" />
                <div className="pl-1">{nameBotuttonAuth}</div>
            </div>
        );
    };
    const validateScrollPrev = () => {
        if (countScroll > MAX_TEXT && fileType === HSM_FILE_TYPE && selectedType.id === NO_TYPE_SELECTED) {
            return "h-88 overflow-y-scroll";
        } else if (countScroll > MAX_TEXT_WITH_MULTIMEDIA && fileType !== HSM_FILE_TYPE) {
            return "h-[28rem] overflow-y-scroll";
        } else if (countScroll > MAX_TEXT && fileType === HSM_FILE_TYPE && selectedType.id !== NO_TYPE_SELECTED) {
            return "h-82 overflow-y-scroll";
        } else if (countScroll > MAX_TEXT && fileType !== HSM_FILE_TYPE && selectedType.id !== NO_TYPE_SELECTED) {
            return "h-82 overflow-y-scroll";
        } else {
            return "h-auto";
        }
    };

    return (
        <React.Fragment>
            <div
                className={`mb-4 h-auto w-[20rem] rounded-tr-[1.6rem] rounded-br-[1.6rem] rounded-tl-[1.6rem] bg-white py-[1.5rem] px-[1.2rem] ${
                    !isEmpty(content) || !isEmpty(header) || !isEmpty(footer) ? "text-black" : "text-gray-34"
                } ${validateScrollPrev()}`}
            >
                {fileType === ".pdf" && (
                    <div className="rounded-left-bubble bg-white px-2 py-2 leading-relaxed text-black shadow-preview">
                        {mediaUrlMessage ? (
                            <iframe title="document" className="w-full overflow-hidden rounded-t-lg object-cover lg:h-[134px] customBase:h-[165px]" scrolling="no" src={mediaUrlMessage}></iframe>
                        ) : (
                            <JelouImg width="100%" className="lg:h-[134px] customBase:h-[165px]" viewBox="0 0 270 170" />
                        )}
                    </div>
                )}
                {fileType === ".jpg, .png" && (
                    <div className="rounded-left-bubble bg-white px-2 py-2 leading-relaxed text-black shadow-preview">
                        {mediaUrlMessage ? (
                            <img style={{ height: "114px" }} className="w-full rounded-lg object-cover" src={mediaUrlMessage} alt="Imagen"></img>
                        ) : (
                            <JelouImg width="100%" className="lg:h-[134px] customBase:h-[165px]" viewBox="0 0 270 170" />
                        )}
                    </div>
                )}
                {fileType === ".mp4" && (
                    <div className="rounded-left-bubble bg-white px-2 py-2 leading-relaxed text-black shadow-preview">
                        {mediaUrlMessage ? (
                            <video width="320" className="!h-[190px]" ref={videoRef} controls>
                                <source src={mediaUrlMessage} type="video/mp4" />
                                <source src={mediaUrlMessage} type="video/ogg" />
                            </video>
                        ) : (
                            <JelouImg width="100%" className="lg:h-[134px] customBase:h-[165px]" viewBox="0 0 270 170" />
                        )}
                    </div>
                )}
                {previewContent()}
            </div>
            {selectedType.id === "QUICK_REPLY" && previewButtons()}
            {selectedType.id === "CALL_TO_ACTION" && previewActions()}
            {selectedType.id === "OTP" && previewButtonsOpt()}
        </React.Fragment>
    );
}
export default Preview;
