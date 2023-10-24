import React from "react";

const Sort = ({ column }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${!column.isSortedDesc && column.isSorted && "text-primary-400"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </span>
            <span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${column.isSortedDesc && column.isSorted && "text-primary-400"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </span>
        </div>
    );
};

export default Sort;
