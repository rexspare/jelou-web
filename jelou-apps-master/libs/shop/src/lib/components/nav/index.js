import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { Menu as TopNav } from "@apps/shared/common";
import { useSelector } from "react-redux";
import { SeeCatalogueButton } from "../Actions/SeeCatalogueButton";

export function Nav({ menuOptions = [] } = {}) {
    const [currentOptionId, setCurrentOptionId] = useState(0);
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    useEffect(() => {
        if (window.location.pathname === "/shop/products") setCurrentOptionId(0);
        if (window.location.pathname === "/shop/orders") setCurrentOptionId(1);
        if (window.location.pathname === "/shop/categories") setCurrentOptionId(2);
        if (window.location.pathname === "/shop/plans") setCurrentOptionId(3);
    }, [window.location.pathname]);

    const navigate = useNavigate();

    const options = menuOptions.map((tab) => {
        return {
            id: tab.id,
            label: tab.name,
            handleClick: () => {
                setCurrentOptionId(tab.id);
                navigate(`/shop/${tab.tab}`);
            },
        };
    });

    return (
        <div className="mb-3">
            <TopNav title={t("shop.title")} currentOptionId={currentOptionId} options={options} lang={lang} showChildren>
                <SeeCatalogueButton />
            </TopNav>
        </div>
    );
}
