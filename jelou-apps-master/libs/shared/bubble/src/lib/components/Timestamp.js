import React from "react";
import { useSelector } from "react-redux";
import has from "lodash/has";

const Timestamp = (props) => {
    const { from } = props;
    const operators = useSelector((state) => state.operators);
    const bots = useSelector((state) => state.bots);
    const styles = `block mt-1 text-gray-400 font-medium text-13 ${
        props.bubbleSide === "right"
            ? "text-right flex justify-end items-center pr-3"
            : props.bubbleSide === "right-bot"
            ? "text-right"
            : "text-left pl-16"
    }`;

    const { operatorId, botId } = props;

    let names = null;
    if (operatorId) {
        const operator = operators.find((operator) => operator.providerId === operatorId);
        names = operator?.names;
    }

    if (has(from, "name")) {
        names = from.name;
    }

    if (botId) {
        const bot = bots.find((bot) => bot.id === botId);
        names = bot?.name;
    }

    return <small className={styles}>{names && `${names}`}</small>;
};

export default Timestamp;
