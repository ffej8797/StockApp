import axios from "axios";
import { formatTimestemp } from "../utils/index.js";

export default async function clock(req, res) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

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