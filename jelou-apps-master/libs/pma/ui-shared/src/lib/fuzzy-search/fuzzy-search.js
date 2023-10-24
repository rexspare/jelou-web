import Fuse from "fuse.js";

export default function fuzzySearch(options) {
    const fuse = new Fuse(options, {
        keys: ["name", "groupName", "items.name", "template"],
        threshold: 0.3,
    });
    return (value) => {
        if (!value.length) {
            return options;
        }

        const results = fuse.search(value);

        return results.map((result) => result.item);
    };
}
