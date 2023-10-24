import { useState } from "react";
import toUpper from "lodash/toUpper";
import { usePopper } from "react-popper";
import { withTranslation } from "react-i18next";
import { Transition } from "@tailwindui/react";

import { DownIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";

const OptionsMenu = (props) => {
    const {
        t,
        openNewChat,
        copyToClipboard,
        handleReply,
        messages,
        supportsReplies,
        by,
        dropdownRef,
        popperRef,
        bubbleSide,
        setOpenOptions,
        openOptions,
        onHover,
        type,
    } = props;

    const [referenceRef] = useState(null);
    const { styles: attributes } = usePopper(referenceRef, popperRef, {});

    let canCopy = false;
    canCopy = props.canCopy;

    const openOptionsMenu = () => {
        setOpenOptions(!openOptions);
    };

    useOnClickOutside(dropdownRef, () => setOpenOptions(false));
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <div className="absolute top-0 right-0 z-40 mr-1 cursor-pointer shadow-preview">
            {onHover && (
                <span
                    className={`absolute top-0 right-0 mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                        bubbleSide === "right" ? `bg-primary-600` : `bg-gray-10`
                    } `}
                    onClick={openOptionsMenu}>
                    <DownIcon className="select-none fill-current text-gray-400" width="1.25rem" height="1.25rem" />
                </span>
            )}
            {toUpper(by) === "USER" ? (
                <Transition
                    show={openOptions ? openOptions : false}
                    as={"div"}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    className={`${
                        toUpper(type) === "AUDIO" ? "absolute right-0" : "absolute left-0"
                    } border z-100 ml-2 mt-4 w-36 rounded-lg border-gray-200 bg-white py-2 shadow-normal`}
                    {...attributes.popper}>
                    <div id="tooltip" role="tooltip">
                        {supportsReplies && (
                            <div className="flex cursor-pointer items-center px-4 hover:bg-gray-30" onClick={handleReply}>
                                <div className="relative mr-2 flex flex-col">
                                    <div className="py-1 text-right text-13 font-bold text-gray-400">{t("pma.Responder")}</div>
                                </div>
                            </div>
                        )}
                        <div
                            className="flex cursor-pointer items-center px-4 hover:bg-gray-30"
                            onClick={() => {
                                openNewChat(messages);
                                setOpenOptions(false);
                            }}>
                            <div className="relative mr-2 flex flex-col">
                                <div className="py-1 text-right text-13 font-bold text-gray-400">{t("pma.Reenviar")}</div>
                            </div>
                        </div>
                        {canCopy && (
                            <div className="flex cursor-pointer items-center px-4 hover:bg-gray-30" onClick={() => copyToClipboard(messages)}>
                                <div className="relative mr-2 flex flex-col">
                                    <div className="py-1 text-right text-13 font-bold text-gray-400">{t("pma.Copiar")}</div>
                                </div>
                            </div>
                        )}
                        {/* try to find a way to automatically download mp3 file instead of opening it in a new tab */}
                        {toUpper(type) === "AUDIO" && (
                            <a
                                className="flex cursor-pointer items-center px-4 hover:bg-gray-30"
                                href={messages.message?.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer">
                                <div className="relative mr-2 flex flex-col">
                                    <div className="py-1 text-right text-13 font-bold text-gray-400">{t("pma.Descargar audio")}</div>
                                </div>
                            </a>
                        )}
                    </div>
                </Transition>
            ) : (
                <Transition
                    show={openOptions ? openOptions : false}
                    as={"div"}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    className="border absolute z-100 mt-4 mr-1 w-36 rounded-lg border-gray-200 bg-white py-2 shadow"
                    style={{
                        position: "absolute",
                        right: "0rem",
                        top: "0rem",
                    }}
                    {...attributes.popper}>
                    <div id="tooltip" role="tooltip">
                        {supportsReplies && (
                            <div className="flex cursor-pointer items-center px-4 hover:bg-gray-30" onClick={handleReply}>
                                <div className="relative mr-2 flex flex-col">
                                    <div className="py-1 text-right text-13 font-bold text-gray-400">{t("pma.Responder")}</div>
                                </div>
                            </div>
                        )}
                        <div
                            className="flex cursor-pointer items-center px-4 hover:bg-gray-30"
                            onClick={() => {
                                openNewChat(messages);
                                setOpenOptions(false);
                            }}>
                            <div className="relative mr-2 flex flex-col">
                                <div className="py-1 text-right text-13 font-bold text-gray-400">{t("pma.Reenviar")}</div>
                            </div>
                        </div>
                        {canCopy && (
                            <div
                                className="flex cursor-pointer items-center px-4 hover:bg-gray-30"
                                onClick={() => {
                                    copyToClipboard(messages);
                                }}>
                                <div className="relative mr-2 flex flex-col">
                                    <div className="py-1 text-right text-13 font-bold text-gray-400">{t("pma.Copiar")}</div>
                                </div>
                            </div>
                        )}
                        {/* try to find a way to automatically download mp3 file instead of opening it in a new tab */}
                        {toUpper(type) === "AUDIO" && (
                            <a
                                className="flex cursor-pointer items-center px-4 hover:bg-gray-30"
                                href={messages.message?.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer">
                                <div className="relative mr-2 flex flex-col">
                                    <div className="py-1 text-right text-13 font-bold text-gray-400">{t("pma.Descargar audio")}</div>
                                </div>
                            </a>
                        )}
                    </div>
                </Transition>
            )}
        </div>
    );
};

export default withTranslation()(OptionsMenu);
