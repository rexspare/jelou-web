import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { deleteToS3Service, uploadToS3Service } from "./service";

export class S3 {
    private readonly defatulFolder = "workflows";
    /**
     * Creates a new instance of S3
     * @param companyId id of the company
     * @param folder folder where the files will be uploaded
     */
    constructor(public companyId: string, public folder?: string) {}

    /**
     * Uploads a file to s3
     * @param file file to upload to s3
     * @returns URL of the uploaded file
     */
    uploadFile(file: File, defaultPath?: string) {
        const [type, extension] = file.type.split("/");

        const path = this.getDefaultPath(type, extension, defaultPath);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("path", path);

        try {
            return uploadToS3Service(this.companyId, formData);
        } catch (error) {
            this.handleError(error, "Error uploading file to s3");
        }
    }

    /**
     * It takes a url as an argument, validates it, and then calls the deleteToS3Service function
     * @param url The url of the file you want to delete.
     * @returns Whether the file was successfully deleted
     */
    async deleteFile(url: string): Promise<boolean> {
        try {
            return deleteToS3Service(this.companyId, url);
        } catch (error) {
            this.handleError(error, "Error deleting file to s3");
        }
    }

    private handleError(error: unknown, message: string): never {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || error.message);
        }

        if (error instanceof Error) throw error;

        throw new Error(message);
    }

    private getDefaultPath(type: string, extension: string, path?: string): string {
        if (path) return path;

        const currentFolder = this.folder ?? this.defatulFolder;
        const currentTimeStamp = new Date().getTime();

        return `${currentFolder}/${type}/${uuidv4()}-${currentTimeStamp}.${extension}`;
    }
}
