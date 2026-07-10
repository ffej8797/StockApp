import axios from "axios";

export default async function lineWebhook(req, res) {

    const body = req.body;

    const event = body.events[0];
    const replyToken = event.replyToken;
    const userMessage = event.message.text;

    try {

        await axios.post(
            "https://api.line.me/v2/bot/message/reply",
            {
                replyToken,
                messages: [
                    {
                        type: "text",
                        text: `你輸入的是 ${userMessage}`
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


        res.status(200).send("ok");

    } catch (error) {

        console.log(
            "LINE reply error:",
            error.response?.data || error.message
        );

        res.status(500).send("error");
    }
}