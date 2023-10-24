import isEmpty from "lodash/isEmpty";

/**
 * @param {{text: string}} props
 */
export const TextArea = ({ text = "" }) => {
    return !isEmpty(text) ? (
        <div className="shadow-nodo max-h-[17rem] min-h-20 w-56 break-words rounded-10 bg-white p-2">
            <p className="max-h-full overflow-hidden text-13 leading-[1.5] text-gray-400 [white-space:_break-spaces]">{text}</p>
        </div>
    ) : (
        <div className="shadow-nodo min-h-20 rounded-10 border-1 border-gray-330 bg-white pl-2">
            <span className="text-13 font-light text-gray-340">Agrega contenido al mensaje</span>
        </div>
    );
};
