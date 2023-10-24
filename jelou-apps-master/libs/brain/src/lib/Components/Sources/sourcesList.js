import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EyeIcon } from "@apps/shared/icons";
import { setSource } from "@apps/redux/store";
import { ITEM_TYPES, DATASOURCE } from "../../constants";

const SourcesList = (props) => {
    const { sources, datastoreId, datasourceId, datasourceName } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleViewBlocks = (item) => {
        if (datastoreId && datasourceId ) {
            dispatch(setSource(item));
            localStorage.setItem(ITEM_TYPES.SOURCE, JSON.stringify(item));
            navigate(`/brain/datastores/${datastoreId}/${datasourceId}`);
        }
    };

    return (
        <>
            <div>{`${t("brain.sourceMessage")} ${DATASOURCE.SINGULAR_LOWER} "${datasourceName}":`}</div>
            <div className="border-1 border-neutral-200 rounded-md">
                <table className="table-auto min-w-full">
                    <thead className="h-14 border-b-1 border-neutral-200 sticky top-0">
                        <tr>
                            <th className="px-4" scope="col">{t("common.name")}</th>
                        </tr>
                    </thead>
                    <tbody className="overflow-y-auto">
                        {sources?.map((source, index) => {
                            return (
                                <tr className="h-14 items-center" key={index}>
                                    <td className="px-4 items-center">{source?.name}</td>
                                    <td className="px-5 h-full w-7">
                                        <button
                                        className="h-full flex items-center"
                                        type="button"
                                        onClick={() => handleViewBlocks(source)}>
                                            <EyeIcon className="fill-current text-gray-400 hover:text-primary-200" fillOpacity="1" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default SourcesList;