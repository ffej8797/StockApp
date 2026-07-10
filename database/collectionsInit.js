import { connectDB } from "./connectDB.js";
export const UserInit = async () => {
    const db = await connectDB();
    return db.collection("User");
};
