import { BookmarkIcon, UploadCircleIcon } from "@apps/shared/icons";
import { useContext } from "react";
import { DataManagmentContext } from "../../context/DataManagmentContext";
import { useTranslation } from "react-i18next";

const MinimizeDataManagment = () => {
  const { handleOpenPanel, countImportsAndDownloads, calculatingAllProcentage } = useContext(DataManagmentContext);
  const { t } = useTranslation();

  return (
    <button onClick={handleOpenPanel} className="flex h-10 items-center space-x-2 whitespace-nowrap rounded-10 border-transparent shadow-data-card rounded-b-none bg-primary-40 p-3 text-base font-bold text-primary-200 outline-none">
      {countImportsAndDownloads()?
        <>
          <UploadCircleIcon width="1.2rem" height="1.2rem" fill="none"/>
          <span className="ml-4 hidden mid:flex">
          {countImportsAndDownloads()} {t("datum.importsFile.importing")}
          </span>
          <div className="absolute bottom-0 left-[-8px] flex w-full overflow-hidden text-xs" style={{ height: "4px"}}>
            <div style={{ width: `${calculatingAllProcentage()}%` }} className="flex flex-col justify-center whitespace-nowrap bg-primary-370 text-center text-white shadow-none"></div>
          </div>
        </>
      :
      <>
        <BookmarkIcon  width="16" height="16" />
        <span className="hidden mid:flex">
          {t("datum.importsFile.dataManagment")}
        </span>
      </>
      }
    </button>
  )
}

export default MinimizeDataManagment;
