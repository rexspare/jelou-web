import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ActionsTitle } from "../../components/ActionsTitle";
import { CreateCategoriesModal } from "../../components/Categories/Create";
import { DeleteCategoriesModal } from "../../components/Categories/Delete";
import { Pagination } from "../../components/Pagination";
import { Table } from "../../components/Table";
import { useCategoriesData } from "../../hooks/categories";
import { useEstructureColumns } from "../../hooks/estructureColumns";

export function CategoriesTab() {
    const [categoryData, setCategoryData] = useState(null);
    const [showCreateCategoriesModal, setShowCategoriesModal] = useState(false);
    const [showDeleteCategoriesModal, setShowDeleteCategoriesModal] = useState(false);

    const { categoriesColumns } = useEstructureColumns({ setData: setCategoryData, setShow: setShowDeleteCategoriesModal });
    const { t } = useTranslation();

    const { categoryList, dataForPage, loading, setLimitForPage, setPage, setSelectedCategories, setCategoryList } = useCategoriesData();

    return (
        <div className="min-h-[17rem] rounded-xl bg-white">
            <header className="mb-8">
                <ActionsTitle
                    isCategories={true}
                    setSearch={setSelectedCategories}
                    title={t("shop.table.titleCategories")}
                    handleOpenClick={() => setShowCategoriesModal(true)}
                    placeholderInputSearch={t("shop.searchCategories")}
                />
            </header>

            <CreateCategoriesModal
                setCategoryList={setCategoryList}
                isShow={showCreateCategoriesModal}
                onClose={() => setShowCategoriesModal(false)}
            />

            <DeleteCategoriesModal
                categoryData={categoryData}
                setCategoryList={setCategoryList}
                isShow={showDeleteCategoriesModal}
                onClose={() => setShowDeleteCategoriesModal(false)}
            />

            <Table
                dataList={categoryList}
                EmptyTable={EmptyMessage}
                errMsg="Tuvimos un error al obtener las categorías"
                // isError={isError}
                loadingTable={loading}
                structureColumns={categoriesColumns}
            />

            <div className="border-t-1 border-[#a6b4d0] border-opacity-25">
                {categoryList.length > 0 && <Pagination dataForPage={dataForPage} setCurrentPage={setPage} setPerPage={setLimitForPage} />}
            </div>
        </div>
    );
}

function EmptyMessage() {
    return (
        <>
            <h3 className="mt-4 text-center text-xl font-bold text-gray-400 text-opacity-75">Aún no tienes categorías</h3>
            {/* <p className="leading-normal text-center text-gray-400 text-15 text-opacity-65">
                Las ordenes se generan automáticamente al realizar una compra
            </p> */}
        </>
    );
}
