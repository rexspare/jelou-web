import React, { useRef, useEffect } from "react";
import get from "lodash/get";
import { LoadingSpinner } from "@apps/shared/icons";
import { transformAnswerSources } from "../../hooks/helpers";
import Answer from "./answerBubble";
import Question from "./questionBubble";

const HistoryMessages = (props) => {
    const { messages, isLoading } = props;
    const historyEndRef = useRef(null);

    useEffect(() => {
        historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {isLoading && (
                <div className="mx-auto mt-3 flex h-7 w-14 items-center justify-center p-3">
                    <LoadingSpinner size={"0.25rem"} />
                </div>
            )}
            {messages?.map((message, index) => {
                const question = get(message, "question", "");
                const createdAt = get(message, "created_at", "");
                const answer = transformAnswerSources({
                    message,
                    isMessageFromHistory: true,
                });
                const aIResponse = get(answer, "answer", "");
                const sources = get(answer, "sources", []);

                return (
                    <React.Fragment key={`messages-from-history-${index}`}>
                        <Question createdAt={createdAt} question={question} />
                        <Answer index={index} answer={aIResponse} sources={sources} createdAt={createdAt} />
                    </React.Fragment>
                );
            })}
            <div ref={historyEndRef}></div>
        </>
    );
};

export default HistoryMessages;
