import axios from "axios";
import { User } from "../../database/index.js";

export default async function lineWebhook(req, res) {
    const event = req.body.events[0]
    const userId = event.source.userId;

    switch (event.type) {
        case "follow":
            const UserResult = await User.findOne({ userId: userId })
            if (Boolean(UserResult)) {
                await User.updateOne(
                    { userId: userId },
                    {
                        $set: {
                            delete: false
                        }
                    }
                )
            } else {
                await User.insertOne({
                    userId: userId,
                    joinTimestamp: event.timestamp,
                    delete: false
                })
            }

            res.send("有新人加入！")
            break;

        case "message":
            try {
                const replyToken = event.replyToken;
                const userMessage = event.message.text;

                console.log("user message:", userMessage);

                // await axios.post(
                //     "https://api.line.me/v2/bot/message/reply",
                //     {
                //         replyToken: replyToken,
                //         messages: [
                //             {
                //                 type: "text",
                //                 text: `你輸入的是：${userMessage}`
                //             }
                //         ]
                //     },
                //     {
                //         headers: {
                //             "Content-Type": "application/json",
                //             "Authorization":
                //                 `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
                //         }
                //     }
                // );

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
            await User.updateOne(
                { userId: userId },
                {
                    $set: {
                        delete: true
                    }
                }
            )
            res.send("有人封鎖！")
            break;

    }


}