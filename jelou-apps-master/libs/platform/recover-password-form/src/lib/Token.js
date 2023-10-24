import { setUrl } from "@apps/redux/store";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const Token = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setUrl(window.location.href));
        window.location.replace("/");
    });

    return <div></div>;
};

export default Token;
