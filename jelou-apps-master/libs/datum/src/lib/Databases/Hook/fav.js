import { useCallback, useState } from "react";

import { renderMessage } from "@apps/shared/common";
import { MESSAGE_TYPES } from "@apps/shared/constants";
import { useDataBases } from "../../services/databases";

export function useFavoriteDB() {
  const [loading, setLoading] = useState(false);

  const { setFavoriteDatabaes } = useDataBases();

  const changeFavorite = useCallback(({ databaseId, isFavorite = false } = {}) => {
    setLoading(true);
    return setFavoriteDatabaes({ databaseId, isFavorite: !isFavorite })
      .then(({ data, message }) => {
        renderMessage(message, MESSAGE_TYPES.SUCCESS);
        return data.isFavorite;
      })
      .catch((message) => {
        console.error("favorites", { message });
        renderMessage(message, MESSAGE_TYPES.ERROR);
        return isFavorite;
      })
      .finally(() => setLoading(false));
  }, []);

  return { changeFavorite, loading };
}
