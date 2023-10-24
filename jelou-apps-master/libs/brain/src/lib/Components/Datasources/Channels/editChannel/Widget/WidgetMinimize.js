import { CloseIcon1 } from "@apps/shared/icons";
import { validateColorChromePicker } from "@apps/shared/utils";
import { get } from "lodash";

function WidgetMinimize(props) {
    const { widgetProperties } = props;
    const { gradient, backgroundColor, backgroundColorGradient, size, closeIcon, message, logo } = get(widgetProperties,"tooltipPanel",{})

    const colorTextBackground = {
        main: widgetProperties?.theme?.vars?.color?.secondaryLight,
        grey: widgetProperties?.theme?.vars?.color?.grey[1] || "",
        none: "none",
    };
    return (
        <div
            className="relative min-h-[7rem] min-w-[50%]  rounded-4 rounded-br-none p-4 pr-8"
            style={{
                background: !gradient
                    ? validateColorChromePicker(backgroundColor || "#00B3C7")
                    : `linear-gradient(291.44deg,${validateColorChromePicker(backgroundColorGradient || "#40c6d5")} 0%, ${validateColorChromePicker(backgroundColorGradient || "#40c6d5")} 64.45%, ${validateColorChromePicker(backgroundColor || "#00B3C7")})`,
            }}
        >
            <div className=" absolute right-2 top-2">
                <CloseIcon1
                    width={size ? "24px" : "16px"}
                    height={size ? "24px" : "16px"}
                    className={`fill-current ${closeIcon || "text-white"}`}
                />
            </div>
            <div className="flex flex-col rounded-4 gap-y-2" style={{ background: colorTextBackground[message?.backgroundColor || "none"] }}>
                <span className="text-2xl font-bold flex flex-wrap" style={{ color: message.textColor === "light" ? "white" : message.textColor }}>
                    {message?.title}
                </span>
                <span className="text-base font-normal" style={{ color: validateColorChromePicker(message.textColor === "light" ? "#FFF" : message.textColor) }}>
                    {message?.text}
                </span>
                {logo?.enabled && <img src={logo?.url} width={25} height={25} />}
            </div>
        </div>
    );
}

export default WidgetMinimize;
