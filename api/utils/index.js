export function formatTimestemp(timestamp) {
    const date = new Date(timestamp);
    const formatDate = date.toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    })

    return formatDate
}

/** 日期格式: 20260711 */
export function formatTimestampDate(timestamp) {
    const date = new Date(timestamp);

    const taipeiDate = new Date(
        date.toLocaleString("en-US", {
            timeZone: "Asia/Taipei",
        })
    );

    const year = taipeiDate.getFullYear();
    const month = String(taipeiDate.getMonth() + 1).padStart(2, "0");
    const day = String(taipeiDate.getDate()).padStart(2, "0");

    return `${year}${month}${day}`;
}

export function priceDeleteComma(price) {
    return price.replaceAll(",", "")
}