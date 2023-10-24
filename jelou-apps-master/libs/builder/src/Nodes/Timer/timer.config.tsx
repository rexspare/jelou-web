import { NumberInput } from "@builder/common/inputs";
import { ListBoxHeadless } from "@builder/common/Headless/Listbox";
import { timeList } from "@builder/modules/Nodes/Timer/domain/timer.domain";
import { useTimerConfigPanel } from "@builder/modules/Nodes/Timer/infrastructure/TimerConfigPanel.hook";

export const TimerConfigPanel = ({ nodeId }: { nodeId: string }) => {
    const { duration, time, handleOnChangeDuration, handleSelectedTime } = useTimerConfigPanel({ nodeId });

    return (
        <main className="flex flex-row items-end gap-x-1 gap-y-6 py-8 px-6 text-gray-400">
            <NumberInput name="duration" label="Tiempo" placeholder="Ej: 5" defaultValue={String(duration)} hasError="" labelClassName="font-bold" onChange={handleOnChangeDuration} className='!relative !h-12 !w-full !cursor-pointer !rounded-10 !border-1 !border-gray-330 !bg-white !px-2 !pl-3 !text-left !transition !duration-150 !ease-in-out !sm:text-sm !sm:leading-5'/>
            <ListBoxHeadless list={timeList} value={time} label="" slideover setValue={handleSelectedTime} />
        </main>
    );
};
