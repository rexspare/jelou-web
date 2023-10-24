import React from "react";
import { MicIcon } from "@apps/shared/icons";
import truncate from "lodash/truncate";

function ContentMessage(message) {
    return (
        <div>
            {(() => {
                switch (message.message.type) {
                    case "TEXT":
                        return <div> {truncate(message.message.text, { length: 100 })}</div>;
                    case "AUDIO":
                        return (
                            <div className="flex flex-row">
                                <MicIcon className="fill-current pr-2 text-white" fill="#00B3C7" width="1.313rem" height="1.313rem" /> Audio
                            </div>
                        );
                    case "DOCUMENT":
                        return (
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Documento</span>
                            </div>
                        );
                    case "VIDEO":
                        return (
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                                <span>Video</span>
                            </div>
                        );
                    case "LOCATION":
                        return (
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Ubicación</span>
                            </div>
                        );
                    case "IMAGE":
                        return (
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Imagen</span>
                            </div>
                        );
                    default:
                        return <span>Archivo</span>;
                }
            })()}
        </div>
    );
}

export default ContentMessage;
