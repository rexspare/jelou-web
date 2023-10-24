import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, EmojiIcon, MinusCircleIcon, PremiumCrown, StarsIcon, YogaIcon } from "@apps/shared/icons";
import { Menu, Popover, Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";
import { usePopper } from "react-popper";
import { useSelector } from "react-redux";
import get from "lodash/get";
import toUpper from "lodash/toUpper";
import { filterByKey, readStream } from "@apps/shared/utils";
import { BeatLoader } from "react-spinners";
import isEmpty from "lodash/isEmpty";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BG_API } from "@apps/pma/service";
import sortBy from "lodash/sortBy";
import LastMessagesSelector from "./LastMessagesSelector";
import { JelouApiPma } from "@apps/shared/modules";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { setAnswerAIQueue, updateAnswerAIQueue } from "@apps/redux/store";

const AIAnswerPanel = (props) => {
    const { referenceElement, t, setAnswer, answer, handleFeedback_BG, setHasInsertedAIResponse, setText, generatingAIAnswer, setGeneratingAIAnswer } = props;

    const [popperElement, setPopperElement] = useState();
    const [currentAIAnswerData, setCurrentAIAnswerData] = useState("");
    const [showModal, setShowModal] = useState(false);
    const { styles, attributes } = usePopper(referenceElement, popperElement);
    const [selectedHistoryOption, setSelectedHistoryOption] = useState({
        value: 15,
    }); //["neutral", "positive", "negative"
    const currentRoom = useSelector((state) => state.currentRoom);
    const userSession = useSelector((state) => state.userSession);
    const messages = useSelector((state) => state.messages);
    const userId = get(currentRoom, "conversation.user.id", "");
    const userName = get(currentRoom, "metaData.name", get(userSession, "names", ""));
    const company = get(userSession, "companyId", {});
    const conversation_id = get(currentRoom, "conversation._id", "");
    const is_BG_company = company === 155;
    const { section = "chats" } = useParams();
    const operatorId = get(userSession, "operatorId", "");
    const [answerMode, setAnswerMode] = useState("neutral");

    // get lang from localstorage
    const lang = localStorage.getItem("lang") || "es";
    const dispatch = useDispatch();

    const messagesLengthRef = useRef(15);
    let isArchived = toUpper(section) === "ARCHIVED";
    const answerAIQueue = useSelector((state) => state.answerAIQueue);
    const conversationMessages = !isArchived
        ? filterByKey(messages, "roomId", currentRoom.id)
        : messages.filter((message) => {
              return message.roomId === get(currentRoom, "id", "_id");
          });

    const getLastMessages = (messagesArr) => {
        const sortedMessages = sortBy(messagesArr, (data) => {
            const fecha = new Date(data.createdAt);
            if (isValidDate(fecha)) {
                return new Date(data.createdAt);
            } else {
                return new Date(data.createdAt);
            }
        });

        return sortedMessages;
    };

    useEffect(() => {
        if (is_BG_company && !generatingAIAnswer && currentAIAnswerData?.done && !currentAIAnswerData?.error?.status && currentAIAnswerData?.feedbackStatus === "notSent") {
            try {
                // const maskedMessages = async () => await getMessagesMasked(getConversationHistory({ messagesLength: selectedHistoryOption.value }));
                const maskedMessages = get(currentAIAnswerData, "maskedMessagesResponse", []);
                handleFeedback_BG({
                    response: currentAIAnswerData.response,
                    conversation_id,
                    event: "IA_Asesor_Generate",
                    identity: operatorId,
                    history: maskedMessages,
                });
                dispatch(updateAnswerAIQueue({ ...currentAIAnswerData, feedbackStatus: "response" }));
            } catch (error) {
                console.log("error", error);
            }
        }
        if (!generatingAIAnswer && currentAIAnswerData?.done && !currentAIAnswerData?.error?.status) {
            setAnswer(currentAIAnswerData?.response, "No se obtuvo una respuesta, vuelve a intentar por favor");
        }
    }, [currentAIAnswerData]);

    const isValidDate = (d) => {
        return d instanceof Date && !isNaN(d);
    };

    const sugestions = [
        {
            id: 1,
            title: "Neutral",
            icon: <YogaIcon className={`fill-current  ${answerMode === "neutral" ? "text-green-960" : "text-gray-400"}`} width="1.25rem" height="1.25rem" />,
            text_color: answerMode === "neutral" ? "text-green-960" : "text-gray-400",
            bg_color: answerMode === "neutral" ? "bg-[#E9F5F3]" : "bg-gray-50",
            mode: "neutral",
        },
        {
            id: 2,
            title: t("pma.Agregar emoji"),
            icon: <EmojiIcon className={`fill-current  ${answerMode === "with-emoji" ? "text-green-960" : "text-primary-200"}`} width="1.25rem" height="1.25rem" />,
            text_color: answerMode === "with-emoji" ? "text-green-960" : "text-primary-200",
            bg_color: answerMode === "with-emoji" ? "bg-[#E9F5F3]" : "bg-primary-600",
            mode: "with-emoji",
        },
        {
            id: 3,
            title: t("pma.Elegante"),
            icon: <PremiumCrown className={`fill-current ${answerMode === "formal" ? "text-green-960" : " text-[#EEBE39]"}`} width="1.25rem" height="1.25rem" />,
            bg_color: answerMode === "formal" ? "bg-[#E9F5F3]" : "bg-[#FFECB7]",
            text_color: answerMode === "formal" ? "text-green-960" : " text-[#EEBE39]",
            mode: "formal",
        },
        {
            id: 4,
            title: t("pma.Más corto"),
            icon: <MinusCircleIcon className={`fill-current  ${answerMode === "concise" ? "text-green-960" : "text-gray-400"}`} width="1.25rem" height="1.25rem" />,
            bg_color: answerMode === "concise" ? "bg-[#E9F5F3]" : "bg-gray-34 bg-opacity-70",
            text_color: answerMode === "concise" ? "text-green-960" : "text-gray-610",
            mode: "concise",
        },
        {
            id: 5,
            title: t("pma.Inspiracional"),
            icon: <StarsIcon className={`fill-current  ${answerMode === "enthusiastic" ? "text-green-960" : "text-[#1990ff]"}`} width="1.25rem" height="1.25rem" />,
            text_color: answerMode === "enthusiastic" ? "text-green-960" : "text-[#1990ff]",
            bg_color: answerMode === "enthusiastic" ? "bg-[#E9F5F3]" : "bg-[#e8f4ff]",
            mode: "enthusiastic",
        },
        {
            id: 6,
            title: t("pma.Experto Tech"),
            icon: <StarsIcon className={`fill-current  ${answerMode === "tech-expert" ? "text-green-960" : "text-[#1990ff]"}`} width="1.25rem" height="1.25rem" />,
            text_color: answerMode === "tech-expert" ? "text-green-960" : "text-[#1990ff]",
            bg_color: answerMode === "tech-expert" ? "bg-[#E9F5F3]" : "bg-[#e8f4ff]",
            mode: "tech-expert",
        },
    ];

    useEffect(() => {
        if (messagesLengthRef.current !== selectedHistoryOption.value && !isEmpty(selectedHistoryOption)) {
            handleGenerateAnswer(answerMode, true, true);
            messagesLengthRef.current = selectedHistoryOption.value;
        }
    }, [selectedHistoryOption]);

    const getMessagesMasked = async (messagesHistory) => {
        const messagesParsed = messagesHistory.map((message) => {
            return {
                type: "TEXT",
                text: is_BG_company ? message?.message : message?.text ?? "",
            };
        });

        try {
            const {
                data: {
                    data: { results },
                },
            } = await JelouApiPma.post("/v1/data_loss_prevention/mask", {
                messages: messagesParsed,
            });
            if (results) {
                if (is_BG_company) {
                    // take a copy of messagesHistory and replace the text with the masked text
                    const maskedMessages = messagesHistory.map((message, index) => {
                        return {
                            ...message,
                            message: results[index].text,
                        };
                    });
                    return maskedMessages;
                }
                const maskedMessages = messagesHistory.map((message, index) => {
                    return {
                        ...message,
                        text: results[index].text,
                    };
                });
                return maskedMessages;
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const answerQueue = useSelector((state) => state.answerAIQueue);
    const getAIAnswerStatus = () => {
        const answerQueueByConversation = answerQueue?.filter((answer) => answer.conversation_id === conversation_id) ?? [];
        if (!isEmpty(answerQueueByConversation)) {
            setGeneratingAIAnswer(answerQueueByConversation[0].inProgress);
        }
    };
    useEffect(() => {
        getAIAnswerStatus();

        setCurrentAIAnswerData(answerQueue.find((answer) => answer.conversation_id === conversation_id) ?? []);
    }, [answerQueue]);

    const getConversationHistory = ({ messagesLength = 15 }) => {
        const textMessages = [];
        // get last 15 messages
        const orderedMessages = getLastMessages(conversationMessages);

        if (is_BG_company) {
            orderedMessages.forEach((message) => {
                if (toUpper(message?.message?.type) === "TEXT" && (toUpper(message?.by) === "USER" || toUpper(message?.by) === "OPERATOR"))
                    textMessages.push({ user: message?.by?.toUpperCase() === "USER" ? "cliente" : "operador", message: message.message.text });
            });
            return textMessages.slice(-20);
        }

        orderedMessages.forEach((message) => {
            if (toUpper(message?.message?.type) === "TEXT" && (toUpper(message?.by) === "USER" || toUpper(message?.by) === "OPERATOR"))
                textMessages.push({ by: message?.by, text: message.message.text });
        });

        return textMessages.slice(-messagesLength);
    };

    const handleInsertAnswer = async () => {
        setText((currentText) => currentText + " " + answer);
        setAnswer("");
        setHasInsertedAIResponse(true);
        if (is_BG_company && !currentAIAnswerData?.error?.status) {
            try {
                // const maskedMessages = await getMessagesMasked(getConversationHistory({ messagesLength: selectedHistoryOption.value }));

                handleFeedback_BG({
                    feedback: "aprobado",
                    response: answer,
                    name: userName,
                    conversation_id,
                    event: "IA_Asesor_Feedback",
                    identity: operatorId,
                    history: currentAIAnswerData.maskedMessagesResponse,
                });
            } catch (error) {
                console.log("error", error);
            }
        }
        if (!isEmpty(answerAIQueue) && !isEmpty(currentAIAnswerData)) {
            const filteredAnswerQueue = answerAIQueue.filter((answer) => answer.conversation_id !== conversation_id);
            dispatch(setAnswerAIQueue(filteredAnswerQueue));
        }
        setAnswerMode("neutral");
        setShowModal(false);
    };

    const handleOmitAnswer = () => {
        setHasInsertedAIResponse(false);
        if (is_BG_company && !currentAIAnswerData?.error?.status) {
            try {
                handleFeedback_BG({
                    feedback: "rechazado",
                    response: currentAIAnswerData.response,
                    conversation_id,
                    event: "IA_Asesor_Feedback",
                    identity: operatorId,
                    history: currentAIAnswerData.maskedMessagesResponse,
                });

                setAnswer("");
                setShowModal(false);
            } catch (error) {
                console.log("error", error);
            }
        }

        if (!isEmpty(answerAIQueue) && !isEmpty(currentAIAnswerData)) {
            const filteredAnswerQueue = answerAIQueue.filter((answer) => answer.conversation_id !== conversation_id);
            dispatch(setAnswerAIQueue(filteredAnswerQueue));
        }
        setAnswerMode("neutral");
        setShowModal(false);
    };

    const cleanElemnentFromAnswerQueue = (conversation_id) => {
        const filteredAnswerQueue = answerAIQueue.filter((answer) => answer.conversation_id !== conversation_id);
        dispatch(setAnswerAIQueue(filteredAnswerQueue));
    };
    const handleGenerateAnswer = async (mode = answerMode, show = false, retry = false) => {
        setShowModal(show);
        if (!retry) {
            if (currentAIAnswerData?.done || currentAIAnswerData?.inProgress) return;
        } else {
            cleanElemnentFromAnswerQueue(conversation_id);
        }

        setGeneratingAIAnswer(true);
        const requestIdRef = uuidv4();
        let requestData = {};
        if (answer) setAnswer("");

        if (is_BG_company) {
            const maskedMessagesResponse = await getMessagesMasked(getConversationHistory({ messagesLength: selectedHistoryOption.value }));
            try {
                const requestData = {
                    done: false,
                    inProgress: true,
                    requestId: requestIdRef,
                    conversation_id,
                    feedbackStatus: "notSent",
                    event: "IA_Asesor_Generate",
                    maskedMessagesResponse,
                    error: {
                        status: false,
                        message: "",
                    },
                };
                if (!retry) {
                    dispatch(setAnswerAIQueue([requestData]));
                }

                const { data } = await BG_API.post("/", {
                    name: userName,
                    message_history: maskedMessagesResponse,
                    // message_history: ["hola", "como esta", "no veo mis movimientos"], // BG example history
                    user_id: operatorId, //identificador del usuario
                    conversation_id: conversation_id,
                });
                setGeneratingAIAnswer(false);

                dispatch(updateAnswerAIQueue({ ...requestData, done: true, inProgress: false, response: data.response }));
            } catch (error) {
                if (error.status === 524) {
                    toast.error("Se ha excedido el tiempo de espera, por favor intente de nuevo");
                } else {
                    toast.error("No se pudo generar la respuesta");
                }
                if (error?.response?.data?.response) {
                    setAnswer(error?.response?.data?.response);
                    setGeneratingAIAnswer(false);
                }
                dispatch(updateAnswerAIQueue({ ...requestData, done: true, inProgress: false, error: { status: true, message: "Ha ocurrido un error en la generación de la respuesta" } }));
                console.log("error", error);
            }

            return;
        }
        try {
            const maskedMessagesResponse = await getMessagesMasked(getConversationHistory({ messagesLength: selectedHistoryOption.value }));

            requestData = {
                done: false,
                inProgress: true,
                requestId: requestIdRef,
                conversation_id,
                maskedMessagesResponse,
                error: {
                    status: false,
                    message: "",
                },
            };
            if (answerAIQueue.find((answer) => answer.conversation_id === conversation_id)) {
                dispatch(updateAnswerAIQueue({ ...requestData, done: false, inProgress: true }));
            } else {
                const newAnswerQueue = [...answerAIQueue, requestData];
                dispatch(setAnswerAIQueue(newAnswerQueue));
            }
            const response = await fetch(" https://ai-functions.jelou.ai/connect/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic MDFIMzAzUEMxUTNNM05CSjlKSFcwOVkzUEU6ZDQ5NjE0NTMtNjA1OS00N2M1LTkxODktMDZkOTg4YzI4Njk3",
                },
                body: JSON.stringify({
                    mode,
                    lang,
                    history: maskedMessagesResponse,
                    model: "gpt-3.5-turbo",
                    temperature: 0,
                }),
            });

            const answerComplete = await readStream(response, setAnswer);

            if (answerComplete) {
                setGeneratingAIAnswer(false);
                dispatch(updateAnswerAIQueue({ ...requestData, done: true, inProgress: false, response: answerComplete }));
            }
        } catch (error) {
            console.log("error", error);
            setGeneratingAIAnswer(false);
            dispatch(updateAnswerAIQueue({ ...requestData, done: true, inProgress: false, error: { status: true, message: "Ha ocurrido un error en la generación de la respuesta" } }));
            toast.error("Ha ocurrido un error en la generación de la respuesta");
        }
    };

    const scrollRightButton = document.getElementById("scrollRightButton");
    const scrollLeftButton = document.getElementById("scrollLeftButton");
    const scrollContainer = document.querySelector(".scroll-container");
    const scrollAmount = 100;

    useEffect(() => {
        if (scrollContainer && scrollRightButton && scrollLeftButton) {
            scrollRightButton.addEventListener("click", () => {
                scrollContainer.scrollLeft += scrollAmount;
            });
            scrollLeftButton.addEventListener("click", () => {
                scrollContainer.scrollLeft -= scrollAmount;
            });
        }
    }, [scrollContainer, scrollRightButton, scrollLeftButton]);

    const statusColor = (status) => {
        if (generatingAIAnswer) return "bg-yellow-500";
        if (!isEmpty(currentAIAnswerData) && currentAIAnswerData?.done) return "bg-green-600";
        if (!isEmpty(currentAIAnswerData) && currentAIAnswerData?.error?.status) return "bg-red-500";

        return "bg-primary-200";
    };
    const onChangeLastMessagesOption = () => {
        if (!isEmpty(answerAIQueue) && !isEmpty(currentAIAnswerData)) {
            dispatch(updateAnswerAIQueue({ ...currentAIAnswerData, done: false, inProgress: false }));
        }
    };

    return (
        <Popover as={"div"}>
            <Tippy theme="success" content={generatingAIAnswer ? t("pma.Generando respuesta") : currentAIAnswerData.done ? t("pma.Respuesta generada") : t("pma.Generar respuesta")} touch={false}>
                <Popover.Button onClick={() => handleGenerateAnswer(null, !showModal)} className="relative  flex h-full items-center rounded-full hover:cursor-pointer hover:bg-primary-350">
                    <div className=" h-4 w-4 cursor-pointer select-none rounded-full hover:bg-primary-350  ">
                        <StarsIcon className="fill-current text-gray-400 hover:text-primary-200" height="95%" witdh="95%" />
                    </div>
                    <span className="absolute -right-[5px] -top-[5px] flex h-3 w-3 items-center justify-center">
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${generatingAIAnswer ? "bg-yellow-400" : ""} opacity-75`}></span>
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${statusColor()}`}></span>
                    </span>
                </Popover.Button>
            </Tippy>
            {/* {generatingAIAnswer && !answer && <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-400 bg-opacity-50"></div>} */}
            <Transition
                static={true}
                show={showModal}
                as={Fragment}
                enter="transition duration-150 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Popover.Panel
                    static={true}
                    ref={setPopperElement}
                    style={{ ...styles.popper }}
                    className={"z-120 w-[98%] !translate-x-[0.5rem] !-translate-y-[8rem] rounded-xl shadow-boxCentered"}
                    {...attributes.popper}
                >
                    {({ close }) => (
                        <div className="w-full rounded-xl bg-white ">
                            <header className="mb-5 flex items-center justify-between rounded-t-xl bg-primary-600 py-2 px-6">
                                <div className="flex items-center gap-3 ">
                                    <StarsIcon className={"text-primary-200"} width={"1.2rem"} />
                                    <div className="max-w-56 md:max-w-128 truncate pr-3 text-base font-semibold  text-primary-200 ">{t("pma.Generar respuesta con AI")}</div>
                                </div>
                                {/* <Tippy disabled={!generatingAIAnswer} trigger="mouseenter" placement="top" theme="light" content={t("Puedes cerrar e")}> */}
                                <button onClick={() => setShowModal(false)} className={` `}>
                                    <CloseIcon className=" fill-current text-primary-200" width="0.8rem" height="0.8rem" />
                                </button>
                                {/* </Tippy> */}
                            </header>
                            <div className=" flex flex-col justify-between px-6 py-1">
                                <p className="text-sm text-gray-610">
                                    {(generatingAIAnswer || !answer) && (
                                        <span className="pr-1">
                                            <BeatLoader color="gray" size={4} />
                                        </span>
                                    )}
                                    <span>{answer}</span>
                                </p>
                            </div>
                            <nav className="flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-3 self-end">
                                    {/* <button>
                                        <ChevronLeftIcon className=" w-4 text-gray-400 hover:text-primary-200" />
                                    </button> */}
                                    {!is_BG_company && (
                                        <span className="text-gray-400">
                                            {/* {1} / {5} */}
                                            <LastMessagesSelector
                                                onChangeOption={onChangeLastMessagesOption}
                                                disabled={generatingAIAnswer}
                                                selectedHistoryOption={selectedHistoryOption}
                                                setSelectedHistoryOption={setSelectedHistoryOption}
                                            />
                                        </span>
                                    )}
                                    {/* <button>
                                        <ChevronRightIcon className="w-4 text-gray-400 hover:text-primary-200" width={"1.2rem"} />
                                    </button> */}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={!answer || generatingAIAnswer}
                                        onClick={() => (currentAIAnswerData.error.status ? handleGenerateAnswer(null, true, true) : handleOmitAnswer())}
                                        className="rounded-xxl  bg-gray-34 py-2 px-3 text-sm font-semibold text-gray-610 hover:bg-opacity-70 disabled:bg-gray-200 disabled:text-gray-300 disabled:hover:cursor-not-allowed"
                                    >
                                        {t("common.omitir")}
                                    </button>
                                    <button
                                        disabled={!answer || generatingAIAnswer}
                                        onClick={() => {
                                            handleInsertAnswer();
                                            setShowModal(false);
                                        }}
                                        className="flex rounded-xxl bg-primary-200 py-2 px-3 text-sm font-semibold text-white hover:bg-opacity-70 disabled:bg-gray-200 disabled:hover:cursor-not-allowed"
                                    >
                                        <span>{currentAIAnswerData?.error?.status ? t("Intentar de nuevo") : t("common.insertar")}</span>
                                    </button>
                                </div>
                            </nav>
                            {!is_BG_company && (
                                <footer className="flex items-center justify-between border-t-default border-gray-100/50  pl-6 pr-10">
                                    <div className=" flex w-full">
                                        <span className="mr-2 flex items-center text-sm font-semibold text-gray-400">{t("common.sugerencias")}:</span>
                                        <button id="scrollLeftButton" className="pr-1">
                                            <ChevronLeftIcon className=" text-gray-400 hover:text-primary-200" width={"1rem"} />
                                        </button>
                                        <div className=" scroll-container flex h-14 items-center gap-2 overflow-x-hidden">
                                            {sugestions.map((sugestion, index) => (
                                                <button
                                                    onClick={() => {
                                                        handleGenerateAnswer(sugestion.mode, true, true);
                                                        setAnswerMode(sugestion.mode);
                                                    }}
                                                    key={index}
                                                    disabled={generatingAIAnswer}
                                                    className={`relative ${
                                                        answerMode === sugestion.mode ? "border-default border-green-960" : ""
                                                    } flex flex-1 items-center rounded-lg px-2 py-1 hover:bg-opacity-70 disabled:hover:cursor-not-allowed ${sugestion.bg_color} `}
                                                >
                                                    {sugestion.icon}
                                                    <p className={`ml-2  flex whitespace-nowrap  text-sm font-medium ${sugestion.text_color}`}>{sugestion.title}</p>
                                                    {answerMode === sugestion.mode && (
                                                        <span className="absolute top-[-8px] right-[-7px] rounded-full bg-white p-1 ">
                                                            <CheckCircleIcon className=" text-green-960" width={"0.75rem"} />
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button id="scrollRightButton" className="pl-1">
                                        <ChevronRightIcon className=" text-gray-400 hover:text-primary-200" width={"1rem"} />
                                    </button>
                                </footer>
                            )}
                        </div>
                    )}
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default AIAnswerPanel;
