import axios from "axios";

import { JelouApiV1 } from "@apps/shared/modules";

/**
 * this function delete a conversation by id
 * @param {{
 * conversationId: string,
 * companyId: string,
 * reason: string
 * }} props each property is required
 * - conversationId: is the id of the conversation to delete
 * - companyId: is the id of the company
 * - reason: is the reason to delete the conversation
 */
export async function deleteConversation({ conversationId, companyId, reason }) {
  try {
    const { data, status } = await JelouApiV1.delete(`/companies/${companyId}/conversations/${conversationId}`, {
      params: { reason },
    });

    if (status === 200) return data;

    return Promise.reject("Error al eliminar conversación");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const messageError = error.message;
      return Promise.reject(messageError);
    }
    return Promise.reject("Error al eliminar conversación");
  }
}
