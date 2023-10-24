import React from "react";
import { useTranslation } from "react-i18next";

import toUpper from "lodash/toUpper";
import { useSelector } from "react-redux";

const OperatorViewIcon = (props) => {
    const { t } = useTranslation();
    const statusOperator = useSelector((state) => state.statusOperator);
    const pmaNotifications = useSelector((state) => state.pmaNotifications);
    const rooms = useSelector((state) => state.rooms);
    const url = window.location.pathname;
    const filteredRooms = rooms.filter((room) => room.type === "client");

    const statusDot = (status) => {
        switch (toUpper(statusOperator)) {
            case "ONLINE":
                return "#67AB2D";
            case "BUSY":
                return "#D39C00";
            case "OFFLINE":
                return "#A83927";
            default:
                return "#727C94";
        }
    };

    const sidebarNotification = () => {
        if (url.startsWith("/pma")) {
            if (filteredRooms.length > 0) {
                return (
                    <div className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-675 text-11 text-white">
                        {filteredRooms.length}
                    </div>
                );
            }
        } else if (pmaNotifications > 0)
            return (
                <div className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-675 text-11 text-white">
                    {pmaNotifications}
                </div>
            );
    };

    return (
        <div className="relative flex flex-col items-center">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8.07329 14.8384H7.25298C6.35015 14.8384 5.61721 13.9372 5.61721 12.8328C5.61721 11.7259 6.35015 10.8248 7.25298 10.8248H7.73837V11.7987H7.25298C6.8768 11.7987 6.55887 12.2706 6.55887 12.8303C6.55887 13.3901 6.8768 13.8619 7.25298 13.8619H8.07329V14.8384Z"
                    fill="#727C94"
                />
                <path
                    d="M19.9266 14.8384H20.7469C21.6497 14.8384 22.3827 13.9372 22.3827 12.8328C22.3827 11.7259 21.6497 10.8248 20.7469 10.8248H20.2615V11.7987H20.7469C21.1231 11.7987 21.441 12.2706 21.441 12.8303C21.441 13.3901 21.1231 13.8619 20.7469 13.8619H19.9266V14.8384Z"
                    fill="#727C94"
                />
                <path
                    d="M16.5919 15.8549V14.881C17.5627 14.881 18.3321 14.5949 18.8733 14.0326C19.8004 13.0713 19.8295 11.5251 19.8295 11.51L20.7445 11.5653C20.7445 11.6431 20.7493 13.4578 19.5455 14.7154C18.8223 15.4709 17.8273 15.8549 16.5919 15.8549Z"
                    fill="#727C94"
                />
                <path
                    d="M15.0824 17.1325C13.9902 17.1325 13.102 16.3419 13.102 15.368C13.102 14.3966 13.9902 13.6034 15.0824 13.6034C16.1745 13.6034 17.0628 14.3941 17.0628 15.368C17.0628 16.3419 16.1745 17.1325 15.0824 17.1325ZM15.0824 14.5798C14.5193 14.5798 14.0436 14.9413 14.0436 15.368C14.0436 15.7972 14.5193 16.1586 15.0824 16.1586C15.6454 16.1586 16.1211 15.7972 16.1211 15.368C16.1211 14.9413 15.6454 14.5798 15.0824 14.5798Z"
                    fill="#727C94"
                />
                <path
                    d="M7.7675 11.3996L7.63159 10.4357C10.6799 9.97641 12.7889 8.9498 13.8956 7.37851C14.8931 5.96536 14.6892 4.62751 14.6819 4.57229L15.609 4.40412C15.6211 4.4744 15.8978 6.17369 14.6746 7.92821C13.4175 9.73293 11.0924 10.9001 7.7675 11.3996Z"
                    fill="#727C94"
                />
                <path
                    d="M19.0529 11.5678C15.4974 11.5678 13.8373 7.94829 13.8203 7.90813L14.6746 7.499C14.7474 7.65713 16.4706 11.377 20.2275 10.4433L20.4459 11.3896C19.9533 11.5151 19.4897 11.5678 19.0529 11.5678Z"
                    fill="#727C94"
                />
                <path
                    d="M13.9999 18.7641C10.2648 18.7641 7.22871 15.4533 7.22871 11.382C7.22871 7.31074 10.2673 4 13.9999 4C17.735 4 20.7712 7.31074 20.7712 11.382C20.7712 15.4533 17.735 18.7641 13.9999 18.7641ZM13.9999 4.9739C10.7842 4.9739 8.17037 7.84789 8.17037 11.382C8.17037 14.9162 10.7842 17.7902 13.9999 17.7902C17.2157 17.7902 19.8295 14.9162 19.8295 11.382C19.8295 7.84789 17.2157 4.9739 13.9999 4.9739Z"
                    fill="#727C94"
                />
                <path
                    d="M4.0227 24C4.01299 23.9322 3.81398 22.3559 4.80175 21.1837C5.46674 20.3931 6.48363 19.994 7.82817 19.994C8.91545 19.994 9.67994 19.7179 10.1022 19.1757C10.6701 18.4428 10.4566 17.4111 10.4541 17.4011L11.3715 17.1827C11.3861 17.243 11.6943 18.6687 10.8449 19.7756C10.2357 20.5688 9.22125 20.9704 7.82817 20.9704C6.77487 20.9704 5.99582 21.2565 5.5177 21.8213C4.81146 22.6521 4.96921 23.9874 4.96921 24H4.0227Z"
                    fill="#727C94"
                />
                <path
                    d="M14.0436 22.9282L10.2114 19.8082L10.7939 19.0427L14.0242 21.6757L17.0531 19.0527L17.6574 19.8007L14.0436 22.9282Z"
                    fill="#727C94"
                />
                <path
                    d="M23.9772 24L23.1035 23.9975C23.1059 23.9875 23.1908 22.6496 22.4846 21.8188C22.0065 21.254 21.2299 20.9679 20.1741 20.9679C18.781 20.9679 17.7666 20.5663 17.1598 19.7731C16.3104 18.6662 16.6186 17.2405 16.6332 17.1802L17.5506 17.4011L17.0919 17.2907L17.5506 17.3986C17.5482 17.4086 17.3346 18.4403 17.9025 19.1732C18.3248 19.7179 19.0893 19.9915 20.1765 19.9915C21.5187 19.9915 22.538 20.3931 23.203 21.1812C24.1859 22.3559 23.9869 23.9322 23.9772 24Z"
                    fill="#727C94"
                />
                <circle cx="14" cy="14" r="13.5" strokeWidth="1.2" stroke={statusDot(statusOperator)} />
                <circle cx="24" cy="24" r="4.5" fill={statusDot(statusOperator)} stroke={"#F3FAF5"} />
            </svg>
            {sidebarNotification()}

            <p className="mt-1 text-center text-[0.5rem] leading-3 md:text-[0.6rem]">{t("sideBar.pma")}</p>
            {/* {<StatusDot status={statusOperator} />} */}
        </div>
    );
};
export default OperatorViewIcon;
