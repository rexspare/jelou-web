import { useEffect } from "react";
import get from "lodash/get";
import { useTranslation } from "react-i18next";

import { DATASOURCE_TYPES } from "../constants";

const WebComponent = ({ setDatasourceValues, datasourceValues }) => {
    const { t } = useTranslation();

    const urlValue = get(datasourceValues, "metadata.url", "");

    const handleInputChange = (e) => {
        e.preventDefault();
        setDatasourceValues((prevValues) => ({
            ...prevValues,
            metadata: {
                url: e.target.value,
            },
        }));
    };

    useEffect (() => {
        if (datasourceValues?.metadata)
        delete datasourceValues.metadata;
    }, []);

    return (
        <>
            <div className="mb-[0.3rem] font-bold text-gray-610">{t("common.url")}</div>
            <input
                className="h-11 w-full rounded-lg border-1 border-neutral-200 px-4 py-3 font-medium text-gray-610 placeholder:text-sm focus-visible:outline-none"
                name={DATASOURCE_TYPES.WEBPAGE}
                onChange={handleInputChange}
                value={urlValue}
            />
        </>
    );
};

export default WebComponent;
