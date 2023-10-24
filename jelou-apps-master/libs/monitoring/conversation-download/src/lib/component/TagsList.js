import { useSelector } from "react-redux";

export function Tags({ tags = [] } = {}) {
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";

    return (
        <div className="flex flex-wrap items-center gap-2">
            {tags &&
                tags.length > 0 &&
                tags.map((tag) => {
                    const { color, name } = tag;

                    if (Array.isArray(tag)) {
                        const { name: name2, color: color2, id } = tag[0];
                        const translatedName = name2[lang];

                        return (
                            <div
                                key={id}
                                style={{ backgroundColor: color2 }}
                                className="px-2 py-1 font-medium text-white bg-opacity-50 rounded-full whitespace-nowrap text-10">
                                {translatedName}
                            </div>
                        );
                    }

                    return (
                        name[lang] && (
                            <div
                                key={tag.id}
                                style={{ backgroundColor: color }}
                                className="px-2 py-1 font-medium text-white bg-opacity-50 rounded-full whitespace-nowrap text-10">
                                {name[lang]}
                            </div>
                        )
                    );
                })}
        </div>
    );
}
