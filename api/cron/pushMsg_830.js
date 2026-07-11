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
    const text = `現在時間：${formatTimestemp(Date.now())}`


    await axios.post(
        "https://api.line.me/v2/bot/message/push",
        {
            to: userId,
            messages: [
                {
                    type: "text",
                    text
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