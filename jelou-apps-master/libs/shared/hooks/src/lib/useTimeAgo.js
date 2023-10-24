import * as dayjs from "dayjs";
import { useSelector } from "react-redux";

const useTimeAgo = () =>{
  const lang = useSelector((state) => state.userSession?.lang) ?? "es";

  const getTimeAgo = (time) => {
    const showAsRelativeTime = dayjs().diff(dayjs(time), "hour") < 20;

    const showFullTime = dayjs().diff(dayjs(time), "hour") > 24;

    if (showFullTime) {
        return dayjs(time).format(`DD/MM/YY HH:mm`);
    }
    if (showAsRelativeTime) {
        return dayjs()
            .locale(lang || "es")
            .to(dayjs(time));
    }

    return dayjs(time).format(`HH:mm`);
  };

  return { getTimeAgo }
}

export default useTimeAgo;
