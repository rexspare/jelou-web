import { useState, useContext, useEffect } from "react";
import get from "lodash/get";
import first from "lodash/first";
import isNil from "lodash/isNil";
import isEmpty from "lodash/isEmpty";
import compact from "lodash/compact";
import cloneDeep from "lodash/cloneDeep";

import { CloseIcon2 } from "@apps/shared/icons";
import { INIT_STEPS_LIST, MILISECONDS, MILISECONDS_EXTRA, STEPS_IDS } from "../../../../constants";
import { DataManagmentContext } from "libs/datum/src/lib/context/DataManagmentContext";
import { createDataPreview, createNewData, getPreview } from "./bulkDataAPI";
import { useUploadFile } from "../Hooks/uploadFile";
import { ShowAnimationContext, ErrorBoundaryContext } from "../../../Table";
import { BulkDataLoadModal } from "../../Modals/BulkDataLoad";
import { NavigationSteps } from "../../Modals/BulkDataLoad/NavigationSteps";
import { UploadFile } from "../../Modals/BulkDataLoad/StepOneUploadFile";
import { MatchColumns } from "../../Modals/BulkDataLoad/StepTwoMatchColumns";
import { DataPreview } from "../../Modals/BulkDataLoad/StepThreeDataPreview";
import { UnsavedChangesModal } from "../../Modals/UnsavedChangesModal";

