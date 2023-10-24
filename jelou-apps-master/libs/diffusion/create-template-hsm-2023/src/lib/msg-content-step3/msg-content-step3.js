import * as React from "react";

import ContentAuth from "./content-auth";
import ContentServMark from "./content-service-marketing";
export function MsgContentStep3(props) {
    const {
        templateModalInputNames,
        t,
        hsmCategory,
        templateTypeOptions,
        handleCombobox,
        values,
        ArrowSelect,
        classSelect,
        fileType,
        setFileType,
        loadingMedia,
        handleDocFile,
        clickFilePicker,
        mediaUrlMessage,
        removeDocFile,
        isFileUploaded,
        mediaFileName,
        isInputValuesDontComply,
        handleChange,
        MINIMUM_CHARACTERS,
        ErrorIcon,
        getValidFileTypes,
        validateExtension,
        getExtension,
        weightFile,
        onBlur,
        handleChangeParams,
        setLockStep,
        setScrollControl,
        paramsNew,
        handleEditParams,
        addParamToContent,
        array,
        setValues,
        setParamsNew,
        setButtonInputsArray,
        setSelectedType,
        setOpcAuth,
        opcAuth,
        setMinutesExp,
        minutesExp,
        setFoundOpcScurity,
        setFoundOpcCodeExp,
        foundOpcScurity,
        foundOpcCodeExp,
        auth,
        setExampleAuth,
        exampleAuth,
        allowChangeCat,
        validationNameChar,
    } = props;

    const inputParamClassName =
        "flex flex-1 h-34 border-1 border-gray-36 border-spacing-[0.98rem] rounded-10 bg-transparent px-2 text-15 text-black focus:!border-blue-200  focus:shadow focus:!shadow-blue-200";
    return (
        <div className="px-12 pt-12 pb-4">
            <h1 className="pb-5 text-xl font-bold  text-gray-400 ">{templateModalInputNames.content}</h1>
            {hsmCategory === auth ? (
                <ContentAuth
                    templateModalInputNames={templateModalInputNames}
                    t={t}
                    values={values}
                    setValues={setValues}
                    inputParamClassName={inputParamClassName}
                    ArrowSelect={ArrowSelect}
                    classSelect={classSelect}
                    setParamsNew={setParamsNew}
                    setButtonInputsArray={setButtonInputsArray}
                    setSelectedType={setSelectedType}
                    hsmCategory={hsmCategory}
                    setFileType={setFileType}
                    array={array}
                    setScrollControl={setScrollControl}
                    setLockStep={setLockStep}
                    paramsNew={paramsNew}
                    setOpcAuth={setOpcAuth}
                    opcAuth={opcAuth}
                    setMinutesExp={setMinutesExp}
                    minutesExp={minutesExp}
                    setFoundOpcScurity={setFoundOpcScurity}
                    setFoundOpcCodeExp={setFoundOpcCodeExp}
                    foundOpcScurity={foundOpcScurity}
                    foundOpcCodeExp={foundOpcCodeExp}
                    setExampleAuth={setExampleAuth}
                    exampleAuth={exampleAuth}
                    allowChangeCat={allowChangeCat}
                />
            ) : (
                <ContentServMark
                    templateModalInputNames={templateModalInputNames}
                    templateTypeOptions={templateTypeOptions}
                    handleCombobox={handleCombobox}
                    values={values}
                    ArrowSelect={ArrowSelect}
                    classSelect={classSelect}
                    t={t}
                    fileType={fileType}
                    setFileType={setFileType}
                    loadingMedia={loadingMedia}
                    handleDocFile={handleDocFile}
                    clickFilePicker={clickFilePicker}
                    mediaUrlMessage={mediaUrlMessage}
                    removeDocFile={removeDocFile}
                    isFileUploaded={isFileUploaded}
                    mediaFileName={mediaFileName}
                    isInputValuesDontComply={isInputValuesDontComply}
                    handleChange={handleChange}
                    MINIMUM_CHARACTERS={MINIMUM_CHARACTERS}
                    ErrorIcon={ErrorIcon}
                    getValidFileTypes={getValidFileTypes}
                    validateExtension={validateExtension}
                    getExtension={getExtension}
                    weightFile={weightFile}
                    onBlur={onBlur}
                    handleChangeParams={handleChangeParams}
                    setLockStep={setLockStep}
                    setScrollControl={setScrollControl}
                    paramsNew={paramsNew}
                    handleEditParams={handleEditParams}
                    addParamToContent={addParamToContent}
                    array={array}
                    setValues={setValues}
                    inputParamClassName={inputParamClassName}
                    hsmCategory={hsmCategory}
                    setOpcAuth={setOpcAuth}
                    setFoundOpcScurity={setFoundOpcScurity}
                    setFoundOpcCodeExp={setFoundOpcCodeExp}
                    allowChangeCat={allowChangeCat}
                    validationNameChar={validationNameChar}
                />
            )}
        </div>
    );
}
export default MsgContentStep3;
