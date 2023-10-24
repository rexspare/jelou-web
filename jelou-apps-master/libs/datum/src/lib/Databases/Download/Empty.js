import { useTranslation } from "react-i18next";

const Empty = () =>{
  const { t } = useTranslation();
  return (
    <div className="w-full mt-7 px-5">
      <span className="font-normal text-gray-400 text-center text-sm">{t("datum.importsFile.empty")}</span>
    </div>
  )
}

export default Empty;
