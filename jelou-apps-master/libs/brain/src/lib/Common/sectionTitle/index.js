/** Renders the title bar of sections "Datasources" and "Blocks" */

import BlocksTitleBar from "./blocksTitleBar";
import DatasourcesTitleBar from "./datasourcesTitleBar";

const SectionTitle = (props) => {
    const {
        datastoreId,
        title,
        displayDatasources,
        datasourceStatus,
        handleSearch,
        resetData,
        hasBlocks,
        hasFlows,
        handleAddDatasource,
        handleAddChannel,
        closeAddDatasourceModal,
        closeAddChannelModal,
        showModal,
        showCreateChannels,
        showChannels,
        setShowChannels,
        totalSources,
        showQrSettings,
        setShowQrSettings,
        isDatasourceTypeFlow,
        searchInputValue,
        setSearchInputValue,
        isSkill,
        isLoading,
    } = props;

    return (
        <header className={displayDatasources ? "border-b-1 border-neutral-200" : ""}>
            {displayDatasources ? (
                <DatasourcesTitleBar
                    datastoreId={datastoreId}
                    handleSearch={handleSearch}
                    resetData={resetData}
                    handleAddDatasource={handleAddDatasource}
                    handleAddChannel={handleAddChannel}
                    closeAddDatasourceModal={closeAddDatasourceModal}
                    closeAddChannelModal={closeAddChannelModal}
                    showModal={showModal}
                    showCreateChannels={showCreateChannels}
                    showChannels={showChannels}
                    setShowChannels={setShowChannels}
                    showQrSettings={showQrSettings}
                    setShowQrSettings={setShowQrSettings}
                    searchInputValue={searchInputValue}
                    setSearchInputValue={setSearchInputValue}
                />
            ) : (
                <BlocksTitleBar
                    title={title}
                    datasourceStatus={datasourceStatus}
                    hasBlocks={hasBlocks}
                    hasFlows={hasFlows}
                    totalSources={totalSources}
                    isDatasourceTypeFlow={isDatasourceTypeFlow}
                    isSkill={isSkill}
                    isLoading={isLoading}
                />
            )}
        </header>
    );
};

export default SectionTitle;
