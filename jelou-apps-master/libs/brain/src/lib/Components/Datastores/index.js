import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { setShowTesterChat } from "@apps/redux/store";
import { useSearchData } from "@apps/shared/hooks";
import SectionCardsView from "../../Common/sectionCardsView/sectionCardsView";
import SectionFooter from "../../Common/sectionFooter";
import SectionHeader from "../../Common/sectionHeader";
import { DATASTORE, DATASTORE_TABLE_HEADERS } from "../../constants";
import { useDataStores } from "../../services/brainAPI";

const Datastores = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [initialDatastoreCount, setInitialDatastoreCount] = useState(0);
    const [totalDatastoreCount, setTotalDatastoreCount] = useState(0);
    const [isDeletedLastDatastore, setIsDeletedLastDatastore] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [showCreateDatastoreModal, setShowCreateDatastoreModal] = useState(false);
    const [showList, setShowList] = useState(false);

    const { data: dataStoreData, isLoading, revalidate } = useDataStores({ itemsPerPage, pageNumber });

    const { data: datastores = [], meta = {} } = dataStoreData || {};

    const { handleSearch, searchData, resetData } = useSearchData({
        dataForSearch: datastores,
        keysForSearch: DATASTORE_TABLE_HEADERS.map((header) => header.key),
    });

    const handleCreateDatastore = () => setShowCreateDatastoreModal(true);
    const closeCreateDatastoreModal = useCallback(() => setShowCreateDatastoreModal(false), []);

    useEffect(() => {
        setTotalDatastoreCount(get(meta, "total", 0));
        if (get(meta, "last_page", 0) > 0) {
            setLastPage(get(meta, "last_page", 1));
        }
        if (initialDatastoreCount === 0 || totalDatastoreCount > initialDatastoreCount) {
            setInitialDatastoreCount(get(meta, "total", 0));
        }
    }, [meta]);

    useEffect(() => {
        if (totalDatastoreCount < initialDatastoreCount && datastores?.length === 1) {
            setIsDeletedLastDatastore(true);
        }
    }, [totalDatastoreCount, datastores]);

    useEffect(() => {
        if (lastPage > 0 && isDeletedLastDatastore) {
            setPageNumber(lastPage);
        }
    }, [lastPage, isDeletedLastDatastore]);

    useEffect(() => {
        dispatch(setShowTesterChat(false));
    }, []);

    return (
        <div className="bg-app-body flex max-h-screen min-h-screen w-full flex-col px-5 mid:px-10 lg:px-12">
            <SectionHeader
                header={`${t("common.allOf")} ${DATASTORE.PLURAL_LOWER}`}
                showList={showList}
                setShowList={setShowList}
                handleSearch={handleSearch}
                resetData={resetData}
                handleCreateDatastore={handleCreateDatastore}
                closeCreateDatastoreModal={closeCreateDatastoreModal}
                showCreateDatastoreModal={showCreateDatastoreModal}
            />
            <section className="relative flex w-full flex-1 flex-col overflow-hidden rounded-1 bg-white shadow-sm">
                <SectionCardsView tableBodyData={searchData} data={datastores} handleCreateDatastore={handleCreateDatastore} isLoading={isLoading} revalidateDatastore={revalidate} />
                {!isEmpty(datastores) && (
                    <SectionFooter
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        totalItems={totalDatastoreCount}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                        showList={showList}
                    />
                )}
            </section>
        </div>
    );
};

export default Datastores;
