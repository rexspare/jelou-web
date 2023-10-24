import Immutable, { List } from "immutable";
import castArray from "lodash/castArray";
import get from "lodash/get";
import isArray from "lodash/isArray";
import isNumber from "lodash/isNumber";
import isObject from "lodash/isObject";
import omit from "lodash/omit";
import orderBy from "lodash/orderBy";
import toLower from "lodash/toLower";
import toUpper from "lodash/toUpper";
import { rgba } from "polished";

import { OPERATOR_STATUS } from "@apps/shared/constants";
import { Facebook, Instagram, MailIcon, SmsIcon, Twitter, WebIcon, WhatsappColoredIcon } from "@apps/shared/icons";
import * as dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import linkifyHtml from "linkify-html";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const botTypeicon = {
    Facebook: <Facebook width="1rem" height="1rem" />,
    Facebook_Feed: <Facebook width="1rem" height="1rem" />,
    Whatsapp: <WhatsappColoredIcon width="1rem" height="1rem" />,
    Twitter: <Twitter width="1rem" height="1rem" />,
    Twitter_replies: <Twitter width="1rem" height="1rem" />,
    Instagram: <Instagram width="1rem" height="1rem" />,
    Widget: <WebIcon width="1rem" height="1rem" />,
    email: <MailIcon width="1rem" height="1rem" />,
    Sms: <SmsIcon width="1rem" height="1rem" />,
};

export async function readStream(response, setText) {
    if (!response.body) {
        return "";
    }
    const reader = response.body.pipeThrough(new window.TextDecoderStream()).getReader();

    let text = "";

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        text += value;
        setText((preState) => preState + value);
    }

    return text;
}
export const getTimeInSeconds = (value, format) => {
    switch (format) {
        case "days":
            return value * 86400;
        case "hours":
            return value * 3600;
        case "minutes":
            return value * 60;
        case "seconds":
            return value;
        default:
            return value;
    }
};

export const getTypeIcon = (botType) => {
    switch (botType) {
        case "Whatsapp":
            return botTypeicon[botType];
        case "Facebook":
            return botTypeicon[botType];
        case "Facebook_Feed":
            return botTypeicon[botType];
        case "Twitter":
            return botTypeicon[botType];
        case "Twitter_replies":
            return botTypeicon[botType];
        case "Instagram":
            return botTypeicon[botType];

        default:
            return botTypeicon[botType];
    }
};

export const getTitleBotColor = (botType) => {
    switch (botType) {
        case "Whatsapp":
            return "text-green-1000";
        case "Facebook":
            return "text-blue-960";
        case "Facebook_Feed":
            return "text-blue-960";
        case "Twitter":
            return "text-teal-960";
        case "Twitter_replies":
            return "text-teal-960";
        case "Instagram":
            return "text-purple-960";
        case "Widget":
            return "text-blue-650";
        case "Sms":
            return "text-[#0072F0]";
        case "email":
            return "text-[#2091A0]";
        default:
            break;
    }
};

export function filterByKey(data, key, value) {
    if (!isArray(data)) {
        return [];
    }
    return data.filter((item) => item[key] === value);
}

export const getTimeByUnity = (seconds, unity) => {
    switch (unity) {
        case "hours":
            return seconds / 3600;
        case "minutes":
            return seconds / 60;
        case "days":
            return seconds / 86400;
        default:
            return seconds;
    }
};

export const keyById = function keyById(data, key = null) {
    if (!Array.isArray(data)) {
        data = [data];
    }

    data = data.map((item) => {
        return {
            ...item,
        };
    });

    return Immutable.fromJS(data)
        .toMap()
        .mapEntries(function ([, value]) {
            return [value.get(key || "id"), value];
        });
};

export const mergeByIdOrder = function mergeByIdOrder(state, payload, keyToMerge = null, keyToOrder = "id", order = "desc") {
    const arrayMerged = mergeById(state, payload, keyToMerge);
    return orderBy(arrayMerged, [keyToOrder], [order]);
};

export const mergeById = function mergeById(state, payload, key = null) {
    const arr = castArray(payload);
    return keyById(state, key).merge(keyById(arr, key)).toList().toJS();
};

export const deleteById = function deleteById(arr = [], id, keyId = "id") {
    return List(arr)
        .filter((item) => item[keyId] !== id)
        .toJS();
};

export const deleteByIdArchived = function deleteById(arr = [], id) {
    return List(arr)
        .filter((item) => item._id !== id)
        .toJS();
};

