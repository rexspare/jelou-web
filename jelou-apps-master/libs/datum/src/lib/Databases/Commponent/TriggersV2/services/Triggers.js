import axios from "axios";
import { t } from "i18next";
import { JelouApiV1 } from "@apps/shared/modules";

export const deleteTrigger = async ({ webhook = null, companyId = null } = {}) => {
    const { id: webhookId } = webhook;
    if (!companyId || !webhookId) {
        console.error("service ~ deleteTrigger", { companyId, webhookId });
        return Promise.reject(t("datum.triggers.services.delete.error"));
    }

    try {
        const { status } = await JelouApiV1.delete(`companies/${companyId}/webhooks/${webhookId}`);
        if (status === 200) return Promise.resolve(t("datum.triggers.services.delete.success"));
        return Promise.reject(t("datum.triggers.services.delete.error"));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(String(error.response.data));
        }
        const errorMessage = String(error?.message ?? error);
        return Promise.reject(errorMessage);
    }
};

export const createTrigger = async ({ webhook = null, companyId = null, lang = "es" } = {}) => {
    if (!companyId || !webhook) {
        console.error("service ~ createTrigger", { companyId, webhook });
        return Promise.reject(t("datum.triggers.services.create.error"));
    }

    try {
        const { status } = await JelouApiV1.post(`companies/${companyId}/webhooks`, webhook);
        if (status === 200) return Promise.resolve(t("datum.triggers.services.create.success"));
        return Promise.reject(t("datum.triggers.services.create.error"));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(error.response.data.error.clientMessages[lang]);
        }
        const errorMessage = String(error?.message ?? error);
        return Promise.reject(errorMessage);
    }
};

export const updateTrigger = async ({ webhook = null, companyId = null, updatedWebhook } = {}) => {
    const { id: webhookId } = webhook;
    if (!companyId || !webhookId) {
        console.error("service ~ updateTrigger", { companyId, webhookId });
        return Promise.reject(t("datum.triggers.services.update.error"));
    }

    try {
        const { status } = await JelouApiV1.put(`companies/${companyId}/webhooks/${webhookId}`, updatedWebhook);
        if (status === 200) return Promise.resolve(t("datum.triggers.services.update.success"));
        return Promise.reject(t("datum.triggers.services.update.error"));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return Promise.reject(String(error.response.data));
        }
        const errorMessage = String(error?.message ?? error);
        return Promise.reject(errorMessage);
    }
};
