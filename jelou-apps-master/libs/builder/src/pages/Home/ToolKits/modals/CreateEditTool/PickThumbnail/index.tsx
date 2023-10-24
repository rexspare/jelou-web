import { isString } from "lodash";
import { useState } from "react";

import { Thumbnail } from "./Thumbnail";

import { DeleteIcon } from "@apps/shared/icons";
import { PlusIcon, SpinnerIcon } from "@builder/Icons";
import { useModalActions } from "../../../hooks/useModalActions";
import { CREATE_EDIT_STEP, CreatedTool } from "../../../types.toolkits";
import { StepLayout } from "../StepLayout";
import { THUMBNAILS, THUMBNAIL_SUPPORTED_FILES } from "./constants.thumbnail";
import { useThumbnailFile } from "./useThumbnailFile";

type IconType =
    | string
    | React.FC<{
          width?: number | undefined;
          height?: number | undefined;
          color?: string | undefined;
      }>;

type Props = {
    createdTool: CreatedTool;
    isEditMode: boolean;
    editToolId?: string;
    handleAddData: (tool: Partial<CreatedTool>) => void;
    handleCloseModal: () => void;
    handlePrimaryClick: (currentStep: CREATE_EDIT_STEP) => void;
    handleSecondaryClick: (currentStep: CREATE_EDIT_STEP) => void;
};

export const PickThumbnail = ({ createdTool, handleAddData, isEditMode, handleCloseModal, handlePrimaryClick, handleSecondaryClick, editToolId }: Props) => {
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { handleSaveEdit, isLoadingAction } = useModalActions({ createdTool, handleCloseModal });

    const { inputRef, thumbnails, pickedThumbnail, isUploadLoading, handleFileChange, handleAddThumbnail, isLoadingThumbnails, handleClickThumbnail, handleDeleteThumbnail } = useThumbnailFile({
        createdTool,
        handleAddData,
    });

    const handleThumbnailClick = (Icon: IconType, id: number) => () => {
        const selectedThumbnail = typeof Icon === "string" ? Icon : id;

        handleClickThumbnail(selectedThumbnail);
    };

    const deleteThumbnail = () => {
        if (typeof pickedThumbnail === "string") {
            setDeleteLoading(true);
            handleDeleteThumbnail(pickedThumbnail).finally(() => setDeleteLoading(false));
        }
    };

    const showTerciary = isString(pickedThumbnail);

    return (
        <StepLayout
            title="Escoge una imagen"
            isLoading={isLoadingAction}
            disabled={!pickedThumbnail || isUploadLoading}
            primaryLabel={isEditMode ? "Guardar" : "Siguiente"}
            secondaryLabel={isEditMode ? "Cancelar" : "Atrás"}
            subTitle="Selecciona una imagen para que sea tu thumbnail"
            onPrimaryClick={isEditMode && editToolId ? () => handleSaveEdit({ editToolId, toolkitId: createdTool.toolkitId }) : () => handlePrimaryClick(CREATE_EDIT_STEP.THUMBNAIL)}
            onSecondaryClick={isEditMode ? handleCloseModal : () => handleSecondaryClick(CREATE_EDIT_STEP.THUMBNAIL)}
            onTerciaryClick={() => deleteThumbnail()}
            terciaryIcon={deleteLoading ? <SpinnerIcon color="#f12b2c" /> : <DeleteIcon stroke={"#f12b2c"} />}
            terciaryButtonClassName={"bg-red-6 px-3"}
            showTerciary={showTerciary}
        >
            <div className="h-[20rem] w-[23rem] overflow-x-hidden overflow-y-scroll rounded-lg border-1 border-gray-200 p-3">
                {isLoadingThumbnails ? (
                    <div className="grid h-[18rem] items-center justify-center">
                        <span className="text-primary-200">
                            <SpinnerIcon width={50} />
                        </span>
                    </div>
                ) : (
                    <>
                        <input type="file" ref={inputRef} className="hidden" onChange={handleFileChange} accept={THUMBNAIL_SUPPORTED_FILES.join(",")} />
                        <div className="ml-[0.15rem] flex w-full flex-wrap gap-1">
                            <div
                                onClick={handleAddThumbnail}
                                className="relative flex h-[4rem] w-[4rem] cursor-pointer items-center justify-center rounded-lg border-1 border-dashed border-gray-200 text-line-hsm"
                            >
                                {isUploadLoading ? <SpinnerIcon /> : <PlusIcon />}
                            </div>
                            {thumbnails.map((thumbnail) => {
                                const { id, Icon } = thumbnail;
                                return <Thumbnail id={id} key={id} Icon={Icon} pickedThumbnail={pickedThumbnail} handleClickThumbnail={handleThumbnailClick(Icon, id)} />;
                            })}
                            {THUMBNAILS.map((thumbnail) => {
                                const { id, Icon } = thumbnail;
                                return <Thumbnail id={id} key={id} Icon={Icon} pickedThumbnail={pickedThumbnail} handleClickThumbnail={handleThumbnailClick(Icon, id)} />;
                            })}
                        </div>
                    </>
                )}
            </div>
        </StepLayout>
    );
};
