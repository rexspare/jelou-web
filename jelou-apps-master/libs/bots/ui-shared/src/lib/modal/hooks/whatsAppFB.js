import axios from "axios";
import { systemUserAccessTokenWS } from "@apps/shared/modules";

// Facebook Login with JavaScript SDK
export function launchWhatsAppSignup() {
    // Conversion tracking code
    // fbq && fbq("trackCustom", "WhatsAppOnboardingStart", { appId: facebookAppId, feature: "whatsapp_embedded_signup" });

    // Launch Facebook login
    return new Promise((resolve, reject) => {
        window.FB.login(
            function (response) {
                if (response.authResponse) {
                    console.log("~ response.authResponse", response.authResponse);
                    const { accessToken } = response.authResponse;
                    handleGetWABAS(accessToken).then(({ status, data }) => {
                        if (status) {
                            resolve(data);
                        } else {
                            reject(data);
                        }
                    });
                    //Use this token to call the debug_token API and get the shared WABA's ID
                } else {
                    reject("User cancelled login or did not fully authorize");
                    console.log("User cancelled login or did not fully authorize.");
                }
            },
            {
                scope: "business_management,whatsapp_business_management",
                extras: {
                    feature: "whatsapp_embedded_signup",
                    // setup: {
                    //   ... // Prefilled data can go here
                    // }
                },
            }
        );
    });
}

const handleGetWABAS = async (accessToken) => {
    // curl -i -X GET "https://graph.facebook.com/v14.0/
    // debug_token?input_token=token-returned-from-signup-flow&
    // access_token=system-user-access-token"

    try {
        const response = await axios.get(
            `https://graph.facebook.com/v14.0/debug_token?input_token=${accessToken}&access_token=${systemUserAccessTokenWS}`
        );
        // console.log("handleWABA", { response: response.data });
        return { status: true, data: response.data };
    } catch (error) {
        console.log("handleWABA - error", { error });
        return { status: false, data: error };
    }
};
