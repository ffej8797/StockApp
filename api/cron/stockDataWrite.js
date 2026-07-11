import axios from "axios";
import { formatTimestemp, formatTimestampDate } from "../utils/index.js";
import { stockData_Top20Volume, stockData_Top20ForeignHolding } from "../fetchStockData/index.js";
import stockData from "../fetchStockData/index.js";

import { StockData } from "../../database/index.js"

export default async function stockDataWrite(req, res) {
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

    await StockData.insertOne(finalData)
    res.status(200).end('Hello Cron!');
}