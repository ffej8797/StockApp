import { connectDB } from "./connectDB.js";
export const UserInit = async () => {
    const db = await connectDB();
    return db.collection("User");
};

export const StockDataInit = async () => {
    const db = await connectDB();
    return db.collection("StockData");
}