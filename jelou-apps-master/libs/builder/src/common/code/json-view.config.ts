import { ReactJsonViewProps } from "react-json-view";

type ReactJsonViewStyle = ReactJsonViewProps["style"];

const style: ReactJsonViewStyle = {
    fontSize: "14px",
    fontFamily: 'JetBrains Mono, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif',
    lineHeight: "24px",
    backgroundColor: "#3D4253",
    padding: "12px",
};

export const jsonViewConfig = (src: object): ReactJsonViewProps => ({
    src,
    theme: {
        base00: "#272822",
        base01: "#383830",
        base02: "#49483e",
        base03: "#75715e",
        base04: "#a59f85",
        base05: "#f8f8f2",
        base06: "#f5f4f1",
        base07: "#f9f8f5",
        base08: "#f92672",
        base09: "#32c3e1",
        base0A: "#f4bf75",
        base0B: "#a6e22e",
        base0C: "#a1efe4",
        base0D: "#66d9ef",
        base0E: "#ae81ff",
        base0F: "#32c3e1",
    },
    iconStyle: "triangle",
    indentWidth: 2,
    collapsed: false,
    collapseStringsAfterLength: 30,
    enableClipboard: false,
    displayObjectSize: false,
    displayDataTypes: false,
    onEdit: false,
    onAdd: false,
    onDelete: false,
    style,
    name: null,
});
