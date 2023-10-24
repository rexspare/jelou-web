import { ChatIconInCircle, CloseIcon1, SettingsOptionsIcon } from "@apps/shared/icons";
import { TESTER_NAMES } from "../../constants";

const TesterChatHeader = (props) => {
    const { handleCloseChat, handleShowSettings } = props;

    return (
        <header className="flex h-20 items-center justify-between rounded-t-xl bg-primary-900 px-5 pt-5 pb-4">
            <div className="flex w-full items-center justify-between pr-5">
                <div className="flex items-center justify-start gap-x-3">
                    <ChatIconInCircle className="text-primary-900" />
                    <div className="leading-5">
                        <div className={`text-lg font-bold text-[#F8FAFC]`}>{TESTER_NAMES.HEADER_TITLE}</div>
                    </div>
                </div>
                <button
                    className="flex h-9 w-9 items-center justify-center justify-self-end rounded-full border-1 border-white p-4"
                    onClick={handleShowSettings}>
                    <SettingsOptionsIcon className="text-white" />
                </button>
            </div>
            <button onClick={handleCloseChat}>
                <CloseIcon1 width="14" height="14" className={`fill-current text-white`} />
            </button>
        </header>
    );
};

export default TesterChatHeader;
