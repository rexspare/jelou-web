import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import AutoSizer from "react-virtualized-auto-sizer";
import { useState } from "react";

import { BeatLoader } from "react-spinners";

import "tippy.js/themes/light.css";
import useRenderFileIcon from "../file-zone/hook/render-file-icon";
import { TYPES_FILE } from "@apps/shared/constants";
import { ModalHeadless } from "../modal-headless/modal-headless";

import TextAreaWithEmojis from "../textAreaEmojis/TextAreaWithEmojis";
const MAX_LENGTH_FACEBOOK_REPLIES = 8000;

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PreviewImage = (props) => {
    
    const { 
        onClose, 
        selectedFile, 
        isOpen,
        showFBReplies = false,
        text = undefined,
        loadingSending = false,
        submitChange = () => null,
        handleChange = () => null,
        setText,
    } = props;

    const { t } = useTranslation();
    const { mediaUrl, name, type } = selectedFile;

    const { renderImg } = useRenderFileIcon({});
    const isPDF = type === TYPES_FILE.pdf;

    const RenderFile =
        !isPDF && renderImg({ link: mediaUrl, fillIcon: "#fff", type, size: "300", classImg: "w-72 h-72", activateControlsVideos: true });

    return (
        <ModalHeadless closeModal={onClose} isOpen={isOpen} title={t("pma.Vista previa")} className="bg-white md:min-w-560 md:max-w-560">
            <div className="grid place-content-center p-4">
                {
                    isPDF ? (
                    <RenderPDF mediaUrl={mediaUrl} />
                    ) : (
                        <div className="grid place-content-center">
                            <RenderFile />
                        </div>
                    )
                }
                <a href={mediaUrl} target={"_blank"} rel="noreferrer" className="text-center text-gray-400 hover:text-primary-200 hover:underline">
                    <p className="mt-4 font-medium">{name}</p>
                </a>
            </div>
            {showFBReplies && (
                <section className="grid justify-center gap-4 mx-4 mb-4">
                    <div className="w-[28rem]">
                        <TextAreaWithEmojis handleChange={handleChange} text={text} maxLength={MAX_LENGTH_FACEBOOK_REPLIES} setText={setText} />
                    </div>
                    <div className="flex items-center justify-center rounded-b-lg bg-modal-footer">
                        {loadingSending ? (
                            <button className="w-32 btn-primary focus:outline-none">
                                <BeatLoader size={"0.625rem"} color="#ffff" />
                            </button>
                        ) : (
                            <button className="w-32 font-bold btn-primary focus:outline-none" onClick={() => submitChange()}>
                                {t("Enviar")}
                            </button>
                        )}
                    </div>
                </section>
            )}
        </ModalHeadless>
    );
};

export default PreviewImage;

const RenderPDF = ({ mediaUrl }) => {
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="rounded-15 max-h-[20rem] w-full overflow-x-hidden object-cover" alt="preview document">
            <AutoSizer disableHeight>
                {({ width }) => (
                    <Document file={mediaUrl} onLoadSuccess={onDocumentLoadSuccess}>
                        {[...Array(numPages).keys()].map((i) => (
                            <Page key={i} pageNumber={i + 1} width={width} />
                        ))}
                    </Document>
                )}
            </AutoSizer>
        </div>
    );
};
