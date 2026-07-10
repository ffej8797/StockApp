import axios from "axios";

export default async function lineWebhook(req, res) {
    const event = req.body.events[0]
    switch (event.type) {

        case "follow":
            console.log("req.body", req.body)
            break;

        case "message":
            try {
                const replyToken = event.replyToken;
                const userMessage = event.message.text;

                console.log("user message:", userMessage);

                await axios.post(
                    "https://api.line.me/v2/bot/message/reply",
                    {
                        replyToken: replyToken,
                        messages: [
                            {
                                type: "text",
                                text: `你輸入的是：${userMessage}`
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
                    "LINE ERROR:",
                    error.response?.data || error.message
                );

                res.status(500).send("error");
            }
            break;


        case "unfollow":
            console.log("req.body", req.body)
            break;

    }


}