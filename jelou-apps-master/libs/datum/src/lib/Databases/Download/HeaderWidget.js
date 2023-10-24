import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DataManagmentContext } from "../../context/DataManagmentContext";


const HeaderWidget = () =>{
  const {
    handleOpenPanel,
  } = useContext(DataManagmentContext);

  const { t } = useTranslation();

  return (
    <button onClick={handleOpenPanel} className="flex w-full justify-between items-center text-white bg-primary-200 py-3 px-5 text-base font-normal space-x-2 whitespace-nowrap outline-none">
        <span className="font-semibold">{t("datum.importsFile.dataManagment")}</span>
        <div className="flex w-[14%]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-white hover:text-gray-200 cursor-pointer mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current justify-center text-white hover:text-gray-200 cursor-pointer w-[50%] ml-2"
            viewBox="0 0 16 16"
          >
            <path
              d="M9.76221 8L15.7444 2.01717C15.9089 1.85248 15.9997 1.63276 16 1.39846C16 1.16404 15.9092 0.944061 15.7444 0.779628L15.2202 0.255496C15.0553 0.0904124 14.8356 0 14.6011 0C14.367 0 14.1473 0.0904124 13.9824 0.255496L8.00026 6.23793L2.01782 0.255496C1.85327 0.0904124 1.63343 0 1.39902 0C1.16488 0 0.945041 0.0904124 0.780488 0.255496L0.256 0.779628C-0.0853333 1.12098 -0.0853333 1.67621 0.256 2.01717L6.23831 8L0.256 13.9826C0.0913171 14.1475 0.000650406 14.3672 0.000650406 14.6015C0.000650406 14.8358 0.0913171 15.0555 0.256 15.2204L0.780358 15.7445C0.944911 15.9095 1.16488 16 1.39889 16C1.6333 16 1.85314 15.9095 2.01769 15.7445L8.00013 9.76194L13.9823 15.7445C14.1471 15.9095 14.3668 16 14.601 16H14.6012C14.8355 16 15.0552 15.9095 15.22 15.7445L15.7443 15.2204C15.9088 15.0557 15.9996 14.8358 15.9996 14.6015C15.9996 14.3672 15.9088 14.1475 15.7443 13.9827L9.76221 8Z"
              fill=""
            />
          </svg>
        </div>
    </button>
  )
}


export default HeaderWidget;
