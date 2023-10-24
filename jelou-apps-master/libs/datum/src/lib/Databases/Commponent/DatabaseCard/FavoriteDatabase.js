import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";

import { LoadingSpinner, StarIcon } from "@apps/shared/icons";
import { useFavoriteDB } from "../../Hook/fav";

const FavoriteDatabase = ({ initialFavorite, databaseId, placementTippy = "top" } = {}) => {
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    const { changeFavorite, loading } = useFavoriteDB();
    const { t } = useTranslation();

    return (
        <div className="flex items-center">
            <Tippy arrow={false} content={isFavorite ? t("plugins.Desmarcar") : t("plugins.Destacar")} placement={placementTippy} theme="tomato" touch={false}>
                <button
                    disabled={loading}
                    className="h-9 w-7"
                    onClick={(evt) => {
                        evt.stopPropagation();
                        changeFavorite({ databaseId, isFavorite }).then((favorite) => {
                            setIsFavorite(favorite);
                        });
                    }}
                >
                    {loading ? <LoadingSpinner /> : <StarIcon className="h-5 w-5" fill={isFavorite ? "#00B3C7" : "none"} stroke={isFavorite ? "none" : "currentColor"} />}
                </button>
            </Tippy>
        </div>
    );
};

export default FavoriteDatabase;
