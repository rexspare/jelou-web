import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { JelouApi } from "@apps/shared/constants";
import { JelouApiV1 } from "@apps/shared/modules";
import { setCompany, setCurrentRoom } from "@apps/redux/store";

export function useInformaction() {
    const dispatch = useDispatch();
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    const getCurrentRoom = async ({ botId, conversationId }) => {
        try {
            const response = await JelouApiV1.get(`/bots/${botId}/conversations/${conversationId}`);

            if (response.status === 200) {
                dispatch(setCurrentRoom(response.data.data));
                return response.data.data;
            }

            if (response.status === 404) {
                throw response.data.message[0];
            }

            throw new Error(response.statusText);
        } catch (error) {
            throw error.response?.data?.error?.clientMessages[lang] || error;
        }
    };

    const getCompany = async () => {
        try {
            JelouApi.getCompany()
                .then((response) => {
                    const { data } = response;
                    if (!isEmpty(data)) {
                        dispatch(setCompany(data));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    };
    return { getCurrentRoom, getCompany };
}
