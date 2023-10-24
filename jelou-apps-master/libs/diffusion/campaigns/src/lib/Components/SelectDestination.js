/* eslint-disable react-hooks/exhaustive-deps */
import { CancelIcon, FilesIcon } from "@apps/shared/icons";
import React, { useEffect } from "react";
import { FileDrop } from "react-file-drop";
import AssignParameters from "./AssignParameters";

import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";

let arrayColumns;

const SelectDestination = (props) => {
    const {
        nextStep,
        acceptString,
        handleFile,
        clickFilePicker,
        fileName,
        selectedHsm,
        options,
        fileRows,
        setParamSelected,
        paramSelected,
        selectAllParams,
        setSelectAllParams,
        loadingFile,
        setLoadingFile,
        setArrayColumn,
        removeFileDropped,
    } = props;

    const { t } = useTranslation();

    useEffect(() => {
        if (!isEmpty(selectedHsm) && !isEmpty(options)) {
            arrayColumns = options.slice(1).map((param, index) => {
                return { id: index + 1, name: param };
            });
            arrayColumns = [{ id: 0, name: t("selectDestination.notAssigned") }].concat(arrayColumns);
            setArrayColumn(arrayColumns);
        }
    }, [selectedHsm, options]);
    useEffect(() => {
        setLoadingFile({ value: false });
    }, [fileRows]);

    const checkComplete = (arrayCheck) => {
        if (!isEmpty(arrayCheck.slice(1))) {
            let count = 0;
            const exist = arrayCheck.slice(1);
            exist.forEach((element) => {
                if (element === 0) {
                    count++;
                }
            });
            if (count === 0) setSelectAllParams(true);
            else setSelectAllParams(false);
        }
    };

    const gotNext = () => {
        nextStep(3);
    };

    const gotPrevious = () => {
        nextStep(1);
    };

    const onDrop = (files) => {
        const dropFile = { target: { files: files } };
        handleFile(dropFile);
    };
    const renderStep = (selectAllParams, fileName) => {
        switch (selectAllParams && !isEmpty(fileName)) {
            case false:
                return (
                    <button
                        className="button-primary mt-6 h-12 w-40 cursor-not-allowed !rounded-full bg-primary-200 text-sm text-white focus:outline-none focus:ring-4"
                        onClick={gotNext}
                        disabled={true}
                    >
                        {t("buttons.next")}
                    </button>
                );
            case true:
                return (
                    <button className="button-primary mt-6 h-12 w-40 !rounded-full bg-primary-200 text-sm font-bold text-white focus:outline-none focus:ring-4" onClick={gotNext}>
                        {t("buttons.next")}
                    </button>
                );
            default:
                break;
        }
    };
    return (
        <div className="flex h-4/5 w-full flex-row " id="select-campaign">
            <div className="ml-6 w-full pb-4 pr-2">
                <p className="text-xl font-bold text-gray-400">{t("selectDestination.sendCampaign")}</p>
                <p className="my-2 pb-2 text-sm font-medium text-gray-450 lg:text-justify">{t("selectDestination.attachList")}</p>
                <div className="h-211 flex w-full flex-row rounded-lg border-2 border-dotted border-gray-60 bg-hover-conversation">
                    <FileDrop className="w-full" onDrop={(files) => onDrop(files)}>
                        <div className="flex">
                            <FilesIcon className="mx-8 my-auto fill-current text-white" width="6.25rem" height="6.25rem" />
                            <div className="my-6 ml-5 flex flex-col" style={{ color: "#9CB4CD" }}>
                                <p className="text-sm font-medium lg:text-justify">CSV</p>
                                <input className="hidden" type="file" name="avatar" accept={acceptString} onChange={handleFile} id="file-picker" />
                                <p className="text-sm font-medium lg:text-justify">{t("selectDestination.searchFile")}</p>
                                <button
                                    className="focus:ring-2 button-primary mt-3 mb-3 h-12 w-40 cursor-pointer !rounded-full bg-gray-border text-base font-medium text-gray-75 hover:bg-primary-200 hover:text-white focus:outline-none"
                                    onClick={() => clickFilePicker()}
                                >
                                    {t("selectDestination.search")}
                                </button>
                                <div className="text-sm font-medium lg:text-justify" style={{ color: "#9CB4CD" }}>
                                    <div className="flex flex-row items-center">
                                        {fileName ? (
                                            <>
                                                <p>{fileName}</p>
                                                <button
                                                    className="ml-2"
                                                    onClick={() => {
                                                        removeFileDropped();
                                                    }}
                                                >
                                                    <CancelIcon />
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                    <p className="mt-2">{fileRows ? `${t("selectDestination.total")} ${fileRows.length - 1}` : " "}</p>
                                </div>
                            </div>
                        </div>
                    </FileDrop>
                </div>
                <p className="my-2 pb-2 text-sm font-medium text-gray-450 lg:text-justify">
                    {t("selectDestination.selectList")}
                    <a className="ml-2 cursor-pointer font-medium text-primary-200" href="https://s3.us-west-2.amazonaws.com/cdn.devlabs.tech/hsm/Lista_ejemplo.csv">
                        {t("selectDestination.getItHere")}
                    </a>
                </p>
                {!isEmpty(options) ? (
                    <AssignParameters
                        fileRows={fileRows}
                        selectedHsm={selectedHsm}
                        arrayColumns={arrayColumns}
                        setParamSelected={setParamSelected}
                        paramSelected={paramSelected}
                        checkComplete={checkComplete}
                        loading={loadingFile.value}
                        setArrayColumn={setArrayColumn}
                    />
                ) : null}

                <div className="flex w-full justify-end">
                    <button className="mt-6 h-12 w-40 rounded-full text-sm font-bold text-gray-450 focus:outline-none focus:ring-4" onClick={gotPrevious}>
                        {t("buttons.back")}
                    </button>
                    {renderStep(selectAllParams, fileName)}
                </div>
            </div>
        </div>
    );
};

export default SelectDestination;
