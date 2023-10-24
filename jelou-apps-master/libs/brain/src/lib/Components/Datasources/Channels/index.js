import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";

import { useSearchData } from "@apps/shared/hooks";
import { CHANNELS_TABLE_HEADERS } from "../../../constants";
import { useChannel } from "../../../services/brainAPI";
import CardsView from "../../../Common/sectionCardsView/cardsView";
import SectionFooter from "../../../Common/sectionFooter";
import SectionTitle from "../../../Common/sectionTitle/index";
import DeleteChannnel from "./deleteChannel";
import EditChannel from "./editChannel";
import QRSetting from "./qrSetting";

const Channels = (props) => {
    const {
        datastoreId,
        datastore,
        channelsData,
        isLoadingChannels,
        refetchChannels,
        channelId,
        showChannels,
        setShowChannels,
        showEditConfigurationChannel,
        channelSelected,
        setChannelSelected,
        itemsPerPage,
        setItemsPerPage,
        pageNumber,
        setPageNumber,
        showCreateChannels,
        handleAddChannel,
        closeAddChannelModal,
    } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [initialChannelCount, setInitialChannelCount] = useState(0);
    const [totalChannelCount, setTotalChannelCount] = useState(0);
    const [isDeletedLastChannel, setIsDeletedLastChannel] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [showQrSettings, setShowQrSettings] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [initialChannelSelected, setInitialChannelSelected] = useState({});

    const { data: channel, refetch: refetchChannel, isLoading: isLoadingChannel } = useChannel({ datastoreId, channelId });

    const { data: channels = [], meta = {} } = channelsData || {};

    const {
        handleSearch: handleSearchChannels,
        searchData: searchChannels,
        // sortBySearch: sortChannelsBySearch,
        resetData: resetChannelsData,
    } = useSearchData({
        dataForSearch: channels,
        keysForSearch: CHANNELS_TABLE_HEADERS.map((header) => header.key),
    });

    const deleteChannelModal = (channel) => {
        setShowDeleteModal(true);
        setChannelSelected(channel);
    };
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const editChannelModal = async (channel) => {
        navigate(`${channel?.id}/edit`);
    };

    const moreOptionsItems = [
        { text: t("common.channelSettings"), onClick: (channel) => editChannelModal(channel) },
        { text: t("common.deleteChannel"), color: "red", onClick: (channel) => deleteChannelModal(channel) },
    ];

    useEffect(() => {
        if (!isEmpty(channel)) {
            setChannelSelected(channel);
            setInitialChannelSelected(Object.freeze(cloneDeep(channel)));
        }
    }, [channel]);

    useEffect(() => {
        const metaTotal = get(meta, "total", 0);
        if (metaTotal > 0) {
            setTotalChannelCount(metaTotal);
            const lastPageValue = get(meta, "last_page", 1);
            setLastPage(lastPageValue);
        }

        if (initialChannelCount === 0 || metaTotal > initialChannelCount) {
            setInitialChannelCount(metaTotal);
        }

        if (channels?.length === 0 && metaTotal < initialChannelCount) {
            setIsDeletedLastChannel(true);
        } else {
            setIsDeletedLastChannel(false);
        }

        if (lastPage > 0 && isDeletedLastChannel) {
            setPageNumber(lastPage);
        }

        if (!isEmpty(datastore)) {
            refetchChannels();
        }
    }, [meta, initialChannelCount, lastPage, isDeletedLastChannel, channels, datastore, channel]);

    useEffect(() => {
        if (!isLoadingChannels) {
            setTotalChannelCount(get(meta, "total", ""));
        }
    }, [isLoadingChannels, channels]);

    return (
        <>
            {!showEditConfigurationChannel ? (
                <>
                    <SectionTitle
                        datastoreId={datastoreId}
                        displayDatasources={true}
                        title={get(datastore, "name", "")}
                        handleSearch={handleSearchChannels}
                        resetData={resetChannelsData}
                        handleAddChannel={handleAddChannel}
                        closeAddChannelModal={closeAddChannelModal}
                        showChannels={showChannels}
                        setShowChannels={setShowChannels}
                        showCreateChannels={showCreateChannels}
                    />
                    <CardsView
                        cardsData={channels}
                        searchData={searchChannels}
                        setCardSelected={setChannelSelected}
                        handleAddChannel={handleAddChannel}
                        datastore={datastore}
                        isLoading={isLoadingChannels}
                        moreOptionsItems={moreOptionsItems}
                        setShowQrSettings={setShowQrSettings}
                        showQrSettings={showQrSettings}
                    />
                    {!isEmpty(channels) && (
                        <SectionFooter
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            totalItems={totalChannelCount}
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            showList={false}
                        />
                    )}
                </>
            ) : (
                <EditChannel
                    channelSelected={channelSelected}
                    setChannelSelected={setChannelSelected}
                    refetchChannels={refetchChannels}
                    refetchChannel={refetchChannel}
                    isLoadingChannel={isLoadingChannel}
                    initialChannelSelected={initialChannelSelected}
                />
            )}
            <DeleteChannnel openModal={showDeleteModal} closeModal={closeDeleteModal} refetchChannels={refetchChannels} channelSelected={channelSelected} />
            <QRSetting channelSelected={channelSelected} openModal={showQrSettings} closeModal={() => setShowQrSettings(false)} />
        </>
    );
};

export default Channels;
