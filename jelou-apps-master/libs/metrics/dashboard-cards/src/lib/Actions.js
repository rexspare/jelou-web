import React from "react";

const Actions = (props) => {
    const { findUser, t } = props;

    return (
        <div className="flex justify-end gap-3">
            <div className="relative flex overflow-hidden rounded-[7px]">
                <div className="absolute top-0 bottom-0 left-0 ml-4 flex items-center">
                    <div className="flex flex-col items-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1.82905 10.6724C-0.610401 8.23419 -0.610352 4.26689 1.82905 1.82867C4.26856 -0.609555 8.2379 -0.609555 10.6774 1.82867C12.7469 3.89717 13.0604 6.97355 11.6185 9.37588C11.6185 9.37588 11.5149 9.54955 11.6548 9.68925C12.4528 10.4868 14.847 12.8797 14.847 12.8797C15.4823 13.5147 15.6336 14.4027 15.0702 14.9659L14.9731 15.0628C14.4097 15.626 13.5212 15.4749 12.8859 14.8398C12.8859 14.8398 10.4968 12.452 9.70048 11.6561C9.55389 11.5096 9.38018 11.6131 9.38018 11.6131C6.97664 13.0541 3.89864 12.7409 1.82905 10.6724ZM9.52225 9.51787C11.3248 7.71628 11.3247 4.78491 9.5222 2.98331C7.71966 1.18176 4.78675 1.18171 2.98426 2.98331C1.18171 4.78486 1.18171 7.71628 2.98426 9.51787C4.7868 11.3194 7.71966 11.3194 9.52225 9.51787Z"
                                fill="#727C94"
                                fillOpacity="0.75"
                            />
                        </svg>
                    </div>
                </div>

                <input
                    id="finder"
                    className="input border-transparent pl-14 text-sm text-gray-500 ring-transparent focus:border-transparent focus:ring-transparent"
                    type="search"
                    placeholder={t("plugins.Buscar")}
                    onChange={findUser}
                />
            </div>

            <svg className="hidden" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0 7C0 3.13401 3.13401 0 7 0H33C36.866 0 40 3.13401 40 7V33C40 36.866 36.866 40 33 40H7C3.13401 40 0 36.866 0 33V7Z"
                    fill="rgba(0, 179, 199, 0.65)"
                    fillOpacity="none"
                />
                <rect x="9.75" y="9.75" width="7.3" height="7.3" rx="1.25" stroke="white" strokeWidth="1.5" />
                <rect x="9.75" y="22.95" width="7.3" height="7.3" rx="1.25" stroke="white" strokeWidth="1.5" />
                <rect x="22.95" y="9.75" width="7.3" height="7.3" rx="1.25" stroke="white" strokeWidth="1.5" />
                <rect x="22.95" y="22.95" width="7.3" height="7.3" rx="1.25" stroke="white" strokeWidth="1.5" />
            </svg>
            <svg className=" hidden" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0 7C0 3.13401 3.13401 0 7 0H33C36.866 0 40 3.13401 40 7V33C40 36.866 36.866 40 33 40H7C3.13401 40 0 36.866 0 33V7Z"
                    fill="white"
                />
                <rect x="8" y="11" width="24" height="4" rx="2" fill="#727C94" fillOpacity="none" />
                <rect x="8" y="18" width="24" height="4" rx="2" fill="#727C94" fillOpacity="none" />
                <rect x="8" y="25" width="24" height="4" rx="2" fill="#727C94" fillOpacity="none" />
            </svg>
        </div>
    );
};

export default Actions;
