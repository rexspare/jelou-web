import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import React, { Fragment, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";

import { MoreIcon1, VideoIcon, CustomPaymentIcon, RecurringPaymentIcon, FilesIcon1, CalendarIcon1, ImageIcon1 } from "@apps/shared/icons";
import { useAcceptance } from "@apps/shared/hooks";
import { useSelector, useDispatch } from "react-redux";

const ELEMENTS_IDS = {
    IMAGE: "image-upload",
    VIDEO: "video-upload",
    DOCUMENTS: "documents-upload",
};

const Attachments = (props) => {
    const {
        disableButton,
        customEvents,
        handleFile,
        isFacebookChat,
        isFacebookFeed,
        isInstagramChat,
        isTwitterChat,
        isWhatsAppChat,
        isWidget,
        setShowEmoji,
        setShowEventModal,
        documentList,
        handleOpenCustomPayment,
        handleOpenRecurringPayment,
        showRecurringPaymentButton,
        checkIfOperatorIsOnline,
        statusOperator,
        setShowDisconnectedModal,
    } = props;
    const { t } = useTranslation();
    const { documentAcceptance, imageAcceptance, videoAcceptance } = useAcceptance();
    const company = useSelector((state) => state.company);
    const gotCredentials = useMemo(() => !isEmpty(company?.properties?.shopCredentials), [company]);

    const ref = useRef(null);
    const dispatch = useDispatch();

    const onChange = (e) => {
        ref.current.click();
        handleFile({ evt: e, documentList });
    };

    const onClickCustomPayment = () => {
        ref.current.click();
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        handleOpenCustomPayment();
    };

    const onClickRecurringPayment = () => {
        ref.current.click();
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        handleOpenRecurringPayment();
    };

    return (
        <Menu as="div" className={"relative"}>
            <Tippy content={t("Adjuntar")} placement={"top"} touch={false}>
                <Menu.Button
                    disabled={disableButton}
                    className="flex h-6 w-6 select-none  items-center rounded-full bg-primary-350 p-[1px] text-gray-400 hover:text-primary-200 disabled:bg-gray-50 disabled:text-gray-300"
                    ref={ref}
                >
                    <MoreIcon1 className="m-2 fill-current text-inherit " width="100%" height="100%" />
                </Menu.Button>
            </Tippy>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute bottom-3  z-20 min-w-[10rem] overflow-hidden rounded-10 bg-white text-13 text-gray-400 text-opacity-80 shadow-ticket" static>
                    {!isEmpty(customEvents) && (
                        <Menu.Item>
                            <Tippy content={t("Eventos")} disabled placement={"right"} touch={false}>
                                <button
                                    onClick={() => {
                                        ref.current.click();
                                        setShowEventModal(true);
                                        setShowEmoji(false);
                                    }}
                                    className="flex w-full cursor-pointer items-center gap-2 border-b-0.5 border-gray-400 border-opacity-25 px-5 py-2 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200"
                                >
                                    <CalendarIcon1 />
                                    <span className="w-12 text-left">{t("Eventos")}</span>
                                </button>
                            </Tippy>
                        </Menu.Item>
                    )}
                    {(isWhatsAppChat || isWidget || isFacebookChat) && (
                        <Menu.Item>
                            <Tippy content={t("Video")} disabled placement={"right"} touch={false}>
                                <div>
                                    <label
                                        htmlFor={ELEMENTS_IDS.VIDEO}
                                        className="flex cursor-pointer items-center gap-2 border-b-0.5 border-gray-400 border-opacity-25 px-5 py-2 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200"
                                    >
                                        <VideoIcon />
                                        <span className="w-12 text-left">{t("Video")}</span>
                                    </label>
                                    <input name="video" type="file" hidden id={ELEMENTS_IDS.VIDEO} accept={videoAcceptance()} onChange={onChange} />
                                </div>
                            </Tippy>
                        </Menu.Item>
                    )}
                    <Menu.Item>
                        <Tippy content={t("Imagen")} disabled placement={"right"} touch={false}>
                            <div>
                                <label
                                    htmlFor={ELEMENTS_IDS.IMAGE}
                                    className="flex cursor-pointer items-center gap-2 border-b-0.5 border-gray-400 border-opacity-25 px-5 py-2 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200"
                                >
                                    <ImageIcon1 />
                                    <span className="w-12 text-left">{t("Imagen")}</span>
                                </label>
                                <input type="file" hidden id={ELEMENTS_IDS.IMAGE} accept={imageAcceptance()} onChange={onChange} />
                            </div>
                        </Tippy>
                    </Menu.Item>
                    {!isFacebookFeed && !isTwitterChat && !isInstagramChat && (
                        <Menu.Item>
                            <Tippy content={t("Documento")} disabled placement={"right"} touch={false}>
                                <div>
                                    <label
                                        htmlFor={ELEMENTS_IDS.DOCUMENTS}
                                        className="flex cursor-pointer items-center gap-2 border-b-0.5 border-gray-400 border-opacity-25 px-5 py-2 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200"
                                    >
                                        <FilesIcon1 />
                                        <span className="w-12 text-left">{t("Documento")}</span>
                                    </label>
                                    <input type="file" hidden name="document" id={ELEMENTS_IDS.DOCUMENTS} accept={documentAcceptance()} onChange={onChange} />
                                </div>
                            </Tippy>
                        </Menu.Item>
                    )}
                    {gotCredentials && (
                        <Menu.Item>
                            <Tippy content={t("Adjuntar")} disabled placement={"top"} touch={false}>
                                <button
                                    onClick={onClickCustomPayment}
                                    className={`flex items-center gap-2 px-5 py-2 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200 ${
                                        showRecurringPaymentButton ? "border-grey-300 border-b-0.5 border-opacity-25" : ""
                                    }`}
                                >
                                    <CustomPaymentIcon />
                                    <span className="w-32 text-left">{t("pma.customPayment")}</span>
                                </button>
                            </Tippy>
                        </Menu.Item>
                    )}
                    {showRecurringPaymentButton && (
                        <Menu.Item>
                            <Tippy content={t("Adjuntar")} disabled placement={"top"} touch={false}>
                                <button onClick={onClickRecurringPayment} className="flex items-center gap-2 px-5 py-2 hover:bg-primary-200 hover:bg-opacity-10 hover:text-primary-200">
                                    <RecurringPaymentIcon />
                                    <span className="w-32 text-left">{t("origin.recurringPayment")}</span>
                                </button>
                            </Tippy>
                        </Menu.Item>
                    )}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default Attachments;
