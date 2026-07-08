const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./src/database/humanai.db", (err) => {

    if (err) {
        console.log("❌ Database Error :", err.message);
    } else {
        console.log("✅ SQLite Connected");
    }

});

// Create table
db.serialize(() => {

    db.run(`
    CREATE TABLE IF NOT EXISTS ai_replies (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        sender TEXT,

        message TEXT,

        reply TEXT,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )
`);
});

// Save message
function saveMessage(sender, message) {

    db.run(
        `INSERT INTO chats(sender, message) VALUES(?, ?)`,
        [sender, message],
        (err) => {

            if (err) {
                console.log("❌ Save Failed");
            } else {
                console.log("💾 Message Saved");
            }

        }
    );

}

function saveAIReply(sender, message, reply) {

    db.run(
        `INSERT INTO ai_replies(sender, message, reply)
         VALUES(?, ?, ?)`,
        [sender, message, reply],
        (err) => {

            if (err) {
                console.log("❌ AI Reply Save Failed");
            } else {
                console.log("🤖 AI Reply Saved");
            }

        }
    );

}

// Get last 10 messages of a contact
function getRecentMessages(sender) {

    return new Promise((resolve, reject) => {

        db.all(
            `SELECT message
             FROM chats
             WHERE sender = ?
             ORDER BY id DESC
             LIMIT 10`,
            [sender],
            (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows.reverse());

            }

        );

    });

}

// Get total messages
function getTotalMessages() {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT COUNT(*) AS total FROM chats",
            (err, row) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(row.total);

            }
        );

    });

}

// Get total unique contacts
function getTotalContacts() {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT COUNT(DISTINCT sender) AS total FROM chats",
            (err, row) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(row.total);

            }
        );

    });

}


function getLatestMessages() {

    return new Promise((resolve, reject) => {

        db.all(
            `SELECT sender, message, created_at
             FROM chats
             WHERE sender NOT LIKE '%newsletter%'
             AND sender != 'status@broadcast'
             ORDER BY id DESC
             LIMIT 10`,
            (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows);

            }

        );

    });

    function getLatestAIReplies() {

    return new Promise((resolve, reject) => {

        db.all(
            `SELECT sender, message, reply, created_at
             FROM ai_replies
             ORDER BY id DESC
             LIMIT 10`,
            (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows);

            }

        );

    });

}

}

module.exports = {
    db,
    saveMessage,
    saveAIReply,
    getRecentMessages,
    getTotalMessages,
    getTotalContacts,
    getLatestMessages,
    getLatestAIReplies
};