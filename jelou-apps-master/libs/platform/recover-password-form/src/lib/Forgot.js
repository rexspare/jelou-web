import get from "lodash/get";
import first from "lodash/first";
import React, { useState } from "react";

import ForgotForm from "./components/ForgotForm";
import { LoginImage } from "@apps/platform/login";
import { DashboardServer } from "@apps/shared/modules";

const { NX_REACT_APP_BASE_URL } = process.env;

const Forgot = (props) => {
    const lang = localStorage.getItem("lang");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState("");
    const [success] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const dataIn = {
            email,
            baseUrl: NX_REACT_APP_BASE_URL,
        };

        try {
            const resp = await DashboardServer.post(`/auth/recover/password`, dataIn);
            const { data } = resp;
            if (data.status === 1) {
                setLoading(false);
                setErrors("");
                setEmail("");
                setFeedback(first(data.message));
            } else {
                const msg = get(data, "error.developerMessages", {});
                setLoading(false);
                setErrors(get(msg, `${lang}`, "El correo no está registrado"));
            }
        } catch (error) {
            const { response } = error;
            const msg = get(response, "data.error.developerMessages", {});
            setLoading(false);
            setErrors(get(msg, `${lang}`, "El correo no está registrado"));
        }
    };

    const handleChange = ({ target }) => {
        const value = target.value;
        const name = target.name;
        if (name === "email") {
            setEmail(value);
        }
        setErrors([]);
    };

    return (
        <div className="flex h-screen min-h-screen bg-white">
            <ForgotForm
                {...props}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                errors={errors}
                success={success}
                loading={loading}
                feedback={feedback}
            />
            <div className="relative hidden items-center justify-center md:flex md:flex-1">
                <LoginImage></LoginImage>
            </div>
        </div>
    );
};
export default Forgot;
