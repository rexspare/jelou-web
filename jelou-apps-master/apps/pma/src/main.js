import "./styles.scss";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";
import { Provider } from "react-redux";
import { Store } from "@apps/redux/store";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    // <StrictMode>
    <BrowserRouter>
        <Provider store={Store}>
            <App />
        </Provider>
    </BrowserRouter>
    // </StrictMode>
);
