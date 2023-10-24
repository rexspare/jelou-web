import { TestToolIcon } from "../../Icons";

export const InitialOutput = () => {
    return (
        <div className="grid h-full place-content-center p-8">
            <div className="flex flex-col items-center gap-4">
                <TestToolIcon height={260} width={220} />
                <p className="w-60 text-center text-gray-400">
                    Ejecuta tus inputs para
                    <span className="font-bold text-primary-200"> probar</span> tus
                    <span className="font-bold"> herramientas</span>
                </p>
            </div>
        </div>
    );
};
