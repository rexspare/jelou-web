import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { HTTP_BRAIN } from "../../http-brain";
import { Brains } from "../domain/brain";

type Link = {
    first: string;
    last: string;
    prev: null;
    next: string;
};

type Response<T> = {
    data: T;
    links: Link;
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Link[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
};

export function useOneDatastore() {
    const { datastoreId } = useParams();
    const navigate = useNavigate();
    const getBrain = async () => {
        if (!HTTP_BRAIN) throw new Error("HTTP_BRAIN is not defined");
        try {
            const { data } = await HTTP_BRAIN.get<Response<Brains>>(`/brains/${datastoreId}`);
            return data.data;
        } catch (error: any) {
            const statusCode: number = error.response.status;
            if (statusCode > 400 && statusCode < 500) navigate("/NotFound" + statusCode.toString());
            return null;
        }
    };

    return useQuery(["datastore", datastoreId], getBrain, {
        enabled: Boolean(datastoreId),
        refetchOnWindowFocus: false,
    });
}
