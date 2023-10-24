import get from "lodash/get";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { DATASOURCE } from "../constants";

// const toolbarOptions = [
//     ["bold", "italic", "underline"],
//     [{ list: "bullet" }, { list: "ordered" }, "blockquote", "link", "image"],
// ];

const TextComponent = ({ setDatasourceValues, datasourceValues }) => {
    const { t } = useTranslation();

    const valueText = get(datasourceValues, "metadata.text", "");

    const handleEditorChange = (event) => {
        const { value } = event.target;
        setDatasourceValues((prevValues) => ({
            ...prevValues,
            metadata: {
                text: value,
            },
        }));
    };

    const renderHtmlContent = () => {
        return { __html: datasourceValues.metadata.text };
    };

    useEffect(() => {
        if (datasourceValues?.metadata) delete datasourceValues.metadata;
    }, []);

    return (
        <>
            <div className="w-full max-w-[33rem] overflow-x-auto rounded-lg border-1 border-neutral-200">
                <textarea
                    onChange={handleEditorChange}
                    value={valueText}
                    placeholder=""
                    className="custom-quill color-[#374361] font-Manrope font-weight-500 text-14px w-full max-w-[33rem] resize-none focus:ring-transparent !outline-none focus:outline-none border-0 focus:ring-0"
                    style={{ height: '9rem', outline: 'none' }}
                />
            </div>
            <div className="mt-1 mb-5 text-sm font-normal text-[#B0B6C2]">{t("brain.minDatasourceTextLength")}</div>
            <style>{`
              .custom-quill .ql-container {
                border: 0;
              }
              .custom-quill .ql-toolbar {
                border-top: 0;
                border-left: 0;
                border-right: 0;
                border-bottom: 1px solid #DCDEE4;
              }
              .custom-quill .ql-toolbar.ql-snow .ql-formats:first-child {
                border-right: 1px solid #DCDEE4;
                padding-right: 15px;
              }
              .custom-quill .ql-snow .ql-stroke {
                stroke: #727C94;
              }
              .custom-quill .ql-snow .ql-fill {
                fill: #727C94;
              }
              .custom-quill .ql-editor {
                height: 9rem;
              }
              .custom-quill .ql-editor.ql-blank::before {
                color: rgba(176, 182, 194, 0.5);
                content: attr(data-placeholder);
                font-style: normal;
              }
            `}</style>
        </>
    );
};

export default TextComponent;
