import { JelouApiV2 } from "@apps/shared/modules";
import { Repository } from "@builder/shared/handleErrorRepositories";
import { Database, IDatumRepository, OneDatabase } from "../domain/datum.domain";

type Response<T> = {
    data: T;
    message: [string];
    status: number;
    statusMessage: string;
};

// const getOneDatabase = useCallback(async ({ databaseId }) => {
//     try {
//         const response = await JelouApiV2.get(`/databases/${databaseId}`);

//         if (response.status === 200) {
//             const { data } = response.data;
//             return data;
//         }

//         const { error, message } = await response.data;
//         if (response.status === 500) {
//             throw error.clientMessages[lang];
//         }

//         throw message[0];
//     } catch (error) {
//         console.error("🚀 ~ file: databases.js ~ line 91 ~ getOneDatabase ~ error", error);
//         throw error;
//     }
// }, []);

export class DatumRepository extends Repository implements IDatumRepository {
    MESSAGES_ERRORS = {
        GET_ALL: "Tuvimos un error al obtener las bases de datos, por favor intenta nuevamente",
        GET_ONE: "Tuvimos un error al obtener la base de datos, por favor intenta nuevamente",
    };

    async getDatabasesByFav(isFavorite: boolean) {
        try {
            const { data, status } = await JelouApiV2.get<Response<Database[]>>(`/databases?isFavorite=${isFavorite}&sortBy=createdAt&schemaType=jsonschema&shouldPaginate=false`);
            if (status === this.STATUS_CODE.OK) return data.data;

            throw new Error(this.MESSAGES_ERRORS.GET_ALL);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.MESSAGES_ERRORS.GET_ALL));
        }
    }

    async getAll() {
        const promisesList = [this.getDatabasesByFav(false), this.getDatabasesByFav(true)];

        return Promise.allSettled(promisesList)
            .then(([databasesNotFavorite, databasesFavorite]) => {
                if (databasesNotFavorite.status === "fulfilled" && databasesFavorite.status === "fulfilled") {
                    return [...databasesFavorite.value, ...databasesNotFavorite.value];
                }

                throw new Error(this.MESSAGES_ERRORS.GET_ALL);
            })
            .catch(() => {
                throw new Error(this.MESSAGES_ERRORS.GET_ALL);
            });
    }

    async getOne(databaseId: number) {
        try {
            const { data, status } = await JelouApiV2.get<Response<OneDatabase>>(`/databases/${databaseId}`);
            if (status === this.STATUS_CODE.OK) return data.data;

            throw new Error(this.MESSAGES_ERRORS.GET_ONE);
        } catch (error) {
            throw new Error(this.getMessageError(error, this.MESSAGES_ERRORS.GET_ONE));
        }
    }
}
