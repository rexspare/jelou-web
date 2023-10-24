import toUpper from "lodash/toUpper";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowIcon, IncognitoIcon } from "@apps/shared/icons";

const renderStatus = (active) => {
    switch (toUpper(active)) {
        case "ONLINE":
            return "bg-green-960";
        case "OFFLINE":
            return "bg-red-1010";
        case "BUSY":
            return "bg-yellow-1010";
        default:
            return "bg-red-1010";
    }
};

const Header = (props) => {
    const { t } = useTranslation();
    const { operator, openImpersonate, loadingImpersonate } = props;
    const { id, names, email, active } = operator;
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex w-full justify-between border-b-default border-gray-100/25 py-5">
            <div className="flex space-x-2">
                <button className="mt-1 flex items-start" onClick={goBack}>
                    <ArrowIcon className="fill-current text-primary-200" width="1.563rem" height="1.563rem" />
                </button>
                <span className="flex flex-col">
                    <span className="flex items-center space-x-4 text-xl font-bold text-primary-200">
                        <span>{names}</span>
                        <div className={`heart ${renderStatus(active)} mr-1 flex h-3 w-3 items-center justify-center rounded-full`}></div>
                    </span>
                    <span className="text-15 text-gray-375/70">{email}</span>
                </span>
            </div>
            <button className="mx-2 my-1 flex items-center space-x-3 rounded-full bg-primary-200 px-3 text-white" onClick={(e) => openImpersonate(e)}>
                {Number(loadingImpersonate) === id ? (
                    <>
                        <ClipLoader color={"white"} size={"1.25rem"} />
                        <span>{t("monitoring.Impersonando")}</span>
                    </>
                ) : (
                    <>
                        <IncognitoIcon className="-ml-0.25" width="1.187rem" height="1.25rem" fill="currentColor" />
                        <span>{t("monitoring.Impersonar")}</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default Header;
