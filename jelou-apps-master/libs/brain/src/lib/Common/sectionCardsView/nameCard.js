import { TRUNCATION_CHARACTER_LIMITS } from "../../constants";
import ConditionalTruncateTippy from "../conditionalTruncateTippy";

const NameCard = ({ name }) => {
    return (
        <div className="h-1/3 w-full">
            <ConditionalTruncateTippy
                text={name}
                charactersLimit={TRUNCATION_CHARACTER_LIMITS.COLUMN}
                textStyle={"font-bold text-lg text-gray-610"}
                componentType={"div"}
                placement={"top"}
            />
        </div>
    );
};

export default NameCard;
