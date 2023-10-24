/**
 * Ugly solution to extract filename from content-disposition header
 * The string looks like: attachment; filename=".15-10-2019.1fv6ak1sd3q5o.pdf"
 *
 * @param {string} content Header string
 * @returns {object} Values
 */

export default function DownloadFile(response) {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "conversation.pdf");

    document.body.appendChild(link);
    link.click();
}
