import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation, useMatch, useNavigate } from "react-router-dom";

import { Nav } from "./components/nav";
import { ActivateShop } from "./pages/Activate";
import { CategoriesTab } from "./pages/Categories";
import { Orders } from "./pages/Orders";
import { ProductTable } from "./pages/Products";

import SubscriptionsTab from "./pages/Subscriptions";

let menuOptions = [];

function Shop(props) {
    const { setShowPage404 } = props;
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const isActivatePage = useMatch("/shop/activate");

    const location = useLocation();
    const pathname = get(location, "pathname", "");

    const navigate = useNavigate();
    const company = useSelector((state) => state.company);
    const permissions = useSelector((state) => state.userSession.permissions);

    const credentials = get(company, "properties.shopCredentials", undefined);
    const app_id = isEqual(company, {}) ? null : get(credentials, "jelou_ecommerce.app_id", undefined);

    const ecommerceViewProductPermission = permissions?.find((data) => data === "ecommerce:view_product");
    const ecommerceViewOrdersPermission = permissions?.find((data) => data === "ecommerce:view_order");
    const ecommerceViewCategoriesPermission = permissions?.find((data) => data === "ecommerce:view_category");

    useMemo(() => {
        const tabsShop = [
            { name: t("shop.products"), tab: "products", id: 0, permissions: Boolean(ecommerceViewProductPermission) },
            { name: t("shop.orders"), tab: "orders", id: 1, permissions: Boolean(ecommerceViewOrdersPermission) },
            { name: t("shop.categories"), tab: "categories", id: 2, permissions: Boolean(ecommerceViewCategoriesPermission) },
            { name: t("shop.plans.title"), tab: "plans", id: 3, permissions: Boolean(ecommerceViewCategoriesPermission) },
        ];

        menuOptions = tabsShop.filter((tab) => tab.permissions);

        if (!isEmpty(credentials) && !isEmpty(menuOptions)) return navigate(`/shop/${menuOptions[0].tab}`);
        if (isEmpty(credentials)) navigate("/shop/activate");
    }, [ecommerceViewProductPermission, ecommerceViewOrdersPermission, ecommerceViewCategoriesPermission, lang, credentials, company, t]);

    useEffect(() => {
        if (pathname !== "/shop/products" && pathname !== "/shop" && pathname !== "/shop/categories" && pathname !== "/shop/orders" && pathname !== "/shop/activate" && pathname !== "/shop/plans")
            setShowPage404(true);
    }, []);

    return (
        <div className="ml-32 mr-10 h-screen w-[90vw] pt-6">
            {!isActivatePage && <Nav menuOptions={menuOptions} />}
            <Routes>
                <Route path="/products" element={<ProductTable path="/products" app_id={app_id} />} />
                <Route path="/orders" element={<Orders path="/orders" />} />
                <Route path="/activate" element={<ActivateShop path="/activate" />} />
                <Route path="/categories" element={<CategoriesTab path="/categories" />} />
                <Route path="/plans" element={<SubscriptionsTab path="/plans" />} />
            </Routes>
        </div>
    );
}

export default Shop;
