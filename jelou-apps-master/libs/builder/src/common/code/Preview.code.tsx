import Tippy from "@tippyjs/react";
import debounce from "lodash/debounce";
import Prism from "prismjs";
import { useCallback, useEffect, useRef } from "react";
import "./prism.css";

import { CopyClicboardIcon } from "../../Icons/CopyClicboard.Icon";
import { TYPE_ERRORS, renderMessage } from "../Toastify";

type Props = {
    content: string;
    highlight?: boolean;
    className?: string;
    classNameWrapp?: string;
    highlightLazy?: boolean;
    showCopyBtn?: boolean;
};

export function PreviewCode({ showCopyBtn = true, highlightLazy = false, content, highlight = false, className = "", classNameWrapp = "" }: Props) {
    const codeRef = useRef<HTMLElement>({} as HTMLElement);

    const highlightCode = useCallback(
        debounce(() => Prism.highlightElement(codeRef.current), 500),
        []
    );

    useEffect(() => {
        if (highlight) {
            highlightLazy ? highlightCode() : Prism.highlightElement(codeRef.current);
        }
    }, [highlight, content]);

    const handleCopyClipboardClick = () => {
        navigator.clipboard.writeText(content);
        renderMessage("Copiado al portapapeles", TYPE_ERRORS.SUCCESS);
    };

    return (
        <div className={`nowheel relative ${classNameWrapp}`}>
            <pre className={`shadow-nodo box-content !overflow-hidden rounded-10 !p-2 text-13 ${className}`}>
                <div className="h-[99%] overflow-hidden">
                    <code role="code" ref={codeRef} className="language-javascript">
                        {content}
                    </code>
                </div>
            </pre>

            {showCopyBtn && (
                <Tippy theme="jelou" placement="top" animation="shift-away" content="Copiar al portapapeles">
                    <button onClick={handleCopyClipboardClick} className="absolute bottom-[10px] right-[10px]">
                        <span className="sr-only">copy to clicboard</span>
                        <CopyClicboardIcon />
                    </button>
                </Tippy>
            )}
        </div>
    );
}
