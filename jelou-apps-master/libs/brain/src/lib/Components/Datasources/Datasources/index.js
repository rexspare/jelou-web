import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useState } from "react";

import { useSearchData } from "@apps/shared/hooks";
import SectionCardsView from "../../../Common/sectionCardsView/sectionCardsView";
import SectionFooter from "../../../Common/sectionFooter";
import SectionTitle from "../../../Common/sectionTitle/index";
import { DATASOURCE_TABLE_HEADERS } from "../../../constants";
import { useDatasources } from "../../../services/brainAPI";

const Datasources = (props) => {
    const { datastoreId, datastore, setHasDatasources, setShowChannels, handleAddChannel, closeAddChannelModal, showCreateChannels } = props;
    const [initialDatasourceCount, setInitialDatasourceCount] = useState(0);
    const [totalDatasourceCount, setTotalDatasourceCount] = useState(0);
    const [isDeletedLastDatasource, setIsDeletedLastDatasource] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [lastPage, setLastPage] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [showCreateDatasourceModal, setShowCreateDatasource] = useState(false);
    const [fetchDatasources, setFetchDatasources] = useState(false);

    const {
        data: datasourcesData,
        isLoading: isLoadingDatasources,
        refetch: refetchDatasources,
    } = useDatasources({
        datastoreId: datastoreId,
        fetchData: fetchDatasources,
        limit: itemsPerPage,
        page: pageNumber,
    });

    const { data: datasources = [], meta = {} } = datasourcesData || {};

    const {
        handleSearch: handleSearchDatasources,
        searchData: searchDatasources,
        // sortBySearch: sortDatasourcesBySearch,
        resetData: resetDatasourcesData,
    } = useSearchData({
        dataForSearch: datasources,
        keysForSearch: DATASOURCE_TABLE_HEADERS.map((header) => header.key),
    });

    const handleAddDatasource = () => setShowCreateDatasource(true);
    const closeAddDatasourceModal = useCallback(() => setShowCreateDatasource(false), []);

    useEffect(() => {
        const metaTotal = get(meta, "total", 0);
        const lastPageValue = get(meta, "last_page", 1);

        setTotalDatasourceCount(metaTotal);
        setLastPage(lastPageValue);

        if (initialDatasourceCount === 0 || metaTotal > initialDatasourceCount) {
            setInitialDatasourceCount(metaTotal);
        }

        if (metaTotal < initialDatasourceCount && datasources.length === 1) {
            setIsDeletedLastDatasource(true);
        } else {
            setIsDeletedLastDatasource(false);
        }

        if (lastPageValue > 0 && isDeletedLastDatasource) {
            setPageNumber(lastPageValue);
        }

        if (!isLoadingDatasources) {
            setHasDatasources(!isEmpty(datasources));
            setTotalDatasourceCount(metaTotal);
        }

        if (!isEmpty(datastore)) {
            setFetchDatasources(true);
        }
    }, [meta, initialDatasourceCount, datasources.length, isDeletedLastDatasource, lastPage, isLoadingDatasources, datasources, datastore]);

    useEffect(() => {
        if (!isEmpty(datastore)) {
            refetchDatasources();
        }
    }, [itemsPerPage, pageNumber, datastore]);

    return (
        <>
            <SectionTitle
                datastoreId={datastoreId}
                displayDatasources={true}
                title={get(datastore, "name", "")}
                handleSearch={handleSearchDatasources}
                resetData={resetDatasourcesData}
                handleAddDatasource={handleAddDatasource}
                closeAddDatasourceModal={closeAddDatasourceModal}
                showModal={showCreateDatasourceModal}
                setShowChannels={setShowChannels}
                handleAddChannel={handleAddChannel}
                closeAddChannelModal={closeAddChannelModal}
                showCreateChannels={showCreateChannels}
            />
            <SectionCardsView
                displayDatasources={true}
                datastore={datastore}
                tableBodyData={searchDatasources}
                data={datasources}
                handleAddDatasource={handleAddDatasource}
                isLoading={isLoadingDatasources}
                refetchDatasources={refetchDatasources}
            />
            {!isEmpty(datasources) && (
                <SectionFooter itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalItems={totalDatasourceCount} pageNumber={pageNumber} setPageNumber={setPageNumber} showList={false} />
            )}
        </>
    );
};

export default Datasources;
