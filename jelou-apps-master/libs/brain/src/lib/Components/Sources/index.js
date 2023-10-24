import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { DATASOURCE, DATASOURCE_TYPES, SOURCE } from "../../constants";
import { useSources } from "../../services/brainAPI";
import { Modal } from "../../Modal";
import ModalHeader from "../../Modal/modalHeader";
import NoSourcesToShow from "./noSourcesToShow";
import SourcesSkeleton from "./skeleton";
import SourcesList from "./sourcesList";

const SourceListViewModal = ({ openModal, closeModal }) => {
    const { t } = useTranslation();
    const datastore = useSelector((state) => state.datastore);
    const datasource = useSelector((state) => state.datasource);
    const [sources, setSources] = useState([]);

    const { data, isFetching, refetch } = useSources({
        datasourceId: datasource?.id,
        fetchSources:  datasource?.type !== DATASOURCE_TYPES.FLOW && datasource?.type !== DATASOURCE_TYPES.SKILL && !isEmpty(datasource),
    });

    useEffect(() => {
        if (datasource?.id) {
            refetch();
        }
    }, [openModal, datasource?.id]);

    useEffect(() => {
        if (!isFetching) {
            setSources(get(data, "data", []));
        }
    }, [data]);

    return (
        <Modal
            closeModal={() => null}
            openModal={openModal}
            className="h-min w-[584px] rounded-20 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]"
            classNameActivate="">
            <div className="h-full flex-row">
                <ModalHeader
                    title={`${t(SOURCE.PLURAL_CAPITALIZED)} ${t("common.ofThe")} ${DATASOURCE.SINGULAR_LOWER}`}
                    closeModal={() => closeModal()}
                />
                <div className="flex-row space-y-6 px-8 pt-8 pb-10 text-sm text-gray-400">
                    {isFetching ? (
                        <SourcesSkeleton />
                    ) : (
                        <>
                            {isEmpty(sources) ? (
                                <NoSourcesToShow datasourceName={datasource?.name} />
                            ) : (
                                <SourcesList
                                    sources={sources}
                                    datastoreId={datastore?.id}
                                    datasourceId={datasource?.id}
                                    datasourceName={datasource?.name}
                                />
                            )}
                            <footer className="flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="min-w-fit button-primary flex h-9 w-28 items-center justify-center px-5">
                                    {t("common.close")}
                                </button>
                            </footer>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SourceListViewModal;
