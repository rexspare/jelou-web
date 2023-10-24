import { useTranslation } from "react-i18next";

const AddButton = (props) => {
    const { onClick, buttonText, isDatasource } = props;
    const { t } = useTranslation();

    return (
        <button onClick={onClick} className="button-gradient-full flex h-10 w-fit items-center justify-center gap-x-2 whitespace-nowrap px-6 py-2">
            <span className="text-3xl font-normal">+</span>
            {isDatasource ? (
                <span className="font-bold">{`${t("common.create")} ${buttonText}`}</span>
            ) : (
                <span className="font-bold">{t("common.create")}</span>
            )}
        </button>
    );
};

export default AddButton;
