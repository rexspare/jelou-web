import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";
import capitalize from "lodash/capitalize";

import { UpIconLarge, RefreshIcon, LoadingSpinner } from "@apps/shared/icons";
import { CHANNEL_ICONS, CHANNEL_TYPES } from "../../constants";
import { useFlowsPerChannel } from "../../services/brainAPI";
import SelectComponent from "../selectComponent";

const Channel = (props) => {
    const { channel, index, handleSelectFromWidget, setDatasourceValues, datasourceValues } = props;
    const { t } = useTranslation();
    const [fetchFlows, setFetchFlows] = useState(false);
    const [options, setOptions] = useState([]);
    const jwt = localStorage.getItem("jwt-master") ?? localStorage.getItem("jwt");

    const {
        data: flowsData,
        isLoading: loadingFlows,
        refetch,
    } = useFlowsPerChannel({
        referenceId: channel?.reference_id,
        fetchData: fetchFlows,
    });

    const handleSelect = (value) => {
        if(handleSelectFromWidget) handleSelectFromWidget(value);

        setDatasourceValues((prevValues) => ({
            ...prevValues,
            metadata: {
                ...prevValues.metadata,
                flows: {
                    ...prevValues.metadata?.flows,
                    [channel.reference_id]: parseInt(value),
                },
            },
        }));
    };

    useEffect(() => {
        if (!loadingFlows) {
            const flows = get(flowsData, "data", []);
            let options;
            if (!isEmpty(flows)) {
                setFetchFlows(false);
                options = [
                    { value: "", label: t("common.flowSelect") },
                    ...flows.map((flow) => ({
                        value: flow.id,
                        label: flow.title,
                    })),
                ];
            } else {
                options = [{ value: "", label: t("common.channelWithoutFlows") }];
            }
            setOptions(options);
        }
    }, [fetchFlows,loadingFlows]);

    useEffect(() => {
        if (!isEmpty(channel)) {
            setFetchFlows(true);
        }
    }, [channel]);

    return (
        <div key={index} className="flex flex-col">
            <div className="mb-2 flex w-full justify-between">
                <div className="flex flex-col ">
                    <span className="flex flex-row items-center gap-2 text-sm font-bold text-gray-400">
                        {CHANNEL_ICONS[toUpper(channel?.type)]} {channel?.name}
                    </span>
                    <span className="font-base text-sm text-gray-400">
                        {channel?.type === CHANNEL_TYPES.WHATSAPP
                            ? capitalize(t("common.whatsappChannel"))
                            : channel?.type === CHANNEL_TYPES.FACEBOOK
                            ? t("common.facebookChannel")
                            : channel?.type === CHANNEL_TYPES.INSTAGRAM
                            ? t("common.instagramChannel")
                            : channel?.type === CHANNEL_TYPES.WEB
                            ? t("common.webChannel")
                            : channel?.type}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between space-x-6">
                {loadingFlows ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <SelectComponent
                            value={options.find(op => op.value === datasourceValues?.metadata?.flows[channel?.reference_id])?.value}
                            onChange={handleSelect}
                            options={options}
                            name={channel?.id}
                        />
                        <button
                            disabled={loadingFlows}
                            onClick={() => {
                                refetch();
                            }}
                            className="flex h-9 items-center space-x-2 whitespace-nowrap rounded-20 border-transparent bg-gray-35 px-3 text-base font-bold text-gray-425 outline-none mid:px-5">
                            <RefreshIcon width="1rem" height="1rem" stroke={"inherit"} className={`${loadingFlows ? "animate-spinother" : ""}`} />
                        </button>
                    </>
                )}
            </div>
            <a
                href={`https://builder.jelou.ai/impersonate/${jwt}/${channel?.reference_id}`}
                target="_blank"
                rel="noreferrer"
                className=" my-px flex w-full cursor-pointer items-center justify-start border-none bg-transparent">
                <span className="text-sm font-bold text-primary-200">{t("common.builderFlows")}</span>
                <UpIconLarge width="0.7rem" height="0.7rem" className="ml-4 rotate-90 text-primary-200" />
            </a>
        </div>
    );
};

export default Channel;