export const updateById = function updateById(arr = [], obj, key = "id") {
    return List(arr)
        .map((item) => {
            if (item[key] === obj[key]) {
                return { ...item, ...obj };
            }
            return item;
        })
        .toJS();
};

export const updateIdById = function updateById(arr = [], obj, key) {
    return List(arr)
        .map((item) => {
            if (item.id === obj[key]) {
                return { ...item, ...obj };
            }
            return item;
        })
        .toJS();
};

export const updateByIdSortByDate = function updateByIdSortByDate(arr = [], obj) {
    let modifiedIndex = -1;
    const updatedList = List(arr)
        .map((item, index) => {
            if (item.id === obj.id) {
                modifiedIndex = index;
                return { ...item, ...obj };
            }
            return item;
        })
        .toJS();
    if (modifiedIndex !== -1) {
        const updatedElement = updatedList.splice(modifiedIndex, 1);
        return [...updatedElement, ...updatedList];
    }
    return updatedList;
};

/* Returns a regExp to test. */
export const escapedRegEXp = (string) => {
    const regExp = string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(toUpper(regExp));
};

/**
 * Get preview message
 *
 * @param {object} message
 */
export const getPreviewMessage = (message) => {
    if (!message) {
        return "";
    }

    const { type } = message;

    if (isObject(message.text)) {
        return "Invalid Message";
    }

    try {
        switch (toUpper(type)) {
            case "TEXT":
                return message.text;
            default:
                return toLower(message.type);
        }
    } catch (error) {
        // console.log(error);
    }
};

export function createMarkup(html) {
    return { __html: linkifyHtml(html, { target: "_blank" }) };
}

export function avgTime(time) {
    let avgReply = isNumber(time) ? time : 0;
    let avgOpReply = Math.round(avgReply / 60);
    if (avgReply > 60) {
        if (avgOpReply.toString().length === 1) {
            avgOpReply = `0${avgOpReply}`;
        }
        return `${avgOpReply}m 00s`;
    } else {
        avgReply = Math.round(avgReply);
        if (avgReply.toString().length === 1) {
            avgReply = `0${avgReply}`;
        }
        return `00m ${avgReply}s`;
    }
}

export function secondsToMinutesAndSeconds(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.round(seconds % 60);

    if (remainingSeconds.toString().length === 1) {
        remainingSeconds = `0${remainingSeconds}`;
    }

    if (minutes.toString().length === 1) {
        minutes = `0${minutes}`;
    }

    return `${minutes}m ${remainingSeconds}s`;
}

export function msToHMS(ms) {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    let hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    let minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
    if (minutes.toString().length === 1) {
        minutes = `0${minutes}`;
    }
    seconds = seconds % 60;
    seconds = Math.floor(seconds);
    if (seconds.toString().length === 1) {
        seconds = `0${seconds}`;
    }

    if (hours.toString().length === 1 && hours !== 0) {
        return `0${hours}` + "h " + minutes + "m " + seconds + "s";
    } else {
        return `${minutes}m ${seconds}s`;
    }
}

export function ssToHMS(seconds) {
    let hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    let minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
    if (minutes.toString().length === 1) {
        minutes = `0${minutes}`;
    }
    seconds = seconds % 60;
    seconds = Math.floor(seconds);
    if (seconds.toString().length === 1) {
        seconds = `0${seconds}`;
    }

    if (hours.toString().length === 1 && hours !== 0) {
        return `0${hours}` + "h " + minutes + "m " + seconds + "s";
    } else {
        return `${minutes}m ${seconds}s`;
    }
}

