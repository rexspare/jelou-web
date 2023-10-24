import get from "lodash/get";
import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { CreateFirmModal } from "./create-firm-modal";
import { CheckIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";

const CreateFirm = (props) => {
    const {
        editorRef,
        attachments,
        setAttachments,
        attachmentAcceptance,
        handleAttachment,
        searchMacros,
        setOpenTableMenu,
        openTableMenu,
        canSendMacros,
        userSession,
        currentEmail,
        bot,
        signatures = [],
        defaultSignature,
        setDefaultSignature,
        setSignatures,
        fontFamily,
    } = props;

    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState({});

    const byTeam = toUpper(get(bot, "properties.signatures.by", "")) === "TEAM";
    // const byTeam = false;

    function closeModal() {
        setIsOpen(false);
        setMessage("");
    }

    function openModal() {
        setIsOpen(true);
    }

    const copyToEditor = (signature) => {
        let body = get(signature, "body", "");
        editorRef.current.insertContent(body);

        signature.body = `<p><br><br>${body}</p>`;
        setDefaultSignature(signature);
    };

    return (
        <Menu as="div" className="relative flex items-center text-left">
            <Tippy theme={"tomato"} content={t("pma.Firmas")} touch={false} arrow={false}>
                <Menu.Button>
                    <IconPencil />
                </Menu.Button>
            </Tippy>

            {isOpen && (
                <CreateFirmModal
                    attachments={attachments}
                    setAttachments={setAttachments}
                    attachmentAcceptance={attachmentAcceptance}
                    handleAttachment={handleAttachment}
                    searchMacros={searchMacros}
                    setOpenTableMenu={setOpenTableMenu}
                    openTableMenu={openTableMenu}
                    canSendMacros={canSendMacros}
                    isOpen={isOpen}
                    closeModal={closeModal}
                    userSession={userSession}
                    currentEmail={currentEmail}
                    setDefaultSignature={setDefaultSignature}
                    defaultSignature={defaultSignature}
                    message={message}
                    signatures={signatures}
                    setSignatures={setSignatures}
                    setMessage={setMessage}
                    fontFamily={fontFamily}
                />
            )}

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute bottom-0 max-h-[30vh] min-w-48 overflow-y-auto rounded-md bg-white shadow-normal">
                    {isEmpty(signatures) ? (
                        <Menu.Item
                            as="button"
                            className="block w-full border-b-[1px] border-gray-100 border-opacity-25 py-2 pl-4 text-left text-13 text-gray-400">
                            {t("pma.No tiene firmas disponibles")}
                        </Menu.Item>
                    ) : (
                        signatures.map((signature) => {
                            return (
                                <Menu.Item
                                    as="button"
                                    key={uuid()}
                                    className="flex w-full items-center space-x-2 border-b-[1px] border-gray-100 border-opacity-25 py-2 pl-2"
                                    onClick={() => copyToEditor(signature)}>
                                    {signature.id === defaultSignature.id && <CheckIcon stroke="#00B3C7" width="12" height="10" />}
                                    <span className="block w-full  text-left text-13 text-gray-400">{signature.name}</span>
                                </Menu.Item>
                            );
                        })
                    )}

                    {!byTeam && (
                        <Menu.Item onClick={openModal} as="button" className="block py-2 pl-4 text-left text-13 font-bold text-primary-200">
                            + {t("pma.Crear firma")}
                        </Menu.Item>
                    )}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default CreateFirm;

const IconPencil = () => (
    <svg width={12} height={17} fill="none">
        <path
            d="M6.294 0C7.122.35 7.95.698 8.78 1.045c.764.319 1.53.634 2.297.953.488.202.623.521.421 1.012-.518 1.25-1.011 2.508-1.56 3.744-.283.632-.396 1.28-.455 1.96-.119 1.407-.26 2.812-.39 4.217-.028.294-.208.463-.452.596a3005.36 3005.36 0 0 0-5.05 2.816l-.648.36c-.526.29-.934.12-1.1-.463-.585-2.062-1.17-4.126-1.757-6.188-.022-.075-.056-.147-.083-.22v-.348c.08-.117.155-.242.246-.35C1.32 7.84 2.394 6.546 3.464 5.252c.07-.083.125-.18.166-.277A671.642 671.642 0 0 0 5.457.565C5.565.3 5.714.1 5.989.003 6.089 0 6.19 0 6.294 0ZM3.838 14.7a796.911 796.911 0 0 0 3.888-2.176c.053-.03.092-.125.097-.194.139-1.42.266-2.84.408-4.26.016-.155-.025-.213-.164-.269-1.191-.487-2.38-.978-3.566-1.477-.13-.055-.203-.041-.291.07-.904 1.094-1.81 2.189-2.72 3.278-.082.1-.102.186-.063.316.297 1.02.582 2.04.873 3.062.103.36.205.724.322 1.131.052-.11.083-.175.11-.238.33-.793.657-1.586.984-2.378.203-.49.402-.984.616-1.469a.65.65 0 0 1 .69-.39.639.639 0 0 1 .551.565c.011.144-.03.304-.086.44-.285.71-.582 1.41-.873 2.118-.252.604-.499 1.205-.776 1.87ZM8.591 6.6c.499-1.208.992-2.391 1.491-3.6l-3.6-1.49-1.49 3.597c1.205.501 2.39.995 3.6 1.493Z"
            fill="#727C94"
            fillOpacity={0.75}
        />
    </svg>
);
