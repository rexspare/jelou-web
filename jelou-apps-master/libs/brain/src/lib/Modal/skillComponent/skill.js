import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { LoadingSpinner, RefreshIcon } from "@apps/shared/icons";
import SelectComponent from "../selectComponent";

const Skill = (props) => {
    const { setDatasourceValues, datasourceValues, loadingSkills, fetchedSkills, refetchSkills } = props;
    const { t } = useTranslation();
    const [options, setOptions] = useState([]);

    const handleSelect = (value) => {
        setDatasourceValues((prevValues) => ({
            ...prevValues,
            metadata: {
                skill_id: value
            },
        }));
    };

    useEffect(() => {
        if (!loadingSkills) {
            let options;
            if (!isEmpty(fetchedSkills)) {
                options = [
                    { value: "", label: t("common.skillSelect") },
                    ...fetchedSkills?.map((skill) => ({
                        value: skill?.id,
                        label: skill?.name,
                    })),
                ];
            } else {
                options = [{ value: "", label: t("common.datasourceWithoutSkills") }];
            }
            setOptions(options);
        }
    }, [fetchedSkills, loadingSkills]);

    return (
        <div className="flex flex-col py-2">
            <div className={`${loadingSkills ? "justify-center" : "justify-between"} flex items-center space-x-6`}>
                {loadingSkills ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <SelectComponent
                            value={get(datasourceValues, `metadata?.skill_id`, "")}
                            onChange={handleSelect}
                            options={options}
                            name={"skill"}
                        />
                        <button
                            disabled={loadingSkills}
                            onClick={refetchSkills}
                            className="flex h-9 items-center space-x-2 whitespace-nowrap rounded-20 border-transparent bg-gray-35 px-3 text-base font-bold text-gray-425 outline-none mid:px-5">
                            <RefreshIcon width="1rem" height="1rem" stroke={"inherit"} className={`${loadingSkills ? "animate-spinother" : ""}`} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Skill;
