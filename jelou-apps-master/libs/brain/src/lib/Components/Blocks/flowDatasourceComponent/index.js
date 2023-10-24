import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import RowsSkeleton from "../../../Common/rowsSkeleton";
import { DESCRIPTION_MAX_LENGTH } from "../../../constants";
import { useChannels } from "../../../services/brainAPI";
import Flow from "./flow";

const FlowDatasourceComponent = (props) => {
    const { setHasFlows, datastoreId, datasourceId, datasourceData, loadingDatasource, refetchDatasource } = props;
    const { t } = useTranslation();
    const [flowsPerDatasource, setFlowsPerDatasource] = useState({});
    const [flowsInfoTorender, setFlowsInfoToRender] = useState([]);

    const {
        data: channelsData,
        isFetching: loadingChannels,
        refetch: refetchChannels,
    } = useChannels({
        datastoreId,
    });

    useEffect(() => {
        if (!loadingChannels) {
            const channelsPerDatastore = get(channelsData, "data", []);
            if (!isEmpty(channelsPerDatastore)) {
                const channelsPerDatasource = channelsPerDatastore.filter((channel) => Object.prototype.hasOwnProperty.call(flowsPerDatasource, channel?.reference_id));
                const flowsToRender = channelsPerDatasource.map((channel) => {
                    const channelReferenceId = get(channel, "reference_id", "");
                    return {
                        flowId: flowsPerDatasource[channelReferenceId],
                        channelReferenceId: channelReferenceId,
                        channelType: get(channel, "type", ""),
                        channelName: get(channel, "name", ""),
                    };
                });
                setFlowsInfoToRender(flowsToRender);
            }
        }
    }, [channelsData, loadingChannels, flowsPerDatasource]);

    useEffect(() => {
        if (!loadingDatasource) {
            const datasourceFlows = get(datasourceData, "metadata.flows", {});
            if (!isEmpty(datasourceFlows)) {
                setHasFlows(true);
                setFlowsPerDatasource(datasourceFlows);
            }
        }
    }, [datasourceData, loadingDatasource]);

    useEffect(() => {
        if (!isEmpty(datastoreId) && !isEmpty(datasourceId)) {
            refetchChannels();
            refetchDatasource();
        }
    }, [datastoreId, datasourceId]);

    if (loadingChannels || loadingDatasource) {
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
                <h2 className="mb-6 text-lg font-bold text-primary-200">{t("common.flows")}</h2>
                <div className={`${flowsInfoTorender.length <= 1 ? "" : "grid grid-cols-2 gap-16"} w-full pb-10 pr-20`}>
                    {flowsInfoTorender.map((flow, idx) => {
                        return (
                            <Flow
                                key={`flow-${idx}`}
                                defaultFlowId={flow?.flowId}
                                channelReferenceId={flow?.channelReferenceId}
                                channelType={flow?.channelType}
                                channelName={flow?.channelName}
                                flowsQuantity={flowsInfoTorender.length}
                                datastoreId={datastoreId}
                                datasourceId={datasourceId}
                                datasource={datasourceData}
                                refetchDatasource={refetchDatasource}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default FlowDatasourceComponent;
