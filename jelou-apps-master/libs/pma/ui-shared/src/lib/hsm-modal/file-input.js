import React, { useEffect, useState } from "react";
import { FileDrop } from "react-file-drop";
import { BeatLoader } from "react-spinners";

import { FilesIcon } from "@apps/shared/icons";
import { useTranslation } from "react-i18next";

const acceptString = ".csv";

const FileInput = (props) => {
  const { loadingFile, setLoadingFile, setIsLoading, handleFile, fileName, fileSize, fileData } = props;
  const { t } = useTranslation();
  const [readyToDrop, setReadyToDrop] = useState(false);

  const clickFilePicker = () => {
    // Sorry for this method... but it may be the easiest one
    const filePicker = document.getElementById("CSV-file-picker");
    filePicker.click();
  };

  const onDrop = (files) => {
    const dropFile = { target: { files: files } };
    handleFile(dropFile);
  };

  useEffect(() => {
    setLoadingFile({ value: false });
    setIsLoading(false);
  }, [fileData]);

  return (
    <div className="px-8">
      <div
        className={`w-full border-2 ${
          readyToDrop ? "border-primary-200" : "border-border"
        } flex flex-row overflow-auto rounded-lg border-dashed bg-gray-25`}>
        <FileDrop
          onDrop={(files) => onDrop(files)}
          onFrameDragEnter={(event) => setReadyToDrop(true)}
          onFrameDragLeave={(event) => setReadyToDrop(false)}
          className="flex-1">
          <div className="flex items-center justify-center py-4">
            <FilesIcon className="mx-8 fill-current text-white" width="6.25rem" height="6.25rem" />
            <div className="flex flex-1 flex-col items-start" style={{ color: "#9CB4CD" }}>
              <p className="text-sm font-medium lg:text-justify">CSV</p>
              <input className="hidden" type="file" name="avatar" accept={acceptString} onChange={handleFile} id="CSV-file-picker" />
              <p className="mb-3 text-sm font-medium lg:text-justify">Arrastra el achivo hasta aquí o búscalo en tus documentos</p>
              <button
                className="mb-3 h-8 cursor-pointer rounded-full bg-primary-200 px-3 text-sm font-medium text-white hover:bg-primary-100 focus:outline-none"
                onClick={clickFilePicker}>
                {t("pma.Seleccionar Archivo")}
              </button>
              <div className="mb-3 text-sm font-medium lg:text-justify" style={{ color: "#9CB4CD" }}>
                {loadingFile.value ? (
                  <BeatLoader color={"#00B3C7"} size={"0.625rem"} />
                ) : (
                  `${fileName ? `${fileName} -` : ""} Destinatarios: ${fileSize}` || " "
                )}
                <a
                  href="https://cdn.jelou.ai/lista_ejemplo.csv"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex items-center underline hover:text-primary-200">
                  Ejemplo
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </FileDrop>
      </div>
    </div>
  );
};

export default FileInput;
