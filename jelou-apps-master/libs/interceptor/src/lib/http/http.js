import { DashboardServer, MetricServer, JelouApiV1, ImpersonateHttp, JelouApiPma, JelouPaymentAPI } from "@apps/shared/modules";
import has from "lodash/has";
import { Store, setUnauthorization } from "@apps/redux/store";
import get from "lodash/get";

export function httpInterceptor() {
    DashboardServer.interceptors.request.use((config) => {
        const userSession = Store.getState().userSession;
        const timezone = get(userSession, "timezone", "America/Guayaquil");
        return {
            ...config,
            headers: {
                timezone,
                "Accept-Language": "es",
                ...(config.Authorization ? { Authorization: config.Authorization } : { Authorization: `Bearer ${localStorage.getItem("jwt")}` }),
                ...config.headers,
            },
        };
    });
    DashboardServer.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (has(error, "response.status") && error.response.status === 401) {
                Store.dispatch(setUnauthorization(true));
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );
}

export function dashInterceptor() {
    JelouApiV1.interceptors.request.use((config) => {
        const userSession = Store.getState().userSession;
        const timezone = get(userSession, "timezone", "America/Guayaquil");
        return {
            ...config,
            headers: {
                timezone: timezone,
                "Accept-Language": "es",
                ...(config.Authorization ? { Authorization: config.Authorization } : { Authorization: `Bearer ${localStorage.getItem("jwt")}` }),
                ...config.headers,
            },
        };
    });
    JelouApiV1.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (has(error, "response.status") && error.response.status === 401) {
                Store.dispatch(setUnauthorization(true));
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );
}
export function metricsInterceptor() {
    MetricServer.interceptors.request.use((config) => {
        const userSession = Store.getState().userSession;
        const timezone = get(userSession, "timezone", "America/Guayaquil");
        return {
            ...config,
            headers: {
                timezone,
                "Accept-Language": "es",
                ...(config.Authorization ? { Authorization: config.Authorization } : { Authorization: `Bearer ${localStorage.getItem("jwt")}` }),
                ...config.headers,
            },
        };
    });
    MetricServer.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (has(error, "response.status") && error.response.status === 401) {
                Store.dispatch(setUnauthorization(true));
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );
}

export function impersonateInterceptor() {
    ImpersonateHttp.interceptors.request.use((config) => {
        const userSession = Store.getState().userSession;
        const timezone = get(userSession, "timezone", "America/Guayaquil");
        return {
            ...config,
            headers: {
                timezone,
                ...config.headers,
            },
        };
    });
    ImpersonateHttp.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (get(error, "response.status") === 401) {
                Store.dispatch(setUnauthorization(true));
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );
}

export function pmaInterceptor() {
    JelouApiPma.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (get(error, "response.status") === 401) {
                Store.dispatch(setUnauthorization(true));
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );
}

export function jelouShopInterceptor() {
    JelouApiPma.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (get(error, "response.status") === 401) {
                Store.dispatch(setUnauthorization(true));
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );
}

export function jelouPaymentInterceptor() {
    JelouPaymentAPI.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (get(error, "response.status") === 401) {
                Store.dispatch(setUnauthorization(true));
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );
}
