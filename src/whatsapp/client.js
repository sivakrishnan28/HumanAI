const { generateReply } = require("../ai/replyEngine");
const { getLastMessages } = require("../ai/memory");

console.log("\n📚 Previous Messages");

history.forEach((m) => {

    console.log("•", m.message);

});
const P = require("pino");
const qrcode = require("qrcode-terminal");
const { saveMessage } = require("../database/database");

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
} = require("@whiskeysockets/baileys");

async function startWhatsApp() {

    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: "silent" }),
        browser: ["HumanAI", "Chrome", "1.0.0"]
    });

    // Save credentials
    sock.ev.on("creds.update", saveCreds);

    // Connection events
    sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {

        if (qr) {
            console.clear();
            console.log("📱 Scan this QR with WhatsApp\n");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "connecting") {
            console.log("🔄 Connecting...");
        }

        if (connection === "open") {
            console.log("✅ WhatsApp Connected");
        }

        if (connection === "close") {

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            console.log("❌ Connection Closed");

            if (shouldReconnect) {
                console.log("🔄 Reconnecting...");
                setTimeout(() => {
                    startWhatsApp();
                }, 3000);
            }

        }

    });

    // Receive Messages
    sock.ev.on("messages.upsert", async ({ messages, type }) => {

        if (type !== "notify") return;

        const msg = messages[0];

        if (!msg.message) return;

        if (msg.key.fromMe) return;

        const sender = msg.key.remoteJid;

        const text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            msg.message?.ephemeralMessage?.message?.conversation ||
            msg.message?.ephemeralMessage?.message?.extendedTextMessage?.text ||
            "";

        if (!text) return;

        console.log("\n==================================");
        console.log("📩 New Message");
        console.log("👤 From :", sender);
        console.log("💬 Text :", text);

        // Save message
        saveMessage(sender, text);

        const reply = generateReply(text);

        const lower = text.toLowerCase();

        if (lower.includes("hi") || lower.includes("hello")) {
            reply = "Hey da 👋";
        }
        else if (lower.includes("how are you")) {
            reply = "Nalla iruken da 😄";
        }
        else if (lower.includes("saptiya")) {
            reply = "Innum illa da 😅";
        }
        else if (lower.includes("bye")) {
            reply = "Bye da 👋";
        }
        else {
            reply = "Seri da, konjam nerathula reply panren 🙂";
        }

        console.log("🤖 Suggested Reply :", reply);
        console.log("💾 Saved to Database");
        console.log("==================================\n");

        // NOTE:
        // This only shows a suggested reply.
        // It does NOT automatically send messages.

    });

    return sock;
}

module.exports = startWhatsApp;