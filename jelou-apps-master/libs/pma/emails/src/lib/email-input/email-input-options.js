import get from "lodash/get";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import React, { useEffect, useRef } from "react";

import Tiptap from "./tiptap";
import { usePrevious } from "@apps/shared/hooks";
import { filterByKey } from "@apps/shared/utils";
import { useTranslation } from "react-i18next";

const EmailInputOptions = (props) => {
    const {
        setShowEmailError,
        showEmailError,
        blackListEmails,
        editFromPermission,
        setShowingTipTap,
        bottomViewRef,
        lastMessageContext,
        defaultSignature,
        setDefaultSignature,
        setShowTipTap,
        showTipTap,
        setShowDeleteMessageModal,
        editor,
        text,
        setText,
        from,
        setFrom,
        attachments,
        setAttachments,
        sendMessage,
        selectedOption,
        setSelectedOption,
        firstEmail,
        sending,
        to,
        setTo,
        cc,
        setCc,
        bcc,
        setBcc,
        ElemContainerScroll,
        disabled,
        signatures = [],
        handleEditorChange,
        bot,
        setSignatures,
        setAddedContext,
        addedContext,
    } = props;
    const { t } = useTranslation();
    const currentEmail = useSelector((state) => state.currentEmail);
    const inputMessages = useSelector((state) => state.inputMessages);
    const textBox = useRef(null);
    const editorRef = useRef(null);
    const prevcurrentEmail = usePrevious(currentEmail);

    const handleShowTiptapClick = () => {
        setShowTipTap(true);
        setShowingTipTap(true);
        window.setTimeout(() => {
            ElemContainerScroll.scroll({ top: ElemContainerScroll.scrollHeight, left: 0, behavior: "smooth" });
        }, 100);
        let signatureHtml = signatures;
        signatureHtml = get(signatures, "body");
        setText(first(signatureHtml));
    };

    useEffect(() => {
        if (!isEmpty(prevcurrentEmail) && prevcurrentEmail.roomId !== currentEmail.roomId) {
            const input_message = filterByKey(inputMessages, "roomId", currentEmail.roomId);
            if (input_message.length > 0) {
                setText(input_message[0].text);
            } else {
                setText("");
            }
        }

        const selectedOption = get(currentEmail, "ticketStatus", "open") === "new" ? "open" : get(currentEmail, "ticketStatus", "open");
        setSelectedOption(selectedOption);
    }, [currentEmail]);

    const fontFamily = get(bot, "properties.editorConfig.fontFamily", "Arial");
    const allowResponseAll = get(bot, "properties.supportTickets.responseAll", false);
    const tipTapRef = useRef(null);
    return !disabled && showTipTap ? (
        <div className="w-full overflow-hidden rounded-xl bg-white">
            <div className="flex flex-row justify-center transition-all">
                <div ref={tipTapRef} className="relative  my-auto w-full">
                    <Tiptap
                        tipTapRef={tipTapRef}
                        setShowEmailError={setShowEmailError}
                        showEmailError={showEmailError}
                        editFromPermission={editFromPermission}
                        blackListEmails={blackListEmails}
                        lastMessageContext={lastMessageContext}
                        defaultSignature={defaultSignature}
                        editorRef={editorRef}
                        setShowDeleteMessageModal={setShowDeleteMessageModal}
                        showTipTap={showTipTap}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        sendMail={sendMessage}
                        text={text}
                        setText={setText}
                        textBox={textBox}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        editor={editor}
                        to={to}
                        setTo={setTo}
                        cc={cc}
                        setCc={setCc}
                        setFrom={setFrom}
                        from={from}
                        bcc={bcc}
                        setBcc={setBcc}
                        sending={sending}
                        firstEmail={firstEmail}
                        setShowTipTap={setShowTipTap}
                        signatures={signatures}
                        handleEditorChange={handleEditorChange}
                        bot={bot}
                        setDefaultSignature={setDefaultSignature}
                        setSignatures={setSignatures}
                        setAddedContext={setAddedContext}
                        addedContext={addedContext}
                        fontFamily={fontFamily}
                        allowResponseAll={allowResponseAll}
                    />
                </div>
            </div>
        </div>
    ) : (
        !disabled && (
            <button
                ref={bottomViewRef}
                className="flex w-[7.25rem] items-center space-x-2 rounded-[0.625rem] border-default !border-primary-200 px-3 py-2 text-13 font-bold text-gray-400"
                onClick={handleShowTiptapClick}>
                <span>
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.5524 1.32809L2.64304 2.81243C2.654 2.82697 2.65434 2.82844 2.6653 2.84298C5.18707 2.21188 7.58986 2.51925 9.83319 3.89239C11.8692 5.1381 13.2158 6.91254 13.9337 9.15667C14.054 9.53235 13.837 9.92859 13.4619 10.0153L13.4561 10.0167C13.1242 10.0934 12.7884 9.89634 12.6815 9.56565C11.9431 7.29212 10.5022 5.60932 8.30359 4.58743C6.58154 3.78592 4.79655 3.67869 2.97478 4.16193C3.3618 4.40922 3.96394 4.79145 4.40803 5.07521C4.72693 5.27772 4.82569 5.70494 4.62803 6.02687C4.43071 6.35028 4.01082 6.44735 3.69234 6.24009C2.97869 5.77655 1.77211 4.99555 1.07544 4.55291C0.895652 4.43929 0.723836 4.32072 0.622087 4.12387C0.607945 4.04954 0.585288 3.93839 0.571145 3.86406C0.589759 3.6487 0.697789 3.47164 0.806921 3.29278C1.24159 2.58239 1.99788 1.33674 2.43483 0.616518C2.62299 0.306092 3.022 0.210745 3.33028 0.400194C3.6457 0.594201 3.74565 1.01339 3.5524 1.32809Z"
                            fill="#00B3C7"
                        />
                    </svg>
                </span>
                <span>{t("pma.Responder")}</span>
            </button>
        )
    );
};

export default EmailInputOptions;
