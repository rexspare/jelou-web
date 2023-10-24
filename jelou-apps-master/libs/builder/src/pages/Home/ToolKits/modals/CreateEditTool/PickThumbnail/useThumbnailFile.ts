import { useQuery, useQueryClient } from "@tanstack/react-query";
import get from "lodash/get";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import { Store } from "@apps/redux/store";
import { CredentialsStore } from "@builder/Stores/types.stores";
import { TYPE_ERRORS, renderMessage } from "@builder/common/Toastify";
import { S3 } from "@builder/libs/s3";
import { attachMediaToApp, deleteMediaToApp, getMediaFromApp } from "@builder/services/app";
import { Company, Media } from "@builder/services/types.services";
import { CreatedTool, Thumbnail } from "../../../types.toolkits";
import { COLLECTION_NAMES, MODEL_TYPES, THUMBNAIL_SUPPORTED_FILES } from "./constants.thumbnail";

type UseThumbnailFile = {
    inputRef: React.RefObject<HTMLInputElement>;
    thumbnails: Thumbnail[];
    pickedThumbnail: string | number;
    isUploadLoading: boolean;
    isLoadingThumbnails: boolean;
    handleAddThumbnail: () => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleClickThumbnail: (id: string | number) => void;
    handleDeleteThumbnail: (pickedThumbnail: string) => Promise<void>;
};

type ThumbnailFileProps = {
    createdTool: CreatedTool;
    handleAddData: (tool: Partial<CreatedTool>) => void;
};

export const useThumbnailFile = ({ createdTool, handleAddData }: ThumbnailFileProps): UseThumbnailFile => {
    const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

    const queryClient = useQueryClient();
    const mediaQuery = queryClient.getQueryData<Media[]>(["THUMBNAILS"]) ?? [];

    const company = useSelector((state: ReturnType<typeof Store.getState>) => state.company) as Company;
    const credentials = get(company, "properties.builder", {}) as CredentialsStore;

    const [isUploadLoading, setIsUploadLoading] = useState(false);
    const [pickedThumbnail, setPickedThumbnail] = useState(createdTool?.thumbnail ?? null);

    const [thumbnails, setThumbnails] = useState<Thumbnail[]>(() => {
        return createdTool?.thumbnails ?? handleParseThumbnails(mediaQuery);
    });

    const s3 = new S3(String(company?.id));

    const { isLoading: isLoadingThumbnails } = useQuery(["THUMBNAILS"], () => getMediaFromApp(credentials.app_id, MODEL_TYPES.APP), {
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        onSuccess: (data) => {
            handleAttachThumbnails(data);
        },
    });

    const handleAddThumbnail = (): void => {
        inputRef.current.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }

        const file = fileObj;

        handleUploadFile([file]);
    };

    function handleParseThumbnails(mediaThumbnails: Media[]): Thumbnail[] {
        if (!mediaThumbnails?.length) return [];

        const attachedThumbnails = mediaThumbnails?.map((media: Media) => {
            return {
                id: media.id,
                Icon: media.url,
            };
        }) as Thumbnail[];

        const newThumbnails = [...attachedThumbnails];
        return newThumbnails;
    }

    function handleAttachThumbnails(appMedia: Media[]): void {
        const newThumbnails = handleParseThumbnails(appMedia);
        setThumbnails(newThumbnails);
        handleAddData({ thumbnails: newThumbnails });
    }

    const handleUploadFile = async (files: File[] | FileList): Promise<void> => {
        if (files.length === 0) {
            renderMessage("No se encontró ningún archivo", TYPE_ERRORS.ERROR);
            return;
        }

        if (files.length > 1) renderMessage("Solo se tomará el primer archivo", TYPE_ERRORS.WARNING);
        setIsUploadLoading(true);
        const file = files[0];
        if (!THUMBNAIL_SUPPORTED_FILES.includes(file.type)) {
            renderMessage("Formato de archivo no válido", TYPE_ERRORS.ERROR);
            setIsUploadLoading(false);
            return;
        }
        const url = await s3.uploadFile(file);
        handleAddData({ thumbnail: url });

        try {
            const media = {
                filename: file.name.replace(/ /g, "_"),
                url: url,
                modelType: MODEL_TYPES.APP,
                collectionName: COLLECTION_NAMES.ICON,
                modelId: credentials?.app_id,
            };

            await attachMediaToApp(media);

            const newThumbnail = {
                id: thumbnails.length + 1,
                Icon: url,
            };

            setThumbnails([newThumbnail, ...thumbnails]);
            setPickedThumbnail(url);
            queryClient.invalidateQueries(["THUMBNAILS"]);
        } catch (error) {
            renderMessage(String(error), TYPE_ERRORS.ERROR);
        }
        setIsUploadLoading(false);
    };

    const handleDeleteThumbnail = async (pickedThumbnail: string) => {
        if (!pickedThumbnail) return;

        const thumbnail = thumbnails.find((thumbnail) => thumbnail.Icon === pickedThumbnail);
        if (!thumbnail) return;

        const { Icon, id } = thumbnail;
        if (typeof Icon !== "string") return;

        const deleteThumbnailList = [s3.deleteFile(Icon), deleteMediaToApp(id)];
        return Promise.all(deleteThumbnailList).then(() => {
            setThumbnails(thumbnails.filter((thumbnail) => thumbnail.id !== id));
        });
    };

    const handleClickThumbnail = (id: string | number) => {
        setPickedThumbnail(id);
        handleAddData({ thumbnail: id });
    };

    return {
        inputRef,
        thumbnails,
        pickedThumbnail,
        isUploadLoading,
        handleFileChange,
        handleAddThumbnail,
        isLoadingThumbnails,
        handleClickThumbnail,
        handleDeleteThumbnail,
    };
};
