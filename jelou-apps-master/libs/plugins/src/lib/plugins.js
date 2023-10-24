// import styles from "./plugins.module.scss";
import DatafastPruebas from "@apps/plugins/datafast-pruebas";
import DatafastSidebar from "@apps/plugins/datafast-sidebar";
import GeaEcuadorSidebar from "@apps/plugins/gea-ecuador-sidebar";
import InteraguaSidebar from "@apps/plugins/interagua-sidebar";
import OscusSidebar from "@apps/plugins/oscus-sidebar";
import Utpl2Sidebar from "@apps/plugins/utpl-2-sidebar";
import UTPLsidebar from "@apps/plugins/utpl-sidebar";

const plugins = (props) => {
    const { plugin } = props;
    const showPlugin = (plugin) => {
        switch (plugin) {
            case "@01labec/datafast-plugin":
                return <DatafastSidebar {...props} />;
            case "@01labec/datafast-pruebas":
                return <DatafastPruebas {...props} />;
            case "@01labec/interagua-sidebar":
                return <InteraguaSidebar {...props} />;
            case "@01labec/utpl-2-sidebar":
                return <Utpl2Sidebar {...props} />;
            case "@01labec/utpl-sidebar":
                return <UTPLsidebar {...props} />;
            case "@01labec/oscus-sidebar":
                return <OscusSidebar {...props} />;
            case "@01labec/gea-ecuador":
                return <GeaEcuadorSidebar {...props} />;
            default:
                break;
        }
    };
    return showPlugin(plugin);
};

export default plugins;
