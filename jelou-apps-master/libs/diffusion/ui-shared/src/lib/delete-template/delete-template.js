import { useEffect, useRef } from "react";
import FormModal from "../form-modal/form-modal";
import { Modal } from "@apps/shared/common";
import { useOnClickOutside } from "@apps/shared/hooks";
import RenderPreviewMessage from "../render-preview-message/render-preview-message";

const DeleteTemplate = (props) => {
    const { paramsNew, onClose, values, renderBeatLoader, isPreviewImageUploaded, handleUploadImage, templateModalInputNames: inputNames } = props;
    const { mediaUrl: defaultMediaUrl } = props.template;
    const modalRef = useRef();

    useOnClickOutside(modalRef, () => onClose());

    function calcHeight(value) {
        let numberOfLineBreaks = (value.match(/\n/g) || []).length;
        // min-height + lines x line-height + padding + border
        let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
        return newHeight;
    }

    useEffect(() => {
        if (props.openUpdateModal) {
            // Dealing with Textarea Height
            let textarea = document.querySelector(".resize-ta");
            textarea.style.height = calcHeight(textarea.value) + "px";
        }
    }, [props.onClose]);

    return (
        <Modal>
            <div className="fixed inset-x-0 top-0 z-100 overflow-scroll sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-100 bg-gray-490 bg-opacity-40" />
                </div>
                <div className="max-w-4xl justify-center" ref={modalRef}>
                    <FormModal
                        title={props.title}
                        onClose={props.onClose}
                        onConfirm={props.onConfirm}
                        loading={props.loading}
                        refuseString={props.refuseString}
                        agreeString={props.agreeString}
                        className={props.className}>
                        <RenderPreviewMessage
                            renderBeatLoader={renderBeatLoader}
                            paramsNew={paramsNew}
                            inputNames={inputNames}
                            template={props.template}
                            mediaUrl={values.mediaUrl ? values.mediaUrl : defaultMediaUrl}
                            handleUploadImage={handleUploadImage}
                            isPreviewImageUploaded={isPreviewImageUploaded}
                        />
                    </FormModal>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteTemplate;
