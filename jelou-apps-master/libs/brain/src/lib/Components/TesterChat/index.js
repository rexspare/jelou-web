//// @ts-check

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { TESTER_DEFAULT_MODEL_OPTIONS, TESTER_SENDER } from "../../constants";
import { transformAnswerSources } from "../../hooks/helpers";
import { useChatHistory } from "../../services/brainAPI";
import TesterChatBubbleContainer from "./bubbleContainer";
import ChatSettings from "./chatSettings";
import TesterChatHeader from "./header";
import TesterChatInboxContainer from "./inboxContainer";

import { TesterRepository } from "./conversationTester/TesterRespository";
import { ConvesationTester } from "./conversationTester/conversation.hook";

const TesterChat = ({ isOpen, onClose, messages, setMessages }) => {
    const userSession = useSelector((state) => state.userSession);
    const datastore = useSelector((state) => state.datastore);
    const showTesterChat = useSelector((state) => state.showTesterChat);
    const [question, setQuestion] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [chatSettings, setChatSettings] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [answerIA, setAnswerIA] = useState("");

    const { id: userId } = userSession;
    const datastoreId = datastore?.id;

    useEffect(() => {
        if (datastore) {
            const { settings = {} } = datastore;
            if (isEmpty(settings)) {
                setChatSettings(TESTER_DEFAULT_MODEL_OPTIONS);
            } else {
                const { model = "", minimum_score = "", temperature = "" } = settings;
                if (isEmpty(model) || isEmpty(minimum_score) || isEmpty(temperature)) {
                    setChatSettings({ ...settings, ...TESTER_DEFAULT_MODEL_OPTIONS });
                } else {
                    setChatSettings(settings);
                }
            }
        }
    }, [datastore]);

    const { data, isLoading: isLoadingHistory } = useChatHistory({ datastoreId, showTesterChat, userId });

    if (!isOpen) {
        return null;
    }

    const handleShowSettings = () => {
        setShowSettings(true);
    };

    const handleInputChange = (event) => {
        const text = event.target.value;
        setQuestion(text);
        event.preventDefault();
    };

    const sendUserQuestion = async (question) => {
        setIsLoading(true);

        const answerSources = {
            datastoreId,
            question,
            reference_id: userId?.toString(),
            chatSettings,
        };

        const testerRepository = new TesterRepository();
        const conversationTester = new ConvesationTester(testerRepository, setAnswerIA);

        try {
            const answerSourcesResponse = await conversationTester.getAnswerSources({ answerSources });
            const response = await conversationTester.sendQuestion({ answerSources, answerSourcesResponse, setIsLoading });
            const log = get(response, "log", {});

            if (!isEmpty(log.context)) {
                testerRepository.saveLog({ datastoreId, log });
            }

            const answer = transformAnswerSources({
                message: log,
                isMessageFromHistory: true,
            });

            const aiMessage = {
                by: TESTER_SENDER.ARTIFICIAL_INTELLIGENCE,
                answer,
            };

            setMessages((prevValues) => [...prevValues, aiMessage]);
        } catch (error) {
            console.log("Error while getting the answer");
        }
        setAnswerIA("");
        setIsLoading(false);
    };

    const handleSendMessage = () => {
        if (question.trim() !== "") {
            const userMessage = {
                by: TESTER_SENDER.USER,
                question,
                created_at: new Date(),
            };
            setMessages((prevValues) => [...prevValues, userMessage]);
            sendUserQuestion(question).catch((error) => {
                console.error(error);
            });
            setQuestion("");
        }
    };

    const handleCloseChat = () => {
        setMessages([]);
        setShowSettings(false);
        onClose();
        setQuestion("");
    };

    return (
        <div
            className={`fixed bottom-5 right-0 mb-8 mr-5 flex h-full w-[404px]  flex-col overflow-hidden rounded-xl bg-white shadow-md transition-transform duration-300 mid:mb-12 mid:mr-10 lg:mb-10 lg:mr-12 xl:mb-12 ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
                filter: isOpen ? "drop-shadow(0px 4px 12px rgba(1, 27, 52, 0.16))" : "none",
                height: isOpen ? "80%" : "auto",
            }}>
            <TesterChatHeader handleCloseChat={handleCloseChat} handleShowSettings={handleShowSettings} />
            <TesterChatBubbleContainer
                answerIAStream={answerIA}
                messages={messages}
                isLoading={isLoading}
                data={data}
                isLoadingHistory={isLoadingHistory}
            />
            <TesterChatInboxContainer
                question={question}
                handleMessageChange={handleInputChange}
                handleSendMessage={handleSendMessage}
                isLoading={isLoading}
                isLoadingHistory={isLoadingHistory}
            />
            {/* {showSettings && ( */}
            <ChatSettings
                chatSettings={chatSettings}
                setChatSettings={setChatSettings}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
            />
            {/* )} */}
        </div>
    );
};

export default TesterChat;
