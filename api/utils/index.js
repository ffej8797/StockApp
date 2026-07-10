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