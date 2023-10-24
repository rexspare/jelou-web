import isEmpty from "lodash/isEmpty";
import { useMemo, useRef, useState } from "react";

import { SpinnerIcon } from "@builder/Icons";
import { TYPES_FILE } from "@builder/Nodes/Message/Blocks/Image/RenderImg/constants.renderImg";
import { renderFile } from "@builder/Nodes/Message/Blocks/Image/RenderImg/renderFileIcon";
import { getEmptyIconColor, getSupportedFiles } from "@builder/Nodes/Message/Blocks/utils.blocks";
import { useWorkflowStore } from "@builder/Stores";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { S3 } from "@builder/libs/s3";
import { BLOCK_TYPES } from "@builder/modules/Nodes/message/domain/constants.message";

type UploadFileProps = {
    type: BLOCK_TYPES;
    closeModal: () => void;
    saveUrlMedia: (url: string) => () => Promise<void>;
};

export const UploadFile = ({ closeModal, saveUrlMedia, type }: UploadFileProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSaveUrlMedia, setIsLoadingSaveUrlMedia] = useState(false);

    const supportedFiles = getSupportedFiles(type);

    const { companyId, id: workflowId } = useWorkflowStore((state) => state.currentWorkflow) ?? {};
    const s3 = new S3(String(companyId), String(workflowId));

    const handleResetUrlMediaClick = () => {
        if (!imageUrl) return;
        setIsLoading(true);
        s3.deleteFile(imageUrl).then(() => {
            setIsLoading(false);
            setImageUrl(null);
        });
    };

    const handleUploadFile = (files: File[] | FileList) => {
        if (!files || files.length === 0) {
            renderMessage("No se seleccionó ningún archivo", TYPE_ERRORS.ERROR);
            return;
        }

        setIsLoading(true);
        const file = files[0];

        if (!supportedFiles.includes(file.type)) {
            renderMessage("Formato de archivo no válido", TYPE_ERRORS.ERROR);
            setIsLoading(false);
            return;
        }

        s3.uploadFile(file)
            .then((url) => {
                setImageUrl(url);

                handleSaveUrlMediaClick(url);
            })
            .catch((error) => {
                renderMessage(String(error?.message || error), TYPE_ERRORS.ERROR);
            })
            .finally(() => setIsLoading(false));
    };

    const handleDrop = async (evt: React.DragEvent<HTMLElement>) => {
        evt.stopPropagation();
        evt.preventDefault();

        const files = evt.dataTransfer.files;
        handleUploadFile(files);
    };

    const handleSaveUrlMediaClick = (url: string) => {
        if (!url) {
            renderMessage("No se encontró ningún archivo", TYPE_ERRORS.ERROR);
            return;
        }

        setIsLoadingSaveUrlMedia(true);
        saveUrlMedia(url)().then(() => {
            setIsLoadingSaveUrlMedia(false);
            setImageUrl(null);
            closeModal();
        });
    };

    return (
        <section onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className="h-full w-full px-7 py-3 pt-4">
            <div className="grid h-full w-full place-content-center gap-5 rounded-12 border-1 border-dashed">
                {isLoading ? (
                    <p className="text-primary-200">
                        <SpinnerIcon width={100} heigth={100} />
                    </p>
                ) : isEmpty(imageUrl) && imageUrl === null ? (
                    <EmptyZone type={type} supportedFiles={supportedFiles} handleUploadFile={handleUploadFile} />
                ) : (
                    <>
                        <RenderFileComponent url={imageUrl ?? ""} showPlayer />
                        <footer className="flex justify-end gap-2 py-4">
                            <button
                                disabled={isEmpty(imageUrl)}
                                onClick={handleResetUrlMediaClick}
                                className="flex h-8 min-w-1 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Cambiar archivo
                            </button>
                        </footer>
                    </>
                )}
            </div>
            {/*           <footer className="flex justify-end gap-2 py-4">
                <button
                    disabled={isEmpty(imageUrl)}
                    onClick={handleResetUrlMediaClick}
                    className="h-8 min-w-1 rounded-20 bg-primary-700 px-4 font-semibold text-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Reintentar
                </button>
                <button
                    disabled={isEmpty(imageUrl) || isLoading}
                    onClick={handleSaveUrlMediaClick}
                    className="flex h-8 min-w-1 items-center justify-center rounded-20 bg-primary-200 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isLoadingSaveUrlMedia ? <SpinnerIcon /> : "Guardar"}
                </button>
                </footer>*/}
        </section>
    );
};

type RenderFileProps = {
    url: string;
    showPlayer: boolean;
};

export const RenderFileComponent = ({ url, showPlayer }: RenderFileProps) => {
    const type = url.split(".").pop();
    const classImg = "rounded-10 max-h-full max-w-full h-70 w-auto min-w-auto min-h-full";

    const Element = useMemo(() => renderFile({ link: url, type, classImg, size: "120", showPlayer }), [url, showPlayer]);

    return (
        <div className="grid max-h-full max-w-full place-content-center bg-white">
            <Element />
        </div>
    );
};

type EmptyZoneProps = {
    type: BLOCK_TYPES;
    supportedFiles: string[];
    handleUploadFile: (files: File[]) => void;
};

function EmptyZone({ handleUploadFile, supportedFiles, type }: EmptyZoneProps) {
    const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const fileObj = evt.target.files && evt.target.files[0];
        if (!fileObj) return;

        let file = fileObj;

        if (type === BLOCK_TYPES.AUDIO && supportedFiles.includes(fileObj.type)) {
            file = new window.File([fileObj], fileObj.name, { type: TYPES_FILE.AUDIO_MP3 });
        }

        handleUploadFile([file]);
    };

    const Icon = getEmptyIconColor(type);

    return (
        <div className="flex flex-col gap-3">
            <input type="file" ref={inputRef} className="hidden" onChange={handleFileChange} accept={supportedFiles.join(",")} />
            {Icon && <div className="mt-4 grid place-content-center">{Icon}</div>}
            <p className="w-52 text-center font-normal text-gray-400" data-testid="body-text">
                Arrastra tu documento aquí para empezar a cargar
            </p>
            <p className="w-52 text-center text-sm text-primary-200">*solo se permiten los formatos: {supportedFiles.filter((file) => !file.includes("-") && !file.includes("/")).join(", ")}</p>
            <div className="w-13 self-center">
                <button onClick={handleClick} className="mb-4 self-center rounded-xxl bg-primary-200 px-4 py-1 font-bold text-white">
                    Buscar archivo
                </button>
            </div>
        </div>
    );
}
