import { PlusIcon } from "libs/builder/src/Icons";
import { getFieldTypeIcon } from "../../../helpers/utils.contact";

/**
 * @param {{
 * Icon: React.FC
 * list: ContactField[]
 * title: string
 * view: string
 * value: string
 * handleChangeView: (value: string) => void
 * }} props
 */

export const FieldInfo = ({ Icon, list, view, value, title, handleChangeView }) => {
    return (
        <div
            className="flex cursor-pointer flex-col gap-2 rounded-10 border-1 border-gray-330 px-6 py-4 hover:border-primary-10 hover:bg-[#E6F6F7] hover:text-primary-200"
            onClick={() => handleChangeView(view)}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Icon />
                    <span className="text-base font-semibold">{title}</span>
                </div>
                <div className="rounded-full bg-[#E6F6F7] p-2 text-primary-200">
                    <PlusIcon />
                </div>
            </div>

            {list.map((element) => {
                const { id, type } = element;
                const label = element[value];

                return label ? (
                    <div key={id} className="flex flex-col gap-1">
                        <div className="ml-[0.11rem] flex items-center gap-4 text-primary-200">
                            {getFieldTypeIcon(type)}
                            <span className="text-sm">{label}</span>
                        </div>
                    </div>
                ) : null;
            })}
        </div>
    );
};
