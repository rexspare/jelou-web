import ReactDOM from "react-dom";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { CloseIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";

const FormModal = React.forwardRef((props, ref) => {
    const { children, onClose, title } = props;
    const { t } = useTranslation();
    let maxWidth = props.maxWidth ? props.maxWidth : "md:min-w-84 md:max-w-4xl";
    const canOverflow = props.canOverflow ? "md:overflow-y-auto" : "md:overflow-visible";
    const background = props.background ? props.background : "bg-white";

    useOnClickOutside(ref, onClose);

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

    return ReactDOM.createPortal(
        <div className="fixed inset-x-0 top-0 z-[130] overflow-auto px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            <div
                className={`${background} transform rounded-xl px-4 pt-5 pb-4 shadow-modal transition-all sm:min-w-350 ${maxWidth} max-h-content-mobile overflow-y-auto sm:max-h-content sm:p-8 ${canOverflow}`}>
                <div className="mb-3 flex items-center justify-between pb-4">
                    <div className="flex items-center">
                        <div className="max-w-56 md:max-w-128 truncate pr-3 text-base font-bold text-gray-400 md:text-xl">{t(title)}</div>
                    </div>
                    <span onClick={() => onClose()}>
                        <CloseIcon className="cursor-pointer fill-current text-gray-400" width="1rem" height="1rem" />
                    </span>
                </div>
                {children && <div className="w-full md:flex md:justify-center">{children}</div>}
            </div>
        </div>,
        document.getElementById("root")
    );
});

export default FormModal;
