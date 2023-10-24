import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const SSO = () => {
    const { token } = useParams();

    useEffect(() => {
        AzureLogin();
    }, []);

    const AzureLogin = async () => {
        try {
            // const { data: res } = await axios.get(`https://api.apps.jelou.ai/api/auth/me_apps`, {
            const { data: res } = await axios.get(`https://apiapps.01lab.co/api/auth/me_apps`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { data } = res;
            const jwt = data.token;

            localStorage.setItem("jwt", jwt);

            if (localStorage.getItem("jwt")) {
                return (window.location = "/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex h-screen flex-col justify-center">
            <div className="text-center text-2xl font-bold text-primary-200">Ingresando...</div>
        </div>
    );
};

export default SSO;
