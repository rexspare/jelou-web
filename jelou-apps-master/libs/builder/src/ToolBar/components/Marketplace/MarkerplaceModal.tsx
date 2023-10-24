import { useState } from "react";

import { SpinnerIcon } from "@builder/Icons";
import { useSearch } from "@builder/ToolBar/hook/search";
import { ModalHeadless } from "@builder/common/Headless/Modal";
import { Switch } from "@builder/common/Headless/conditionalRendering";
import { SECTIONS_TABS, SECTIONS_TABS_KEYS } from "@builder/modules/Marketplace/domin/constants.marketplace";
import { useQueryMarketplace } from "@builder/modules/Marketplace/infrastructure/queryMarketplace";

import { HeaderMarkertPlace } from "./Header.marketplace";
import { ImportModalState, ImportToolModal } from "./ImportToolModal";
import { MarketplaceToolsList } from "./ToolsList.marketplace";

type MarkerplaceModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function MarkerplaceModal({ isOpen, onClose }: MarkerplaceModalProps) {
    const [showImportModal, setShowImportModal] = useState<ImportModalState | null>(null);

    const { data, isLoading } = useQueryMarketplace();
    const { handleSearch, search, searchResults } = useSearch(data, ["snapshot.Tool.name"]);

    const onImportTool = (versionTool: string, toolName: string) => {
        setShowImportModal({ isOpen: true, versionTool, toolName });
    };

    return (
        <ModalHeadless className="h-[53rem] w-[72rem]" showBtns={false} showClose={false} closeModal={onClose} isOpen={isOpen}>
            <main className="grid h-full grid-cols-[15rem_1fr] gap-10">
                <SectionTabs />
                <section>
                    <HeaderMarkertPlace onClose={onClose} search={search} handleSearch={handleSearch} />

                    <Switch>
                        <Switch.Case condition={isLoading}>
                            <div className="grid h-78 place-content-center text-primary-200">
                                <SpinnerIcon width={32} />
                            </div>
                        </Switch.Case>
                        <Switch.Case condition={!isLoading}>
                            <MarketplaceToolsList onImportTool={onImportTool} marketPlaceTools={searchResults} />
                        </Switch.Case>
                    </Switch>
                </section>
            </main>

            {showImportModal !== null && (
                <ImportToolModal isOpen={showImportModal.isOpen} onClose={() => setShowImportModal(null)} versionTool={showImportModal.versionTool} toolName={showImportModal.toolName} />
            )}
        </ModalHeadless>
    );
}

function SectionTabs() {
    const [activeTab] = useState(SECTIONS_TABS_KEYS.EXPLORER);
    return (
        <section className="w-60 rounded-l-1 bg-neutral-50">
            <h3 className="mb-7 ml-10 pt-14 text-xl font-semibold text-primary-200">Tools Marketplace</h3>
            <ul>
                {SECTIONS_TABS.map(({ id, label, Icon, disabled }) => {
                    const isActive = activeTab === id;
                    return (
                        <li key={id} className={`grid h-10 items-center pl-10 ${isActive ? "border-r-5 border-primary-370 bg-primary-350 font-semibold text-[#009EAF]" : "text-gray-400"}`}>
                            <button disabled={disabled} className={`flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-70`}>
                                <Icon />
                                {label}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