export function ssToHMSUnformatedd(seconds) {
    let hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    let minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute

    seconds = seconds % 60;
    seconds = Math.floor(seconds);
    if (seconds.toString().length > 0 && seconds >= 1) {
        return `${seconds} ${seconds === 1 ? "segundo" : "segundos"}`;
    }

    if (minutes.toString().length > 0 && minutes >= 1) {
        return `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    }

    // //format the hours to days if needed
    // if (hours > 24) {
    //     let days = Math.floor(hours / 24);
    //     hours = hours % 24;
    //     return `${days} ${days === 1 ? "dia" : "dias"}`;
    // }

    if (hours.toString().length > 0 && hours >= 1) {
        return `${hours} ${hours === 1 ? "hora" : "horas"}`;
    }
}

export function msToTime(duration) {
    // let milliseconds = parseInt(duration % 1000),
    // seconds = parseInt((duration / 1000) % 60),
    let minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    // seconds = seconds < 10 ? "0" + seconds : seconds;

    if (hours > 1) {
        return hours + ":" + minutes + " HORAS RESTANTES";
    } else {
        return minutes + " MINUTOS RESTATES";
    }
}

export function ssToMS(seconds, t, complete = false) {
    if (seconds < 60) {
        if (seconds === 1) {
            return `${seconds} ${t("pma.segundo")}`;
        }
        return Math.round(seconds) + `${complete ? ` ${t("pma.segundos")}` : ` ${t("pma.seg")}`}`;
    }

    const minutes = Math.round(seconds / 60);

    if (minutes === 1) {
        return `${minutes} ${complete ? ` ${t("pma.minuto")}` : ` ${t("min")}`}`;
    }

    return Math.round(seconds / 60) + `${complete ? ` ${t("pma.minutos")}` : ` ${t("min")}`}`;
}

export function mockOnChangeEvent({ name, value }) {
    return {
        target: {
            name,
            value,
        },
    };
}

export function parseMessage(msg) {
    const message = msg.bubble;
    const messageData = omit(msg, "bubble");
    const createdAt = dayjs(msg.createdAt).valueOf();

    const messageModel = {
        ...messageData,
        message,
        createdAt,
        id: msg.messageId,
    };

    return messageModel;
}

export function getTime(time, t) {
    if (time < "12:00") {
        return t("pma.Buenos dias");
    } else if (time >= "12:00" && time < "19:00") {
        return t("pma.Buenas tardes");
    } else if (time >= "19:00") {
        return t("pma.Buenas noches");
    }
}

// return true if isEmpty or if is full of space
export function onlySpaces(str) {
    return /^\s*$/.test(str);
}

export function getTranslatedMessage(obj) {
    if (!obj || !isObject(obj)) {
        return null;
    }

    const lang = localStorage.getItem("lang");

    try {
        const message = obj[lang];

        if (!message) {
            throw new Error("No message found.");
        }

        return message;
    } catch (error) {
        const key = Object.keys(obj)[0];
        return obj[key];
    }
}

export function emailsViewEnable(teams) {
    let permission;
    teams.map((team) => {
        const views = get(team, "properties.views", []);
        if (views.includes("emails")) {
            permission = true;
        }
    });
    return permission;
}

export function postsViewEnable(teams) {
    let permission;
    teams.map((team) => {
        const views = get(team, "properties.views", []);
        if (views.includes("posts")) {
            permission = true;
        }
    });
    return permission;
}

export function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
}

export function deepComparison(first, second) {
    /* Checking if the types and values of the two arguments are the same. */
    if (first === second) return true;

    /* Checking if any arguments are null */
    if (first === null || second === null) return false;

    /* Checking if any argument is none object */
    if (typeof first !== "object" || typeof second !== "object") return false;

    /* Using Object.getOwnPropertyNames() method to return the list of the objects’ properties */
    let first_keys = Object.getOwnPropertyNames(first);

    let second_keys = Object.getOwnPropertyNames(second);

    /* Checking if the objects' length are same*/
    if (first_keys.length !== second_keys.length) return false;

    /* Iterating through all the properties of the first object with the for of method*/
    for (let key of first_keys) {
        /* Making sure that every property in the first object also exists in second object. */
        if (!Object.hasOwn(second, key)) return false;

        /* Using the deepComparison function recursively (calling itself) and passing the values of each property into it to check if they are equal. */
        if (deepComparison(first[key], second[key]) === false) return false;
    }

    /* if no case matches, returning true */
    return true;
}

export const getTimeRelative = (createdAt, lang) => {
    const showAsRelativeTime = dayjs().diff(dayjs(createdAt), "hour") < 20;

    if (showAsRelativeTime) {
        return dayjs()
            .locale(lang || "es")
            .to(dayjs(createdAt));
    }

    return dayjs(createdAt).format(`DD/MM/YY HH:mm`);
};

export const checkIfOperatorIsOnline = (statusOperator) => {
    if (toUpper(statusOperator) === OPERATOR_STATUS.OFFLINE) {
        return true;
    }
    return false;
};


export const validateColorChromePicker = color => {
  return typeof color === 'string' ? color : rgba(color?.r,color?.g,color?.b,color?.a)
 }
