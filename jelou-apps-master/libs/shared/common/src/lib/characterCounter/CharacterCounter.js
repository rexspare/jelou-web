import { CircularProgressbar } from "react-circular-progressbar";

const CharacterCounter = (props) => {
    const {
        colorCircle = "#00B3C7",
        count = 0,
        max = 100,
        width,
        height,
        right,
        className = "text-gray-400 font-normal text-opacity-50 text-sm",
        containerClassName = "flex w-full items-center px-4",
    } = props;

    const styles = {
        path: {
            stroke: colorCircle,
        },
    };

    return (
        <div className={`${containerClassName} ${right ? "justify-end" : "justify-start"}`}>
            <span className={className}>{`${count}/${max}`}</span>
            <div className="ml-2" style={{ width: width, height: height }}>
                <CircularProgressbar value={count} maxValue={max} styles={styles} />
            </div>
        </div>
    );
};

export default CharacterCounter;
