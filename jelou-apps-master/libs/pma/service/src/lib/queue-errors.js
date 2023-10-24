import * as Sentry from "@sentry/react";
import dayjs from "dayjs";

export function addToQueue(error) {
    const obj = {
        message: error,
        timestamp: dayjs().format(),
    };
    localStorage.setItem("error", JSON.stringify(obj));
}

export function processQueue() {
    const error = localStorage.getItem("error");

    if (error) {
        const { message, timestamp } = JSON.parse(error);
        Sentry.configureScope(function (scope) {
            const user = JSON.parse(localStorage.getItem("operator"));
            scope.setUser(user);
            scope.setExtra("dateTime", timestamp);
        });

        Sentry.captureException(new Error(message));
    }
}
