const P = require("pino");
const qrcode = require("qrcode-terminal");

const {
    saveMessage,
    saveAIReply,
    getRecentMessages
} = require("../database/database");

const { askOllama } = require("../ai/ollama");

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

        // Save incoming message
        saveMessage(sender, text);

        // Load previous messages
        const history = await getRecentMessages(sender);

        const historyText = history
            .map(msg => msg.message)
            .join("\n");

        console.log("\n📚 Previous Messages");

        history.forEach(msg => {
            console.log("•", msg.message);
        });

        // AI Prompt
        const prompt = `
You are Siva.

Reply in Tanglish.

Keep replies short and natural.

Previous Conversation:
${historyText}

Current Message:
${text}

Reply:
`;

        // Ask Ollama
        const reply = await askOllama(prompt);

        // Save AI reply
        saveAIReply(sender, text, reply);

        console.log("🤖 Suggested Reply :", reply);
        console.log("🤖 AI Reply Saved");
        console.log("💾 Message Saved Successfully");
        console.log("======================================\n");

    });

    return sock;
}

module.exports = startWhatsApp;