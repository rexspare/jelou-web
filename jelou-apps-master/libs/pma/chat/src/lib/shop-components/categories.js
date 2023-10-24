import React from "react";
import Skeleton from "react-loading-skeleton";

export function CategoriesShop({ categoriesList, indexCategorySeleted, loadintCategories, handleSearchCategory }) {
    return (
        <aside className="mt-3 mb-3 ml-3">
            {loadintCategories ? (
                <div className="no-scrollbar flex gap-2 overflow-x-scroll pr-2">
                    <div className="h-9 w-48">
                        <Skeleton height={23} />
                    </div>
                    <div className="h-9 w-48">
                        <Skeleton height={23} />
                    </div>
                    <div className="h-9 w-28">
                        <Skeleton height={23} />
                    </div>
                </div>
            ) : (
                <ul className="no-scrollbar flex gap-2 overflow-x-scroll pr-2">
                    <li>
                        <button
                            onClick={() => handleSearchCategory("all", "all")}
                            className={`whitespace-nowrap rounded-10 border-0.5 border-primary-200 px-3 py-1 font-semibold ${
                                indexCategorySeleted === "all" ? "bg-primary-200 text-white" : "bg-white text-gray-400"
                            }`}>
                            Todos
                        </button>
                    </li>
                    {categoriesList.map((category, index) => {
                        return (
                            <li key={category.id}>
                                <button
                                    onClick={() => handleSearchCategory(category.id, index)}
                                    className={`whitespace-nowrap rounded-10 border-0.5 border-primary-200 px-3 py-1  font-semibold ${
                                        indexCategorySeleted === index ? "bg-primary-200 text-white" : "bg-white text-gray-400"
                                    }`}>
                                    {category.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </aside>
    );
}
