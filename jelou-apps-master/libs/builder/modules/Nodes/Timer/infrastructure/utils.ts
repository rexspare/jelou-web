import { TimerTime } from "../domain/timer.domain";

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

export const convertDurationIntoSeconds = (duration: number, time: TimerTime) => {
    const timeOperation = {
        [TimerTime.Seconds]: 1,
        [TimerTime.Minutes]: SECONDS_PER_MINUTE,
        [TimerTime.Hours]: MINUTES_PER_HOUR * SECONDS_PER_MINUTE,
        [TimerTime.Days]: HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE,
    };

    return duration * timeOperation[time];
};
