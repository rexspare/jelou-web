import { useTranslation } from "react-i18next";

const OptionsTypes = ({ handleOptions, currentOption, options }) => {

  const { t } = useTranslation();

  return (
    <div className="flex w-full px-2 flex-row justify-start border-b-gray-border border-1 border-transparent">
      <button onClick={()=> {handleOptions(options.IMPORTS)}} className={`flex justify-center w-1/3 px-2 py-3 text-gray-400 transition-border   border-b-2  duration-100 hover:border-primary-200 ${currentOption === options.IMPORTS ? "border-primary-200 font-bold text-primary-200" : "border-transparent"}`}>
        <span className="text-sm">{t("datum.importsFile.import")}</span>
      </button>
      {/* <button onClick={()=> {handleOptions(options.DOWNLOADS)}} className={`flex justify-center w-1/3 px-2 py-3 text-gray-400 transition-border   border-b-2  duration-100 hover:border-primary-200 ${currentOption === options.DOWNLOADS ?"border-primary-200 font-bold text-primary-200" : "border-transparent"}`}>
        <span className="text-sm">Descargas</span>
      </button> */}
    </div>
  )
}

export default OptionsTypes;
