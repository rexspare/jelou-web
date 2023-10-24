import "dayjs/locale/es";
import "dayjs/locale/en";
import dayjs from "dayjs";
import get from "lodash/get";
import striptags from "striptags";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import parse from "html-react-parser";
import truncate from "lodash/truncate";
import { withTranslation } from "react-i18next";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState, useEffect } from "react";
import PostAvatar from "../post-avatar/post-avatar";
import { DownIcon } from "@apps/shared/icons";
import sanitizeHtml from "sanitize-html";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

dayjs.extend(relativeTime);

const SupportTicketBubble = (props) => {
    const { isLast = false, message, t, scrollUpRef } = props;
    const [show, setShow] = useState(false);
    const html = isEmpty(get(message, "htmlBody", ""))
        ? get(message, "textBody", get(props, "message.bubble.text", ""))
        : get(message, "htmlBody", "");
    // marked.use({ gfm: true });
    const attachments = get(props, "message.attachments", []);
    const sender = get(message, "sender", get(props, "message.sender"));
    const by = get(message, "by", get(props, "message.by"));

    useEffect(() => {
        setShow(isLast);
    }, [isLast]);

    useEffect(() => {
        setTimeout(() => {
            const images = document.querySelectorAll("[data-jelou-img]");
            images.forEach((image) => {
                image.addEventListener("click", ({ target }) => {
                    window.open(target.src, "_blank");
                });
            });
        }, 1000);
        return () => {
            const images = document.querySelectorAll("[data-jelou-img]");
            images.forEach((image) => {
                image.removeEventListener("click", ({ target }) => {
                    window.open(target.src, "_blank");
                });
            });
        };
    }, []);

    if (!message) {
        return null;
    }

    let previewHtml = striptags(get(message, "textBody", ""));
    previewHtml = previewHtml.replace(/&nbsp;/g, "");
    previewHtml = truncate(striptags(previewHtml), { length: 100 });

    const getName = () => {
        let name = get(message, "from.Name", "");
        if (isEmpty(name)) {
            name = get(message, "from.Email", "");
        }
        return name;
    };

    const name = getName();
    const date = dayjs(get(message, "createdAt", "")).format(`DD MMMM YYYY - HH:mm`);
    const from = get(message, "from.Email", "");
    let to = get(message, "to", []);
    let cc = get(message, "cc", []);
    let bcc = get(message, "bcc", []);

    to = to.map((toJr) => {
        return { Email: get(toJr, "Email", toJr) };
    });
    cc = cc.map((ccJr) => {
        return { Email: get(ccJr, "Email", ccJr) };
    });

    bcc = bcc.map((bccJr) => {
        return { Email: get(bccJr, "Email", bccJr) };
    });

    const ccInfo = cc.map((el, i, arr) => {
        if (i + 1 === arr.length) {
            return el.Email;
        } else {
            return `${el.Email}, `;
        }
    });

    const bccInfo = bcc.map((el, i, arr) => {
        if (i + 1 === arr.length) {
            return el.Email;
        } else {
            return `${el.Email}, `;
        }
    });

    const toInfo = to.map((el, i, arr) => {
        if (i + 1 === arr.length) {
            return el.Email;
        } else {
            return `${el.Email}, `;
        }
    });

    class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        static getDerivedStateFromError(error) {
            // Update state so the next render will show the fallback UI.
            return { hasError: true };
        }

        componentDidCatch(error, errorInfo) {
            // You can also log the error to an error reporting service
            console.log(error, errorInfo);
        }

        render() {
            if (this.state.hasError) {
                // You can render any custom fallback UI
                return (
                    <div className="mail-content w-full max-w-full overflow-hidden px-10 pt-6 pb-10">
                        {parser(cleanedHtml)}
                        {!isEmpty(attachments) && (
                            <div className="flex flex-col">
                                <span className="text-13 font-bold text-gray-500">{t("Archivos Adjuntos:")}</span>
                                {/* <ShowFiles attachments={attachments} /> */}
                            </div>
                        )}
                    </div>
                );
            }

            return this.props.children;
        }
    }

    const cleanedHtml = sanitizeHtml(html);

    const parser = (html) => {
        return parse(html, {
            replace: (domNode) => {
                if (domNode.name === "img") {
                    domNode.attribs["data-jelou-img"] = "img";
                    return domNode;
                }
                if (domNode.name === "table" && get(domNode, "attribs.id", "") === "tiny-table") {
                    domNode.attribs["data-jelou-table"] = "table";
                    return domNode;
                }
            },
        });
    };

    function resizeIframe(obj) {
        const { target: iframeObj } = obj;
        iframeObj.contentWindow.document.documentElement.querySelector("body").style.margin = 0;
        iframeObj.contentWindow.document.documentElement.querySelector("body").style.fontFamily =
            "Manrope, Montserrat, system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";
        iframeObj.contentWindow.document.documentElement.querySelector("body").style.fontWeight = "lighter";
        iframeObj.contentWindow.document.documentElement.querySelector("body").style.lineHeight = "24px";
        iframeObj.contentWindow.document.documentElement.querySelector("body").style.lineSize = "16px";
        iframeObj.style.height = iframeObj.contentWindow.document.documentElement.scrollHeight + 15 + "px";
    }

    return (
        <div className="z-1 top-0 w-full border-b-default border-gray-300 bg-white px-3 md:px-5 md:pt-5 md:pb-3" ref={scrollUpRef}>
            <button
                className={`flex w-full flex-col ${show ? "justify-between" : "h-20"} leading-normal focus:outline-none`}
                onClick={() => setShow(!show)}>
                {show && toUpper(by) === "OPERATOR" && (
                    <div
                        className={
                            "w-full border-b-default border-solid border-gray-300 border-opacity-25 pb-3 text-left text-15 text-gray-400 md:pb-4"
                        }>
                        {t(`pma.Contestado por`)} <b>{get(sender, "names", t("Desconocido"))}</b>
                    </div>
                )}
                <div className={`mb-2 flex items-center ${show && toUpper(by) === "OPERATOR" ? "pt-4 md:pt-5" : ""}`}>
                    <PostAvatar src={"https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/default_avatar.jpeg"} name={name} />
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col text-gray-475">
                            <span className="text-left text-base font-bold">{name}</span>
                            <div className="flex items-center text-xs font-light">
                                <span>{date}</span>
                                <div className="flex flex-col">
                                    {show && (
                                        <Tippy
                                            theme={"normal"}
                                            arrow={false}
                                            placement="bottom-start"
                                            allowHTML={true}
                                            content={
                                                <div>
                                                    <p>
                                                        <span className="font-semibold">{t("De")}</span> : <span>{from}</span>
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">{t("Para")}</span> : <span>{toInfo}</span>
                                                    </p>
                                                    {cc.length > 0 && (
                                                        <p>
                                                            <span className="font-semibold">Cc</span> : <span>{ccInfo}</span>
                                                        </p>
                                                    )}
                                                    {bcc.length > 0 && (
                                                        <p>
                                                            <span className="font-semibold">Bcc</span> : <span>{bccInfo}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            }>
                                            <div>
                                                <DownIcon className="ml-1 fill-current text-gray-400" height="1rem" width="1rem" />
                                            </div>
                                        </Tippy>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${show ? "flex items-center justify-end space-x-2" : "flex w-full justify-between"}`}>
                    {/* {show && <StatusTick status={status}></StatusTick>} */}
                    {!show && <span className={"flex-1 text-left text-sm text-gray-475"}>{previewHtml}</span>}
                </div>
            </button>
            {show && !isEmpty(html) && (
                <ErrorBoundary>
                    <div className="mail-content w-full max-w-full px-10 pt-6 pb-10">
                        <iframe srcDoc={html} onLoad={resizeIframe} title="html body" className="h-auto w-full" />
                        {/* {parser(html)} */}
                        {!isEmpty(attachments) && (
                            <div className="flex flex-col">
                                <span className="text-13 font-bold text-gray-500">{t("Archivos Adjuntos:")}</span>
                                {/* <ShowFiles attachments={attachments} /> */}
                            </div>
                        )}
                    </div>
                </ErrorBoundary>
            )}
        </div>
    );
};

const customComparator = (prevProps, nextProps) => {
    // setFromMessage
    // message
    // key
    // isLast
    // scrollUpRef
    return nextProps.message === prevProps.message;
};

export default withTranslation()(React.memo(SupportTicketBubble, customComparator));
