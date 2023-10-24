import { ModernSendIcon } from "@apps/shared/icons";
import Tippy from "@tippyjs/react";

const SendMessage = (props) => {
    const { t, sendMessage, sendingAudio, hasText, showFileZone } = props;

    const isDisabledButton = () => {
        if (sendingAudio) {
            return false;
        }

        if (hasText) {
            return false;
        }

        if (showFileZone) {
            return false;
        }

        return true;
    };
    const isDisabled = isDisabledButton();

    return (
        <Tippy content={t("pma.Enviar")} touch={false}>
            <div className={`flex h-6 w-6 items-center rounded-full border-transparent ${isDisabled ? "" : "hover:bg-primary-350"}  focus:outline-none`}>
                <button disabled={isDisabled} className={`flex h-8 w-8 items-center justify-center border-transparent focus:outline-none`} onClick={sendMessage}>
                    <ModernSendIcon className={`fill-current ${!isDisabled ? "text-primary-200" : "text-gray-300"} `} width="1.3rem" height="1.3rem" />
                </button>
            </div>
        </Tippy>
    );
};

export default SendMessage;
