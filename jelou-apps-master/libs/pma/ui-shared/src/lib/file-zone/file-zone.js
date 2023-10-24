import { useRef } from "react";
import useRenderFileIcon from "./hook/render-file-icon";
import { useAcceptance } from "@apps/shared/hooks";
import PreviewFile from "./preview-file";
import { v4 as uuidv4 } from "uuid";

import isEmpty from "lodash/isEmpty";

import AudioPreview from "./AudioPreview";
export default function FileZone({
    documentList = [],
    uploadingDropZone = {},
    setSendingAudio,
    audiosUrl,
    setAudiosUrl,
    sendingAudio = false,
    setAudioBlobs,
    audioBlobs,
    uploadFile,
    t,
    handleSelectFiles = () => null,
    handleDeleteImage = () => null,
    setSelectedFile = () => null,
    currentRoom,
    isShortCutToShowPreview = false,
    setIsShortCutToShowPreview = () => null,
    setDocumentList = () => null,
} = {}) {
    const { renderImg } = useRenderFileIcon();
    const { documentAcceptance, imageAcceptance, videoAcceptance } = useAcceptance();
    const inputFileRf = useRef(null);
    const acceptance = videoAcceptance() + imageAcceptance() + documentAcceptance();

    const handleOpenSearchFile = (evt) => {
        evt.preventDefault();
        inputFileRf.current.click();
    };

    const handleChange = (evt) => {
        handleSelectFiles({ evt, documentList });
    };
    return (
        <section className="mx-1 mt-1 grid h-24 grid-flow-col items-center justify-start gap-2 overflow-x-scroll rounded-t-12 bg-white p-2">
            {documentList.map((file) => {
                const { type, link, mediaUrl } = file;
                const isLoading = uploadingDropZone[link];
                const IconOrImgFile = renderImg({ type, link, classImg: "w-16 h-16", fillIcon: "#fff", size: "60" });
                return (
                    <PreviewFile
                        key={uuidv4()}
                        setSelectedFile={setSelectedFile}
                        IconOrImgFile={IconOrImgFile}
                        handleDeleteImage={() => handleDeleteImage({ mediaUrl, link, currentRoom })}
                        isLoading={isLoading}
                        file={file}
                        isShortCutToShowPreview={isShortCutToShowPreview}
                        setIsShortCutToShowPreview={setIsShortCutToShowPreview}
                        setDocumentList={setDocumentList}
                    />
                );
            })}
            {!isEmpty(audioBlobs) &&
                audioBlobs.map((audio) => (
                    <AudioPreview
                        t={t}
                        currentRoom={currentRoom}
                        audiosUrl={audiosUrl}
                        setAudiosUrl={setAudiosUrl}
                        uploadFile={uploadFile}
                        audioBlobs={audioBlobs}
                        key={audio.id}
                        audio={audio}
                        setSendingAudio={setSendingAudio}
                        setAudioBlobs={setAudioBlobs}
                    />
                ))}
            {isEmpty(audioBlobs) && (
                <button
                    onClick={handleOpenSearchFile}
                    key="fileHanlde"
                    className="grid h-full w-20 place-content-center rounded-20 border-2 border-primary-700 text-3xl text-primary-200 hover:border-primary-200"
                >
                    +
                </button>
            )}

            <input ref={inputFileRf} type={"file"} accept={acceptance} hidden multiple onChange={handleChange} />
        </section>
    );
}
