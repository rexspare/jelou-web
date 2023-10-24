import Tippy from "@tippyjs/react";
import { useTranslation } from "react-i18next";

const Tabs = ({ setTabSelected = () => null, tabSelected, tabsList = [] } = {}) => {
    const { t } = useTranslation();
    const handleChangeTab = (tab) => {
        setTabSelected(tab);
    };

    return (
        <header className="flex h-18 items-center justify-center gap-2 overflow-x-scroll border-b-1.5 border-gray-100 border-opacity-25">
            {tabsList.map((tab) =>
                tab.disable ? (
                    <Tippy key={tab.name} content={tab?.messageDisable ?? "Próximamente"} placement={"top"} touch={false}>
                        <button className="cursor-not-allowed p-1 text-gray-400 focus:outline-none focus:ring-transparent">
                            <Tab label={t(`pma.${tab.label}`)} />
                        </button>
                    </Tippy>
                ) : (
                    <button key={tab.name} onClick={() => handleChangeTab(tab.name)} className="focus:outline-none focus:ring-transparent">
                        <Tab label={t(`pma.${tab.label}`)} tabName={tab.name} tabSelected={tabSelected} />
                    </button>
                )
            )}
        </header>
    );
};

export default Tabs;

function Tab({ label, tabSelected = null, tabName = "" } = {}) {
    return (
        <span className={`p-1 text-sm font-bold ${tabSelected === tabName ? "rounded-xs bg-[#E6F7F9] text-primary-200" : "text-gray-400"}`}>
            {label}
        </span>
    );
}
