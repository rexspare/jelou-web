import Tippy from "@tippyjs/react";
import ReactJsonView from "react-json-view";

import { CopyClicboardIcon } from "../../Icons/CopyClicboard.Icon";
import { TYPE_ERRORS, renderMessage } from "../Toastify";
import { copyToClipboard } from "../utils";
import { jsonViewConfig } from "./json-view.config";

// type Props = {
//     src: object;
//     showCopyClipboard?: boolean;
//     copyClipboardContent?: string;
// };

export const JsonPreview = ({ src, showCopyClipboard = true, copyClipboardContent = "Copiar al portapapeles" }) => {
    const handleCopyToClipboard = () => {
        copyToClipboard({
            content: JSON.stringify(src, null, 2),
            onsuccess: () => {
                renderMessage("Copiado al portapapeles", TYPE_ERRORS.SUCCESS);
            },
            onerror: () => {
                renderMessage("No se pudo copiar el contenido a tu portapapeles", TYPE_ERRORS.ERROR);
            },
        });
    };

    return (
        <div className={`relative ${showCopyClipboard ? "min-h-[3rem]" : ""} w-full max-w-[37.5rem] overflow-hidden rounded-lg bg-[#3C4254]`}>
            <ReactJsonView {...jsonViewConfig(src)} />
            {showCopyClipboard && (
                <Tippy theme="jelou" placement="top" animation="shift-away" content={copyClipboardContent}>
                    <button className="absolute bottom-[8px] right-[8px] text-white" onClick={handleCopyToClipboard}>
                        <span className="sr-only">copy to clipboard</span>
                        <CopyClicboardIcon />
                    </button>
                </Tippy>
            )}
        </div>
    );
};
