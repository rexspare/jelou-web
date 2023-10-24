import Icon from "./Icon";

export default function CustomPaymentIcon({ width = 15, height = 15, fill = "currentColor" } = {}) {
    return (
        <Icon
            id="Capa_1"
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            x={0}
            y={0}
            viewBox="0 0 100 100"
            style={{
                enableBackground: "new 0 0 100 100",
            }}
            xmlSpace="preserve">
            <path
                fill={fill}
                d="M87.1 54.6c-.18 16.04-10.15 30.85-25.37 36.37-15.24 5.52-32.6.89-43.05-11.5-10.48-12.43-11.9-30.72-3.6-44.66 8.26-13.87 24.84-21.39 40.72-18.23 18.12 3.6 31.1 19.65 31.3 38.02.03 3.15 4.94 3.16 4.9 0-.2-18.2-11.47-34.54-28.56-40.94-17.14-6.42-37.24-.91-48.77 13.26C3.21 40.99 1.54 61.21 10.85 76.86c9.36 15.72 27.88 23.93 45.82 20.56C77.1 93.59 91.77 75.17 92 54.6c.03-3.16-4.87-3.16-4.9 0z"
            />
            <path fill={fill} d="M45.92 26.33v56.53c0 3.15 4.9 3.16 4.9 0V26.33c.01-3.15-4.9-3.16-4.9 0z" />
            <path
                fill={fill}
                d="M31.96 65.05c.78 16.19 30.2 17.54 33.51 2.13 1.65-7.72-5.67-13.38-12.48-14.63-3.73-.69-7.52-.07-11.12-1.52-3.61-1.45-7.28-5.08-5.38-9.23 3.73-8.11 22.91-7.9 23.4 2.34.15 3.14 5.05 3.16 4.9 0-.78-16.19-30.2-17.54-33.51-2.13-1.65 7.72 5.67 13.38 12.48 14.63 3.73.69 7.52.07 11.12 1.52 3.61 1.45 7.28 5.08 5.38 9.23-3.73 8.11-22.91 7.9-23.4-2.34-.15-3.14-5.06-3.15-4.9 0z"
            />
        </Icon>
    );
}

