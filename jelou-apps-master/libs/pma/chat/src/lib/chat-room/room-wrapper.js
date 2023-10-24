import React, { useState } from "react";
import { DragOverView } from "../drag-over-view/drag-over-view";
import { useHandlesDropzone } from "./FileZone/hook/handles";

const RoomWrapper = (props) => {
    const { className, documentList, setDocumentList, setUploading } = props;

    const [showDropzone, setShowDropzone] = useState(false);

    const { handleDragEnter, handleDragLeave, handleOnDrop, handleSelectFiles, handleDeleteImage, handleAddFiles } = useHandlesDropzone({
        setDocumentList,
        setUploading,
        setShowDropzone,
    });

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragOverCapture={(evt) => {
                evt.stopPropagation();
                evt.preventDefault();
            }}
            onDragLeave={handleDragLeave}
            onDrop={(evt) => handleOnDrop({ evt, documentList })}
            className={className}>
            {showDropzone ? <DragOverView setShowDropzone={setShowDropzone} /> : props.children}
        </div>
    );
};

export default RoomWrapper;
