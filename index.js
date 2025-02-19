const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

// เธฃเธฑเธ Webhook เธเธฒเธ LINE
app.post("/webhook", async (req, res) => {
    try {
        const events = req.body.events;
        for (let event of events) {
            if (event.type === "join") {
                // เธเธฃเธ“เธตเธเธญเธ—เธ–เธนเธเน€เธเธดเธเน€เธเนเธฒเธเธฅเธธเนเธก
                await sendWelcomeMessage(event.source.groupId);
            } else if (event.type === "memberJoined") {
                // เธเธฃเธ“เธตเธชเธกเธฒเธเธดเธเนเธซเธกเนเน€เธเนเธฒเธเธฅเธธเนเธก
                const userId = event.joined.members[0].userId;
                await sendWelcomeMessage(event.source.groupId, userId);
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("Error:", error);
        res.sendStatus(500);
    }
});

// เธเธฑเธเธเนเธเธฑเธเธชเนเธเธเนเธญเธเธงเธฒเธกเธ•เนเธญเธเธฃเธฑเธ
async function sendWelcomeMessage(groupId, userId = null) {
    let message;
    if (userId) {
        message = `๐ เธขเธดเธเธ”เธตเธ•เนเธญเธเธฃเธฑเธ <@${userId}> เธชเธนเนเธเธฅเธธเนเธก! ๐\n\nเธ—เธตเนเธเธตเนเธเธทเธญเนเธซเธฅเนเธเธฃเธงเธกเธเธเธฃเธฑเธเธเธดเธขเธฒเธขเนเธฅเธฐเนเธเธฅเธ เธฒเธฉเธฒเธเธตเธเน€เธเนเธเนเธ—เธข เธ–เนเธฒเธกเธตเธญเธฐเนเธฃเนเธซเนเธเนเธงเธข เนเธเนเธเธเธฑเธเนเธ”เนเน€เธฅเธข! โจ`;
    } else {
        message = "๐ เธเธญเธ—เธขเธดเธเธ”เธตเนเธซเนเธเธฃเธดเธเธฒเธฃ! ๐\n\nเธเธญเธเธเธธเธ“เธ—เธตเนเน€เธเธดเนเธกเธเธฑเธเน€เธเนเธฒเธเธฅเธธเนเธก ๐ญ เธเธฑเธเธชเธฒเธกเธฒเธฃเธ–เธเนเธงเธขเนเธ•เนเธเธเธดเธขเธฒเธข เนเธเธฅเธ เธฒเธฉเธฒ เนเธฅเธฐเธชเธฃเนเธฒเธเธ เธฒเธเธ•เธฑเธงเธฅเธฐเธเธฃเนเธ”เน!";
    }

    await axios.post(
        "https://api.line.me/v2/bot/message/push",
        {
            to: groupId,
            messages: [{ type: "text", text: message }],
        },
        {
            headers: {
                Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        }
    );
}

// เธฃเธฑเธเน€เธเธดเธฃเนเธเน€เธงเธญเธฃเน
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});