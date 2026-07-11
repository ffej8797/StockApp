import axios from "axios";
import { formatTimestampDate } from "../utils/index.js";
import stockData from "../fetchStockData/index.js";
import { stockData_DB } from "../fetchStockData/index.js";
import { DIVIDER_LINE } from "../utils/line.js";

export default async function pushMsg_830(req, res) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    /** 抓股票資料 */
    // const DATE = formatTimestampDate(Date.now()) // 日期之後要改為「前一天」
    const finalData = await stockData_DB("20260708")
    console.log("finalData", finalData)

    const userId = "U0c489bc1ad94ec6aca55d5dc529dae66"

    const volumeTop20 = finalData.top20Volume
    const top20ForeignHolding = finalData.top20ForeignHolding
    const message = 
    `📊 ${finalData.date} 市場排行

🔥 成交量 TOP 5
${DIVIDER_LINE}
1. ${volumeTop20[0].stockName}(${volumeTop20[0].stockId})
成交量：${Number(volumeTop20[0].tradingVolume).toLocaleString()}
收盤：${volumeTop20[0].closePrice} ${volumeTop20[0].changeDirection.includes("green") ? "📈" : "📉"}

2. ${volumeTop20[1].stockName}(${volumeTop20[1].stockId})
成交量：${Number(volumeTop20[1].tradingVolume).toLocaleString()}
收盤：${volumeTop20[1].closePrice} ${volumeTop20[1].changeDirection.includes("green") ? "📈" : "📉"}


🌍 外資持股 TOP 5
${DIVIDER_LINE}
1. ${top20ForeignHolding[0].stockName}(${top20ForeignHolding[0].stockId})
外資持股：${top20ForeignHolding[0].foreignHoldingRatio}%

2. ${top20ForeignHolding[1].stockName}(${top20ForeignHolding[1].stockId})
外資持股：${top20ForeignHolding[1].foreignHoldingRatio}%
`;

    const data = {
        to: userId,
        messages: [
            {
                type: "text",
                text: message
            }
        ]
    }
    try {
        await axios.post(
            "https://api.line.me/v2/bot/message/push",
            data,
            {
                headers: {
                    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.log("LINE ERROR:", error.response?.data);
        console.log("STATUS:", error.response?.status);
    }
    res.status(200).end('Hello Cron!');
}