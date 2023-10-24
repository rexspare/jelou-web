import React, { useState } from "react";

import BotFilter from "./BotFilter";
import CompanyFilter from "./CompanyFilter";
import { DateFilter } from "./Date";
import SelectFilter from "./SelectFilter";
import TeamFilter from "./TeamFilter";
import TextFilter from "./TextFilter";

const Filter = ({ filters, setRequestParams, dateProps, valueProps }) => {
    const [companyIdSeleted, setCompanySeleted] = useState(null);

    return (
        <div className="grid w-full grid-flow-row gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minMax(15rem, 1fr))" }}>
            {filters.map((filter, index) => {
                const { type } = filter;
                switch (type) {
                    case "bot":
                        return (
                            <BotFilter
                                companySeleted={companyIdSeleted}
                                filter={filter}
                                key={filter.key + index}
                                setRequestParams={setRequestParams}
                                valueProps={valueProps}
                            />
                        );
                    case "company":
                        return (
                            <CompanyFilter
                                filter={filter}
                                key={filter.key + index}
                                setCompanySeleted={setCompanySeleted}
                                setRequestParams={setRequestParams}
                                valueProps={valueProps}
                            />
                        );
                    case "team":
                        return <TeamFilter filter={filter} key={filter.key + index} setRequestParams={setRequestParams} valueProps={valueProps} />;
                    case "select":
                        return <SelectFilter filter={filter} key={filter.key + index} setRequestParams={setRequestParams} valueProps={valueProps} />;
                    case "dateRange":
                        return <DateFilter key={filter.key + index} filter={filter} dateProps={dateProps} />;
                    case "text":
                        return (
                            <div className="w-60" key={filter.key + index}>
                                <TextFilter valueProps={valueProps} setRequestParams={setRequestParams} filter={filter} />
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default Filter;
