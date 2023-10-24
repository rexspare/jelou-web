import { SectionWrapper, UnauthorizedPage } from "@apps/shared/common";
import { AccessControl } from "@apps/shared/jelou-ui";
import Immutable from "immutable";
import linkifyHtml from "linkify-html";
import castArray from "lodash/castArray";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AuthRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem("jwt");

    const { allowedPermission, permissions } = rest;

    if (rest.path === "/" && allowedPermission !== null && allowedPermission === "home" && isAuthenticated) {
        return <Navigate from="/" to="/home" replace />;
    }
    if (isAuthenticated && allowedPermission) {
        return (
            <AccessControl allowedPermission={allowedPermission} renderNoAccess={UnauthorizedPage} permissions={permissions}>
                <div className="flex">
                    <SectionWrapper>
                        <Component {...rest} />
                    </SectionWrapper>
                </div>
            </AccessControl>
        );
    }

    return <Navigate from="" to="/login" replace />;
};

export const AuthRoutePMA = ({ component: Component, ...rest }) => {
    const unauthorized = useSelector((state) => state.unauthorized);
    if (!isEmpty(localStorage.jwt) && !unauthorized) {
        if (rest.path === "/") {
            return <Navigate replace to="/chats" />;
        }
        return <Component {...rest} />;
    } else {
        return <Navigate replace to="/login" />;
    }
};

export function createMarkup(html) {
    return { __html: linkifyHtml(html, { target: "_blank" }) };
}

export function formatMessage(message = "", style) {
    const parsedMessage = message
        .replace(/\*(.+?)\*/g, "<b>$1</b>")
        .replace(/ _(.+?)_ /g, "<i>$1</i>")
        .replace(/ ~(.+?)~ /g, "<strike>$1</strike>")
        .replace(/ ```(.+?)``` /g, "<tt>$1</tt>")
        .trim();

    return (
        <div
            className={style || "max-w-full whitespace-pre-wrap break-words text-13 font-semibold leading-6"}
            dangerouslySetInnerHTML={createMarkup(parsedMessage)}
        />
    );
}

export const keyById = function keyById(data, key = null) {
    if (!Array.isArray(data)) {
        data = [data];
    }

    data = data.map((item) => {
        return {
            ...item,
        };
    });

    return Immutable.fromJS(data)
        .toMap()
        .mapEntries(function ([, value]) {
            return [value.get(key || "id"), value];
        });
};

export const mergeById = function mergeById(state, payload, key = null) {
    const arr = castArray(payload);
    return keyById(state, key).merge(keyById(arr, key)).toList().toJS();
};

export const groupArrayOfObjects = function groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
