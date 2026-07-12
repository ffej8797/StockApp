import axios from "axios";
import { formatTimestemp, formatTimestampDate } from "../utils/index.js";
import { stockData_Top20Volume, stockData_Top20ForeignHolding } from "../fetchStockData/index.js";
import stockData from "../fetchStockData/index.js";

import { StockData } from "../../database/index.js"

/** 每天晚上六點執行 */
export default async function stockDataWrite(req, res) {
    /** 抓股票資料 */
    const DATE = formatTimestampDate(Date.now())
    const finalData = await stockData(DATE)
    if (
        finalData.top20ForeignHolding.length > 0 ||
        finalData.top20Volume.length > 0
    ) {
        await StockData.insertOne(finalData)
    }

    res.status(200).end('Hello Cron!');
}