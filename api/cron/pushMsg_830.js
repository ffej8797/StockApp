import axios from "axios";
import { formatTimestampDate } from "../utils/index.js";
import stockData from "../fetchStockData/index.js";
import { stockData_DB } from "../fetchStockData/index.js";
import { DIVIDER_LINE } from "../utils/line.js";
import { User } from "../../database/index.js";

import { volumeTop20Message, top20ForeignHoldingMessage } from "../message/index.js";

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
    // const finalData = await stockData_DB(DATE)

    const finalData = await stockData_DB("20260708")
    console.log("finalData", finalData)

    const UserResult = await User.find({}).toArray()

    const volumeTop20 = finalData.top20Volume
    const top20ForeignHolding = finalData.top20ForeignHolding

    /** 訊息生成 */
    const volumeTopMessage = volumeTop20Message(volumeTop20) // 成交量排行
    const foreignHoldingMessage = top20ForeignHoldingMessage(top20ForeignHolding) // 外資持股比例排行

    const message =
        `📊 ${finalData.date} 市場排行

🔥 成交量 TOP 5
${DIVIDER_LINE}
${volumeTopMessage}


🌍 外資持股 TOP 5
${DIVIDER_LINE}
${foreignHoldingMessage}
`;

    for (const item of UserResult) {
        const data = {
            to: item.userId,
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
    }

    res.status(200).end('Hello Cron!');
}