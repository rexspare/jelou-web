import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";

import { homeTabDatabases } from "../../constants";
import { ButtonCreateData } from "../Commponent/CreateData";

export function Header({ oneDataBase, loadingRefresh, getData }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleGoDatosClick = () => navigate("/datum");
    const handleBackToDBClick = () => navigate(homeTabDatabases);

    return (
        <div className="flex justify-between mb-4 sm:text-2xl">
            <h1 className="flex items-start text-xl">
                <p className="font-normal text-gray-400 text-opacity-75 cursor-pointer" onClick={handleGoDatosClick}>
                    {t("dataReport.myData")}
                </p>
                <span className="px-2 font-normal text-gray-400 text-opacity-75"> {" / "} </span>
                <p
                    onClick={handleBackToDBClick}
                    className={`${
                        !isEmpty(oneDataBase) ? "cursor-pointer font-normal text-gray-400 text-opacity-75" : "font-bold text-primary-200"
                    } `}>
                    {t("dataReport.myDatabases")}
                </p>
                {!isEmpty(oneDataBase) && oneDataBase.name && (
                    <>
                        <span className="px-2 font-normal text-gray-400 text-opacity-75"> {" / "} </span>
                        <span className="font-bold text-primary-200">{oneDataBase.name}</span>
                    </>
                )}
            </h1>
            {!isEmpty(oneDataBase) && oneDataBase.name && (
                <ButtonCreateData oneDataBase={oneDataBase} loadingRefresh={loadingRefresh} getData={getData} />
            )}
        </div>
    );
}
