// import { flattenObject } from "./generateschema.output";
export function flattenObject(obj: object) {
    const result: Record<string, string> = {};

    function recurse(current: any, property: string) {
        if (Object(current) !== current) {
            const value = property.replace(/\./g, " ");
            // result[property] = current;
            result[property] = value;
        } else if (Array.isArray(current)) {
            if (current.length === 0) {
                const value = property.replace(/\./g, " ");
                result[property] = value;
            } else {
                for (let i = 0, l = current.length; i < l; i++) {
                    recurse(current[i], `${property}[${i}]`);
                }
            }
        } else {
            let isEmpty = true;
            for (const p in current) {
                isEmpty = false;
                recurse(current[p], property ? `${property}.${p}` : p);
            }
            if (isEmpty && property) {
                const value = property.replace(/\./g, " ");
                result[property] = value;
            }
        }
    }

    recurse(obj, "");
    return result;
}

describe("generate schema outputs", () => {
    it("flatten json", () => {
        expect(typeof flattenObject).toBe("function");
    });

    it("return a flatten object", () => {
        const data = {
            bubble: {
                type: "TEXT",
                text: "@CM_Jelou Hola Jelou ",
            },
            attachments: [],
            messageId: "1628443458472902659",
            roomId: "G:1363986947119710200:1628443458472902659",
            company: {
                id: 135,
                name: "Jelou Dev",
                socketId: "c613c8cc-4bc3-4168-8476-b7d3788a37fe",
            },
            entities: {
                mentions: [
                    {
                        nickname: "CM_Jelou",
                        names: "Publicaciones",
                        id: "1363986947119710209",
                        indices: [0, 9],
                    },
                ],
                hashtags: [],
                media: [],
            },
            bot: {
                id: "1363986947119710200",
                name: "Twitter Replies",
                type: "Twitter_replies",
            },
        };

        const flattenedData = flattenObject(data);
        expect(flattenedData).toEqual({
            "bubble.type": "bubble type",
            "bubble.text": "bubble text",
            attachments: "attachments",
            messageId: "messageId",
            roomId: "roomId",
            "company.id": "company id",
            "company.name": "company name",
            "company.socketId": "company socketId",
            "entities.mentions[0].nickname": "entities mentions[0] nickname",
            "entities.mentions[0].names": "entities mentions[0] names",
            "entities.mentions[0].id": "entities mentions[0] id",
            "entities.mentions[0].indices[0]": "entities mentions[0] indices[0]",
            "entities.mentions[0].indices[1]": "entities mentions[0] indices[1]",
            "entities.hashtags": "entities hashtags",
            "entities.media": "entities media",
            "bot.id": "bot id",
            "bot.name": "bot name",
            "bot.type": "bot type",
        });
    });

    it("return a flatten object with nested objects", () => {
        const data = {
            bubble: {
                type: "TEXT",
                text: "@CM_Jelou Hola Jelou ",
                company: {
                    id: 135,
                    name: "Jelou Dev",
                    socketId: "c613c8cc-4bc3-4168-8476-b7d3788a37fe",
                },
            },
            entities: {
                mentions: [
                    {
                        nickname: "CM_Jelou",
                        names: "Publicaciones",
                        id: "1363986947119710209",
                        indices: [0, 9],
                    },
                    {
                        bot: {
                            id: "1363986947119710200",
                            name: "Twitter Replies",
                            type: "Twitter_replies",
                            channels: [],
                        },
                    },
                ],
                hashtags: [],
                media: [],
            },
        };

        const flattenedData = flattenObject(data);

        expect(flattenedData).toEqual({
            "bubble.type": "bubble type",
            "bubble.text": "bubble text",
            "bubble.company.id": "bubble company id",
            "bubble.company.name": "bubble company name",
            "bubble.company.socketId": "bubble company socketId",
            "entities.mentions[0].nickname": "entities mentions[0] nickname",
            "entities.mentions[0].names": "entities mentions[0] names",
            "entities.mentions[0].id": "entities mentions[0] id",
            "entities.mentions[0].indices[0]": "entities mentions[0] indices[0]",
            "entities.mentions[0].indices[1]": "entities mentions[0] indices[1]",
            "entities.mentions[1].bot.id": "entities mentions[1] bot id",
            "entities.mentions[1].bot.name": "entities mentions[1] bot name",
            "entities.mentions[1].bot.type": "entities mentions[1] bot type",
            "entities.mentions[1].bot.channels": "entities mentions[1] bot channels",
            "entities.hashtags": "entities hashtags",
            "entities.media": "entities media",
        });
    });

    it("return a flatten object with undefined, null and empty values", () => {
        const data = {
            bubble: {
                type: null,
                text: undefined,
                company: {
                    id: 135,
                    name: {},
                    socketId: [],
                },
                undefined: undefined,
                null: null,
                empty: "",
            },
            undefined: undefined,
            null: null,
            empty: "",
        };

        const flattenedData = flattenObject(data);

        expect(flattenedData).toEqual({
            "bubble.type": "bubble type",
            "bubble.text": "bubble text",
            "bubble.company.id": "bubble company id",
            "bubble.company.name": "bubble company name",
            "bubble.company.socketId": "bubble company socketId",
            "bubble.undefined": "bubble undefined",
            "bubble.null": "bubble null",
            "bubble.empty": "bubble empty",
            undefined: "undefined",
            null: "null",
            empty: "empty",
        });
    });
});
