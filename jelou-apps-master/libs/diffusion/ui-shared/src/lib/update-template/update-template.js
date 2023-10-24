import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";

import { BarLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

import { FormComboboxSelect, Label } from "@apps/shared/common";
import FormModal from "../form-modal/form-modal";
import { Modal, Input } from "@apps/shared/common";
import { FileIcon, CloseIcon2, ErrorIcon } from "@apps/shared/icons";
import { useOnClickOutside } from "@apps/shared/hooks";
import { FileIcon as FileIconReact } from "react-file-icon";
import RenderPreviewMessage from "../render-preview-message/render-preview-message";

const UpdateTemplate = (props) => {
    const {
        paramsNew,
        fileType,
        isFileUploaded,
        mediaFileName,
        closeTemplateModal,
        handleEditParams,
        paramsValidation,
        displayNameValidation,
        removeDocFile,
        values,
        isImageUploaded,
        loadingMedia,
        handleDocFile,
        showUpdateMessage,
        renderBeatLoader,
        handleUpdateChange,
        isPreviewImageUploaded,
        handleUploadImage,
        templateModalInputNames: inputNames,
        clickFilePicker,
        isChecked,
        teamOptions,
        handleCombobox,
        oldParams,
        setParamsNew,
    } = props;
    const { displayName, mediaUrl: defaultMediaUrl } = props.template;
    const defaultMediaFileName = defaultMediaUrl?.split("/")[5];
    const modalRef = useRef();
    let array = isEmpty(paramsNew) ? [] : paramsNew;
    const { t } = useTranslation();
    const isImage = (url) => {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    };
    const isMediaUrlImage = isImage(defaultMediaUrl);

    useOnClickOutside(modalRef, () => closeTemplateModal());

    function calcHeight(value) {
        let numberOfLineBreaks = (value.match(/\n/g) || []).length;
        // min-height + lines x line-height + padding + border
        let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
        return newHeight;
    }

    useEffect(() => {
        const oldData = oldParams.filter((templateObj) => templateObj.id === props.template.id)[0];
        setParamsNew(oldData.params);
        if (props.openUpdateModal) {
            // Dealing with Textarea Height

            let textarea = document.querySelector(".resize-ta");
            textarea.style.height = calcHeight(textarea.value) + "px";
        }
    }, [props.onClose]);

    const inputStringClassName =
        "outline-none h-34 w-full flex-1 rounded-[0.8125rem] border-transparent bg-primary-700 px-2 text-15 text-gray-400 ring-transparent focus:border-transparent focus:ring-transparent";

    const inputCheckboxClassName = "form-checkbox h-5 w-5 rounded-[0.8125rem] text-primary-200 transition duration-150 ease-in-out";

    return (
        <Modal>
            <div className="fixed inset-x-0 top-0 overflow-scroll z-100 sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-100 bg-gray-490 bg-opacity-40" />
                </div>
                <div className="justify-center max-w-4xl" ref={modalRef}>
                    <FormModal
                        title={props.title}
                        onClose={props.onClose}
                        onConfirm={props.onConfirm}
                        loading={props.loading}
                        refuseString={inputNames.close}
                        agreeString={inputNames.save}
                        showUpdateMessage={showUpdateMessage}>
                        <div className="w-full pb-5"></div>
                        <RenderPreviewMessage
                            // paramsNew, inputNames, defaultMediaUrl, isPreviewImageUploaded, renderBeatLoader
                            renderBeatLoader={renderBeatLoader}
                            paramsNew={paramsNew}
                            inputNames={inputNames}
                            template={props.template}
                            mediaUrl={values.mediaUrl ? values.mediaUrl : defaultMediaUrl}
                            handleUploadImage={handleUploadImage}
                            isPreviewImageUploaded={isPreviewImageUploaded}
                        />
                        <div className="w-full pb-5"></div>
                        {showUpdateMessage && (
                            <div className="my-2 flex h-10 items-center rounded-[0.8125rem] bg-yellow-1030 py-2 px-5 text-sm font-extrabold text-yellow-1031">
                                <div className="mr-2">
                                    <ErrorIcon stroke="#987001" strokeWidth="2" />
                                </div>
                                {t("hsm.updateMessage")}
                            </div>
                        )}
                        <div className="divide-gray-200 divide-y-1">
                            <div className="pt-5 sm:pb-10">
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                                    <Label name={inputNames.name} />
                                    <div className="sm:col-span-2">
                                        <Input
                                            type="text"
                                            defaultValue={displayName}
                                            name="displayName"
                                            required={true}
                                            onChange={handleUpdateChange}
                                            className={inputStringClassName}
                                            placeholder={inputNames.placeholderDisplayName}
                                            id="displayName"
                                        />
                                        {props.submitted && displayNameValidation && (
                                            <div className="pt-px text-xs text-right text-red-500">* {inputNames.required}</div>
                                        )}
                                    </div>
                                </div>
                                {array.length > 0 && (
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                        <Label name={inputNames.parameters} />
                                        <div className="flex flex-col flex-1 sm:col-span-2">
                                            {array.map((param, idx) => {
                                                return (
                                                    <div className={"mb-1 flex"} key={idx}>
                                                        <div className="mr-2 flex h-34 w-12 items-center justify-center rounded-[0.8125rem] bg-primary-700">
                                                            <span className="text-gray-400 text-15">{`{{${idx + 1}}}`}</span>
                                                        </div>
                                                        <Input
                                                            type="text"
                                                            id={idx + 1}
                                                            defaultValue={param.label}
                                                            placeholder={`{{${idx + 1}}} ${inputNames.placeholderParameters}`}
                                                            name={`${param.id}`}
                                                            onChange={handleEditParams}
                                                            className={inputStringClassName}
                                                        />
                                                    </div>
                                                );
                                            })}
                                            {props.submitted && paramsValidation && (
                                                <div className="pt-px text-xs text-right text-red-500">* {inputNames.requiredAllFields}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {((fileType === ".jpg, .png" && isMediaUrlImage) || fileType === ".pdf" || fileType === ".mp4") && (
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                        <Label name={inputNames.attachedFile} />
                                        <div className="sm:col-span-2">
                                            <input
                                                onChange={handleDocFile}
                                                // ref={InputImage}
                                                type="file"
                                                hidden={true}
                                                accept={fileType}
                                                id="file-picker"
                                                name="mediaUrl"
                                            />
                                            <button
                                                onClick={(evt) => {
                                                    evt.preventDefault();
                                                    clickFilePicker();
                                                }}
                                                className="flex cursor-pointer items-center gap-0.5 text-primary-200">
                                                <FileIcon />
                                                {inputNames.attachFile}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {loadingMedia && (
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                        <p>&nbsp;</p>
                                        <div className="sm:col-span-2">
                                            <div className="flex flex-row items-center justify-center w-full pb-3 my-1 h-11">
                                                <BarLoader size={"2.25rem"} color="#00b3c7" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isFileUploaded &&
                                    ((fileType === ".jpg, .png" && isMediaUrlImage) || fileType === ".pdf" || fileType === ".mp4") &&
                                    !loadingMedia && (
                                        <div className=" sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                            <p>&nbsp;</p>
                                            <div className="sm:col-span-2">
                                                {!loadingMedia && (
                                                    <div
                                                        className="grid items-start grid-cols-8 text-sm font-medium max-w-custom2 lg:text-justify"
                                                        style={{ color: "#9CB4CD" }}>
                                                        <div className="flex flex-row items-center col-span-7 p-3 rounded-lg border-1">
                                                            {mediaFileName || defaultMediaUrl ? (
                                                                <>
                                                                    {fileType === ".jpg, .png" && (
                                                                        <img
                                                                            className="rounded-lg h-11"
                                                                            src={values.mediaUrl ? values.mediaUrl : defaultMediaUrl}
                                                                            alt="Uploaded file"
                                                                        />
                                                                    )}
                                                                    {fileType === ".pdf" && (
                                                                        <div className="flex-none w-6">
                                                                            <FileIconReact
                                                                                color={"#E2E5E7"}
                                                                                labelTextColor={"white"}
                                                                                size={45}
                                                                                labelColor={"red"}
                                                                                foldColor="#B0B7BD"
                                                                                type={"acrobat"}
                                                                                labelUppercase
                                                                                extension={"pdf"}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    {fileType === ".mp4" && (
                                                                        <video className="rounded-lg h-11" controls>
                                                                            <source src={values.mediaUrl} type="video/mp4"></source>
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                    )}
                                                                    <p className="... ml-3  flex-1 truncate">
                                                                        {mediaFileName ? mediaFileName : defaultMediaFileName}
                                                                    </p>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <button
                                                            className="col-span-1 place-self-center"
                                                            onClick={() => {
                                                                removeDocFile();
                                                            }}>
                                                            <CloseIcon2 />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                {props.submitted && !isImageUploaded && (
                                    <div className="pt-px text-xs text-right text-red-500">* {inputNames.required}</div>
                                )}
                            </div>
                            <div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-10">
                                    <Label name={inputNames.team} />
                                    <div className="sm:col-span-2">
                                        <FormComboboxSelect
                                            positionTop={true}
                                            options={teamOptions}
                                            value={
                                                isUndefined(get(values, "teamId"))
                                                    ? isNull(props.template.teamId)
                                                        ? { name: inputNames.noTeam, id: "noTeam" }
                                                        : teamOptions.filter((team) => team.id === props.template.teamId)[0]
                                                    : teamOptions.filter((team) => team.id === values.teamId.id)[0]
                                            }
                                            handleChange={(e) => handleCombobox(e, "teamId")}
                                            name={"teamId"}
                                            background={"#fff"}
                                            hasCleanFilter={false}
                                        />
                                    </div>
                                </div>
                                <div className="mb-2 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                    <Label name={inputNames.visible} />
                                    <div className="w-full ml-2 sm:col-span-2">
                                        <input
                                            checked={isUndefined(get(values, "isVisible")) ? props.template.isVisible === 1 : isChecked}
                                            onChange={handleUpdateChange}
                                            name="isVisible"
                                            type="checkbox"
                                            className={inputCheckboxClassName}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormModal>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateTemplate;
