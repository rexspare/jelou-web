import axios from "axios";

const defaultErrorMessage = "Tuvimos un error al intentar esta accion, por favor intente nuevamente refrescando la página";

export class Repository {
    protected STATUS_CODE = {
        OK: 200,
        CREATED: 201,
        NOT_FOUND: 404,
    };

    /**
     * handle the error of the repositories
     */
    protected getMessageError(error: unknown, message = defaultErrorMessage): string {
        // TODO: send to sentry
        if (axios.isAxiosError(error)) {
            return  error.response?.data?.message || message 
            
        }

        if (error instanceof Error) {
            return error?.message || message
        }

        return message
    }
}
