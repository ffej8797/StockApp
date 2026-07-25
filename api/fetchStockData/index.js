import axios from "axios";
import FIELDS_MAP from "../../fieldsMap.json" with { type: "json" };
import { priceDeleteComma, formatTimestampDate } from "../utils/index.js";
import { StockData } from "../../database/index.js";

const STOCK_URL = process.env.STOCK_URL;

export async function stockData_Top20Volume(date) {
    const url = `${STOCK_URL}afterTrading/MI_INDEX20?date=${date}&response=json&_=${Date.now()}` // 成交量前二十名證券
    const result = await axios.get(
        url,
        {},
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    if (Number(result.total) === 0) {
        return []
    }

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
    const url = `${STOCK_URL}fund/MI_QFIIS_sort_20?date=${date}&response=json&_=${Date.now()}` // 成交量前二十名證券
    const result = await axios.get(
        url,
        {},
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    if (Number(result.total) === 0) {
        return []
    }
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

export async function stockData_NetPosition(date) {
    const url = `${STOCK_URL}fund/TWT38U?date=${date}&response=json&_=${Date.now()}` // 成交量前二十名證券
    const result = await axios.get(
        url,
        {},
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    if (Number(result.total) === 0) {
        return []
    }

    const englishFields = Object.values(FIELDS_MAP['netPosition']);
    var NetPositionFormatData = []

    const data = result.data
    data.fields = data.fields.slice(1);

    data.data = data.data.map(row => row.slice(1));

    for (const stockData_arr of data.data) {
        var tempNetPosition = {}
        for (const key in stockData_arr) { // 數據
            if (
                englishFields[key] === "foreignExDealerBuyShares" ||
                englishFields[key] === "foreignExDealerSellShares" ||
                englishFields[key] === "foreignExDealerNetShares" ||
                englishFields[key] === "foreignDealerBuyShares" ||
                englishFields[key] === "foreignDealerSellShares" ||
                englishFields[key] === "foreignDealerNetShares" ||
                englishFields[key] === "foreignTotalBuyShares" ||
                englishFields[key] === "foreignTotalSellShares" ||
                englishFields[key] === "foreignTotalNetShares"
            ) {
                tempNetPosition[englishFields[key]] = priceDeleteComma(stockData_arr[key])
                continue
            }

            if (
                englishFields[key] === "stockId" ||
                englishFields[key] === "stockName"
            ) {
                tempNetPosition[englishFields[key]] = stockData_arr[key].replaceAll(" ", "")
                continue;
            }

            tempNetPosition[englishFields[key]] = stockData_arr[key]
        }

        NetPositionFormatData.push(tempNetPosition)
    }

    return NetPositionFormatData
}

export async function stockData_ThreeMajorInstitutionsNetReport(date) { // 三大法人買賣超日報
    const url = `${STOCK_URL}fund/T86?date=${date}&selectType=ALL&response=json&_=${Date.now()}`
    const result = await axios.get(
        url,
        {},
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    if (Number(result.total) === 0) {
        return []
    }

    const englishFields = Object.values(FIELDS_MAP['threeMajorInstitutionsNetReport']);
    var ThreeMajorInstitutionsNetReportFormatData = []

    const data = result.data

    for (const stockData_arr of data.data) {
        var tempResult = {}
        const priceDeleteCommaKeys = ["2", "3", "4", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"]
        for (const key in stockData_arr) { // 數據
            if (
                priceDeleteCommaKeys.includes(key)
            ) {
                tempResult[englishFields[key]] = priceDeleteComma(stockData_arr[key])
                continue
            }

            if (
                englishFields[key] === "stockName"
            ) {
                tempResult[englishFields[key]] = stockData_arr[key].replaceAll(" ", "")
                continue;
            }

            tempResult[englishFields[key]] = stockData_arr[key]
        }

        ThreeMajorInstitutionsNetReportFormatData.push(tempResult)
    }

    return ThreeMajorInstitutionsNetReportFormatData
}

export default async function stockData(date) {
    const Top20VolumeFormatData = await stockData_Top20Volume(date)
    const Top20ForeignHolding = await stockData_Top20ForeignHolding(date)
    const StockDataNetPosition = await stockData_NetPosition(date);
    const ThreeMajorInstitutionsNetReport = await stockData_ThreeMajorInstitutionsNetReport(date)
    const finalData = {
        date: date,
        top20Volume: Top20VolumeFormatData,
        top20ForeignHolding: Top20ForeignHolding,
        stockDataNetPosition: StockDataNetPosition,
        threeMajorInstitutionsNetReport: ThreeMajorInstitutionsNetReport
    }
    return finalData
}

export async function stockData_DB(date) {
    const data = await StockData.findOne({ date: date })
    return data
}