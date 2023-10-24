import { JelouApiV1 } from "@apps/shared/modules";

type Props = {
    companyId: number;
    credentials: object;
};

export async function addCredentialsToCompany({ companyId, credentials }: Props) {
    try {
        const { data, status } = await JelouApiV1.post("/settings", {
            entity: {
                type: "COMPANY",
                id: companyId,
            },
            settings: [
                {
                    key: "shopCredentials",
                    typeOf: "object",
                    value: credentials,
                },
            ],
        });

        if (status === 200) return data;

        throw new Error("Error al agregar credenciales a la compañia");
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error("Error al agregar credenciales a la compañia");
    }
}
