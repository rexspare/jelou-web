import { withTranslation } from "react-i18next";

const Filters = (props) => {
    const { openTagModal, t } = props;

    return (
        <header className="flex flex-col w-full">
            <div className={`flex w-full sm:items-end`}>
                <div className={`w-full flex sm:items-center flex-col sm:flex-row justify-end`}>
                    <div className="flex justify-end">
                        <button className="button-primary w-44" onClick={() => openTagModal()}>
                            {t("Crear etiqueta")}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default withTranslation()(Filters);
