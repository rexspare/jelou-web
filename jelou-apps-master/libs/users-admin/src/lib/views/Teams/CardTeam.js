import React from "react";
import Avatar from "react-avatar";

const CardUser = (props) => {
    const { team, active } = props;
    return (
        <div
            className={`inline-flex w-full cursor-pointer items-center py-3 px-5 align-middle ${
                active ? "border-r-5 border-primary-200 bg-primary-2" : ""
            }`}>
            <span className="relative mr-3">
                <Avatar
                    color="#D7EAFF"
                    name={team.name}
                    size={"2.813rem"}
                    fgColor="#7E819F"
                    round={true}
                    textSizeRatio={2.5}
                    className="font-medium"
                />
            </span>
            <div className="relative w-full pl-1">
                <dd className="w-full text-15 font-bold text-gray-400">{team.name}</dd>
            </div>
        </div>
    );
};

export default CardUser;
