import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";

import AddButton from "./addButton";
import DataNotFound from "../assets/Data_Not_Found.png";

const EmptyData = (props) => {
    const {
        item,
        itemName,
        onClick,
        isDatasource,
        buttonText,
        imageWidth = 325,
        imageHeight = 359,
        textClassName,
        showButton = true,
        message,
    } = props;
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const isLangEnglish = lang === "en" ? true : false;

    return (
        <section className="flex flex-col items-center justify-center">
            <img
                src={DataNotFound}
                alt="Data not found"
                style={{ width: `${imageWidth}`, height: `${imageHeight}` }}
            />
            <div className={`${textClassName ?? "mt-10 mb-5 text-gray-600" }`}>
                {isEmpty(message) ? (
                    <>
                        <span>{`${t("common.dontHaveYet")} ${item}`}</span>
                        {!isEmpty(itemName) && (
                            <>
                                <span>{` ${t("common.in")} `}</span>
                                <span className="font-bold">{itemName}</span>
                            </>
                        )}
                        {isLangEnglish && <span>{" yet"}</span>}
                    </>
                ) : (
                    <span>{message}</span>
                )}
            </div>
            {showButton &&
                <AddButton
                    onClick={onClick}
                    buttonText={isDatasource ? buttonText : ""}
                    isDatasource={isDatasource}
                />
            }
        </section>
    );
};

export default EmptyData;
