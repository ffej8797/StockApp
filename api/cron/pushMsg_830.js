import axios from "axios";
import { formatTimestemp, formatTimestampDate } from "../utils/index.js";
import { stockData_Top20Volume, stockData_Top20ForeignHolding } from "../fetchStockData/index.js";
import stockData from "../fetchStockData/index.js";

export default async function pushMsg_830(req, res) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    /** 抓股票資料 */
    // const DATE = formatTimestampDate(Date.now())
    const finalData = await stockData("20260708")
    console.log("finalData", finalData)

    const userId = "U0c489bc1ad94ec6aca55d5dc529dae66"

    const message = `
📊 ${finalData.date} 市場排行

🔥 成交量 TOP 5

1. ${volumeTop5[0].stockName}(${volumeTop5[0].stockId})
   成交量：${Number(volumeTop5[0].tradingVolume).toLocaleString()}
   收盤：${volumeTop5[0].closePrice} ${volumeTop5[0].changeDirection}

2. ${volumeTop5[1].stockName}(${volumeTop5[1].stockId})
   成交量：${Number(volumeTop5[1].tradingVolume).toLocaleString()}
   收盤：${volumeTop5[1].closePrice} ${volumeTop5[1].changeDirection}


🌍 外資持股 TOP 5

1. ${foreignTop5[0].stockName}(${foreignTop5[0].stockId})
   外資持股：${foreignTop5[0].foreignHoldingRatio}%

2. ${foreignTop5[1].stockName}(${foreignTop5[1].stockId})
   外資持股：${foreignTop5[1].foreignHoldingRatio}%
`;

    await axios.post(
        "https://api.line.me/v2/bot/message/push",
        {
            to: userId,
            messages: [
                {
                    type: "text",
                    message
                }
            ]
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization":
                    `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
            }
        }
    );
    res.status(200).end('Hello Cron!');
}