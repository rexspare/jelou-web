import { validateColorChromePicker } from "@apps/shared/utils";
import { get } from "lodash";

const WidgetIconBubble = (props) => {
    const { widgetProperties, justify = "end" } = props;
    const { backgroundColor, size, logoSize, logoUrl } = get(widgetProperties,"startButton",{});
    const { borderColor, borderWidth } = get(widgetProperties, "startButton.border", {});

    const sizeParameters = {
        "2xl": "108px",
        xl: "98px",
        lg: "88px",
        md: "78px",
        sm: "68px",
    };

    return (
        <div className={`flex w-full justify-${justify}`}>
            <button
                className="flex items-center justify-center rounded-full"
                style={{
                    background: validateColorChromePicker(backgroundColor),
                    width: `calc(${sizeParameters[size]} - 8px)`,
                    height: `calc(${sizeParameters[size]} - 8px)`,
                    borderColor: validateColorChromePicker(borderColor),
                    borderWidth: borderWidth,
                }}>
                <img
                    src={logoUrl}
                    alt=""
                    style={{ width: `calc(${sizeParameters[logoSize]} - 8px)` }}
                />
            </button>
        </div>
    );
};

export default WidgetIconBubble;
