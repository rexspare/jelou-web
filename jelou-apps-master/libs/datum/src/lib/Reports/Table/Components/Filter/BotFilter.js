import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import first from "lodash/first";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import React, { useCallback, useEffect, useState } from "react";

import { ComboboxSelect } from "@apps/shared/common";
import { DashboardServer } from "@apps/shared/modules";
import LoadingFilter from "./LoadingFilter";

// This filter depends on the company filter selection
const BotFilter = ({ filter, setRequestParams, companySeleted }) => {
    const [value, setValue] = useState({});
    const { key, placeholder } = filter;

    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [botSelect, setBotSelect] = useState({});
    const [rawBots, setRawBots] = useState([]);
    // const [botsOptions, setBotsOptions] = useState([]);

    const { t } = useTranslation();
    const userSession = useSelector((state) => state.userSession);

    useEffect(() => {
        if (companySeleted === null || rawBots.length === 0) return;

        const filteredBots = rawBots.filter((bot) => bot.companyId === companySeleted);
        setBots(filteredBots);

        const firstBot = first(filteredBots);
        if (!isEmpty(firstBot)) setBotSelect(firstBot);
    }, [companySeleted, rawBots]);

    useEffect(() => {
        if (isEmpty(botSelect)) return;
        setRequestParams((preState) => ({ ...preState, [key]: botSelect.id }));
        setValue({ ...botSelect, value: botSelect.id, id: botSelect.id });
    }, [botSelect]);

    const getBots = useCallback(async () => {
        try {
            const { companyId } = userSession;
            const { data } = await DashboardServer.get(`companies/${companyId}/bots`, {
                params: {
                    shouldPaginate: false,
                    state: 1,
                },
            });

            const bots = data.data;
            if (isEmpty(bots)) {
                setLoading(false);
                return;
            }

            // Select first bot by default
            const bot = first(bots);
            const botOptions = typeof bot["inProduction"] === "undefined" ? bots : bots.filter((bot) => bot.inProduction);

            // const firstBot = first(botOptions);
            // setBotSelect(firstBot);

            setBots(botOptions);
            setRawBots(botOptions);

            // const botsId = bots.map((bot) => bot.id);
            // setRawBotsId(botsId);
        } catch (error) {
            console.error(error.message);
            console.error(error.response);
        }
        setLoading(false);
    }, [userSession]);

    useEffect(() => {
        getBots();
        return () => {
            setBots([]);
            setRawBots([]);
            // setRawBotsId([]);
        };
    }, [getBots]);

    const getBotOptions = useCallback(() => {
        if (isEmpty(bots)) return [];
        // const firstBot = first(bots);

        // const botOptions = typeof firstBot["inProduction"] === "undefined" ? bots : bots.filter((bot) => bot.inProduction);

        return bots.map((bot) => ({
            name: bot.name,
            value: bot.id,
            id: bot.id,
        }));
    }, [bots]);

    const botsOptions = getBotOptions();

    const hasAllBot = has(filter, "hasAllBot");
    const botsOptionsAll = botsOptions?.length > 1 && hasAllBot ? [{ name: t("Todos"), value: -1 }, ...botsOptions] : botsOptions;

    const handleChange = (value) => {
        setValue(value);
        const botsIds = botsOptions.map((bot) => bot.id);
        setRequestParams((preState) => ({ ...preState, [key]: value.value === -1 ? botsIds : value.value }));
    };

    if (loading) {
        return <LoadingFilter />;
    }

    if ((!isEmpty(bots) && bots.length <= 1) || isEmpty(bots)) {
        return null;
    }

    return (
        botsOptionsAll &&
        botsOptionsAll.length > 0 && (
            <div className="w-60">
                <ComboboxSelect
                    hasClearButton={false}
                    background={"#fff"}
                    handleChange={handleChange}
                    label={filter.label}
                    name={key}
                    options={botsOptionsAll}
                    placeholder={placeholder}
                    value={value}
                />
            </div>
        )
    );
};

export default BotFilter;
