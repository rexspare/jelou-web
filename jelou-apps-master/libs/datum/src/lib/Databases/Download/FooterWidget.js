import { useTranslation } from "react-i18next";
import ButtonsContainer from "./ButtonsContainer";
import { useContext } from "react";
import { DataManagmentContext } from "../../context/DataManagmentContext";

const FooterWidget = () => {
  const {
    dataImportFile,
    calculateAllTimeEstimate,
    countImportsAndDownloads,
  } = useContext(DataManagmentContext);

  const { t } = useTranslation();

  return (
    <div className="absolute bottom-0 w-full">
      {countImportsAndDownloads()?
        <div className="px-3 py-2 w-full bg-[#F7F8FA] text-center">
          <span className="font-medium text-[#727C94] text-xs">...{t("datum.importsFile.startTo")} <span className="font-bold text-[#727C94] text-xs">{calculateAllTimeEstimate()}</span> {t("datum.importsFile.leftTo")}...</span>
        </div>
      :null}
      {dataImportFile.length > 0 ?
        <ButtonsContainer />
      :null}
    </div>
  )
}

export default FooterWidget;
