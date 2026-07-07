require("dotenv").config();

// Initialize Database
require("./database/database");

// Express App
const app = require("./app");

// WhatsApp Client
const startWhatsApp = require("./whatsapp/client");

// Server Port
const PORT = process.env.PORT || 3000;

// Start Express Server
app.listen(PORT, () => {
    console.log("======================================");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("======================================");
});

// Start WhatsApp Client
(async () => {
    try {
        await startWhatsApp();
        console.log("✅ WhatsApp Client Started");
    } catch (error) {
        console.error("❌ Failed to start WhatsApp:", error);
    }
})();