export default function CreateDataFromFile({ isOpen, closeModal, oneDataBase }) {
    const dataBaseColumns = get(oneDataBase, "columns", []);
    const requiredDbColumns = dataBaseColumns.filter(column => column.isRequired === true);
    const { setShowUploadingDataAnimation } = useContext(ShowAnimationContext);
    const { setHasUploadFileError } = useContext(ErrorBoundaryContext);
    const { getActualImports } = useContext(DataManagmentContext)
    const { prepareFile: uploadFile } = useUploadFile({ databaseSlug: `${oneDataBase.slug}` });
    const [step, setStep] = useState(STEPS_IDS.FILE_UPLOAD);
    const [stepsList, setStepsList] = useState(INIT_STEPS_LIST);
    const [url, setUrl] = useState("");
    const [timeCurrent,setTimeCurrent] = useState(0);
    const [timelimit, setTimeLimit] = useState(null);
    const [formatError, setFormatError] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [fileName, setFileName] = useState("");
    const [loadingFile, setLoadingFile] = useState(false);
    const [pageList, setPageList] = useState([]);
    const [initPageList, setInitPageList] = useState([]);
    const [selectedDateRows, setSelectedDateRows] = useState([]);
    const [allowGoingToNextPage, setAllowGoingToNextPage] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [selectedFileCol, setSelectedFileCol] = useState(
        dataBaseColumns.map(() => {
            return { value: undefined, type: "", key: "", hasDateFormat: false, isRequired: false, isLoading: false };
        })
    );
    const page = 0;
    let intervalId;

    const calculateTimeLeft = () => {
        intervalId = !intervalId && setInterval(() => {
          setTimeCurrent(prev => prev + 1);
        }, 1000)
        if(timeCurrent >= timelimit ) {
          setTimeCurrent(0);
          setTimeLimit(null);
          clearInterval(intervalId);
          intervalId = null;
        }
    };

    useEffect(()=>{
      calculateTimeLeft();
      return () => clearInterval(intervalId)
    }, [timelimit, timeCurrent]);

    async function fetchDataPreview(dataBase, fileUrl, dateColumns) {
        const validDateColumns = compact(dateColumns);
        let response;
        let hasError = "";
        try {
          response = await createDataPreview(dataBase.id, fileUrl, validDateColumns);
          const { preview_id, duration } = response.data;
          const timeOutInMiliseconds = (duration * MILISECONDS) + MILISECONDS_EXTRA;
          setTimeLimit(timeOutInMiliseconds/MILISECONDS);
          const { data } = await getPreview(preview_id, timeOutInMiliseconds);
          if(data.status === "error") hasError = data.error
          if (isEmpty(hasError)) {
            return { success: true, data: get(data, "data.worksheet_data",[]), fileSize: get(data, "data.file_size",0) };
          } else {
            return { success: false, error: hasError };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
    };

    /** This function gets the file information preview. */
    function handleFile(evt) {
        try {
            setFormatError("");
            const files = get(evt, "target.files");
            const file = first(files);
            if(!file.name.includes(".xlsx")){ setFormatError("Error archivo")}
            else {
              setFileSize(get(file, "size", 0));
              setFileName(get(file, "name", ""));
              setLoadingFile(true);
              uploadFile({ file })
              .then(async (url) => {
                setUrl(url);
                try {
                    const result = await fetchDataPreview(oneDataBase, url, selectedDateRows);
                    setLoadingFile(false);
                    if (result.success) {
                      const fileDataPreview = result.data;
                      setPageList([{...fileDataPreview[0],fileSize:fileSize}]);
                      setInitPageList(Object.freeze(cloneDeep(fileDataPreview)));
                    } else {
                      const errorMessage = result.error;
                      setPageList([{fileSize:get(file, "size", 0)}]);
                      setFormatError(errorMessage);
                    }
                } catch (error) {
                    setFormatError(error);
                    setAllowGoingToNextPage(false);
                  };
                })
              .catch((error) => {
                setLoadingFile(false);
                setFormatError(error);
                console.log("An error occurred while trying to upload your info preview ==> ", error);
              });
            }
        } catch (error) {
            setLoadingFile(false);
            setFormatError(error);
            // setAllowGoingToNextPage(false);
            console.log("An error occurred while trying to get your file information ==> ", error);
        };

    }

    /**This function writes the file information selected by the user, to the database. */
    async function uploadDataFile() {
        try {
            const metaDataObj = {};
            const dbColKeys = dataBaseColumns.map(dbCol => dbCol.key);
            dbColKeys.forEach((key, index) => {
                if (!isNil(selectedFileCol[index].value) && selectedFileCol[index].value !== "- - - -") {
                    metaDataObj[key] = selectedFileCol[index].value;
                }
            });
            setShowUploadingDataAnimation(true);
            closeModal();
            try {
                const validDateColumns = compact(selectedDateRows);
                const data = await createNewData(oneDataBase.id, url, validDateColumns, pageList, page, fileSize, metaDataObj);
                const hasError = get(data, `error.clientMessages.${localStorage.getItem("lang")}`, "");
                setShowUploadingDataAnimation(false);
                if (isEmpty(hasError)) {
                  getActualImports()
                } else {
                    setHasUploadFileError(true);
                    throw hasError;
                }
            } catch (error) {
                setShowUploadingDataAnimation(false);
                throw error;
            }
        } catch (error) {
            setShowUploadingDataAnimation(false);
            console.log("An error occurred while uploading your data ==> ", error);
        }
    }

    const closeAndClear = () => {
        setStep(STEPS_IDS.FILE_UPLOAD);
        setStepsList(INIT_STEPS_LIST);
        closeModal();
    };

    const PANELS = {
        [STEPS_IDS.FILE_UPLOAD]: () => (
            <UploadFile
                handleFile={handleFile}
                pageList={pageList}
                setPageList={setPageList}
                page={page}
                timeCurrent={(timeCurrent * 100) / timelimit}
                fileName={fileName}
                formatError={formatError}
                setFormatError={setFormatError}
                loadingFile={loadingFile}
                allowGoingToNextPage={allowGoingToNextPage}
                setAllowGoingToNextPage={setAllowGoingToNextPage}
                closeAndClear={closeAndClear}
                goToNextPanel={goToNextPanel}
                setTimeCurrent={setTimeCurrent}
                setTimeLimit={setTimeLimit}
            />
        ),
        [STEPS_IDS.COLUMN_MATCH]: () => (
            <MatchColumns
                dataBaseColumns={dataBaseColumns}
                requiredDbColumns={requiredDbColumns}
                pageList={pageList}
                setPageList={setPageList}
                fetchDataPreview={fetchDataPreview}
                initPageList={initPageList}
                page={page}
                setSelectedDateRows={setSelectedDateRows}
                selectedDateRows={selectedDateRows}
                loadingFile={loadingFile}
                selectedFileCol={selectedFileCol}
                setSelectedFileCol={setSelectedFileCol}
                goBackPanel={goBackPanel}
                goToNextPanel={goToNextPanel}
                url={url}
                oneDataBase={oneDataBase}
            />
        ),
        [STEPS_IDS.DATA_PREVIEW]: () => (
            <DataPreview
                dataBaseColumns={dataBaseColumns}
                pageList={pageList}
                page={page}
                selectedFileCol={selectedFileCol}
                goBackPanel={goBackPanel}
                goToNextPanel={goToNextPanel}
                uploadDataFile={uploadDataFile}
            />
        ),
    };

    const goToNextPanel = (currentStep, nextStep) => {
        setStepsList((preState) => preState.map((step) => (step.id === currentStep ? { ...step, isComplete: true, isActive: false } : step)));
        setStepsList((preState) => preState.map((step) => (step.id === nextStep ? { ...step, isActive: true } : step)));
        setStep(nextStep);
    };

    const goBackPanel = (currentStep, previousStep) => {
        setStepsList((preState) => preState.map((step) => (step.id === currentStep ? { ...step, isActive: false } : step)));
        setStepsList((preState) => preState.map((step) => (step.id === previousStep ? { ...step, isActive: true, isComplete: false } : step)));
        setStep(previousStep);
    };

    return (
        <>
            <BulkDataLoadModal className="h-[725px] rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]"
                showModal={isOpen}
                closeModal={() => null}
                classNameActivate=""
            >
                <div className="grid grid-cols-[20rem_1fr] h-full">
                    <div className="mr-2 mt-1 p-4 absolute right-0 top-0">
                        <button
                            aria-label="Close"
                            onClick={(evt) => {
                                evt.preventDefault();
                                setShowWarningModal(true);
                            }}>
                            <CloseIcon2 width={"1.1rem"} height={"1.1rem"} fillOpacity={0.5} />
                        </button>
                    </div>
                <section className="w-full row-span-2 py-11 pr-12 pl-12 bg-primary-350">
                    <NavigationSteps stepsList={stepsList} />
                </section>
                <section className="w-full">
                    {PANELS[step]()}
                </section>
                </div>
            </BulkDataLoadModal>
            <UnsavedChangesModal
                showModal={showWarningModal}
                closeModal={() => setShowWarningModal(false)}
                closeAndClear={closeAndClear}
            />
        </>
    );
}

