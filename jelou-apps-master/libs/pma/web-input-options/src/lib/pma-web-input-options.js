import dayjs from "dayjs";
import get from "lodash/get";
import trim from "lodash/trim";
import omit from "lodash/omit";
import Tippy from "@tippyjs/react";
import { v4 as uuidv4 } from "uuid";
import * as Sentry from "@sentry/react";
import { Popover, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import TextareaAutosize from "react-autosize-textarea";
import React, { useState, useRef, useEffect, useCallback, Fragment } from "react";
import data from "@emoji-mart/data";

import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import isObject from "lodash/isObject";

import EventsModal from "./events-modal/events-modal";
import Attachments from "./attachments/attachments";
import { JelouApiV1 } from "@apps/shared/modules";
import { filterByKey, checkIfOperatorIsOnline } from "@apps/shared/utils";
// import EmojiPicker from "./emoji-picker/emoji-picker";
import { VoltIcon, EmojiIcon } from "@apps/shared/icons";
import TemplateShortCut from "./hsm-shortcut/hsm-shortcut";
import { QuickReplyModal, FileZone, PreviewFacebookImage as Preview } from "@apps/pma/ui-shared";
import { setInputMessage, addMessage, updateMessage, updateRoomById, updateCurrentRoom, setShowDisconnectedModal } from "@apps/redux/store";
import { USER_TYPES, FACEBOOK_MAX_LENGTH, INSTAGRAM_MAX_LENGTH, DOCUMENT_MESSAGE_TYPES, MESSAGE_TYPES } from "@apps/shared/constants";
import { renderMessage } from "@apps/shared/common";
import { usePrevious, useUploadFile } from "@apps/shared/hooks";
import { usePaymentsPlans } from "./payment/hooks/plans";
import { CustomPayment, RecurringPayment } from "./payment";
import AIAnswerPanel from "./AI_answerPanel/AI_answerPanel";
import GrammarCheckerPanel from "./grammarCheckerPanel/GrammarCheckerPanel";
import RecordAudio from "./recordAudio.js/RecordAudio";
import SendMessage from "./sendMessage/SendMessage";
import Picker from "@emoji-mart/react";

const PmaWebInputOptions = (props) => {
    const {
        bot,
        audioRef,
        clearDocumentList,
        documentList,
        handleDeleteImage,
        handleAddFiles,
        setDisableDragFile,
        handleSelectFiles,
        micPermission,
        setMicPermission,
        uploadingDropZone,
        setDocumentList,
    } = props;
    const { t } = useTranslation();
    const [cancelRecord, setCancelRecord] = useState(false);
    const [customEvents, setCustomEvents] = useState([]);
    const [intervalId, setIntervalId] = useState(false);
    const [openOptions, setOpenOptions] = useState(false);
    const [phone, setPhone] = useState("");
    const [record, setRecord] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [sendingAudio, setSendingAudio] = useState(false);
    const [sendingEvent, setSendingEvent] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    const [showEventModal, setShowEventModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showShortCut, setShowShorCut] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [text, setText] = useState("");
    const [hasInsertedAIResponse, setHasInsertedAIResponse] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showCustomPaymentModal, setShowCustomPaymentModal] = useState(false);
    const [showRecurringPaymentModal, setShowRecurringPaymentModal] = useState(false);
    const [referenceElement, setReferenceElement] = useState();
    const [audioBlobs, setAudioBlobs] = useState([]);
    const [audiosUrl, setAudiosUrl] = useState([]);
    const company = useSelector((state) => state.company);
    const currentRoom = useSelector((state) => state.currentRoom);
    const inputMessages = useSelector((state) => state.inputMessages);
    const userSession = useSelector((state) => state.userSession);
    const [generatingAIAnswer, setGeneratingAIAnswer] = useState(false);
    const [answer, setAnswer] = useState("");
    const conversation_id = get(currentRoom, "conversation._id", "");
    const prevCurrentRoom = usePrevious(currentRoom);
    const is_BG_company = company.id === 155;

    const { uploadFile } = useUploadFile();
    const wrapperRef = useRef(null);

    const dispatch = useDispatch();

    const hasText = !isEmpty(trim(text));
    const isMobileApp = {
        AndroidApp: function () {
            return navigator.userAgent.match(/\bAndroid\W+(?:\w+\W+){0,10}?Build\b/g);
        },
        iOSApp: function () {
            return navigator.userAgent.match(/\biPhone|iPad|iPod\W+(?:\w+\W+){0,10}?Build\b/g);
        },
    };

    setDisableDragFile(!isEmpty(audioBlobs) || record);

    const canPasteFiles = get(company, "properties.canPasteImages", true);
    const isFacebookChat = toUpper(get(currentRoom, "source", "WEB")) === "FACEBOOK";
    const isFacebookFeed = toUpper(get(currentRoom, "source", "WEB")) === "FACEBOOK_FEED";
    const isTwitterChat = toUpper(get(currentRoom, "source", "WEB")) === "TWITTER";
    const isInstagramChat = toUpper(get(currentRoom, "source", "WEB")) === "INSTAGRAM";
    const isWhatsAppChat = toUpper(get(currentRoom, "channel")) === "WHATSAPP";
    const isWidget = toUpper(get(currentRoom, "channel")) === "WIDGET";
    const isAudioChannel = isFacebookChat || isWhatsAppChat || isWidget;

    const sendAudio = get(bot, "properties.sendAudio", true) && isAudioChannel;
    const showFileZone = Boolean(documentList.length > 0) || !isEmpty(audioBlobs);
    const statusOperator = useSelector((state) => state.statusOperator);

    let inputElement = useRef(null);

    let refText = useRef(text);
    refText.current = text;

    let textMaxLength = Infinity;

    if (isFacebookChat) {
        textMaxLength = FACEBOOK_MAX_LENGTH;
    }

    if (isInstagramChat) {
        textMaxLength = INSTAGRAM_MAX_LENGTH;
    }

    const handleKeyDownShortCut = (event) => {
        if (event.key === "/" && refText.current === "") {
            if (inputElement.current) {
                inputElement.current.blur();
            }
            setShowEmoji(false);
            setShowShorCut(true);
        }
    };

    const handlePasteFiles = async (event) => {
        setShowEmoji(false);
        const files = (event.clipboardData || event.originalEvent.clipboardData).files;
        const hasFiles = files && files.length > 0;

        if (hasFiles) {
            event.preventDefault();
            handleAddFiles({ files, documentList });
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDownShortCut);
        if (canPasteFiles) {
            document.addEventListener("paste", handlePasteFiles);
        }
        return () => {
            // console.log("remove event");
            document.removeEventListener("keydown", handleKeyDownShortCut);
            document.removeEventListener("paste", handlePasteFiles);
        };
    }, [document]);

    useEffect(() => {
        if (!isEmpty(currentRoom)) {
            setCurrentRoomPhone();
            const input_message = filterByKey(inputMessages, "roomId", currentRoom.id);
            if (input_message.length > 0) {
                setText(input_message[0].text);
            }
            if (prevCurrentRoom !== currentRoom) {
                dispatch(setInputMessage({ roomId: currentRoom.id, text: "" }));
            }
        }
    }, [currentRoom]);

    useEffect(() => {
        checkMic();
        getCustomEvents();
    }, []);

    /**
     * Currently firefox does not support permission API
     * Also Safari does not have any support on navigator.permissions
     */
    const checkMic = () => {
        const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (navigator.permissions && !isFirefox) {
            try {
                navigator.permissions.query({ name: "microphone" }).then((permissionStatus) => {
                    setMicPermission(permissionStatus.state === "granted");
                    permissionStatus.onchange = () => {
                        setMicPermission(permissionStatus.state === "granted");
                        setMicPermission(permissionStatus.state === "granted");
                    };
                });
            } catch (error) {
                console.log(error, "error with mic permission API");
            }
        }
    };

    const setCurrentRoomPhone = async () => {
        try {
            const { senderId } = await currentRoom;
            const phone = senderId.replace("@c.us", "");
            setPhone(phone);
        } catch (error) {
            console.log(error);
        }
    };

    const getCustomEvents = async () => {
        try {
            const companyId = get(userSession, "companyId", null);

            if (!companyId) {
                return;
            }

            const { data } = await JelouApiV1.get(`/company/${companyId}/custom_events`, {
                params: {
                    shouldPaginate: false,
                },
            });

            setCustomEvents(get(data, "results", []));
        } catch (error) {
            console.log(error, "error on custom events");
        }
    };

    const sendMessage = async () => {
        if (checkIfOperatorIsOnline(statusOperator)) {
            dispatch(setShowDisconnectedModal(true));
            return;
        }
        const loadingsValues = Object.values(uploadingDropZone);
        const hasSomeLoading = loadingsValues.some((value) => value === true);

        if (!isEmpty(audiosUrl)) {
            audiosUrl.forEach(async (audio) => {
                let audioMessage = { mediaUrl: audio, type: "AUDIO" };
                await createMessage(audioMessage, true);
            });
            setAudiosUrl([]);
            setAudioBlobs([]);
            return;
        }

        if (!sendingAudio && hasText && documentList.length === 1 && !hasSomeLoading) {
            const doc = documentList[0];
            const { mediaUrl, type } = doc;
            const [typeFile] = type.split("/");
            const messageType = DOCUMENT_MESSAGE_TYPES[typeFile] ?? null;

            if (messageType) {
                const message = { mediaUrl, type: messageType, mimeType: type, caption: trim(text), width: 2 };
                await createMessage(message, true);
                clearDocumentList();

                return;
            }
        }

        if (!hasSomeLoading && showFileZone) {
            for (let i = 0; i < documentList.length; i++) {
                const doc = documentList[i];
                const { mediaUrl, type } = doc;
                const [typeFile] = type.split("/");
                const messageType = DOCUMENT_MESSAGE_TYPES[typeFile] || DOCUMENT_MESSAGE_TYPES.document;

                const message = { mediaUrl, type: messageType, mimeType: type, width: 2 };
                await createMessage(message, true);
            }
            clearDocumentList();
        }

        if (!sendingAudio && hasText) {
            const sendMessageText = () => {
                const message = { type: "TEXT", text };
                createMessage(message);
            };

            showFileZone ? setTimeout(() => sendMessageText(), 500) : sendMessageText();
        }
    };

    const handleKeyDown = (event) => {
        if (!event.shiftKey && event.key === "Enter") {
            event.preventDefault();
            if (checkIfOperatorIsOnline(statusOperator)) {
                dispatch(setShowDisconnectedModal(true));
                return;
            }
            if (!sendingAudio) {
                sendMessage();
            }
        }
    };

    const handleChange = (event) => {
        const text = event.target.value;
        if (text === "/") {
            return;
        }
        setText(text);
        dispatch(setInputMessage({ roomId: currentRoom.id, text }));
    };

    const sendTemplate = async (message) => {
        const by = USER_TYPES.OPERATOR;
        const { appId, source } = currentRoom;
        let { senderId } = currentRoom;

        const roomId = currentRoom.id;

        const removePlus = source === "gupshup" || source === "wavy";
        if (removePlus) {
            senderId = senderId.replace("+", "");
        }

        //SEND MESSAGE
        const formMessage = {
            by,
            source,
            roomId,
            botId: appId,
            userId: senderId,
            bubble: message,
            operatorId: userSession.providerId,
            id: uuidv4(),
            createdAt: dayjs().valueOf(),
        };

        // Add message to Redux
        changeRepliedRoom();
        dispatch(addMessage(formMessage));

        // Send message to server
        JelouApiV1.post(`/operators/message`, omit(formMessage, ["source"])).catch((error) => {
            console.error("Error on send message", error.response);

            Sentry.configureScope((scope) => {
                const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                scope.setExtra("formMessage", formMessage);
                scope.setExtra("userSession", userSession);
                scope.setExtra("errorResponse", data);
            });

            Sentry.captureException(new Error(`( Room ) Send Message Hsm Failed With: ${error.message}`));
        });
    };

    const changeRepliedRoom = () => {
        const wasReplied = get(currentRoom, "conversation.wasReplied", false) === false;

        if (wasReplied) {
            const updatedRoom = {
                ...currentRoom,
                conversation: {
                    ...currentRoom.conversation,
                    wasReplied: true,
                },
            };

            dispatch(updateRoomById(updatedRoom)); // it updates the room in the left sidebar (inbox)
            dispatch(updateCurrentRoom(updatedRoom)); // it updates the curretn room (redux)
        }
    };

    // TODO: This needs a refactor
    const createMessage = async (message, ignoreText = false) => {
        const isFacebookChat = toUpper(get(currentRoom, "source", "WEB")) === "FACEBOOK";
        const isInstagramChat = toUpper(get(currentRoom, "source", "WEB")) === "INSTAGRAM";
        const textMaxLength = isFacebookChat ? FACEBOOK_MAX_LENGTH : INSTAGRAM_MAX_LENGTH;

        if ((isFacebookChat || isInstagramChat) && text.length > textMaxLength) {
            renderMessage(`El mensaje es mayor a ${textMaxLength} caracteres`, MESSAGE_TYPES.ERROR);
            return;
        }

        if (isEmpty(trim(text)) && !sendingAudio && !ignoreText) {
            return;
        }

        const { appId, source } = currentRoom;
        let { senderId } = currentRoom;
        const by = USER_TYPES.OPERATOR;

        const removePlus = source === "gupshup" || source === "wavy";
        if (removePlus) {
            senderId = senderId.replace("+", "");
        }

        const roomId = currentRoom.id;

        //SEND MESSAGE
        const formMessage = {
            appId,
            botId: appId,
            bubble: message,
            by,
            createdAt: dayjs().valueOf(),
            id: uuidv4(),
            roomId,
            senderId,
            source,
            userId: senderId,
        };

        // Add message to Redux
        changeRepliedRoom();
        dispatch(addMessage(formMessage));

        // Send message to server
        JelouApiV1.post(`/operators/message`, omit(formMessage, ["source"]))
            .then((res) => {
                const { data } = res;
                if (hasInsertedAIResponse) {
                    handleFeedback_BG({
                        event: "IA_Asesor_Send",
                        response: trim(text),
                        conversation_id,
                        identity: operatorId,
                    });
                }

                console.log(`Message sent:`, JSON.stringify(message, null, 2), get(data, "data.messageId", ""));
            })
            .catch((error) => {
                dispatch(
                    updateMessage({
                        ...formMessage,
                        status: "FAILED",
                    })
                );

                Sentry.configureScope((scope) => {
                    const data = isObject(error.response) ? JSON.stringify(error.response, null, 2) : error.response;
                    scope.setExtra("formMessage", formMessage);
                    scope.setExtra("userSession", userSession);
                    scope.setExtra("errorResponse", data);
                });

                Sentry.captureException(new Error(`( Room ) Send Message Failed With: ${error.message}`));
            });

        cleaner();
        dispatch(setInputMessage({ roomId, text: "" }));
    };

    const cleaner = () => {
        // setMessage({});
        setText("");
        setSendingAudio(false);
        setUploading(false);
        clearInterval(intervalId);
    };

    const openPreviewModal = () => {
        setShowPreview(true);
        // setUploadingFile(true);
        setShowEmoji(false);
    };

    const closePreviewModal = () => {
        cleaner();
        setShowPreview(false);
        setSelectedFile(null);
    };

    const handleSeletedFileToPreview = (file) => {
        setSelectedFile(file);
        openPreviewModal();
    };

    const addEmoji = (e) => {
        setShowEmoji(false);
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);

        setText(text + " " + emoji + " ");

        if (inputElement.current) {
            inputElement.current.focus();
        }

        dispatch(setInputMessage({ roomId: currentRoom.id, text: text + " " + emoji + " " }));
    };

    const closeTemplates = () => {
        setShowTemplates(false);
        setShowShorCut(false);
    };

    const operatorId = get(userSession, "operatorId", null);
    const BG_AI_OPERATOR = [3759, 3758, 3890, 3783, 3808, 1977, 1978, 573, 579, 6, 1, 1678, 4265];

    const isAiOperator = BG_AI_OPERATOR.includes(operatorId);

    const copyToClipBoard = (text) => {
        setText(text);
        dispatch(setInputMessage({ roomId: currentRoom.id, text }));
        closeTemplates();
    };

    const handleSendEvent = async (event) => {
        try {
            if (checkIfOperatorIsOnline(statusOperator)) {
                dispatch(setShowDisconnectedModal(true));
                return;
            }
            setSendingEvent(true);

            const { senderId: userId, appId: botId } = currentRoom;
            await JelouApiV1.post("/operators/event", {
                botId,
                userId,
                bubble: {
                    type: "EVENT_CUSTOM",
                    slug: event.slug,
                    description: event.name,
                },
            });
        } catch (error) {
            console.log("Error on send event", error);
        } finally {
            setSendingEvent(false);
            setShowEventModal(false);
        }
    };
    useEffect(() => {
        if (isEmpty(audioBlobs)) {
            setSendingAudio(false);
        }
    }, [audioBlobs]);

    const [isShortCutToShowPreview, setIsShortCutToShowPreview] = useState(false);

    const onCloseCustomPayment = useCallback(() => setShowCustomPaymentModal(false), []);
    const handleOpenCustomPayment = useCallback(() => setShowCustomPaymentModal(true), []);

    const onCloseRecurringPayment = useCallback(() => setShowRecurringPaymentModal(false), []);
    const handleOpenRecurringPayment = useCallback(() => setShowRecurringPaymentModal(true), []);

    const { plans } = usePaymentsPlans();
    const showRecurringPaymentButton = plans.length > 0;
    const abortController = new AbortController();

    const handleFeedback_BG = async ({ identity = "", conversation_id = "", response = "", history = [], name = "", feedback = "", event }) => {
        if (is_BG_company && isAiOperator) {
            try {
                const data = await fetch("https://8961050d-5115-41d9-b420-e88e48790855.trayapp.io", {
                    method: "POST",

                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        app_id: "914459672",
                        identity,
                        event,
                        properties: {
                            conversation_id, // identificador único de la conversación
                            ...(!isEmpty(history) && { message_history: history }), // un array de los últimos 20 mensajes en la conversación
                            response, // respuesta generada con la
                            ...(feedback && { feedback }),
                        },
                    }),
                });
                console.log("response HEAP", data);
            } catch (error) {
                console.log("error posting Heap", error);
            }
        }
    };
    return (
        <div ref={setReferenceElement} className="mx-2 mb-2 mt-1 rounded-xl border-default  border-gray-100/50">
            {showFileZone && (
                <FileZone
                    t={t}
                    uploadFile={uploadFile}
                    setSendingAudio={setSendingAudio}
                    sendingAudio={sendingAudio}
                    audiosUrl={audiosUrl}
                    setAudiosUrl={setAudiosUrl}
                    setAudioBlobs={setAudioBlobs}
                    audioBlobs={audioBlobs}
                    documentList={documentList}
                    handleDeleteImage={handleDeleteImage}
                    handleSelectFiles={handleSelectFiles}
                    setSelectedFile={handleSeletedFileToPreview}
                    uploadingDropZone={uploadingDropZone}
                    currentRoom={currentRoom}
                    isShortCutToShowPreview={isShortCutToShowPreview}
                    setDocumentList={setDocumentList}
                />
            )}
            <div className="relative my-auto flex w-full flex-row items-center pt-1 ">
                {isEmpty(audioBlobs) && (
                    <TextareaAutosize
                        autoFocus
                        className="h-11 w-full resize-none overflow-y-auto border-transparent bg-transparent align-middle text-base font-medium leading-normal text-gray-400 outline-none placeholder:text-gray-400 placeholder:text-opacity-65 focus:border-transparent focus:ring-transparent md:text-15"
                        maxRows={5}
                        minRows={2}
                        placeholder={"Escribe un mensaje"}
                        onChange={handleChange}
                        disabled={record || sendingAudio || !isEmpty(audioBlobs)}
                        value={text}
                        onKeyDown={(evt) => handleKeyDown(evt)}
                        ref={inputElement}
                    />
                )}
                {(isFacebookChat || isInstagramChat) && (
                    <div className={`pointer-events-none mr-2 mt-1 select-none text-sm font-semibold ${text.length > textMaxLength ? "text-red-675 opacity-75" : "text-gray-600 opacity-50"}`}>
                        {text.length}/{textMaxLength}
                    </div>
                )}
            </div>
            <div className="px-2 py-2 sm:px-3">
                <div className="flex items-center justify-between ">
                    <div className="flex items-center space-x-3">
                        <Attachments
                            handleOpenRecurringPayment={handleOpenRecurringPayment}
                            showRecurringPaymentButton={showRecurringPaymentButton}
                            customEvents={customEvents}
                            documentList={documentList}
                            disableButton={sendingAudio}
                            handleFile={handleSelectFiles}
                            isFacebookChat={isFacebookChat}
                            isFacebookFeed={isFacebookFeed}
                            isInstagramChat={isInstagramChat}
                            isTwitterChat={isTwitterChat}
                            isWhatsAppChat={isWhatsAppChat}
                            isWidget={isWidget}
                            openOptions={openOptions}
                            setOpenOptions={setOpenOptions}
                            setShowEmoji={setShowEmoji}
                            setShowEventModal={setShowEventModal}
                            handleOpenCustomPayment={handleOpenCustomPayment}
                            statusOperator={statusOperator}
                            checkIfOperatorIsOnline={checkIfOperatorIsOnline}
                            setShowDisconnectedModal={setShowDisconnectedModal}
                        />
                        {/* <EmojiPicker addEmoji={addEmoji} showEmoji={showEmoji} setShowEmoji={setShowEmoji} /> */}

                        <div ref={wrapperRef}>
                            <Popover className={"relative"}>
                                <Tippy content={"Emoji"} placement={"top"} touch={false}>
                                    <Popover.Button
                                        disabled={sendingAudio}
                                        className={
                                            " bg- flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-primary-350 hover:text-primary-200 disabled:text-gray-300 disabled:hover:bg-transparent"
                                        }
                                        onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                        <EmojiIcon className="fill-current text-inherit" width="95%" height="95%" />
                                    </Popover.Button>
                                </Tippy>
                                <Transition
                                    as={Fragment}
                                    show={showEmoji}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                    style={styles.emojiPicker}
                                >
                                    <Popover.Panel className="absolute bottom-[2.5rem] right-[1rem] z-120 ">
                                        <Picker
                                            theme={"light"}
                                            locale={"es"}
                                            emojiButtonSize={"28"}
                                            emojiSize={"18"}
                                            maxFrequentRows={"2"}
                                            data={data}
                                            previewPosition={"none"}
                                            onEmojiSelect={addEmoji}
                                            onClickOutside={() => setShowEmoji(false)}
                                        />
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                        </div>
                        <Tippy content={t("pma.Mensajes Rápidos")} disabled={sendingAudio} touch={false}>
                            <div className="flex cursor-pointer items-center rounded-full ">
                                <button
                                    disabled={sendingAudio}
                                    className="custom-file-upload flex h-5 w-5 cursor-pointer items-center rounded-full px-[2px] text-gray-400 hover:bg-primary-350 hover:text-primary-200 disabled:cursor-default disabled:text-gray-300 disabled:hover:bg-transparent"
                                    onClick={() => {
                                        setShowTemplates(true);
                                        setShowEmoji(false);
                                    }}
                                >
                                    <VoltIcon className=" text-inherit" height="90%" width="90%" />
                                </button>
                            </div>
                        </Tippy>
                        {isAiOperator && (
                            <div className="flex space-x-4 ">
                                <AIAnswerPanel
                                    t={t}
                                    abortController={abortController}
                                    text={text}
                                    hasInsertedAIResponse={hasInsertedAIResponse}
                                    setHasInsertedAIResponse={setHasInsertedAIResponse}
                                    handleFeedback_BG={handleFeedback_BG}
                                    setText={setText}
                                    answer={answer}
                                    setAnswer={setAnswer}
                                    generatingAIAnswer={generatingAIAnswer}
                                    setGeneratingAIAnswer={setGeneratingAIAnswer}
                                    referenceElement={referenceElement}
                                    setReferenceElement={setReferenceElement}
                                />

                                {/* <GrammarCheckerPanel t={t} referenceElement={referenceElement} setReferenceElement={setReferenceElement} /> */}
                            </div>
                        )}
                        {showPreview && <Preview isOpen={showPreview} onClose={closePreviewModal} selectedFile={selectedFile} />}
                        {showTemplates && (
                            <QuickReplyModal
                                copyToClipBoard={copyToClipBoard}
                                onClose={closeTemplates}
                                phone={`+${phone}`}
                                quickReply={true}
                                sendCustomText={sendTemplate}
                                setMessage={(da) => console.log("este es el setMessage de QuickReplyModal", da)}
                                setShowPreview={setShowPreview}
                                statusOperator={statusOperator}
                                checkIfOperatorIsOnline={checkIfOperatorIsOnline}
                                setShowDisconnectedModal={setShowDisconnectedModal}
                            />
                        )}
                        <div className="border-l-1 border-gray-100/50 pl-2">
                            <RecordAudio
                                setAudioBlobs={setAudioBlobs}
                                audioBlobs={audioBlobs}
                                cancelRecord={cancelRecord}
                                createMessage={createMessage}
                                currentRoom={currentRoom}
                                hasText={hasText}
                                intervalId={intervalId}
                                disableButton={(!isEmpty(audioBlobs) && audioBlobs.length >= 3) || !sendAudio || hasText || !isEmpty(documentList)}
                                isMobileApp={isMobileApp}
                                micPermission={micPermission}
                                record={record}
                                sendAudio={sendAudio}
                                sendingAudio={sendingAudio}
                                sendMessage={sendMessage}
                                setCancelRecord={setCancelRecord}
                                setIntervalId={setIntervalId}
                                setMessage={(da) => console.log("este es el setMessage de SendOptions", da)}
                                setMicPermission={setMicPermission}
                                setRecord={setRecord}
                                setSendingAudio={setSendingAudio}
                                setShowEmoji={setShowEmoji}
                                setUploading={setUploading}
                                showFileZone={showFileZone}
                                uploadFile={uploadFile}
                                uploading={uploading}
                                audioRef={audioRef}
                                t={t}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <SendMessage t={t} sendMessage={sendMessage} sendingAudio={sendingAudio} hasText={hasText} showFileZone={showFileZone} />
                    </div>
                </div>
                <Transition
                    show={showShortCut}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <div className="absolute bottom-0 left-0 z-100 mb-[3.3rem] ml-2 w-72 rounded-12 bg-white shadow-normal">
                        <TemplateShortCut
                            company={company}
                            copyToClipBoard={copyToClipBoard}
                            handleKeyDownShortCut={handleKeyDownShortCut}
                            onClose={closeTemplates}
                            showShortCut={showShortCut}
                            setSelectedFile={setSelectedFile}
                            setDocumentList={setDocumentList}
                            setIsShortCutToShowPreview={setIsShortCutToShowPreview}
                        />
                    </div>
                </Transition>
                {showEventModal && (
                    <EventsModal
                        closeEventsModal={() => setShowEventModal(false)}
                        customEvents={customEvents}
                        handleSendEvent={handleSendEvent}
                        sendingEvent={sendingEvent}
                        showEventModal={showEventModal}
                    />
                )}

                <CustomPayment createMessage={createMessage} onCloseCustomPayment={onCloseCustomPayment} showCustomPaymentModal={showCustomPaymentModal} />

                <RecurringPayment plans={plans} createMessage={createMessage} onCloseRecurringPayment={onCloseRecurringPayment} showRecurringPaymentModal={showRecurringPaymentModal} />
            </div>
        </div>
    );
};

export default PmaWebInputOptions;

const styles = {
    emojiPicker: {
        bottom: 34,
        left: 0,
    },
};
