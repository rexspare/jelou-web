import Tippy from "@tippyjs/react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import { useEffect, useRef, useState } from "react";

import { Input, Label, Modal } from "@apps/shared/common";
import { useOnClickOutside } from "@apps/shared/hooks";
import FormModal from "../form-modal/form-modal";
import RenderPreviewMessage from "../render-preview-message/render-preview-message";

const ViewTemplate = (props) => {
    const { isVisible, displayName, elementName, paramsNumber, language, mediaUrl: defaultMediaUrl, teamId, category } = props.template;
    const {
        paramsNew,
        fileType,
        closeTemplateModal,
        buttonInputsArray,
        templateTypeOptions,
        renderBeatLoader,
        isPreviewImageUploaded,
        handleUploadImage,
        templateModalInputNames: inputNames,
        teamArray,
        lang,
    } = props;
    const buttonsNumber = buttonInputsArray.length;

    const [defaultBotName, setDefaultBotName] = useState("");
    const [defaultTypeValue, setDefaultTypeValue] = useState("");
    // hay un registro con un team id que esta en la lista
    const [defaultTeamValue] = useState(
        isNull(teamId)
            ? inputNames.noTeam
            : get(
                  teamArray.filter((team) => team.id === teamId),
                  "[0].name",
                  inputNames.noTeam
              )
    );

    const modalRef = useRef();
    let array = isEmpty(paramsNew) ? [] : paramsNew;

    function calcHeight(value) {
        let numberOfLineBreaks = (value.match(/\n/g) || []).length;
        // min-height + lines x line-height + padding + border
        let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
        return newHeight;
    }

    useEffect(() => {
        if (props.openEditModal) {
            // Dealing with Textarea Height
            let textarea = document.querySelector(".resize-ta");
            textarea.style.height = calcHeight(textarea.value) + "px";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.onClose]);

    useOnClickOutside(modalRef, () => closeTemplateModal());

    const columnsClassName = "flex justify-between sm:items-center sm:py-1";

    const inputStringClassName =
        "pl-10 truncate ... outline-none h-34 w-full flex-1 rounded-[0.8125rem] border-transparent px-2 text-15 text-gray-400 ring-transparent focus:border-transparent focus:ring-transparent font-semibold";

    const labelClassName = "ml-10";

    useEffect(() => {
        //
        const defaultBotName = props.botArray.filter((val) => val.id === props.template.botId)[0];
        setDefaultBotName(defaultBotName.name);
        //
        const defaultTypeName = templateTypeOptions.filter((val) => val.id === props.template.type);
        if (isEmpty(defaultTypeName)) {
            setDefaultTypeValue("HSM");
        } else setDefaultTypeValue(defaultTypeName[0].name);
    }, [props.botArray]);

    return (
        <Modal>
            <div className="fixed inset-x-0 top-0 z-100 overflow-scroll sm:inset-0 sm:flex sm:items-center sm:justify-center">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 z-100 bg-gray-490 bg-opacity-40" />
                </div>
                <div className="max-w-lg justify-center" ref={modalRef}>
                    <FormModal title={props.title} onClose={props.onClose} onConfirm={props.onConfirm} verified={true} loading={props.loading}>
                        <RenderPreviewMessage
                            renderBeatLoader={renderBeatLoader}
                            paramsNew={paramsNew}
                            inputNames={inputNames}
                            template={props.template}
                            mediaUrl={defaultMediaUrl}
                            handleUploadImage={handleUploadImage}
                            isPreviewImageUploaded={isPreviewImageUploaded}
                        />
                        <div className="divide-y-1 divide-gray-200 pt-2">
                            <div className={columnsClassName}>
                                <Label className={labelClassName} name={inputNames.name} />
                                <Tippy content={displayName} theme={"tomato"} arrow={false} placement={"top"} touch={false}>
                                    <div className="">
                                        <Input
                                            type="text"
                                            defaultValue={displayName}
                                            name="displayName"
                                            required={true}
                                            readOnly
                                            className={inputStringClassName}
                                        />
                                    </div>
                                </Tippy>
                            </div>

                            <div className={columnsClassName}>
                                <Label className={labelClassName} name={inputNames.template} />
                                <Tippy content={elementName} theme={"tomato"} arrow={false} placement={"top"} touch={false}>
                                    <div className="">
                                        <Input
                                            type="text"
                                            defaultValue={elementName}
                                            name="elementName"
                                            required={true}
                                            readOnly
                                            className={inputStringClassName}
                                        />
                                    </div>
                                </Tippy>
                            </div>

                            <div className={columnsClassName}>
                                <Label className={labelClassName} name={inputNames.category} />
                                <Tippy
                                    content={
                                        lang === "es"
                                            ? category === "UTILITY"
                                                ? "SERVICIOS"
                                                : category === "AUTHENTICATION"
                                                ? "AUTENTICACIÓN"
                                                : category
                                            : category
                                    }
                                    theme={"tomato"}
                                    arrow={false}
                                    placement={"top"}
                                    touch={false}>
                                    <div className="">
                                        <Input
                                            type="text"
                                            defaultValue={
                                                lang === "es"
                                                    ? category === "UTILITY"
                                                        ? "SERVICIOS"
                                                        : category === "AUTHENTICATION"
                                                        ? "AUTENTICACIÓN"
                                                        : category
                                                    : category
                                            }
                                            name="category"
                                            required={true}
                                            readOnly
                                            className={inputStringClassName + " lowercase"}
                                        />
                                    </div>
                                </Tippy>
                            </div>
                            <div className={columnsClassName}>
                                <Label className={labelClassName} name={inputNames.language} />
                                <div className="">
                                    <Input defaultValue={language} type="text" name="language" readOnly className={inputStringClassName} />
                                </div>
                            </div>
                            {props.botArray.length >= 2 && (
                                <div className={columnsClassName}>
                                    <div className="mr-10">
                                        <Label className={labelClassName} name={"Bot"} />
                                    </div>
                                    <div className="">
                                        <Input
                                            type="text"
                                            value={defaultBotName}
                                            name="botId"
                                            required={true}
                                            readOnly
                                            className={inputStringClassName}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className={columnsClassName}>
                                <Label className={labelClassName} name={inputNames.team} />
                                <div className="">
                                    <Input
                                        type="text"
                                        value={defaultTeamValue}
                                        name="displayName"
                                        required={true}
                                        readOnly
                                        className={inputStringClassName}
                                    />
                                </div>
                            </div>
                            <div className={columnsClassName}>
                                <Label className={labelClassName} name={inputNames.visible} />
                                <div className="">
                                    <Input
                                        type="text"
                                        value={isVisible === 1 ? inputNames.yes : inputNames.no}
                                        name="botId"
                                        required={true}
                                        readOnly
                                        className={inputStringClassName}
                                    />
                                </div>
                            </div>

                            <div className={columnsClassName}>
                                <Label className={labelClassName} name={inputNames.type} />
                                <div className="">
                                    <Input
                                        type="text"
                                        value={defaultTypeValue}
                                        name="botId"
                                        required={true}
                                        readOnly
                                        className={inputStringClassName}
                                    />
                                </div>
                            </div>
                            {fileType === "HSM_QUICKREPLY" && (
                                <div className={columnsClassName}>
                                    <Label className={labelClassName} name={inputNames.buttons} />
                                    <div className="">
                                        <Input value={buttonsNumber} type="text" name="ButtonOptions" readOnly className={inputStringClassName} />
                                    </div>
                                </div>
                            )}
                            {array.length > 0 && (
                                <>
                                    <div className={columnsClassName}>
                                        <Label className={labelClassName} name={inputNames.paramsNumber} />
                                        <div className="">
                                            <Input
                                                type="number"
                                                min="0"
                                                defaultValue={paramsNumber}
                                                name="paramsNumber"
                                                className={inputStringClassName}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className={columnsClassName}>
                                        <Label className={labelClassName} name={inputNames.parameters} />
                                        <div
                                            className={`flex flex-col divide-y-1 divide-gray-200 ${
                                                array.length > 1 ? "border-l-1 border-gray-200" : ""
                                            }`}>
                                            {array.map((param, index) => {
                                                return (
                                                    <div className={"mb-1"} key={index}>
                                                        <Input
                                                            type="text"
                                                            id={index + 1}
                                                            defaultValue={param.label}
                                                            name={`${param.id}`}
                                                            readOnly
                                                            className={inputStringClassName}
                                                            placeholder={"ej: operador"}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </FormModal>
                </div>
            </div>
        </Modal>
    );
};

export default ViewTemplate;
