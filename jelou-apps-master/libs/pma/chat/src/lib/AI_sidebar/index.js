import { RelatedArticlesModal } from "@apps/pma/ui-shared";
import { Input } from "@apps/shared/common";
import { SearchIcon } from "@apps/shared/icons";
import { useState } from "react";

const AISidebar = () => {
    const [openArticleModal, setOpenArticleModal] = useState(false);
    const [article, setArticle] = useState({});
    const [page, setPage] = useState();

    const handleOpenArticleModal = (index) => {
        setOpenArticleModal(true);
        setArticle(articles[index]);
        setPage(index + 1);
    };
    const onCloseArticleModal = () => {
        setOpenArticleModal(false);
        setArticle({});
    };

    return (
        <div className="flex flex-col space-y-2 overflow-y-auto py-4 pl-4">
            <div className="flex flex-col space-y-2 pr-4">
                <h2 className="text-13 font-medium leading-normal text-gray-400 sm:text-sm 2xl:text-15">Encuentra respuestas al instante</h2>
                <div className="relative flex rounded-[0.8125rem] border-[0.0938rem] border-transparent">
                    <div className="absolute bottom-0 left-0 top-0 ml-4 flex items-center">
                        <SearchIcon className="fill-current" width="1rem" height="1rem" />
                    </div>
                    <Input
                        id="operatorName"
                        type="text"
                        // value={query}
                        name="operatorName"
                        className="w-full rounded-[0.8125rem] border-[0.0938rem] border-gray-100/50 py-1 pl-10 text-sm text-gray-500 focus:border-gray-100 focus:ring-transparent"
                        // onKeyPress={(event) => handleKeyDown(event)}
                        placeholder={"Buscar"}
                        // onChange={onChange}
                        autoFocus
                    />
                </div>
            </div>
            <div className="flex flex-col space-y-2 overflow-y-auto pr-4">
                <h2 className="text-13 font-medium leading-normal text-gray-400 sm:text-sm 2xl:text-15">Artículos relacionados</h2>
                {articles.map((article, index) => (
                    <div key={index} className="h-[10.5rem]   rounded-lg border-default border-gray-100/50">
                        <div className="flex h-full flex-col space-y-2 p-3">
                            <h3 className="text-sm font-bold text-gray-610">{article.title}</h3>
                            <p className="h-full w-[16rem] break-words text-sm text-gray-500 line-clamp-3">{article.description}</p>
                            <div className="flex justify-end space-x-1 pt-1">
                                <button className="rounded-xl bg-gray-34 py-2 px-3 text-sm font-semibold text-gray-610">Omitir</button>
                                <button
                                    onClick={() => handleOpenArticleModal(index)}
                                    className="rounded-xl border-default border-primary-200 py-2 px-3 text-sm font-semibold text-primary-200 hover:bg-primary-600">
                                    Ver Artículo
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {openArticleModal && (
                <RelatedArticlesModal
                    articles={articles}
                    page={page}
                    setPage={setPage}
                    setArticle={setArticle}
                    onClose={onCloseArticleModal}
                    articleData={article}
                />
            )}
        </div>
    );
};

export default AISidebar;

// create an array of objects that contain a title and description for each article
const articles = [
    {
        title: "Articulo 1",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. \n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non.",
    },
    {
        title: "Articulo 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non.",
    },
    {
        title: "Articulo 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non.",
    },
    {
        title: "Articulo 4",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non.",
    },
    {
        title: "Articulo 5",

        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non.",
    },
    {
        title: "Articulo 6",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquam fringilla non.",
    },
];
