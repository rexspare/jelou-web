import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import RowsSkeleton from "../../../Common/rowsSkeleton";
import { DESCRIPTION_MAX_LENGTH } from "../../../constants";
import Skill from "./skill";

const SkillDatasourceComponent = ({ setHasFlows, datastoreId, datasourceId, datasourceData, loadingDatasource, refetchDatasource }) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (!loadingDatasource) {
            const datasourceSkills = get(datasourceData, "metadata.skills", {});
            if (!isEmpty(datasourceSkills)) {
                setHasFlows(true);
            }
        }
    }, [datasourceData, loadingDatasource]);

    useEffect(() => {
        if (!isEmpty(datastoreId) && !isEmpty(datasourceId)) {
            refetchDatasource();
        }
    }, [datastoreId, datasourceId]);

    console.log({ datasourceData, loadingDatasource });

    if (loadingDatasource) {
        return (
            <>
                <div className="no-scrollbar sticky top-0 w-1/4 flex-row space-y-2 overflow-y-auto border-r-1 border-neutral-200 pr-8">
                    <div className="sticky top-0 mb-6 bg-white">
                        <RowsSkeleton />
                    </div>
                </div>
                <div className="w-3/4">
                    <RowsSkeleton />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="no-scrollbar sticky top-0 w-1/4 flex-row space-y-2 overflow-y-auto border-r-1 border-neutral-200 pr-8">
                <div className="sticky top-0 mb-6 bg-white">
                    <div className="ml-4 mb-[0.3rem] font-bold text-gray-400">{t("common.description")}</div>
                    <div className="h-auto min-h-20 w-full break-words rounded-lg border-1 border-neutral-200 px-4 py-3 text-gray-610">{datasourceData?.description}</div>
                    <div className="mb-5 flex justify-end">
                        {datasourceData?.description && <span className="text-sm font-normal text-[#B0B6C2]">{`${datasourceData?.description?.length}/${DESCRIPTION_MAX_LENGTH}`}</span>}
                    </div>
                </div>
            </div>
            <div className="w-3/4">
                <h2 className="mb-6 text-lg font-bold text-primary-200">{"Skills"}</h2>
                <div className="w-full pb-10 pr-2">
                    <Skill skillId={get(datasourceData, "metadata.skill_id", "")} datastoreId={datastoreId} datasourceId={datasourceId} datasource={datasourceData} />
                </div>
            </div>
        </>
    );
};

export default SkillDatasourceComponent;
