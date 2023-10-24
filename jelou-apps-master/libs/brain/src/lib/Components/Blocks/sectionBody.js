import { DATASOURCE_TYPES } from "../../constants";
import { useOneDatasource } from "../../services/brainAPI";
import GenericDatasourceComponent from "./genericDatasourceComponent";
import FlowDatasourceComponent from "./flowDatasourceComponent";
import SkillDatasourceComponent from "./skillDatasourceComponent";

const SectionBody = (props) => {
    const {
        datasource = {},
        datastoreId,
        sourceId,
        fetchBlocks,
        setHasBlocks,
        setHasFlows,
        isFlowOrSkill,
    } = props;

    const {
        data: datasourceData,
        isFetching: loadingDatasource,
        refetch: refetchDatasource,
    } = useOneDatasource();

    return (
        <div className="flex flex-grow gap-x-16 overflow-x-auto px-6 pt-0 pb-6">
            {isFlowOrSkill ? (
                <>
                    {datasource?.type === DATASOURCE_TYPES.WORKFLOW &&
                        <FlowDatasourceComponent
                            setHasFlows={setHasFlows}
                            datastoreId={datastoreId}
                            datasourceId={datasource?.id}
                            datasourceData={datasourceData}
                            loadingDatasource={loadingDatasource}
                            refetchDatasource={refetchDatasource}
                        />
                    }
                    {datasource?.type === DATASOURCE_TYPES.SKILL &&
                        <SkillDatasourceComponent
                            setHasFlows={setHasFlows}
                            datastoreId={datastoreId}
                            datasourceId={datasource?.id}
                            datasourceData={datasourceData}
                            loadingDatasource={loadingDatasource}
                            refetchDatasource={refetchDatasource}
                        />
                    }
                </>
            ) : (
                <GenericDatasourceComponent
                    sourceId={sourceId}
                    datasource={datasource}
                    fetchBlocks={fetchBlocks}
                    setHasBlocks={setHasBlocks}
                    setHasFlows={setHasFlows}
                />
            )}
        </div>
    );
};

export default SectionBody;
