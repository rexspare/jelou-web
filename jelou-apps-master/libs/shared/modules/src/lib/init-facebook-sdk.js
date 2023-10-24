import { accountService } from "./account.service";

//const facebookAppId = "246870340218279"; // Local
// const facebookAppId = "1942880685850947"; // prod

// these tokens are for facebook and instagram logins (jelou app - devlab)
export const facebookAppId = "358763682688306";
export const appSecretFB = "aee5ba7b09c339070e3c840dbc2d4607";
// export const systemUserAccessToken =
//     "EAAFGSy3dbTIBAHBnQGAsXfZAT4kY5wRtqPfs7MjOjfaehotULnPOmolWWHzIJR3IGVCQkqJjmOURWQhMQ2UNOLHFm5FiRpJNpVga0iy9SnMjZAa08k9v9ThrZBDPWLE1MXAriW4hE8TAztsgQEgu7oEw2JGYwLAF57cBSA0rYpxcYuq8u75";
/**
 * These tokens are for WhatsApp Business embedded-signup flow (Jelou app - Jelou)
 */
const COMPANY_ID_BPS = 285;
export const facebookAppIdWS = "5860087694056512";
export const appSecretFBWS = "745898562f54b32573e3f0112bcdb81f";
export const systemUserAccessTokenWS =
    "EABTRtZC1bXEABAOMShZBuQijJuAsPhSNYYNiz4j25O87Uxu0uppwPXqib1bH1QgGmoDcrMZACJyo8f1e7ZAuzWwZCcCqW9cq8scZBNpbeMdonsSwM0qHxC2ZBWJZBtAEKZCOSaamTb2NHmO8kFz4WrvS7yddd6JrJK34kd8Ioz5OeCZCmjBkMPoToY";

export function initFacebookSdk({ companyId }) {
    return new Promise((resolve) => {
        // wait for facebook sdk to initialize before starting the react app
        window.fbAsyncInit = function () {
            const appId = companyId === COMPANY_ID_BPS ? facebookAppIdWS : facebookAppId;
            window.FB.init({
                appId,
                cookie: true,
                xfbml: true,
                version: "v14.0",
            });

            // auto authenticate with the api if already logged in with facebook
            window.FB.getLoginStatus(({ authResponse }) => {
                if (authResponse) {
                    accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
                } else {
                    resolve();
                }
            });
        };

        // load facebook sdk script
        (function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "facebook-jssdk");
    });
}
