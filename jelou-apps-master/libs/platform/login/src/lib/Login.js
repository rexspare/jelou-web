import { getUserSession, setSession, setUnauthorization } from "@apps/redux/store";
import { DashboardServer } from "@apps/shared/modules";
import axios from "axios";
import first from "lodash/first";
import get from "lodash/get";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";

export function AppsLogin(props) {
    const { setIsLogged } = props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(null);
    const session = useSelector((state) => state.session);
    const lang = localStorage.getItem("lang") === "null" ? "es" : localStorage.getItem("lang");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let config = {
        headers: { "Accept-Language": "es" },
    };

    useEffect(() => {
        localStorage.removeItem("jwt-master");
        localStorage.removeItem("company-master");
        localStorage.removeItem("master-id");
        localStorage.removeItem("user-master");
        isMounted.current = true;

        return () => (isMounted.current = false);
    }, []);

    const handleChange = ({ target }) => {
        const { value, name } = target;

        if (name === "email") {
            setEmail(value);
        }
        if (name === "password") {
            setPassword(value);
        }
    };

    const handleSocialRes = async (sesionData) => {
        try {
            const resp = await DashboardServer.post(`/auth/login/social`, sesionData, config);
            const { data } = resp;
            localStorage.setItem("jwt", data.data.token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + data.data.token;
            axios.defaults.headers.common["Accept-Language"] = "es";
            setLoading(false);
            setSession(true);
            setIsLogged(true);
            // Controlling memory leak
            if (isMounted.current) {
                setErrors(data.message[0]);
            }
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const { message, email } = data;
            setLoading(false);
            setErrors(first(message) || first(email));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const dataIn = {
            email,
            password,
        };

        try {
            dispatch(setUnauthorization(false));
            const resp = await DashboardServer.post(`/auth/login`, dataIn, config);
            const { data } = resp;
            localStorage.setItem("jwt", get(data, "data.token", ""));
            localStorage.setItem("session", get(data, "data.user.sessionId", ""));
            localStorage.setItem("user", get(data, "data.user.names", ""));
            axios.defaults.headers.common["Authorization"] = "Bearer " + data.data.token;
            axios.defaults.headers.common["Accept-Language"] = "es";
            axios.defaults.headers.common["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;

            setIsLogged(true);
            setLoading(false);
            dispatch(setSession());
            setIsLogged(true);

            dispatch(getUserSession());
            navigate("/home");

            // Controlling memory leak
            if (isMounted.current) {
                const { data } = resp;
                setErrors(data);
            }
        } catch (error) {
            const { response } = error;
            const { data } = response;
            const { message } = data;
            setLoading(false);
            setErrors(get(data, "error.clientMessages", ""));
        }
    };

    if (session) {
        return <Navigate from="" to="/home" noThrow />;
    }

    return (
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-white">
            <LoginForm {...props} handleSubmit={handleSubmit} handleChange={handleChange} errors={errors} isLoading={loading} handleSocialRes={handleSocialRes} />
        </div>
    );
}

export default AppsLogin;
