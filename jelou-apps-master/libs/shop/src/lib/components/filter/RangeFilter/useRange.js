import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";

import { getMaxMinValuesForRangeFilter } from "../../../services/prices";

export const PRICE_METADATA = "price_metadata";

export function useRange({ setSelected = () => null } = {}) {
    const [valueRange, setValueRange] = useState({ min: 0, max: 100 });

    const company = useSelector((state) => state.company);
    const app_id = company?.properties?.shopCredentials?.jelou_ecommerce?.app_id ?? null;

    const { data = {} } = useQuery([PRICE_METADATA], () => getMaxMinValuesForRangeFilter({ app_id }), {
        enabled: Boolean(app_id),
        refetchInterval: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const { min_price = undefined, max_price = undefined } = data;

    const handleChange = (value) => setValueRange(value);

    const handleClick = (evt) => {
        evt.preventDefault();
        const value = {
            filters: [
                {
                    field: "price",
                    operator: ">=",
                    value: valueRange.min,
                },
                {
                    field: "price",
                    operator: "<=",
                    value: valueRange.max,
                },
            ],
        };
        setSelected((preState) => ({ ...preState, price: value }));
    };

    const clearFilter = () => {
        setValueRange({ min: Math.ceil(min_price), max: Math.ceil(max_price) });
        setSelected((preState) => {
            const { price, ...rest } = preState;
            return rest;
        });
    };

    return {
        handleChange,
        clearFilter,
        handleClick,
        valueRange,
        min_price,
        max_price,
    };
}
