import ReactDOM from "react-dom";
import React, { useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { useOnClickOutside } from "@apps/shared/hooks";

const NewFormModal = (props) => {
    const { children, onClose } = props;

    const ref = useRef();
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
        <div className="fixed inset-x-0 top-0 z-[130] px-4 pt-8 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-0">
            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 z-20 bg-gray-490/75" />
            </div>
            {children}
        </div>,
        document.getElementById("root")
    );
};

export default withTranslation()(NewFormModal);
