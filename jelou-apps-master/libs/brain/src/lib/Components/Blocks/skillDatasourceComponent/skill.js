import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { CheckCircleIconPrimary, EditButtonIcon, LoadingSpinner, RefreshIcon, SkillIcon, UpIconLarge } from "@apps/shared/icons";
import { ListBoxHeadless } from "../../../Modal/listBox";
import { COMPONENT_NAME, DATASOURCE } from "../../../constants";
import { areObjectsEqual } from "../../../hooks/helpers";
import { useSkills, useUpdateDatasource } from "../../../services/brainAPI";

const Skill = (props) => {
    const { skillId, datastoreId, datasourceId, datasource } = props;

    const { t } = useTranslation();
    const navigate = useNavigate();
    const datasourceValues = { name: datasource?.name, type: datasource?.type, metadata: datasource?.metadata };

    const [enableSelect, setEnableSelect] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState({ id: null, name: "" });
    const [options, setOptions] = useState([]);
    const [updatedDatasourceValues, setUpdatedDatasourceValues] = useState({
        name: datasource?.name,
        type: datasource?.type,
        metadata: datasource?.metadata,
    });
    const company = useSelector((state) => state.company);
    const { data: skillsData, isFetching, isLoading: loadingSkills, refetch: refetchSkills } = useSkills({ apiKey: company?.properties?.builder?.app_token });

    const { mutateAsync } = useUpdateDatasource({
        datastoreId,
        datasourceId,
        newDatasourceInfo: updatedDatasourceValues,
    });

    const handleSelect = (value) => {
        setUpdatedDatasourceValues((prevValues) => ({
            ...prevValues,
            metadata: {
                skill_id: parseInt(value?.id),
            },
        }));
        setSelectedSkill(value);
    };

    const handleGoToImagine = () => {
        navigate(`/brain/${datastoreId}/skills`);
    };

    const handleUpdateDatasource = async () => {
        setEnableSelect(!enableSelect);
        if (!areObjectsEqual(datasourceValues?.metadata, updatedDatasourceValues?.metadata)) {
            await mutateAsync(
                {},
                {
                    onSuccess: () =>
                        toastMessage({
                            messagePart1: `${t("common.itemUpdated")} ${DATASOURCE.SINGULAR_LOWER}`,
                            messagePart2: datasourceValues.name,
                            type: MESSAGE_TYPES.SUCCESS,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                    onError: () =>
                        toastMessage({
                            messagePart1: `${t("common.itemNotUpdated")} ${DATASOURCE.SINGULAR_LOWER}`,
                            messagePart2: datasourceValues.name,
                            type: MESSAGE_TYPES.ERROR,
                            position: TOAST_POSITION.TOP_RIGHT,
                        }),
                }
            );
        }
    };

    useEffect(() => {
        const skills = get(skillsData, "data", []);
        let options;
        if (!isEmpty(skills)) {
            options = skills?.map((skill) => ({
                id: skill?.id,
                name: skill?.name,
                Icon: <SkillIcon showBackground={false} color="#727C94" />,
            }));
            const selectedSkill = skills.find((skill) => skill?.id === parseInt(skillId));

            if (isEmpty(selectedSkill)) {
                setSelectedSkill({ id: null, name: `${t("common.datasourceWithoutSkills")}`, Icon: <SkillIcon showBackground={false} color="#727C94" /> });
            } else {
                setSelectedSkill({ id: selectedSkill.id, name: selectedSkill.name, Icon: <SkillIcon showBackground={false} color="{color}" /> });
            }
        } else {
            options = [{ id: null, name: `${t("common.datasourceWithoutSkills")}`, Icon: <SkillIcon showBackground={false} color="#727C94" /> }];
        }
        setOptions(options);
    }, [skillsData]);

    return (
        <div className="flex flex-col justify-start">
            <div className="flex items-center justify-between space-x-6 text-sm text-gray-400">
                {loadingSkills || isFetching ? (
                    <div className="my-6 flex h-14 w-full items-center justify-center rounded-xs border-1 border-neutral-200 py-2 px-4">
                        <LoadingSpinner />
                    </div>
                ) : enableSelect ? (
                    <div className="my-6 flex h-14 w-full items-center justify-between gap-4 pr-4">
                        <ListBoxHeadless value={selectedSkill} setValue={handleSelect} list={options} name={COMPONENT_NAME.METADATA} className="h-full" />
                        <button onClick={handleUpdateDatasource}>
                            <CheckCircleIconPrimary
                                className="rounded-full border-1 border-primary-200 hover:opacity-80"
                                width="2.5rem"
                                height="2.5rem"
                                fill="none"
                                stroke="#00B3C7"
                                fillCircle={"#fff"}
                            />
                        </button>
                    </div>
                ) : (
                    <div className="my-6 flex h-14 w-full items-center justify-between rounded-xs border-1 border-neutral-200 py-2 px-4">
                        <div className="flex items-center justify-start">
                            <SkillIcon showBackground={false} color="#727C94" />
                            <span>{selectedSkill.name}</span>
                        </div>
                        <button onClick={() => setEnableSelect(!enableSelect)}>
                            <EditButtonIcon width="2.5rem" height="2.5rem" className="opacity-80" />
                        </button>
                    </div>
                )}
                <button
                    disabled={loadingSkills}
                    onClick={refetchSkills}
                    className="flex h-9 items-center space-x-2 whitespace-nowrap rounded-20 border-transparent bg-gray-35 px-3 text-base font-bold text-gray-425 outline-none mid:px-5"
                >
                    <RefreshIcon width="1rem" height="1rem" stroke={"inherit"} className={`${loadingSkills ? "animate-spinother" : ""}`} />
                </button>
            </div>
            <button
                className="my-px flex w-fit items-center justify-start rounded-xl border-1 border-primary-200 bg-transparent px-5 py-2 text-primary-200 focus:outline-none"
                onClick={handleGoToImagine}
            >
                <span className="font-bold">{t("common.imagineSkills")}</span>
                <UpIconLarge width="0.7rem" height="0.7rem" className="ml-4 rotate-90" />
            </button>
        </div>
    );
};

export default Skill;
