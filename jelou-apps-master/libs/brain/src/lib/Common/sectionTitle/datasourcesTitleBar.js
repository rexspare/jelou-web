import { useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { useTranslation } from "react-i18next";

import { CloseIcon, SearchIcon2 } from "@apps/shared/icons";
import CreateChannelModal from "../../Components/Datasources/Channels/createChannel";
import { CreateDataSource } from "../../Components/Datasources/Datasources/Modals/Create";
import { CHANNEL, DATASOURCE } from "../../constants";
import AddButton from "./../addButton";
import { useNavigate } from "react-router-dom";

const DatasourcesTitleBar = (props) => {
    const {
        handleSearch,
        datastoreId,
        resetData,
        handleAddDatasource,
        handleAddChannel,
        closeAddDatasourceModal,
        closeAddChannelModal,
        showModal,
        showCreateChannels,
        showChannels,
        setShowChannels,
        showQrSettings,
        setShowQrSettings,
    } = props;
    const { t } = useTranslation();
    const [searchInputValue, setSearchInputValue] = useState("");
    const navigate = useNavigate();

    const handleClearInputSearchClick = (e) => {
        e.preventDefault();
        setSearchInputValue("");
        resetData();
    };

    const renderClick = () => {
        showChannels ? handleAddChannel() : handleAddDatasource();
    };

    return (
        <div className="flex justify-between p-6 py-4 custom:p-6">
            <div className="flex items-center gap-x-4">
                <button
                    className={`flex h-fit items-center rounded-12 ${
                        !showChannels ? "bg-primary-200 bg-opacity-[.16] text-primary-200" : "text-gray-400"
                    } hover:bg-primary-200 hover:bg-opacity-[.16] hover:text-primary-200`}
                    onClick={() => {
                        setShowChannels(false);
                        navigate(`/brain/${datastoreId}/knowledge`,{replace:true});
                    }}
                >
                    <span className="px-4 py-[10px] font-bold">{DATASOURCE.PLURAL_CAPITALIZED}</span>
                </button>
                <button
                    className={`flex h-fit items-center rounded-12 ${
                        showChannels ? "bg-primary-200 bg-opacity-[.16] text-primary-200" : "text-gray-400"
                    } hover:bg-primary-200 hover:bg-opacity-[.16] hover:text-primary-200`}
                    onClick={() => {
                        setShowChannels(true);
                        navigate(`/brain/${datastoreId}/channels`, {replace:true});
                    }}
                >
                    <span className="px-4 py-[10px] font-bold">{t("common.channels")}</span>
                </button>
            </div>
            <section className="flex gap-3">
                <div className="flex h-10 w-[18rem] items-center rounded-10 border-default border-gray-100 border-opacity-50 px-4">
                    <label className="flex items-center">
                        <SearchIcon2 width="24px" height="24px" />
                        <DebounceInput
                            autoFocus
                            type="search"
                            minLength={2}
                            debounceTimeout={500}
                            onChange={(e) => {
                                handleSearch(e);
                                setSearchInputValue(e.target.value);
                            }}
                            value={searchInputValue}
                            className="inputShop border-0 bg-transparent pl-4 text-15 leading-normal text-gray-100 placeholder-gray-100 outline-none ring-transparent focus:border-transparent focus:ring-transparent"
                            placeholder={`${t("common.search")} ${!showChannels ? DATASOURCE.SINGULAR_LOWER : showChannels ? t("common.channels").toLowerCase() : ""}`}
                        />
                    </label>
                    {searchInputValue && (
                        <button className="pr-2" onClick={handleClearInputSearchClick}>
                            <CloseIcon width={10} height={10} fill="rgba(166, 180, 208,1)" />
                        </button>
                    )}
                </div>
                <AddButton
                    onClick={() => renderClick()}
                    buttonText={`${!showChannels ? DATASOURCE.SINGULAR_LOWER : showChannels ? t(CHANNEL.SINGULAR_LOWER) : ""}`}
                    //isDatasource={!showAgents}
                />
            </section>
            <CreateDataSource closeModal={closeAddDatasourceModal} isOpen={showModal} handleAddChannel={handleAddChannel} />
            <CreateChannelModal openModal={showCreateChannels} closeModal={closeAddChannelModal} showQrSettings={showQrSettings} setShowQrSettings={setShowQrSettings} />
        </div>
    );
};

export default DatasourcesTitleBar;
