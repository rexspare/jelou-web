import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { setDatasource, setDatastore, setShowTesterChat, setSource } from "@apps/redux/store";
import SectionHeader from "../../Common/sectionHeader";
import SectionTitle from "../../Common/sectionTitle/index";
import { DATASOURCE_TYPES, DATASTORE, ITEM_TYPES } from "../../constants";
import { useOneDatastore } from "../../module/Brains/Infrastructure/queryBrains";
import { useOneDatasource, useSources } from "../../services/brainAPI";
import TesterChat from "../TesterChat";
import TesterChatButton from "../TesterChat/button";
import TesterPreviewMessage from "../TesterChat/previewMessage";
import SectionBody from "./sectionBody";

const Blocks = () => {
    const dispatch = useDispatch();
    const { datasourceId } = useParams();
    const _source = JSON.parse(localStorage.getItem(ITEM_TYPES.SOURCE));
    const datastore = useSelector((state) => state.datastore);
    const datasource = useSelector((state) => state.datasource);
    const source = useSelector((state) => state.source) ?? _source;
    const showTesterChat = useSelector((state) => state.showTesterChat);
    const [isFlowOrSkill, setIsFlowOrSkill] = useState(false);
    const [fetchBlocks, setFetchBlocks] = useState(false);
    const [hasBlocks, setHasBlocks] = useState(false);
    const [hasFlows, setHasFlows] = useState(false);
    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState("");

    const { data: datastoreInfo } = useOneDatastore();
    const { data: datasourceInfo } = useOneDatasource();
    const { data: sources, isLoading } = useSources({
        datasourceId,
        fetchSources: datasource?.type !== DATASOURCE_TYPES.FLOW && datasource?.type !== DATASOURCE_TYPES.SKILL && !isEmpty(datasource),
    });

    const handleOpenTesterChat = () => dispatch(setShowTesterChat(true));
    const handleCloseTesterChat = useCallback(() => dispatch(setShowTesterChat(false)), []);

    useEffect(() => {
        if (!isEmpty(datastore)) {
            localStorage.setItem(DATASTORE.SINGULAR_LOWER, JSON.stringify(datastore));
        } else {
            if (!isEmpty(datastoreInfo)) {
                localStorage.setItem(DATASTORE.SINGULAR_LOWER, JSON.stringify(datastoreInfo));
                dispatch(setDatastore(datastoreInfo));
            }
        }
    }, [datastore, datastoreInfo]);

    useEffect(() => {
        if (isEmpty(datastore)) {
            const storagedDatastore = localStorage.getItem(ITEM_TYPES.DATASTORE);
            const parsedDatastore = JSON.parse(storagedDatastore);
            dispatch(setDatastore(parsedDatastore));
        }
        if (isEmpty(datasource)) {
            const storagedDatasource = localStorage.getItem(ITEM_TYPES.DATASOURCE);
            const parsedDatasource = JSON.parse(storagedDatasource);
            dispatch(setDatasource(parsedDatasource));
        }
        if (datasource?.type !== ITEM_TYPES.FLOW || datasource?.type !== ITEM_TYPES.SKILL) {
            if (isEmpty(source)) {
                const storagedSource = localStorage.getItem(ITEM_TYPES.SOURCE);
                const parsedSource = JSON.parse(storagedSource);
                dispatch(setSource(parsedSource));
            } else {
                setFetchBlocks(true);
            }
        }
    }, [source]);

    useEffect(() => {
        if (datasource?.type === DATASOURCE_TYPES.WORKFLOW || datasource?.type === DATASOURCE_TYPES.SKILL) {
            setTitle(get(datasource, "name", "") || get(datasourceInfo, "name", ""));
            setIsFlowOrSkill(true);
        } else {
            setTitle(get(source, "name", ""));
            setIsFlowOrSkill(false);
        }
    }, [datasource, source]);

    useEffect(() => {
        if (!isEmpty(sources)) {
            const {
                data: [source],
            } = sources;
            dispatch(setSource(source));
        }
    }, [sources]);

    return (
        <div className="bg-app-body static flex max-h-screen min-h-screen w-full flex-col px-5 pb-5 mid:px-10 lg:px-12">
            <SectionHeader
                displayBlocks={true}
                header={get(datastore, "name", "") || get(datastoreInfo, "name", "")}
                datastoreId={get(datastore, "id", "") || get(datastoreInfo, "id", "")}
                secondaryHeader={get(datasource, "name", "") || get(datasourceInfo, "name", "")}
                tertiaryHeader={!isFlowOrSkill && get(source, "name", "")}
                hasFlows={hasFlows}
                isSkill={datasource?.type === DATASOURCE_TYPES.SKILL}
            />
            <section className="main-content flex w-full flex-grow flex-col rounded-1 bg-white shadow-sm">
                <SectionTitle
                    displayBlocks={true}
                    title={title}
                    datasourceStatus={get(datasourceInfo, "sync_status", "")}
                    datastore={datastoreInfo}
                    hasBlocks={hasBlocks}
                    hasFlows={hasFlows}
                    isSkill={datasource?.type === DATASOURCE_TYPES.SKILL}
                    totalSources={get(sources, "meta.total", 0)}
                    isLoading={isLoading}
                />
                <SectionBody
                    datastoreId={get(datastore, "id", "") || get(datastoreInfo, "id", "")}
                    datasource={datasource || datasourceInfo}
                    sourceId={get(source, "id", "")}
                    fetchBlocks={fetchBlocks}
                    setHasBlocks={setHasBlocks}
                    setHasFlows={setHasFlows}
                    isFlowOrSkill={isFlowOrSkill}
                />
            </section>
            <TesterChatButton openTesterChat={handleOpenTesterChat} isChatActive={hasBlocks || hasFlows} closeTesterChat={handleCloseTesterChat} messages={messages} />
            <TesterPreviewMessage messages={messages} showTesterChat={showTesterChat} handleOpenTesterChat={handleOpenTesterChat} />
            <TesterChat isOpen={showTesterChat} onClose={handleCloseTesterChat} messages={messages} setMessages={setMessages} />
        </div>
    );
};

export default Blocks;
