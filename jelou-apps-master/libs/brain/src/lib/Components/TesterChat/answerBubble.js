import Tippy from "@tippyjs/react";
import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDatasource, setSource } from "@apps/redux/store";
import { toastMessage } from "@apps/shared/common";
import { MESSAGE_TYPES, TOAST_POSITION } from "@apps/shared/constants";
import { DownIcon, RightIconLarge } from "@apps/shared/icons";
import { getTimeRelative } from "@apps/shared/utils";
import { SOURCE, TESTER_KEYS, DATASOURCE_TYPES } from "../../constants";
import { useReplaceURLWithLink } from "../../hooks/hooks";
import ModalBlock from "./modalBlock";
import { useSkill } from "../../services/brainAPI";

const Answer = (props) => {
    const { answer, sources, createdAt } = props;
    const company = useSelector((state) => state.company);

    const type = getTypeFromSources(sources);
    const isSkillOrFlow = type === DATASOURCE_TYPES.SKILL || type === DATASOURCE_TYPES.WORKFLOW;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const time = getTimeRelative(createdAt, lang);
    const procesedAiResponse = useReplaceURLWithLink(answer);
    const firstSource = sources[0]?.datasource;
    const { data: skillsData } = useSkill({ apiKey: company?.properties?.builder?.app_token, id: firstSource?.metadata?.skill_id });

    const [oneSource] = useState(firstSource?.name || null);

    const handleGoToBlock = (modal) => {
        const { datastoreId, blockId, datasource, sourceInfo } = modal;
        if (datastoreId && datasource) {
            dispatch(setDatasource(datasource));
            dispatch(setSource(sourceInfo));
            navigate(`/brain/${datastoreId}/${datasource.id}`);
        }
        if (blockId) {
            localStorage.setItem("blockId", JSON.stringify(blockId));
        }
        closeModal();
    };

    function getTypeFromSources(sources) {
        let type;

        if (sources[0]["datasource"] && sources[0]["datasource"].type) {
            type = sources[0]["datasource"].type;
        } else if (sources[0].source && sources[0].source.type) {
            type = sources[0].source.type;
        } else {
            type = "";
        }

        return type;
    }

    const [openBlockModal, setOpenBlockModal] = useState(false);

    const sourceText = `${t("common.show")} (${sources.length}) ${sources.length > 1 ? t("common.informationSources") : t("common.informationSource")}`;
    const [isOpenSources, setOpenSources] = useState(false);
    const [modalBlock, setModalBlock] = useState({});
    const showSources = () => {
        setOpenSources(!isOpenSources);
    };

    const openModal = (source) => {
        const { datastoreId, datasource, sourceInfo } = source;

        if (datastoreId && datasource && sourceInfo) {
            setOpenBlockModal(true);
            // dispatch(setSource(sourceInfo));
            setModalBlock(source);
        } else if (datastoreId && datasource && source[TESTER_KEYS.TYPE_FLOW]) {
          dispatch(setDatasource(datasource));
          const jwt = localStorage.getItem("jwt-master") ?? localStorage.getItem("jwt");
          const channelReferenceId = Object.keys(source.datasource.metadata.flows)[0]
          const url = `https://builder.jelou.ai/impersonate/${jwt}/${channelReferenceId}`;
          window.open(url, "_blank");
        } else if (type === DATASOURCE_TYPES.SKILL) {
            dispatch(setDatasource(datasource));
            navigate(`/brain/${datastoreId}/skills/${datasource.metadata.skill_id}`);
        } else {
            toastMessage({
                messagePart1: `${source[TESTER_KEYS.TYPE_FLOW] ? t("common.canNotGetFlowInformation") : t("common.canNotGetBlockInformation")}`,
                type: MESSAGE_TYPES.ERROR,
                position: TOAST_POSITION.BOTTOM_RIGHT,
            });
        }
    };

    const closeModal = () => {
        // dispatch(setSource({}));
        setOpenBlockModal(false);
    };

    const excludedKeys = [TESTER_KEYS.DATASTORE_ID, TESTER_KEYS.DATASOURCE, TESTER_KEYS.SOURCE_INFO, TESTER_KEYS.BLOCK_ID, TESTER_KEYS.TYPE_FLOW];

    return (
        <div className="flex flex-1 justify-start">
            <div className="my-3 max-w-[80%] flex-col">
                {!isSkillOrFlow && (
                    <div className="mb-3 flex flex-col whitespace-pre-line break-words rounded-lg bg-primary-350 p-4 text-sm text-gray-610 xl:text-sm">
                        {procesedAiResponse}
                        <span className="text-right text-11 text-gray-610/60">{time}</span>
                    </div>
                )}
                {!isEmpty(sources) && (
                    <div className="mb-3 break-words rounded-lg bg-teal-5 p-4 text-sm text-gray-610 xl:text-sm">
                        {!isSkillOrFlow && (
                            <button onClick={showSources} className="flex flex-row items-center justify-center text-primary-200">
                                <span className="text-13 font-bold leading-5">{sourceText}</span>
                                <DownIcon fill="currentColor" className={`${isOpenSources && "rotate-180"}`} />
                            </button>
                        )}
                        {(isOpenSources || isSkillOrFlow) && (
                            <>
                                {isSkillOrFlow ? (
                                    <div className="mb-3 w-full text-13 xl:text-sm">
                                        {`${t("brain.answerSkillFlow")}`} <span className="font-bold capitalize">{oneSource}</span>
                                    </div>
                                ) : (
                                    <div className="my-3 w-full text-13 xl:text-sm">{`${t("brain.answerSources")} ${t(SOURCE.PLURAL_LOWER)}:`}</div>
                                )}

                                <div className="flex flex-col space-y-3">
                                    {sources?.map((source, sourceIndex) => {
                                        return (
                                            <div key={`source-${sourceIndex}`} className="rounded-xl bg-white py-2 px-3">
                                                {Object.keys(source).map((key) => {
                                                    if (!excludedKeys.includes(key)) {
                                                        return (
                                                            <div key={key} className="flex flex-row justify-between text-gray-400">
                                                                <div className="text-sm font-bold capitalize xl:text-sm">{`${t(key)}:`}</div>
                                                                {key === TESTER_KEYS.SOURCE ? (
                                                                    <div className="w-[35%] text-sm capitalize xl:text-sm">{t(source[key])}</div>
                                                                ) : key === TESTER_KEYS.SCORE ? (
                                                                    <div className="w-[35%] text-sm font-light xl:text-sm">{source[key].toFixed(2)}</div>
                                                                ) : (
                                                                    <Tippy theme="light" placement="left" touch={false} content={<span className="text-gray-400">{source[key]}</span>}>
                                                                        <div className="w-[35%] truncate">{source[key]}</div>
                                                                    </Tippy>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                                {type === DATASOURCE_TYPES.SKILL && skillsData && (
                                                    <div key="skillName" className="flex flex-row justify-between text-gray-400">
                                                        <div className="text-sm font-bold capitalize xl:text-sm">{`Skill:`}</div>
                                                        <Tippy theme="light" placement="left" touch={false} content={<span className="text-gray-400">{skillsData.name}</span>}>
                                                        <div className="w-[35%] text-sm capitalize xl:text-sm truncate">{skillsData.name}</div>
                                                        </Tippy>

                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => openModal(source)}
                                                    className="mt-1 flex h-8 w-full items-center justify-center gap-x-3 rounded-xl border-1 border-primary-200 py-1 font-bold text-primary-200"
                                                >
                                                    <span>{`${
                                                        source[TESTER_KEYS.TYPE_FLOW] ? t("brain.goToBuilder") : type !== DATASOURCE_TYPES.SKILL ? t("brain.goToBlock") : t("brain.goToImagine")
                                                    }`}</span>
                                                    <RightIconLarge width={13} height={13} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                )}
                <ModalBlock openBlockModal={openBlockModal} closeModal={closeModal} modalBlock={modalBlock} handleGoToBlock={handleGoToBlock} />
            </div>
        </div>
    );
};

export default Answer;
