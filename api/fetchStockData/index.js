import axios from "axios";
import FIELDS_MAP from "../../fieldsMap.json" with { type: "json" };
import { priceDeleteComma, formatTimestampDate } from "../utils/index.js";
import { StockData } from "../../database/index.js";

const STOCK_URL = process.env.STOCK_URL;

export async function stockData_Top20Volume(date) {
    const url = `${STOCK_URL}afterTrading/MI_INDEX20?date=${date}&response=json&_=1783663383065` // 成交量前二十名證券
    const result = await axios.get(
        url,
        {},
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );

    const englishFields = result.data.fields.map(field => FIELDS_MAP['top20Volume'][field]);
    var Top20VolumeFormatData = []

    for (const stockData_arr of result.data.data) {
        var tempTop20Volume = {}
        for (const key in stockData_arr) { // 數據
            if (
                englishFields[key] === "tradingVolume" ||
                englishFields[key] === "tradingCount"
            ) {
                tempTop20Volume[englishFields[key]] = priceDeleteComma(stockData_arr[key])
                continue
            }
            tempTop20Volume[englishFields[key]] = stockData_arr[key]
        }

        Top20VolumeFormatData.push(tempTop20Volume)
    }

    return Top20VolumeFormatData
}

export async function stockData_Top20ForeignHolding(date) {
    const url = `${STOCK_URL}fund/MI_QFIIS_sort_20?date=${date}&response=json&_=1783682217453` // 成交量前二十名證券
    const result = await axios.get(
        url,
        {},
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    const englishFields = result.data.fields.map(field => FIELDS_MAP['top20ForeignHolding'][field]);
    var Top20ForeignHoldingFormatData = []

    for (const stockData_arr of result.data.data) {
        var tempTop20ForeignHolding = {}
        for (const key in stockData_arr) { // 數據
            if (
                englishFields[key] === "issuedShares" ||
                englishFields[key] === "foreignAvailableShares" ||
                englishFields[key] === "foreignHeldShares"
            ) {
                tempTop20ForeignHolding[englishFields[key]] = priceDeleteComma(stockData_arr[key])
                continue
            }
            tempTop20ForeignHolding[englishFields[key]] = stockData_arr[key]
        }

        Top20ForeignHoldingFormatData.push(tempTop20ForeignHolding)
    }
    return Top20ForeignHoldingFormatData
}

export default async function stockData(date) {
    const Top20VolumeFormatData = await stockData_Top20Volume(date)
    const Top20ForeignHolding = await stockData_Top20ForeignHolding(date)
    const finalData = {
        date: date,
        top20Volume: Top20VolumeFormatData,
        top20ForeignHolding: Top20ForeignHolding
    }
    return finalData
}

export async function stockData_DB(date) {
    const data = await StockData.findOne({ date: date })
    return data
}