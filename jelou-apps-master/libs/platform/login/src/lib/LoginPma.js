import { getUserSession, logInUser, setSession, setStatusOperator, setUnauthorization } from "@apps/redux/store";
import { DashboardServer } from "@apps/shared/modules";
import axios from "axios";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoginFormPma from "./components/LoginFormPma";
import LoginImage from "./components/LoginImage";

const LoginPma = (props) => {
    const { setIsLogged } = props;
    const dispatch = useDispatch();
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { t } = useTranslation();
    const formRef = useRef(null);
    const _isMounted = useRef(null);

    function clearData() {
        formRef.current.reset();
    }

    useEffect(() => {
        _isMounted.current = true;
        return () => (_isMounted.current = false);
    }, []);

    let config = {
        headers: { "Accept-Language": "es" },
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isEmpty(email) || isEmpty(password)) {
            setErrors(t("login.errorMiss"));
            clearData();
            return;
        }
        setLoading(true);
        const dataIn = {
            email,
            password,
            setOnline: true,
        };
        try {
            // dispatch(logInUser(dataIn));
            const resp = await DashboardServer.post(`/auth/login`, dataIn, config);
            // DashboardServer.post(`/auth/login`, dataIn).then(({ data: resp }) => {
            const { data } = resp;

            if (!isEmpty(data)) {
                localStorage.setItem("jwt", data.data.token);

                try {
                    window.JSBridge.sendTokenNative(data.data.user.providerId, data.data.token); // Android
                } catch (error) {
                    console.log("Error on native Android:", error);
                }

                try {
                    window.webkit.messageHandlers.jsMessageHandler.postMessage({ userId: data.data.user.providerId, token: data.data.token }); //iOS
                } catch (error) {
                    console.log("Error on native IOS:", error);
                }

                // Set headers for axios
                axios.defaults.headers.common["Authorization"] = "Bearer " + data.data.token;
                axios.defaults.headers.common["Accept-Language"] = "es";
                axios.defaults.headers.common["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
                localStorage.setItem("operator", JSON.stringify(omit(data.data.User, ["Company"])));
                dispatch(setSession());
                setIsLogged(true);
                dispatch(setStatusOperator("online"));
                dispatch(setUnauthorization(false));
                dispatch(getUserSession());
            }

            // });
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            const { response } = error;
            // const { data } = response;
            // const { message } = data;
            // setErrors(first(message));
        }
    };

    const handleChange = ({ target }) => {
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
        setErrors([]);
    };

    const unauthorized = useSelector((state) => state.unauthorized);
    const session = useSelector((state) => state.session);

    if (session && !unauthorized) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen min-h-screen bg-white">
            <LoginFormPma {...props} handleSubmit={handleSubmit} handleChange={handleChange} errors={errors} isLoading={loading} formRef={formRef} />
            <div className="relative hidden items-center justify-center mid:flex mid:flex-1">
                <LoginImage></LoginImage>
            </div>
        </div>
    );
};

export default LoginPma;