export function RecurringPaymentIcon({ width = 15, height = 15, fill = "currentColor" } = {}) {
    return (
        <svg
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            fill={fill}
            style={{
                enableBackground: "new 0 0 513 510",
            }}
            viewBox="0 0 513 510">
            <path d="M303.76 293.56c-.99-3.21-2.56-5.99-4.71-8.33-2.16-2.34-4.44-4.35-6.85-6.03-2.41-1.68-5.41-3.12-8.99-4.33s-6.98-2.19-10.19-2.96c-3.22-.77-7.01-1.52-11.4-2.25-.29-.22-.59-.33-.88-.33-.29 0-.57-.04-.82-.11-.26-.07-.53-.11-.82-.11-3.66-.73-6.43-1.28-8.33-1.64-1.9-.37-4.33-1.1-7.29-2.19-2.96-1.1-5.21-2.25-6.74-3.45-1.53-1.21-2.9-2.87-4.11-4.99-1.21-2.12-1.81-4.64-1.81-7.56 0-4.09 1.15-7.69 3.45-10.8 2.3-3.1 5.43-5.43 9.37-6.96 2.75-1.07 5.81-1.76 9.16-2.08 2.15.69 4.57.63 6.68-.17 4.73.22 8.92 1.19 12.54 2.91 4.17 1.97 7.2 4.37 9.1 7.18.81 1.21 1.48 2.45 2 3.73 1.33 3.28 4.66 5.31 8.21 5.31 6.25 0 10.69-6.3 8.36-12.09-.25-.62-.52-1.23-.81-1.83-2.05-4.24-4.97-7.87-8.77-10.91-3.8-3.03-8.44-5.42-13.92-7.18-3.55-1.14-7.31-1.9-11.29-2.3v-19.92c0-11.58-18-11.6-18 0v20.49c-8.07 1.35-15.13 4.23-21.18 8.63-8.73 6.36-13.1 15.71-13.1 28.06 0 4.9.75 9.11 2.25 12.66 1.5 3.55 3.36 6.43 5.59 8.66 2.23 2.23 5.46 4.26 9.7 6.08 4.24 1.83 8.04 3.16 11.4 4 3.36.84 7.93 1.85 13.7 3.01 4.38.95 7.76 1.68 10.14 2.19 2.37.51 5.15 1.35 8.33 2.52 3.18 1.17 5.57 2.39 7.18 3.67 1.61 1.28 2.98 2.98 4.11 5.1 1.13 2.12 1.7 4.57 1.7 7.34 0 4.09-.99 7.62-2.96 10.58s-5.24 5.39-9.81 7.29c-4.57 1.9-10.21 2.85-16.93 2.85-14.19 0-23.1-4.34-26.73-13.02-1.42-3.4-4.61-5.73-8.29-5.73h-.65c-6.58 0-11.18 6.67-8.68 12.76 2.07 5.04 5.51 9.29 10.32 12.73 6.45 4.61 14.43 7.45 23.93 8.53 0 .05-.01.09-.01.13v17.71c0 11.58 18 11.6 18 0v-17.78c10.77-1.12 19.73-4.4 26.86-9.86 8.99-6.87 13.48-16.37 13.48-28.5-.01-3.92-.5-7.49-1.49-10.71z" />
            <path d="M490.87 160.41V93.86c0-10.68 1.65-23.74-1.5-34.15-3.36-11.09-11.68-19.82-22.42-24.02-5.58-2.18-11.42-2.41-17.29-2.41-.91-1.8-2.03-3.55-3.45-5.26-10.35-12.44-29.14-14.06-41.68-4.04-3.43 2.75-5.84 5.89-7.53 9.31H115.66c-.91-1.8-2.04-3.56-3.46-5.28C101.85 15.59 83.07 13.97 70.52 24c-3.42 2.73-5.82 5.86-7.5 9.26-5.47-.03-10.96.16-16.16 1.97-11.3 3.92-20.17 13.01-23.65 24.49-1.56 5.15-1.5 10.38-1.5 15.66v366.24c0 4.22-.02 8.44 0 12.66.08 14.59 7.66 28.19 21.17 34.47 11.15 5.17 25.11 3.56 37.13 3.56h369.65c6.71 0 13.16-.51 19.45-3.3 13.84-6.12 21.69-19.89 21.77-34.73.21-37.42 0-74.84 0-112.25-.01-60.54-.01-121.08-.01-181.62zM433.08 40.25c3.42 4.75 2.21 12.23 2.21 17.73v13.33h-24v-9.48c0-5.58-1.35-13.39.75-18.77 3.39-8.69 15.48-10.52 21.04-2.81zm-334 0c3.42 4.75 2.21 12.23 2.21 17.73v13.33h-24v-9.48c0-5.58-1.35-13.39.75-18.77 3.39-8.69 15.48-10.52 21.04-2.81zM39.71 70.13c.16-7.56 4.56-14.5 11.65-17.45 2.46-1.02 5.18-1.39 7.96-1.5-.02.81-.03 1.62-.03 2.44v26.69c0 4.87 4.12 9 9 9h42c2.76 0 4.85-1.03 6.3-2.58 1.62-1.45 2.7-3.58 2.7-6.42V57.06c0-1.94 0-3.86-.04-5.75h274.07c-.02.77-.03 1.54-.03 2.31v26.69c0 4.87 4.12 9 9 9h42c2.76 0 4.85-1.03 6.3-2.58 1.62-1.45 2.7-3.58 2.7-6.42V57.06c0-1.94 0-3.87-.04-5.77 3.78.16 7.46.8 10.83 2.94 5.58 3.54 8.66 9.48 8.79 16.01.06 2.88 0 5.76 0 8.64v31.65H86.33c-15.59 0-31.28-.5-46.89-.21-.06-13.4-.02-26.81.27-40.19zm433.16 384.02c-.05 10.19-6.7 19.33-17.42 20.12-8.71.65-17.67.03-26.39.03H63.91c-3.67 0-7.48.27-11.01-.86-9-2.88-13.17-10.98-13.19-19.88-.11-37.18 0-74.36 0-111.54V163.87c0-11.77-.1-23.56-.18-35.34h386.72c15.49 0 31.09.49 46.61.21v312.88c.01 4.18.03 8.35.01 12.53z" />
            <path d="M151.29 90.31h209.99c11.58 0 11.6-18 0-18H151.29c-11.58 0-11.6 18 0 18zm73 335h-91c-11.58 0-11.6 18 0 18h91c11.58 0 11.6-18 0-18zm155 1h-91c-11.58 0-11.6 18 0 18h91c11.58 0 11.6-18 0-18zm-115 0h-14c-4.71 0-9.22 4.14-9 9 .22 4.88 3.95 9 9 9h14c4.71 0 9.22-4.14 9-9-.22-4.88-3.95-9-9-9zM384.04 298.3c1.08-6.96 1.71-13.95 1.75-21-.31-54.1-34.43-102.84-85.13-121.66-50.39-18.71-109.68-2.71-143.82 38.78-34.6 42.04-39.85 102.69-11.59 149.56 28.13 46.66 83.39 70.67 136.72 60.25 51.82-10.12 93.98-53.71 102.07-105.93zm-214.06 49.67c-29.82-35.83-33.14-88.53-9.19-128.25 23.89-39.62 71.56-61.02 117.05-51.85 45.77 9.23 81.38 46.46 88.73 92.55.89 5.58 1.18 11.24 1.21 16.88-.26 45.88-29.11 88.67-72.54 104.54-44.61 16.31-94.91 2.6-125.26-33.87z" />
        </svg>
    );
}