import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { IconCategory, IconDiscount, IconIVA, IconStatus } from "@apps/shared/icons";
import { getCategoriesOptionsForFilter } from "../../services/categories";

export const CATEGORIES_OPTIONS_KEY = "categories_options_filters";

export function useInitFilters() {
    const { t } = useTranslation();

    const company = useSelector((state) => state.company);
    const { app_id = null } = company?.properties?.shopCredentials?.jelou_ecommerce || {};

    const { data: optionsCategoriesFilter = [] } = useQuery([CATEGORIES_OPTIONS_KEY], () => getCategoriesOptionsForFilter({ jelou_ecommerce_app_id: app_id }), {
        refetchOnMount: false,
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
        enabled: Boolean(app_id),
    });

    const arrayFilterProducts = [
        {
            icon: <IconIVA />,
            placeholder: t("shop.filters.taxes"),
            key: "iva",
            options: [
                {
                    id: 1,
                    name: t("shop.filters.taxIncluded"),
                    key: "iva",
                    value: {
                        filters: [
                            {
                                field: "has_tax",
                                operator: "=",
                                value: 1,
                            },
                        ],
                    },
                },
                {
                    id: 2,
                    name: t("shop.filters.withoutTaxation"),
                    key: "iva",
                    value: {
                        filters: [
                            {
                                field: "has_tax",
                                operator: "=",
                                value: 0,
                            },
                        ],
                    },
                },
            ],
        },
        {
            icon: <IconDiscount />,
            placeholder: t("shop.filters.discount"),
            key: "discount",
            options: [
                {
                    id: 3,
                    name: t("shop.filters.withDiscount"),
                    key: "discount",
                    value: {
                        scopes: [
                            {
                                name: "withDiscount",
                            },
                        ],
                    },
                },
                {
                    id: 4,
                    name: t("shop.filters.withoutDiscount"),
                    key: "discount",
                    value: {
                        scopes: [
                            {
                                name: "withoutDiscount",
                            },
                        ],
                    },
                },
            ],
        },
        {
            placeholder: t("shop.table.category"),
            key: "categories",
            icon: <IconCategory />,
            options: optionsCategoriesFilter,
        },
    ];

    const arrayFilterOrders = [
        {
            icon: <IconStatus />,
            placeholder: t("shop.filters.status"),
            key: "status",
            options: [
                {
                    id: 5,
                    name: t("shop.status.success"),
                    key: "status",
                    value: {
                        scopes: [
                            {
                                name: "successful",
                            },
                        ],
                    },
                },
                {
                    id: 7,
                    name: t("shop.status.failed"),
                    key: "status",
                    value: {
                        scopes: [
                            {
                                name: "failed",
                            },
                        ],
                    },
                },
                {
                    id: 8,
                    name: t("shop.status.canceled"),
                    key: "status",
                    value: {
                        scopes: [
                            {
                                name: "canceled",
                            },
                        ],
                    },
                },
            ],
        },
    ];

    return { arrayFilterOrders, arrayFilterProducts };
}
