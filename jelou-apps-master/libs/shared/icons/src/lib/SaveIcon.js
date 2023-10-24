import Icon from "./Icon";

export default function SaveIcon({ fill = "#B8BDC9", className } = {}) {
    return (
        <Icon
            className={className}
            viewBox="0 0 100 100"
            style={{
                enableBackground: "new 0 0 100 100",
            }}
            xmlSpace="preserve"
            width={20}
            height={19}
            fill="none">
            <path
                d="M41.92 56.78c2.06 2.32 4.55 6.48 8.09 6.48 3.43 0 5.76-3.87 7.77-6.13l7.89-8.88c2.13-2.4-1.39-5.95-3.54-3.54-2 2.25-3.99 4.5-5.99 6.75-.6.68-2.16 2.96-3.64 4.68V18.5c0-3.22-5-3.22-5 0v37.65c-1.47-1.71-3.02-3.99-3.64-4.68l-6-6.75c-2.14-2.41-5.67 1.14-3.54 3.54 2.54 2.84 5.07 5.68 7.6 8.52z"
                fill={fill}
            />
            <path
                d="M84 16H69.88c-3.22 0-3.22 5 0 5H81.5v58h-63V21h10.95c3.22 0 3.22-5 0-5H16c-1.35 0-2.5 1.15-2.5 2.5v63c0 1.35 1.15 2.5 2.5 2.5h68c1.35 0 2.5-1.15 2.5-2.5v-63c0-1.35-1.15-2.5-2.5-2.5z"
                fill={fill}
            />
        </Icon>
    );
}
