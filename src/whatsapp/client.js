const ollamaModule = require("../ai/ollama");
console.log("OLLAMA:", ollamaModule);

const { askOllama } = require("../ai/ollama");
const P = require("pino");
const qrcode = require("qrcode-terminal");
const { saveMessage, getRecentMessages } = require("../database/database");
const { generateReply } = require("../ai/replyEngine");

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
        browser: ["HumanAI", "Chrome", "1.0.0"],
    });

    // Save auth credentials
    sock.ev.on("creds.update", saveCreds);

    // Connection updates
    sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {

        if (qr) {
            console.clear();
            console.log("📱 Scan this QR using WhatsApp\n");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "connecting") {
            console.log("🔄 Connecting to WhatsApp...");
        }

        if (connection === "open") {
            console.log("✅ WhatsApp Connected Successfully!");
        }

        if (connection === "close") {

            console.log("❌ WhatsApp Disconnected");

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            if (shouldReconnect) {
                console.log("🔄 Reconnecting in 3 seconds...");

                setTimeout(() => {
                    startWhatsApp();
                }, 3000);
            } else {
                console.log("🚫 Logged Out");
            }
        }

    });

    // Incoming Messages
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

        console.log("\n======================================");
        console.log("📩 New Message");
        console.log("👤 From :", sender);
        console.log("💬 Text :", text);

        // Save message to database
        saveMessage(sender, text);

        const history = await getRecentMessages(sender);

        const historyText = history
        .map((msg) => msg.message)
        .join("\n");

        console.log("\n📚 Previous Messages");

        history.forEach((msg) => {
        console.log("•", msg.message);
     });

        // Generate reply suggestion
        const prompt = `
        You are Siva.

        Reply in Tanglish.

        Keep replies short.

        Previous Conversation:

        ${historyText}

        Current Message:

        ${text}

        Reply:
        `;

const reply = await askOllama(prompt);

        console.log("🤖 Suggested Reply :", reply);
        console.log("💾 Message Saved Successfully");
        console.log("======================================\n");

    });

    return sock;
}

module.exports = startWhatsApp;