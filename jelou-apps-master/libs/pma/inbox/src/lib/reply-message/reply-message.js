import React from "react";
import Tippy from "@tippyjs/react";
import { CloseIcon2 } from "@apps/shared/icons";
import get from "lodash/get";
import { useDispatch } from "react-redux";
import ContentMessage from "../content-message/content-message";
import { removeReplyId } from "@apps/redux/store";

const ReplyMessage = ({ message }) => {
    const dispatch = useDispatch();
    let name = get(message, "from.name", "Desconocido");

    if (get(message, "userId", "") !== get(message, "senderId", "")) {
        name = get(message, "from.name", "Tú");
    }

    const handleCloseReply = () => {
        dispatch(removeReplyId());
    };

    const type = get(message, "message.type", null);

    return (
        <div className="relative z-20 mx-1 mb-3 flex flex-row items-center rounded-md border-l-4 border-b-default border-primary-200 border-b-gray-35 bg-white py-3 pr-4 md:mx-1">
            <div className="static flex-col pl-4 md:pl-8">
                <div className="mb-1 text-13 font-bold uppercase text-primary-200">{name}</div>
                <div className="text-xs text-gray-400">
                    <ContentMessage message={message.message} />
                </div>
            </div>
            <div className="right-24 absolute inline-block">
                {(() => {
                    switch (type) {
                        case "IMAGE":
                            return <img alt="jpeg" className="h-12 w-12 rounded-default object-cover" src={message.message.mediaUrl} />;
                        default:
                            return <div></div>;
                    }
                })()}
            </div>
            <Tippy content="Cerrar" touch={false}>
                <div
                    className="absolute right-4 mr-1 h-8 w-8 cursor-pointer flex-row content-end items-center rounded-full text-white"
                    onClick={() => {
                        handleCloseReply();
                    }}>
                    <CloseIcon2
                        className="m-2 items-center fill-current text-right text-sm text-gray-100 hover:text-primary-200"
                        width="1rem"
                        height="1rem"
                    />
                </div>
            </Tippy>
        </div>
    );
};

export default ReplyMessage;
