// import { StrictMode } from "react";
import App from "./app/apps";
import "./styles.scss";

import { Store } from "@apps/redux/store";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import smoothscroll from "smoothscroll-polyfill";

smoothscroll.polyfill();

const queryClient = new QueryClient();
const root = createRoot(document.getElementById("root"));

root.render(
  // <StrictMode>
  <BrowserRouter>
    <Provider store={Store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} position={"bottom-right"} />
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
  // </StrictMode>
);
