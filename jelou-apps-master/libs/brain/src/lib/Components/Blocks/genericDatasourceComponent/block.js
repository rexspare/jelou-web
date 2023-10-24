import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { toastMessage } from "@apps/shared/common";
import { LoadingSpinner } from "@apps/shared/icons";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { BLOCK, COMPONENT_NAME, ITEM_TYPES } from "../../../constants";
import { useUpdateBlock } from "../../../services/brainAPI";
import DeleteButton from "../../../Common/deleteButton";
import DeleteConfirmation from "../../../Common/deleteConfirmationModal";

const Block = (props) => {
    const { index, renderedBlock, isBlockSelected, isBlockEditable, sourceId, blocksQuantity, setSelectedBlockIndex, editableBlockIndex, setEditableBlockIndex, isModal = false, refetch } = props;
    const { content, length, tokens, id, title } = renderedBlock;
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const [showDeleteBlockModal, setShowDeleteBlockModal] = useState(false);
    const [blockContent, setBlockContent] = useState({ content: "" });
    const [blockLength, setBlockLength] = useState(0);
    const [factor, setFactor] = useState(1);

    const { isLoading, mutateAsync } = useUpdateBlock({
        sourceId,
        blockId: id,
        blockInfo: blockContent,
    });

    const focusTextareaByIndex = (index) => {
        const textarea = document.getElementById(`block-text-area-${index}`);
        if (textarea) {
            textarea.focus();
        }
    };

    const handleDeleteBlock = (index) => {
        setSelectedBlockIndex(index);
        setShowDeleteBlockModal(true);
    };
    const closeDeleteBlockModal = useCallback(() => {
        setShowDeleteBlockModal(false);
        if (isModal) {
            props.closeModal();
        }
    }, []);

    const handleEditBlock = (index) => {
        focusTextareaByIndex(index);
        setEditableBlockIndex(index);
        setSelectedBlockIndex(index);
    };

    const handleContentChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setBlockContent((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
        setBlockLength(value?.length);
    };

    const handleCancelChange = () => {
        setEditableBlockIndex(null);
        setBlockContent({
            content: content,
        });
        setBlockLength(length);
    };

    const handleSubmitChange = async (e) => {
        e.preventDefault();
        setEditableBlockIndex(null);
        await mutateAsync(
            {},
            {
                onSuccess: () =>
                    toastMessage({
                        messagePart1: `${t("common.itemUpdated")} ${t(BLOCK.SINGULAR_LOWER)}`,
                        type: MESSAGE_TYPES.SUCCESS,
                        position: TOAST_POSITION.TOP_RIGHT,
                    }),
                onError: () =>
                    toastMessage({
                        messagePart1: `${t("common.itemNotUpdated")} ${t(BLOCK.SINGULAR_LOWER)}`,
                        type: MESSAGE_TYPES.ERROR,
                        position: TOAST_POSITION.TOP_RIGHT,
                    }),
            }
        );
    };

    useEffect(() => {
        if (tokens > 0) {
            setFactor(length / tokens);
        }
        setBlockLength(length);
        setBlockContent({
            content,
        });
    }, [renderedBlock]);

    return (
        <>
            <div
                ref={inputRef}
                id={`block-${index}`}
                className={`mb-0 rounded-md px-3 ${isBlockSelected && !isModal ? "border-1 border-primary-200" : ""} ${blocksQuantity === 1 || isModal ? "h-full" : "h-auto"}`}
            >
                <span className="mb-1 font-bold text-gray-400 line-clamp-2">{title || "-"}</span>
                <textarea
                    id={`block-text-area-${index}`}
                    className={`${isBlockEditable && isBlockSelected ? "border-primary-200 focus:border-primary-200" : "border-neutral-200 focus:border-neutral-200"} ${
                        isModal ? "h-70" : blocksQuantity === 1 ? "h-4/5" : "h-[350px]"
                    }
                    mb-0 min-h-[60%] w-full resize-none overflow-y-auto rounded-md border-1 bg-neutral-200 bg-opacity-[0.16] p-6 leading-relaxed text-gray-610 placeholder:text-gray-610 focus:ring-transparent focus-visible:outline-none`}
                    placeholder={content}
                    value={blockContent?.content}
                    onChange={handleContentChange}
                    name={COMPONENT_NAME.CONTENT}
                    disabled={editableBlockIndex !== index}
                />
                <div className="flex items-center justify-between py-3 text-primary-200">
                    <div>{`${blockLength} ${t("common.characters")} / ${tokens > 0 ? Math.trunc(blockLength / factor) : tokens} tokens`}</div>
                    <div className="items-between inset-y-1/2 flex justify-center  gap-x-2 ">
                        {(blocksQuantity > 1 || isModal || (blocksQuantity === 1 && isBlockEditable)) && (
                            <DeleteButton
                                isBlockEditable={isBlockEditable}
                                onClick={isBlockEditable ? handleCancelChange : () => handleDeleteBlock(index)}
                                buttonText={isBlockEditable ? t("common.cancel") : `${t("common.delete")} ${t(ITEM_TYPES.BLOCK)}`}
                                showIcon={isBlockEditable ? false : true}
                            />
                        )}
                        <button
                            className="button-primary flex h-9 w-40 items-center justify-center px-16 py-3.5"
                            type="submit"
                            onClick={isBlockEditable ? handleSubmitChange : () => handleEditBlock(index)}
                        >
                            {isLoading ? <LoadingSpinner color={"#FFFFFF"} /> : isBlockEditable ? t("common.save") : t("common.edit")}
                        </button>
                    </div>
                </div>
            </div>
            <DeleteConfirmation revalidate={refetch} openModal={showDeleteBlockModal} closeModal={closeDeleteBlockModal} itemType={ITEM_TYPES.BLOCK} elementId={id} isLastBlock={props.isLastBlock} />
        </>
    );
};

export default Block;
