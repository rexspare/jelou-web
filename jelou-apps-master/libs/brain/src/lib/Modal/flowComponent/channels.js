import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DebounceInput } from "react-debounce-input";
import toLower from "lodash/toLower";

import { SearchIcon2 } from "@apps/shared/icons";
import { useSearchData } from "@apps/shared/hooks";
import { CHANNEL } from "../../constants";
import Channel from "./channel";
import EmptyData from "../../Common/emptyData";

const Channels = (props) => {
    const { fetchedChannels, handleSelectFromWidget, setDatasourceValues, datasourceValues, viewSearch = true, handleAddChannel = () => null, datastoreName } = props;
    const { t } = useTranslation();
    const [page, setPage] = useState(1);

    const { handleSearch, searchData, resetData } = useSearchData({
        dataForSearch: fetchedChannels,
        keysForSearch: ["name"],
    });

    const handleScroll = ({ target }) => {
        const { scrollTop, scrollHeight, clientHeight } = target;
        if (scrollTop + (clientHeight + page) >= scrollHeight && fetchedChannels.length < searchData.length) {
            setPage(page + 1);
        }
    };

    return (
        <>
            {fetchedChannels.length > 0 ? (
                <>
                    {viewSearch && (
                        <div className="mb-4 flex items-center rounded-lg border-1 border-neutral-200 px-4">
                            <label className="flex items-center">
                                <SearchIcon2 width="24px" height="24px" />
                                <DebounceInput
                                    autoFocus
                                    type="search"
                                    minLength={2}
                                    debounceTimeout={500}
                                    onChange={handleSearch}
                                    placeholder={`${t("common.search")} ${toLower(t("common.channel"))}`}
                                    className="inputShop border-0 bg-transparent pl-4 text-15 font-semibold leading-normal text-gray-100 placeholder-gray-100 outline-none ring-transparent focus:border-transparent focus:ring-transparent"
                                />
                            </label>
                        </div>
                    )}
                    <div onScroll={handleScroll} className="my-2 flex h-[20rem] flex-col gap-y-3 overflow-scroll xl:h-[15rem]">
                        {searchData.map((channel, index) => {
                            return <Channel key={index} handleSelectFromWidget={handleSelectFromWidget} channel={channel} setDatasourceValues={setDatasourceValues} datasourceValues={datasourceValues} />;
                        })}
                    </div>
                </>
            ) : (
                <div className="my-6 flex h-[20rem] items-center justify-center xl:my-1 xl:h-[15rem]">
                    <EmptyData
                        item={t(CHANNEL.PLURAL_LOWER)}
                        itemName={datastoreName}
                        onClick={handleAddChannel}
                        isDatasource={true}
                        buttonText={t(CHANNEL.SINGULAR_LOWER)}
                        imageWidth={window.innerWidth >= 1400 ? "150px" : "200px"}
                        imageHeight={window.innerWidth >= 1400 ? "150px" : "200px"}
                        textClassName={"my-4 text-sm text-gray-400"}
                    />
                </div>
            )}
        </>
    );
};

export default Channels;
