export function volumeTop20Message(volumeTop20) {
    const message = volumeTop20
        .slice(0, 5)
        .map(
            (item, index) =>
                `
${index + 1}. ${item.stockName}(${item.stockId})
成交量：${Number(item.tradingVolume).toLocaleString()}
收盤：${item.closePrice} ${item.changeDirection.includes("green") ? "📈" : "📉"}
`).join("")

    return message
}

export function top20ForeignHoldingMessage(top20ForeignHolding) {
    const message = top20ForeignHolding
        .slice(0, 5)
        .map(
            (item, index) =>
                `
${index + 1}. ${item.stockName}(${item.stockId})
外資持股：${item.foreignHoldingRatio}%
`
        ).join("");

    return message
}