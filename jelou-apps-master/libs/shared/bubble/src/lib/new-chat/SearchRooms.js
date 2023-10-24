import { SearchIcon } from "@apps/shared/icons";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { ClipLoader } from "react-spinners";

const inputStyle = "input-new-chat";

const SearchRooms = (props) => {
    const [loading] = useState(false);
    const { t, findRoom } = props;

    return (
        <div className="relative w-full py-4 xxl:py-6">
            <div className="absolute top-0 left-0 bottom-0 ml-4 flex items-center">
                {loading ? (
                    <div>
                        <ClipLoader size={"0.875rem"} color={"#c4daf2"} />
                    </div>
                ) : (
                    <SearchIcon className="fill-current" width="1.25rem" height="1.25rem" />
                )}
            </div>
            <div>
                <input type="search" className={inputStyle} placeholder={`${t("pma.Buscar")} ...`} onChange={findRoom} />
            </div>
        </div>
    );
};

export default withTranslation()(SearchRooms);
