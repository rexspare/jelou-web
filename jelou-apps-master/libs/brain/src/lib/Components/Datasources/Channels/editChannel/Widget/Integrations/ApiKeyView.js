import { CheckCircleIconPrimary, CopyIcon } from "@apps/shared/icons";
import { useState } from "react";

const ApiKeyView = (props) => {
    const { copyContent, apiKey } = props;
    const [copy, setCopy] = useState(false);
    return (
        <div className="my-4 flex w-1/2 flex-col rounded-10 border-1 border-neutral-200">
            <div className="flex w-full justify-between border-b-1 border-neutral-200 p-2">
                <span className="font-bold text-gray-610">API key</span>
                {copy && <button className="rounded-4 bg-primary-200 bg-opacity-15 p-2 font-bold text-primary-200">Copiado!</button>}
            </div>
            <div className="flex- flex justify-between p-2">
                <span className="flex items-center font-bold leading-6 text-gray-400">••••••••••</span>
                {copy ? (
                    <CheckCircleIconPrimary className="rounded-full border-1 border-primary-200 hover:opacity-80" width="2rem" height="2rem" fill="none" stroke="#00B3C7" fillCircle={"#fff"} />
                ) : (
                    <button
                        className="rounded-full border-1 border-primary-200 p-2"
                        onClick={() => {
                            setCopy(true);
                            copyContent(apiKey);
                        }}
                    >
                        <CopyIcon className="stroke-current text-primary-200" width="1.2rem" height="1.2rem" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ApiKeyView;
