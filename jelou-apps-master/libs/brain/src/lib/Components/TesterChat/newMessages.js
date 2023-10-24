import get from "lodash/get";
import { useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";

import { TESTER_SENDER } from "../../constants";
import Answer from "./answerBubble";
import Question from "./questionBubble";

const NewMessages = ({ messages, isLoading }) => {
    const newMessagesEndRef = useRef(null);

    useEffect(() => {
        newMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {messages?.map((message, index) => {
                const sender = get(message, "by", "");
                const question = get(message, "question", "");
                const aIResponse = get(message, "answer.answer", "");
                const sources = get(message, "answer.sources", []);
                const createdAt = get(message, "created_at", new Date());

                if (sender === TESTER_SENDER.USER) {
                    return <Question key={`question-${index}`} question={question} createdAt={createdAt} />;
                } else if (sender === TESTER_SENDER.ARTIFICIAL_INTELLIGENCE) {
                    return <Answer key={`answer-${index}`} index={index} answer={aIResponse} sources={sources} createdAt={createdAt} />;
                }
                return null;
            })}
            {isLoading && (
                <div className="flex h-7 w-14 items-center justify-center rounded-xl bg-primary-350 p-3">
                    <BeatLoader color={"#727C94"} size={"0.25rem"} />
                </div>
            )}
            <div ref={newMessagesEndRef}></div>
        </>
    );
};

export default NewMessages;
