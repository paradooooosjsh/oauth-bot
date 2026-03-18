const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID || "1426323585391136949";
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || "https://oauth-bot-df1u.onrender.com/callback";

const users = [];
const usedCodes = new Set();

app.get("/", (req, res) => {
    res.send("Bot is running ✅");
});

app.get("/callback", async (req, res) => {
    const code = req.query.code;

    if (!code) return res.send("❌ لا يوجد code");

    // منع استخدام نفس الكود مرتين
    if (usedCodes.has(code)) {
        return res.send("⚠️ هذا الرابط تم استخدامه من قبل");
    }

    usedCodes.add(code);

    try {
        const tokenRes = await axios.post(
            "https://discord.com/api/oauth2/token",
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const access_token = tokenRes.data.access_token;

        const userRes = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const user_id = userRes.data.id;
        const username = userRes.data.username;

        const existing = users.find(u => u.user_id === user_id);

        if (!existing) {
            users.push({ user_id, username, access_token });
        } else {
            existing.access_token = access_token;
        }

        res.send("تم تسجيل الدخول بنجاح 🎉");

    } catch (err) {
        console.log(err.response?.data || err.message);
        res.send("❌ " + JSON.stringify(err.response?.data || err.message));
    }
});

app.get("/users", (req, res) => {
    res.json(users);
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
