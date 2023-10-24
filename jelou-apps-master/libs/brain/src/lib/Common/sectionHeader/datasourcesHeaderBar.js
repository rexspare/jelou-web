import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";

import { TRUNCATION_CHARACTER_LIMITS } from "../../constants";
import ConditionalTruncateTippy from "../conditionalTruncateTippy";

const DatasourcesHeaderBar = ({ header, secondaryHeader, actionClick }) => {
    const { t } = useTranslation();

    return (
        <>
            <span className={`${isEmpty(secondaryHeader) ? " font-bold" : ""}`}>/</span>
            <ConditionalTruncateTippy
                actionClick={secondaryHeader ? actionClick : null}
                text={header}
                charactersLimit={TRUNCATION_CHARACTER_LIMITS.HEADER}
                textStyle={`${isEmpty(secondaryHeader) ? " font-bold text-primary-200" : ""}`}
            />
            {secondaryHeader && (
                <>
                    <span className="font-bold">/</span>
                    <ConditionalTruncateTippy text={secondaryHeader} charactersLimit={TRUNCATION_CHARACTER_LIMITS.HEADER} textStyle={"font-bold text-primary-200"} />
                    <span className="font-bold">/</span>
                    <span className="font-bold text-primary-200">{t("brain.Configuracion de canal")}</span>
                </>
            )}
        </>
    );
};

export default DatasourcesHeaderBar;
