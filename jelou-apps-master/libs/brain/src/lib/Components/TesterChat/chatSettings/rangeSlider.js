import { useState } from "react";
import "./rangeSlider.css";

const RangeSlider = (props) => {
    const { bulletCount, onChange, name, temperature } = props;
    const [value, setValue] = useState(temperature);

    const genSlideStyle = (value, bulletCount) => {
        return {
            point: {
                left: `calc(${(value / bulletCount) * 100}% - ${value === bulletCount ? "15" : "10"}px)`,
            },
            range: {
                width: `${(value / bulletCount) * 100}%`,
            },
        };
    };

    const slideStyle = genSlideStyle(value, bulletCount);

    const renderBullets = () => {
        const _bulletCount = bulletCount * 10;
        const initialPadding = 97 / _bulletCount;
        return Array.from({ length: _bulletCount }).map((_, index) => {
            const padding = initialPadding * (index + 1);
            return (
                <span
                    key={index}
                    className="absolute top-[2px] left-0 z-10 inline-block h-[5px] w-[5px] rounded-full bg-primary-900"
                    style={{ left: `${padding}%` }}
                />
            );
        });
    };

    const handleChange = (e) => {
        setValue(e.target.value);
        onChange(e);
    };

    return (
        <div className="slider-container relative block h-2.5 w-full rounded-[10px] bg-neutral-100">
            {renderBullets()}
            <span
                className="slider-background-progress-color absolute top-0 left-0 inline-block h-2.5 w-1/5 rounded-[10px] bg-primary-200 transition duration-200"
                style={slideStyle.range}
            />
            <span
                className="slider-circle pointer-events-none absolute top-[-3px] z-15 h-[15px] w-[15px] rounded-full border-2 border-neutral-200 bg-white shadow-sm transition duration-200"
                style={slideStyle.point}
            />
            <input className="slider" name={name} type="range" min="0" max={bulletCount} value={value} step="0.1" onChange={handleChange} />
        </div>
    );
};

export default RangeSlider;
