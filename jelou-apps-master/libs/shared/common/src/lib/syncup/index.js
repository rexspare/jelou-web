import { useTranslation } from "react-i18next";

const textColor = {
  error: "text-red-750",
  success: "text-green-960",
  warningloading: "text-yellow-1015",
  defaultLoading: "text-primary-200"
}
const backgroundColor = {
  error: "bg-red-5",
  success: "bg-green-20",
  warningLoading: "bg-yellow-1030",
  defaultLoading: "bg-teal-5"
}
const DEFAULT = "defaultLoading"
const SyncUp = ({ currentProgress = 5, type = DEFAULT, text }) =>{

  const { t } = useTranslation();

  return (
    <div className={`w-full flex flex-col rounded-10 justify-center items-center py-2 px-3 ${backgroundColor[type]}`}>
      <span className={`text-sm font-bold ${textColor[type]}`}>{text}</span>
      {type === DEFAULT && (
        <div className="flex w-full my-1 mr-2 overflow-hidden rounded-default text-xs" style={{ height: "7px", backgroundColor: "#f2f2f2" }}>
          <div style={{ width: `${currentProgress}%` }} className={`flex flex-col justify-center whitespace-nowrap rounded-default ${type !== DEFAULT ? "bg-yellow-1015" : "bg-primary-200"} text-center text-white shadow-none`}></div>
        </div>
      )}
    </div>
  )
}

export default SyncUp;
