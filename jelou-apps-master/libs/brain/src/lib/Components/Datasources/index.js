import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { setDatastore, setShowTesterChat } from "@apps/redux/store";
import SectionHeader from "../../Common/sectionHeader";
import { CHANNEL_TYPES, DATASTORE } from "../../constants";
import { useOneDatastore } from "../../module/Brains/Infrastructure/queryBrains";
import { useChannels } from "../../services/brainAPI";
import TesterChat from "../TesterChat";
import TesterChatButton from "../TesterChat/button";
import TesterPreviewMessage from "../TesterChat/previewMessage";
import Channels from "./Channels";
import Datasources from "./Datasources";
// import Agents from "./Agents";

const DatasourcesView = () => {
    const dispatch = useDispatch();
    const { datastoreId, channelId } = useParams();
    const datastore = useSelector((state) => state.datastore);
    const showTesterChat = useSelector((state) => state.showTesterChat);
    const navigate = useNavigate();

    // const [fetchDatastore, setFetchDatastore] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [messages, setMessages] = useState([]);
    // TODO: Remove this state and make it well 👀
    const [showChannels, setShowChannels] = useState(() => window.location.pathname.endsWith("channels"));
    const [showEditConfigurationChannel, setShowEditConfigurationChannel] = useState(false);
    const [channelSelected, setChannelSelected] = useState({});
    const [hasDatasources, setHasDatasources] = useState(false);
    const [showCreateChannels, setShowCreateChannels] = useState(false);

    const { data: datastoreInfo } = useOneDatastore();

    const {
        isLoading: isLoadingChannels,
        isFetching: isFetchingChannels,
        data: channelsData,
        refetch: refetchChannels,
    } = useChannels({
        datastoreId: datastoreId,
        limit: itemsPerPage,
        page: pageNumber,
    });

    const handleAddChannel = () => setShowCreateChannels(true);
    const closeAddChannelModal = useCallback(() => {
        setShowCreateChannels(false);
        refetchChannels();
    }, []);

    const handleOpenTesterChat = () => dispatch(setShowTesterChat(true));
    const handleCloseTesterChat = useCallback(() => dispatch(setShowTesterChat(false)), []);

    useEffect(() => {
        if (!isEmpty(channelId)) {
            setShowChannels(true);
            setShowEditConfigurationChannel(true);
        } else {
            setChannelSelected({});
            setShowEditConfigurationChannel(false);
        }
    }, [channelId]);

    useEffect(() => {
        if (!isEmpty(datastore)) {
            localStorage.setItem(DATASTORE.SINGULAR_LOWER, JSON.stringify(datastore));
            refetchChannels();
        } else {
            // setFetchDatastore(true);
            if (!isEmpty(datastoreInfo)) {
                localStorage.setItem(DATASTORE.SINGULAR_LOWER, JSON.stringify(datastoreInfo));
                dispatch(setDatastore(datastoreInfo));
            }
        }
    }, [datastore, datastoreInfo]);

    return (
        <div className="bg-app-body static flex max-h-screen min-h-screen w-full flex-col px-5 py-4 mid:px-10 lg:px-12">
            <SectionHeader
                displayDatasources={true}
                header={get(datastore, "name", "") || get(datastoreInfo, "name", "")}
                secondaryHeader={showEditConfigurationChannel ? get(channelSelected, "name", "") : ""}
                datastoreId={datastoreId}
            />

            <section className="relative flex w-full flex-1 flex-col overflow-hidden rounded-1 bg-white shadow-sm">
                {!showChannels && (
                    <Datasources
                        datastoreId={datastoreId}
                        datastore={datastore || datastoreInfo}
                        setHasDatasources={setHasDatasources}
                        setShowChannels={setShowChannels}
                        handleAddChannel={handleAddChannel}
                        closeAddChannelModal={closeAddChannelModal}
                        showCreateChannels={showCreateChannels}
                    />
                )}
                {showChannels && (
                    <Channels
                        datastoreId={datastoreId}
                        datastore={datastore || datastoreInfo}
                        channelsData={channelsData}
                        isLoadingChannels={isLoadingChannels || isFetchingChannels}
                        refetchChannels={refetchChannels}
                        channelId={channelId}
                        showChannels={showChannels}
                        setShowChannels={setShowChannels}
                        showEditConfigurationChannel={showEditConfigurationChannel}
                        channelSelected={channelSelected}
                        setChannelSelected={setChannelSelected}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                        showCreateChannels={showCreateChannels}
                        handleAddChannel={handleAddChannel}
                        closeAddChannelModal={closeAddChannelModal}
                    />
                )}
            </section>
            {!(channelSelected?.type === CHANNEL_TYPES.WEB) &&
              <>
                <TesterChatButton openTesterChat={handleOpenTesterChat} isChatActive={hasDatasources} closeTesterChat={handleCloseTesterChat} messages={messages} />
                <TesterPreviewMessage messages={messages} showTesterChat={showTesterChat} handleOpenTesterChat={handleOpenTesterChat} />
                <TesterChat isOpen={showTesterChat} onClose={handleCloseTesterChat} messages={messages} setMessages={setMessages} />
              </>}
        </div>
    );
};

export default DatasourcesView;
