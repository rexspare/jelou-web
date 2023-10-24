import { useTranslation } from "react-i18next";
import { OpenFile } from "@apps/shared/icons";
import { DATASOURCE, SOURCE } from "../../constants";


const NoSourcesToShow = (props) => {
    const { datasourceName } = props;
    const { t } = useTranslation();

    return (
        <div className="flex-row space-y-6 items-center justify-center">
            <OpenFile />
            <div className="text-center">
                <span>{`${t("common.the")} ${DATASOURCE.SINGULAR_LOWER} `}</span>
                <span className="font-bold">{`"${datasourceName}" `}</span>
                <span>{`${t("brain.doesNotHave")} ${t(SOURCE.PLURAL_LOWER)}.`}</span>
            </div>
        </div>
    );
};

export default NoSourcesToShow;