import React from "react";
import { withTranslation } from "react-i18next";

const MoreOptionsMobile = (props) => {
    const { handleReply, t, openNewChat, setOpen, copyToClipboard } = props;
    const inbox = props.inbox;

    return (
        <div id="tooltip" role="tooltip">
            {inbox ? (
                <div className="flex cursor-pointer items-center py-3 px-4 hover:bg-gray-30" onClick={handleReply}>
                    <div className="relative mr-2 flex flex-col">
                        <div className="text-right text-sm font-bold text-gray-400">{t("pma.Responder")}</div>
                    </div>
                </div>
            ) : (
                <>
                    <div
                        className="flex cursor-pointer items-center py-3 px-4 hover:bg-gray-30"
                        onClick={() => {
                            openNewChat(props.message);
                            setOpen(false);
                        }}>
                        <div className="relative mr-2 flex flex-col">
                            <div className="text-right text-sm font-bold text-gray-400">{t("pma.Reenviar")}</div>
                        </div>
                    </div>
                    <div className="flex cursor-pointer items-center py-3 px-4 hover:bg-gray-30" onClick={() => copyToClipboard(props.message)}>
                        <div className="relative mr-2 flex flex-col">
                            <div className="text-right text-sm font-bold text-gray-400">{t("pma.Copiar")}</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default withTranslation()(MoreOptionsMobile);
