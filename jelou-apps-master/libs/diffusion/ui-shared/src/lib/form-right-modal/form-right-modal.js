import { useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { withTranslation } from "react-i18next";

import { CloseIcon } from "@apps/shared/icons";

const FormRightModal = (props) => {
    const cancelButton = "focus:outline-none w-40 rounded-20 border-1 border-transparent bg-gray-10 p-2 text-base font-bold text-gray-400";
    const buttonActivated = "button button-primary focus:outline-none w-40";
    const { agreeString, refuseString, onConfirm, onClose, children, title, loading, t } = props;

    const handler = (e) => {
        if (e.keyCode === 27) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("keyup", handler);
        return () => {
            document.removeEventListener("keyup", handler);
        };
    }, []);

    return (
        <div className="max-w-xxl relative z-50 flex h-full w-full flex-col overflow-hidden  bg-white opacity-100 shadow-modal">
            <button className="absolute right-0 mt-6 mr-6" onClick={onClose}>
                <CloseIcon className="fill-current text-[#727C94] opacity-30 " width="0.8rem" height="0.8rem" />
            </button>
            <h1 className="flex items-center px-8 pt-8 font-sans text-[20px] font-bold text-primary-200">
                <div className="w-15 truncate pr-1">{title}</div>
            </h1>
            {children && <div className="min-w-125 block w-full overflow-x-hidden overflow-y-scroll px-8 pt-2 pb-4">{children}</div>}

            {(agreeString || refuseString) && (
                <div className="relative justify-end py-4">
                    <div className="flex w-full justify-end space-x-3 px-6 py-3">
                        {refuseString && (
                            <button onClick={onClose} className={cancelButton}>
                                {t(`${refuseString}`)}
                            </button>
                        )}
                        {agreeString && (
                            <button onClick={onConfirm} className={buttonActivated} disabled={loading}>
                                {loading ? <BeatLoader size={"0.5rem"} color={"#e1e1e1"} className="" /> : t(`${agreeString}`)}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default withTranslation()(FormRightModal);
