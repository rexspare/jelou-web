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
