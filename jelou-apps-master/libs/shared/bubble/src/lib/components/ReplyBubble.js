import React from "react";
import Clamp from "react-multiline-clamp";
import { MicIcon } from "@apps/shared/icons";
import get from "lodash/get";

const ReplyBubble = (props) => {
    const { bubbleSide, message } = props;

    const text = get(message, "bubble.text", get(message, "message.text"), "");
    const user = get(message, "from.name", "Tú");
    const type = get(message, "bubble.type", get(message, "message.type"), null);
    const mediaUrl = get(message, "bubble.mediaUrl", get(message, "message.mediaUrl"), null);

    return (
        <div className="mb-2 flex w-full">
            <div
                className={`rounded-m mb-1 flex w-full flex-row space-x-5 rounded-md py-2 pr-3 pl-4`}
                style={{
                    backgroundColor: bubbleSide === "right" ? "rgba(0, 179, 199, 0.1)" : "rgba(114, 124, 148, 0.1)",
                }}>
                <div className="flex flex-col">
                    <div className="mb-1 text-left text-13 font-bold uppercase" style={{ color: bubbleSide === "right" ? "#00B3C7" : "#727C94" }}>
                        {user}
                    </div>
                    {(() => {
                        switch (type) {
                            case "TEXT":
                                return (
                                    <div>
                                        <Clamp withTooltip lines={3}>
                                            <div className={`text-left text-sm text-gray-400`}>{text}</div>
                                        </Clamp>
                                    </div>
                                );
                            case "AUDIO":
                                return (
                                    <div className={`flex flex-row text-left text-sm text-gray-400`}>
                                        <MicIcon
                                            className="mr-2 fill-current text-gray-400"
                                            fill={`${bubbleSide === "right" ? "#00B3C7" : "#727C94"}`}
                                            width="1.125rem"
                                            height="1.125rem"
                                        />
                                        <span>Audio</span>
                                    </div>
                                );
                            case "DOCUMENT":
                                return (
                                    <div className={`flex flex-row text-left text-sm text-gray-400`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-5 w-5 opacity-50"
                                            viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <div>Documento</div>
                                    </div>
                                );
                            case "VIDEO":
                                return (
                                    <div className={`flex flex-row text-left text-sm text-gray-400`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                        <div>Video</div>
                                    </div>
                                );
                            case "LOCATION":
                                return (
                                    <div className={`flex flex-row text-left text-sm text-gray-400`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <div>Ubicación</div>
                                    </div>
                                );
                            case "IMAGE":
                                return (
                                    <div className={`flex flex-row text-left text-sm text-gray-400`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-5 w-5 opacity-50"
                                            viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <div>Imagen</div>
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })()}
                </div>
                <div className="flex items-end">
                    {(() => {
                        switch (type) {
                            case "IMAGE":
                                return <img alt="jpeg" className="h-8 w-8 rounded-default object-cover" src={mediaUrl} />;
                            default:
                                return null;
                        }
                    })()}
                </div>
            </div>
        </div>
    );
};

export default ReplyBubble;
