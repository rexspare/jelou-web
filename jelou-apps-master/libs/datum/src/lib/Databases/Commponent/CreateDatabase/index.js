import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ColumnsConfig from "./columnsConfig";
import PrincipalData from "./principalData";

export function CreateDatabase() {
    const { t } = useTranslation();
    const [isShowFirstStep, setShowFirstStep] = useState(false);
    const [isShowSecondStep, setShowSecondStep] = useState(false);

    const [nameDatabase, setNameDatabase] = useState("");
    const [descriptionDatabase, setDescriptionDatabase] = useState("");

    const permissions = useSelector((state) => state.permissions);
    const databasePermission = permissions.find((permission) => permission === "datum:create_database");

    const handleSaveNameDatabase = ({ nameDatabase, descriptionDatabase }) => {
        setNameDatabase(nameDatabase);
        setDescriptionDatabase(descriptionDatabase);

        setShowFirstStep(false);
        setShowSecondStep(true);
    };

    return (
        <>
            {databasePermission && (
                <div className="flex items-center space-x-3">
                    <button onClick={() => setShowFirstStep(true)} className="button-gradient h-9 whitespace-nowrap !p-0">
                        <span className="pr-2">+</span>
                        {t("bots.createBot")}
                    </button>
                </div>
            )}
            {isShowFirstStep && (
                <PrincipalData closeModal={() => setShowFirstStep(false)} hanldeSaveData={handleSaveNameDatabase} isShow={isShowFirstStep} />
            )}
            {isShowSecondStep && (
                <ColumnsConfig
                    closeModal={() => setShowSecondStep(false)}
                    isShow={isShowSecondStep}
                    nameDatabase={nameDatabase}
                    descriptionDatabase={descriptionDatabase}
                />
            )}
        </>
    );
}