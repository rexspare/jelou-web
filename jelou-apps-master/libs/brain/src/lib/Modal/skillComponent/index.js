import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import get from "lodash/get";

import { QuestionCircleIcon } from "@apps/shared/icons";
import { DATASOURCE, DESCRIPTION_MAX_LENGTH, DESCRIPTION_MIN_LENGTH } from "../../constants";
import { useSkills } from "../../services/brainAPI";
import RowsSkeleton from "../../Common/rowsSkeleton";
import DescriptionComponent from "../descriptionComponent";
import Skills from "./skills";

const SkillComponent = (props) => {
    const { setDatasourceValues, datasourceValues } = props;
    const { t } = useTranslation();
    const datastore = useSelector((state) => state.datastore);
    const company = useSelector((state) => state.company);

    const {
        data: skillsData,
        isFetching: fetchingSkills,
        isLoading: loadingSkills,
        refetch: refetchSkills,
    } = useSkills({ apiKey: company?.properties?.builder?.app_token });

    const handleChangeDatasourceParams = (e) => {
        const { name, value } = e.target;
        setDatasourceValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    return (
        <div className="flex w-full flex-col">
            <div className="flex flex-row items-center space-x-2 text-sm">
                <span className="mb-1 w-auto font-bold text-gray-610">{t("brain.skillDescription")}</span>
                <Tippy
                    theme="light"
                    placement="right"
                    touch={false}
                    trigger="mouseenter"
                    content={
                        <span className="text-sm font-light text-gray-400">
                            {`${t("brain.flowDescription1")} ${DATASOURCE.PLURAL_LOWER} ${t("brain.flowDescription2")}`}
                        </span>
                    }>
                    <div>
                        <QuestionCircleIcon width="1rem" height="1rem" />
                    </div>
                </Tippy>
            </div>
            <DescriptionComponent
                showTitle={false}
                placeholder={DATASOURCE.SINGULAR_LOWER}
                itemValues={datasourceValues}
                onChange={handleChangeDatasourceParams}
                maxLength={DESCRIPTION_MAX_LENGTH}
                minLength={DESCRIPTION_MIN_LENGTH}
                length={datasourceValues?.description?.length}
            />
            <div className="mb-3 flex flex-col gap-1 text-sm">
                <div className="font-bold text-gray-610">Skills</div>
            </div>
            {loadingSkills ? (
                <div className="flex h-[20rem] flex-col gap-y-3 xl:h-[15rem]">
                    <RowsSkeleton />
                </div>
            ) : (
                <Skills
                    fetchedSkills={get(skillsData, "data", [])}
                    setDatasourceValues={setDatasourceValues}
                    datasourceValues={datasourceValues}
                    datastoreName={datastore.name}
                    loadingSkills={loadingSkills || fetchingSkills}
                    refetchSkills={refetchSkills}
                />
            )}
        </div>
    );
};

export default SkillComponent;
