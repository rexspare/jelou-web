import { useContext } from "react"
import { DataManagmentContext } from "../../context/DataManagmentContext"
import { Clean } from "@apps/shared/icons"
import { ClipLoader } from "react-spinners"
import { useTranslation } from "react-i18next"

const ButtonsContainer = () =>{
  const { clearBrowsingData, isLoading } = useContext(DataManagmentContext);
  const { t } = useTranslation();
  return (
    <div className="w-full px-3 flex justify-end bg-white border-t-gray-border border-1 border-transparent">
        <button className="w-[38%] rounded-3xl border-1 flex justify-center items-center border-primary-200 my-4 py-1 px-3" onClick={()=>{clearBrowsingData()}}>
          {isLoading ?
            <ClipLoader color="#00B3C7" size={"1rem"} />
          :
          <>
            <Clean fill="#00B3C7" width="1.188rem" height="1.188rem" />
            <span className="ml-1 text-primary-200 font-bold text-13">{t("datum.importsFile.cleanFiles")}</span>
          </>
          }
        </button>
    </div>
   )
}

export default ButtonsContainer
