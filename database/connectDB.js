import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

export async function connectDB() {
    if (db) return db;

    await client.connect();

    db = client.db("StockApp");

    return db;
}