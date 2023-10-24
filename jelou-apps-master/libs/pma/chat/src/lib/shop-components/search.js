import React from "react";
import { DebounceInput } from "react-debounce-input";

export function Search({ handleSearchOnChange }) {
    return (
        <label className="ml-3 flex h-9 w-[90%] items-center rounded-xl border-2 border-gray-100 border-opacity-50 pl-3">
            <div>
                <svg width={16} height={16} fill="none">
                    <path
                        d="M1.829 10.672a6.258 6.258 0 0 1 0-8.843 6.266 6.266 0 0 1 8.848 0 6.13 6.13 0 0 1 .941 7.547s-.103.174.037.313l3.192 3.19c.635.636.787 1.524.223 2.087l-.097.097c-.563.563-1.452.412-2.087-.223L9.7 11.656c-.146-.146-.32-.043-.32-.043a6.138 6.138 0 0 1-7.551-.94Zm7.693-1.154a4.624 4.624 0 0 0 0-6.535 4.63 4.63 0 0 0-6.538 0 4.624 4.624 0 0 0 0 6.535 4.63 4.63 0 0 0 6.538 0Z"
                        fill="#A6B4D0"
                        fillOpacity={0.75}
                    />
                </svg>
            </div>

            <DebounceInput
                onChange={handleSearchOnChange}
                autoFocus
                className="border-0 bg-transparent text-15 font-semibold leading-normal text-gray-100 placeholder-gray-100 ring-transparent focus:border-transparent focus:ring-transparent"
                debounceTimeout={700}
                minLength={2}
                placeholder="Buscar producto"
                type="search"
            />
        </label>
    );
}
