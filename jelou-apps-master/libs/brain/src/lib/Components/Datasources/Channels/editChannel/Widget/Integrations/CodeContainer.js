import { CopyIcon } from "@apps/shared/icons";
import CodeBlock from "./CodeBlock";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CodeContainer = (props) => {
    const { code, language, title, description } = props;
    const [copy, setCopy] = useState(false);
    const { t } = useTranslation();

    const copyContent = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopy(true);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <div className="flex w-4/5 flex-col gap-y-2">
            <span className="text-sm font-bold text-gray-610">{title}</span>
            {description && <span className="mb-2 text-sm text-gray-400">{description}</span>}
            <div className="relative w-full">
                <CodeBlock language={language} code={code} />
                <div className="absolute top-1 right-1 z-10">
                    {copy && <button className="w-auto rounded-4 bg-primary-200 bg-opacity-15 p-2 font-bold text-primary-200">{t("monitoring.Copiado")}</button>}
                    <button className="mt-2 rounded-full border-1 border-primary-200 p-2" onClick={copyContent}>
                        <CopyIcon className="stroke-current text-primary-200" width="1.2rem" height="1.2rem" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeContainer;
