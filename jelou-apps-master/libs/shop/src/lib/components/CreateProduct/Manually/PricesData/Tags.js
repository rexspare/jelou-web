import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { renderMessage } from "@apps/shared/common";
import { CloseIcon } from "@apps/shared/icons";
import { InputErrorMessage } from "../InputErrorMessage";
import { CreatebleSelector } from "./CreatableSelector";
import { getColors } from "./utils.colors";
import { getAllTagsForApp } from "../../../../services/tags";
import { TAGS_QUERY_KEY } from "../../../../constants";
import { MESSAGE_TYPES } from "@apps/shared/constants";

export const PricesTags = ({ tags, setTags, error, isEditable }) => {
    const company = useSelector((state) => state.company);
    const app_id = get(company, "properties.shopCredentials.jelou_ecommerce.app_id", null);

    const { data: listOfTagsCompany = [] } = useQuery([TAGS_QUERY_KEY], () => getAllTagsForApp(app_id), {
        staleTime: Infinity,
        enabled: Boolean(app_id),
    });

    const options = listOfTagsCompany
        .filter((tag) => !tags.some((tagSelected) => tagSelected.name === tag))
        .map((tag) => ({ label: tag, value: tag }));

    const addTagToArray = (name) => {
        const [backgroundColor, color] = getColors();
        setTags((preState) => [...preState, { name, backgroundColor, color }]);
    };

    /** @param {string} inputValue */
    const handleAddTag = (inputValue) => {
        if (isEmpty(inputValue)) {
            renderMessage("El tag no puede ser un texto vacío, por favor ingrese un tag válido", MESSAGE_TYPES.ERROR);
            return Promise.reject();
        }

        const thisTagNotExists = tags.some((tag) => tag.name === inputValue);

        if (thisTagNotExists) {
            renderMessage("Este tag ya existe, por favor agregue uno diferente", MESSAGE_TYPES.ERROR);
            return Promise.reject();
        }

        addTagToArray(inputValue);
        return Promise.resolve();
    };

    const handleRemoveTag = (tagName) => () => setTags((preState) => preState.filter((tag) => tag.name !== tagName));

    const handleChange = (selectedOptions) => {
        addTagToArray(selectedOptions);
    };

    return (
        <>
            <div>
                <label className="font-medium text-gray-400">Tags</label>
                {error && <InputErrorMessage hasError={error} />}
            </div>
            <div className="flex w-76 flex-wrap gap-1">
                {tags.map(({ name, backgroundColor, color }) => (
                    <span className="rounded-full px-4 py-1" style={{ backgroundColor, color }} key={name}>
                        {name}
                        {isEditable && (
                            <button type="button" className="ml-2" onClick={handleRemoveTag(name)}>
                                <CloseIcon width={6} fill={color} />
                            </button>
                        )}
                    </span>
                ))}
                {isEditable && <CreatebleSelector createCallback={handleAddTag} options={options} onChange={handleChange} />}
            </div>
        </>
    );
};
