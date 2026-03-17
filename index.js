const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// الصفحة الرئيسية
app.get("/", (req, res) => {
    res.send("Bot is running ✅");
});

// هذا هو redirect_uri
app.get("/callback", (req, res) => {
    const code = req.query.code;

    console.log("CODE:", code);

    res.send("تم تسجيل الدخول بنجاح 🎉");
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
