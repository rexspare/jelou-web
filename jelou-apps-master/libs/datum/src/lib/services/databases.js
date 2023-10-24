import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { BASE_URI } from "../constants";
import { JelouApiV2 } from "@apps/shared/modules";
import { renderMessage } from "@apps/shared/common";
import { setDatabases } from "@apps/redux/store";
import axios from "axios";
import { MESSAGE_TYPES } from "@apps/shared/constants";

export function useDataBases() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const getDataBases = useCallback(async ({ isFavorite = false } = {}) => {
        try {
            const { data, status } = await JelouApiV2.get(
                `/databases?isFavorite=${isFavorite}&sortBy=createdAt&schemaType=jsonschema&shouldPaginate=false`
            );
            if (status === 200) return data.data || [];

            throw data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data ?? error.message;
            }
            throw error;
        }
    }, []);

    const LoadAllDatabases = useCallback(async () => {
        return Promise.allSettled([getDataBases(), getDataBases({ isFavorite: true })])
            .then(([databasesNotFavorite, databasesFavorite]) => {
                if (databasesNotFavorite.status === "fulfilled" && databasesFavorite.status === "fulfilled") {
                    dispatch(setDatabases([...databasesFavorite.value, ...databasesNotFavorite.value]));
                    return;
                }
                dispatch(setDatabases([]));
                renderMessage(databasesNotFavorite.reason ?? databasesFavorite.reason, MESSAGE_TYPES.ERROR);
            })
            .catch(() => {
                renderMessage(t("datum.error.loadingDB"), MESSAGE_TYPES.ERROR);
                dispatch(setDatabases([]));
            });
    }, []);

    const setFavoriteDatabaes = useCallback(async ({ databaseId, isFavorite }) => {
        try {
            const response = await JelouApiV2.patch(`/databases/${databaseId}/favorite`, {
                isFavorite,
            });

            if (response.status === 200) {
                const { data, message } = response.data;
                return { data, message: message[0] };
            }

            const { error, message } = response.data;
            if (response.status === 500) {
                throw error.clientMessages[lang];
            }

            throw message[0];
        } catch (error) {
            console.error("🚀 ~ file: databases.js ~ line 63 ~ setFavoriteDatabaes ~ error", error);
            throw error;
        }
    }, []);

    const getOneDatabase = useCallback(async ({ databaseId }) => {
        try {
            const response = await JelouApiV2.get(`/databases/${databaseId}`);

            if (response.status === 200) {
                const { data } = response.data;
                return data;
            }

            const { error, message } = await response.data;
            if (response.status === 500) {
                throw error.clientMessages[lang];
            }

            throw message[0];
        } catch (error) {
            console.error("🚀 ~ file: databases.js ~ line 91 ~ getOneDatabase ~ error", error);
            throw error;
        }
    }, []);

    const deleteDatabase = useCallback(async ({ databaseId }) => {
        try {
            const response = await JelouApiV2.delete(`${BASE_URI}/databases/${databaseId}`);

            if (response.status === 200) {
                return response.data;
            }

            const { error, message } = response.data;

            if (response.status === 500) {
                throw new Error("500 - Internal Server Error");
            }

            if (response.status === 404) {
                throw error.clientMessages[lang];
            }
            throw message[0];
        } catch (error) {
            console.error("🚀 ~ file: databases.js ~ line 118 ~ deleteDatabase ~ error", error);
            throw error;
        }
    }, []);

    const updateNameDescrDb = useCallback(async ({ databaseId, name, description }) => {
        if (!databaseId || !name) throw new Error("Missing parameters");

        try {
            const response = await JelouApiV2.patch(`/databases/${databaseId}`, { name, description });

            if (response.status === 200) {
                const { data: databaseUpdated, message } = response.data;
                return { message: message[0], databaseUpdated };
            }

            if (response.status === 404) {
                throw response.data?.error?.clientMessages[lang] || "Hubo un error al actualizar el nombre de la base de datos";
            }
            throw response.data;
        } catch (error) {
            console.error("update name of data bases", { error });
            throw error;
        }
    }, []);

    const createDatabase = useCallback(async ({ database }) => {
        if (!database) throw new Error("Missing parameters");

        try {
            const response = await JelouApiV2.post("/databases", { ...database });

            if (response.status === 200) {
                const { data: databaseCreated, message } = response.data;
                return { message: message[0], databaseCreated };
            }

            const { error, message } = await response.json();
            if (response.status === 404) {
                throw error.clientMessages[lang];
            }
            if (response.status === 500) {
                const error = "Tuvimos un error";
                throw error;
            }
            throw message[0];
        } catch (error) {
            console.error("create database", { error });
            throw error;
        }
    }, []);

    return {
        deleteDatabase,
        getDataBases,
        getOneDatabase,
        LoadAllDatabases,
        setFavoriteDatabaes,
        updateNameDescrDb,
        createDatabase,
    };
}
