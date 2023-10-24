import { JelouApiV2 } from "@apps/shared/modules";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export function useRowData() {
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const createData = useCallback(async ({ databaseId, data }) => {
        if (!data || !databaseId) throw new Error("Invalid data");

        try {
            const response = await JelouApiV2.post(`/databases/${databaseId}/rows`, data);
            if (response.status === 200) return { row: response.data.data, message: response.data.message };

            const { error, message } = response.data;
            if (response.status === 404) {
                throw error.clientMessages[lang];
            }
            throw message[0];
        } catch (error) {
            if (error?.response) {
                const { clientMessages = {} } = error.response?.data?.error || {};
                throw clientMessages[lang] ?? error;
            }
            console.error("file: rowData.js ~ line 19 ~ createData ~ error", error);
            throw error;
        }
    }, []);

    const deleteData = useCallback(async ({ databaseId, rowId }) => {
        if (!databaseId || !rowId) throw new Error("Invalid data");

        try {
            const response = await JelouApiV2.delete(`/databases/${databaseId}/rows/${rowId}`);
            if (response.status === 200) return { message: response.data.message[0] };

            const { error, message } = response.data;
            if (response.status === 404) {
                throw error.clientMessages[lang];
            }
            throw message[0];
        } catch (error) {
            if (error?.response) {
                const { clientMessages = {} } = error.response?.data?.error || {};
                throw clientMessages[lang] ?? error;
            }
            console.error("error", error);
            throw error;
        }
    }, []);

    const updateData = useCallback(async ({ databaseId, rowId, data }) => {
        if (!databaseId || !rowId || !data) throw new Error("Invalid data");

        try {
            const response = await JelouApiV2.put(`/databases/${databaseId}/rows/${rowId}`, data);
            if (response.status === 200) return { row: response.data.data, message: response.data.message };
            const { error, message } = response.data;
            if (response.status === 404) {
                throw error.clientMessages[lang];
            }
            throw message[0];
        } catch (error) {
            if (error?.response) {
                const { clientMessages = {} } = error.response?.data?.error || {};
                throw clientMessages[lang] ?? error;
            }
            console.log("file: rowData.js ~ line 57 ~ updateData ~ error", { error });
            throw error;
        }
    }, []);

    const getRowOfTable = useCallback(async ({ databaseId, limit, page, paramsFilters = {} } = {}) => {
        if (!databaseId) throw new Error("Invalid data");

        try {
            const response = await JelouApiV2.get(`/databases/${databaseId}/rows`, {
                params: { page, limit, ...paramsFilters },
            });

            if (response.status === 200) {
                const { results, pagination } = response.data;
                return { results, pagination };
            }

            const { error, message } = response.data;
            if (response.status === 404) {
                throw error.clientMessages[lang];
            }
            throw message[0];
        } catch (error) {
            if (error?.response) {
                const { clientMessages = {} } = error.response?.data?.error || {};
                throw clientMessages[lang] ?? error;
            }
            console.error("🚀 ~ file: rowData.js ~ line 58 ~ getRowOfTable ~ error", error);
            throw error;
        }
    }, []);

    return { createData, deleteData, updateData, getRowOfTable };
}
