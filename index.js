const express = require("express");
const { Client, middleware } = require("@line/bot-sdk");

const app = express();
app.use(express.json());

const LINE_CONFIG = {
    channelAccessToken: "/mevNVhs6KSLj/ZHQkoGD4QuPmehPRiwu3FY4paBp/4MCZduOqsm4VNq6x67EV1gTIKX8DLdogQcXtEnrhqQO7SNsfeiqxm8QGtbzhNy+jRlRBVFPn/ZgKu0CsFlC6UUg7fPD/QY6FW29PFT/QXMTQdB04t89/1O/w1cDnyilFU=",
    channelSecret: "7e20d6b153c182824a947685894e0792"
};
const client = new Client(LINE_CONFIG);

app.post("/webhook", middleware(LINE_CONFIG), async (req, res) => {
    try {
        const events = req.body.events;
        for (const event of events) {
            if (event.type === "message" && event.message.type === "text") {
                const replyText = `คุณพูดว่า: ${event.message.text}`;
                await client.replyMessage(event.replyToken, { type: "text", text: replyText });
            }
        }
        res.status(200).send("OK");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error processing request");
    }
});

app.listen(3000, () => console.log("Bot is running on port 3000"));
