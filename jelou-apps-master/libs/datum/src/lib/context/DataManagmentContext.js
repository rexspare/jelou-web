import { JelouApiV2 } from "@apps/shared/modules";
import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const MINUTE = 60
const PROCCESS_X_SECONDS = 10;

export const DataManagmentContext = createContext(null);

const DataManagmentContextProvider = ({ children }) =>{
  let interval;
  const { databaseId } = useParams();
  const [openPanel, setOpenPanel] = useState(false);
  const [dataImportFile, setDataImportFile] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleOpenPanel = () => setOpenPanel(!openPanel);

  const getActualImports = async() =>{
    const { data } = await JelouApiV2.get(`/databases/${databaseId}/stats?page=1&limit=10`)
    setDataImportFile(data.results)
  }

  useEffect(()=>{
    getActualImports();
    if(!interval){
       interval = setInterval(getUploadAndDownload,10000)
    }
  },[databaseId])

  const getUploadAndDownload = async () => {
    const { data } = await JelouApiV2.get(`/databases/${databaseId}/stats?page=1&limit=10`)
    if(isSuccessfullyAll(data.results)){
      stopConsulting();
    }
    setDataImportFile(data.results);
  }

  const clearBrowsingData = async () => {
    setIsLoading(true)
    await JelouApiV2.delete('/databases/bulk/history');
    getActualImports();
    setIsLoading(false);
  }

  const stopConsulting = () => {
    clearInterval(interval)
    interval = null;
  }

  const calculatingPorcentage = (current, total) =>{
    return (current * 100) / total
  }

  const calculatingAllProcentage = () => {
    const allCurrent = dataImportFile.reduce((acc, current) => current.processed_rows !== current.total_rows ? (acc + current.processed_rows) : acc,0)
    const allTotal = dataImportFile.reduce((acc, current) => current.processed_rows !== current.total_rows ? (acc + current.total_rows) : acc,0)
    return (allCurrent * 100) / allTotal
  }

  const isSuccessfullyAll = data => {
    return !data.some( register => register.total_rows !== register.processed_rows)
  }

  const removeItem = id => {
    setDataImportFile(dataImportFile.filter(d => d.file_name !== id))
  }

  const calculateTimeEstimate = (currentRows,totalRows) =>{
    const countSeconds = (totalRows - currentRows) / PROCCESS_X_SECONDS;
    if(countSeconds < MINUTE)
      return `${t("datum.importsFile.about")} ${countSeconds.toFixed(0)} ${t("datum.importsFile.seconds")} ${t("datum.importsFile.left")}`
    else
      return `${t("datum.importsFile.about")} ${(countSeconds/MINUTE).toFixed(0)} ${t("datum.importsFile.minutes")} ${t("datum.importsFile.left")}`
  }

  const calculateAllTimeEstimate = () => {
    const totalSeconds = dataImportFile.reduce((acc,current) => acc + (((current.total_rows - current.processed_rows)/PROCCESS_X_SECONDS) || 0),0);
    return totalSeconds < MINUTE ? `${totalSeconds.toFixed(0)} ${t("datum.importsFile.seconds")}` : `${(totalSeconds/MINUTE).toFixed(0)} ${t("datum.importsFile.minutes")}`
  }

  const countImportsAndDownloads = () =>{
    const count = dataImportFile.reduce((acc,current) => {
      if(current.total_rows !== current.processed_rows){
        return acc + 1
      }
      return acc
    },0)
    return count;
  }

  return (
    <DataManagmentContext.Provider value={
      { dataImportFile,
        isLoading,
        openPanel,
        setOpenPanel,
        removeItem,
        calculateAllTimeEstimate,
        calculateTimeEstimate,
        handleOpenPanel,
        getActualImports,
        stopConsulting,
        setDataImportFile,
        calculatingPorcentage,
        countImportsAndDownloads,
        calculatingAllProcentage,
        clearBrowsingData
      }
    }>
      {children}
    </DataManagmentContext.Provider>
  )
}

export default DataManagmentContextProvider;
