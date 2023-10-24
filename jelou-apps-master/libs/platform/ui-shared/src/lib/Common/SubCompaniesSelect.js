import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Fuse from "fuse.js";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { Popover } from "@headlessui/react";
import { DEFAULT_LOGO } from "@apps/shared/constants";
import { InProcessIcon, SearchIcon, PlusIcon } from "@apps/shared/icons";
import { DebounceInput } from "react-debounce-input";
import { SyncLoader } from "react-spinners";
import { useNavigate, useMatch } from "react-router-dom";

const inputStyle = "input";

const SubCompaniesSelect = ({
    subCompanies,
    company,
    changeUserContext,
    setLoadingAvatar,
    loadingAvatar,
    deleteUserContext,
    setImpersonateCompany,
    location,
    t,
}) => {
    const [filterArray, setFilterArray] = useState(subCompanies);
    const match = useMatch("/metrics/:dash");
    const navigate = useNavigate();

    const companyId = get(company, "id");

    useEffect(() => {
        let currentArray = subCompanies;
        if (!isEmpty(localStorage.getItem("jwt-master"))) {
            currentArray = currentArray.filter((subcompany) => {
                return subcompany.id !== companyId;
            });
        }
        setFilterArray(currentArray);
    }, [company, subCompanies]);

    async function handleChange({ target }) {
        const { value } = target;
        const fuseOptions = {
            keys: ["name", "slug"],
            threshold: 0.3,
        };
        let currentArray = subCompanies;
        if (!isEmpty(localStorage.getItem("jwt-master"))) {
            currentArray = currentArray.filter((subcompany) => {
                return subcompany.id !== companyId;
            });
        }
        const fuse = new Fuse(currentArray, fuseOptions);
        const result = fuse.search(value);
        let subCompanyResponse = [];
        result.forEach((subcompany) => {
            subCompanyResponse.push(subcompany.item);
        });
        if (isEmpty(value)) {
            setFilterArray(currentArray);
        } else {
            setFilterArray(subCompanyResponse);
        }
    }

    const goToMetrics = () => {
        if (match !== null) {
            navigate("/metrics");
        }
    };

    const { pathname } = location;
    const validateOperatorView = () => {
        if (pathname.startsWith("/monitoring/operators/")) {
            navigate("/monitoring/operators/");
        }
    };

    return (
        <div className="flex flex-col text-sm" style={{ maxHeight: "31.125rem" }}>
            <div className="mt-1 w-full p-4">
                <div className="flex flex-row">
                    <div className="relative flex w-full items-center">
                        <div className="absolute top-0 left-0 bottom-0 ml-4 flex items-center">
                            <SearchIcon className="fill-current" width="1rem" height="1rem" />
                        </div>
                        <div className="w-full">
                            <DebounceInput
                                type="search"
                                autoFocus={true}
                                className={inputStyle}
                                style={{
                                    border: "1px solid rgb(221, 226, 230)",
                                    resize: "none",
                                    flex: "1",
                                    height: "2.313rem",
                                    padding: "0.75rem 0.75rem 0.75rem 3rem",
                                    outline: "0",
                                    fontSize: "0.875rem",
                                }}
                                minLength={2}
                                debounceTimeout={500}
                                placeholder={`${t("Buscar compañias")}`}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="hidden">
                        <button className="ml-4 h-8 w-8 rounded-full bg-primary-600">
                            <PlusIcon className="m-auto text-primary-200" width="1rem" height="1rem" fill="currentColor" />
                        </button>
                    </div>
                </div>
            </div>
            <Popover className="flex h-auto w-full flex-col overflow-y-auto">
                <Popover.Button className={"sticky top-0 z-10 bg-white"}>
                    <div
                        className="flex w-full flex-row border-b-0.5 border-gray-400/25 text-gray-400/85 hover:bg-gray-hover hover:text-gray-800/85 focus:outline-none"
                        style={{ height: "3.125rem" }}
                        onClick={() => {
                            if (!isEmpty(localStorage.getItem("jwt-master"))) {
                                goToMetrics();
                                setImpersonateCompany(null);
                                deleteUserContext();
                                setLoadingAvatar(true);
                            }
                        }}>
                        {loadingAvatar ? (
                            <div className="flex items-center justify-start px-5">
                                <SyncLoader color={"#00B3C7"} size={"0.3125rem"} speedMultiplier={0.7} />
                            </div>
                        ) : (
                            <>
                                <div className="my-auto ml-4 flex h-8 w-8 rounded-full bg-primary-600">
                                    <img
                                        src={isEmpty(localStorage.getItem("url-master")) ? company.imageUrl : localStorage.getItem("url-master")}
                                        alt="template"
                                        className={`h-full rounded-full object-contain`}
                                    />
                                </div>
                                <div className={"my-auto ml-2 flex	font-bold"}>
                                    {isEmpty(localStorage.getItem("company-name-master"))
                                        ? company.name
                                        : localStorage.getItem("company-name-master")}
                                </div>
                            </>
                        )}
                    </div>
                </Popover.Button>
                <div className="mb-6 flex h-full flex-col">
                    {!isEmpty(subCompanies) &&
                        filterArray.map((subCompany, index) => {
                            return (
                                <button
                                    key={`subcompany-${index}`}
                                    className="flex h-full flex-row items-center px-4 text-gray-400/85 hover:bg-gray-hover hover:text-gray-800/85 focus:outline-none"
                                    onClick={() => {
                                        setLoadingAvatar(true);
                                        validateOperatorView();
                                        changeUserContext(subCompany);
                                        goToMetrics();
                                    }}
                                    style={{ height: "3.125rem" }}>
                                    <div className="relative flex h-8 w-8 rounded-full bg-primary-600">
                                        <img
                                            src={
                                                isEmpty(get(subCompany, "imageUrl", DEFAULT_LOGO))
                                                    ? DEFAULT_LOGO
                                                    : get(subCompany, "imageUrl", DEFAULT_LOGO)
                                            }
                                            alt="template"
                                            className={`h-full rounded-full object-contain`}
                                        />
                                        {subCompany.inProduction !== 1 && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    bottom: "-0.25rem",
                                                    right: "-0.25rem",
                                                }}>
                                                <InProcessIcon className="" width="0.875rem" height="0.875rem" />
                                            </div>
                                        )}
                                    </div>
                                    <div className={"my-auto ml-2 flex text-left font-bold"}>
                                        {`${subCompany.name} ${subCompany.inProduction === 1 ? "" : "(en proceso)"}`}
                                    </div>
                                </button>
                            );
                        })}
                </div>
            </Popover>
            {filterArray.length === 0 && (
                <div className="flex flex-col">
                    <span className="mb-8 text-center text-gray-300">{t("No se encontró busqueda")}</span>
                </div>
            )}
        </div>
    );
};
export default withTranslation()(SubCompaniesSelect);
