import { createMarkup } from "./helpers";

export function formatMessage(message = "", style) {
    return (
        <div
            className={style || "max-w-full whitespace-pre-wrap break-words text-13"}
            dangerouslySetInnerHTML={createMarkup(
                message
                    .replace(/\*(.+?)\*/g, "<b>$1</b>")
                    .replace(/ _(.+?)_ /g, "<i>$1</i>")
                    .replace(/ ~(.+?)~ /g, "<strike>$1</strike>")
                    .replace(/ ```(.+?)``` /g, "<tt>$1</tt>")
                    .trim()
            )}
        />
    );
}

export function formatTemplateMessage(message = "", style) {
    return (
        <div
            className={style || "max-w-full break-words text-13"}
            dangerouslySetInnerHTML={createMarkup(
                message
                    .replace(/{{(.+?)}}/g, `<span class="bg-[#BAE2ED] text-[#4F5566] rounded-7.5 px-1">$1</span>`)
                    .replace(/\*(.+?)\*/g, "<b>$1</b>")
                    .replace(/ _(.+?)_ /g, "<i> $1 </i>")
                    .replace(/ ~(.+?)~ /g, "<strike>$1</strike>")
                    .replace(/ ```(.+?)``` /g, "<tt>$1</tt>")
                    .trim()
            )}
        />
    );
}
