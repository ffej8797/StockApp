import axios from "axios";
import { formatTimestemp } from "../utils/index.js";

export default async function clock(req, res) {
    const userId = "U0c489bc1ad94ec6aca55d5dc529dae66"
    const text = `現在時間：${formatTimestemp}`

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