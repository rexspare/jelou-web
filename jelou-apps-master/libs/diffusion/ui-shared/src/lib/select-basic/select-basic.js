import React from "react";
import isEmpty from "lodash/isEmpty";

const Select = (props) => {
    const { title } = props;
    return (
        <div className={`relative ${props.className}`}>
            {!isEmpty(title) && <div className="ml-5 mb-2 text-sm font-bold leading-5 text-gray-400 text-opacity-75 xxl:text-15">{title}</div>}

            <select
                className="h-[2.4rem] w-full rounded-xs border-transparent bg-primary-700 px-2 text-15 text-gray-400 outline-none ring-transparent focus:border-transparent focus:outline-none focus:ring-transparent"
                defaultValue={props.defaultValue}
                onChange={props.onChange}
                name={props.name}>
                <option key="-1" value="-1" disabled>
                    {props.placeHolder}
                </option>
                {props.options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
                <div className="absolute right-0 fill-current text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-chevron-down"
                        viewBox="0 0 16 16">
                        <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                        />
                    </svg>
                </div>
            </select>
        </div>
    );
};

export default Select;
