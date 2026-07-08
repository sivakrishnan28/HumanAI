const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./src/database/humanai.db", (err) => {

    if (err) {
        console.log("❌ Database Error :", err.message);
    } else {
        console.log("✅ SQLite Connected");
    }

});

// Create Tables
db.serialize(() => {

    // Chats Table
    db.run(`
        CREATE TABLE IF NOT EXISTS chats (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            sender TEXT,

            message TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `);

    // AI Replies Table
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

// Save Incoming Message
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

// Save AI Reply
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

// Get Previous Messages
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

// Total Messages
function getTotalMessages() {

    return new Promise((resolve, reject) => {

        db.get(
            `SELECT COUNT(*) AS total FROM chats`,
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

// Total Contacts
function getTotalContacts() {

    return new Promise((resolve, reject) => {

        db.get(
            `SELECT COUNT(DISTINCT sender) AS total FROM chats`,
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

// Latest Messages
function getLatestMessages() {

    return new Promise((resolve, reject) => {

        db.all(
            `SELECT sender, message, created_at
             FROM chats
             WHERE sender NOT LIKE '%newsletter%'
             AND sender != 'status@broadcast'
             ORDER BY id DESC
             LIMIT 20`,
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

// Latest AI Replies
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

function searchMessages(keyword) {

    return new Promise((resolve, reject) => {

        db.all(
            `SELECT sender, message, created_at
             FROM chats
             WHERE message LIKE ?
             ORDER BY id DESC
             LIMIT 20`,
            [`%${keyword}%`],
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

function getTodayMessages() {

    return new Promise((resolve, reject) => {

        db.get(
            `SELECT COUNT(*) AS total
             FROM chats
             WHERE DATE(created_at)=DATE('now','localtime')`,
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

function getTotalAIReplies() {

    return new Promise((resolve, reject) => {

        db.get(
            `SELECT COUNT(*) AS total
             FROM ai_replies`,
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

function getMostActiveContact() {

    return new Promise((resolve, reject) => {

        db.get(
            `SELECT sender,
                    COUNT(*) AS total
             FROM chats
             GROUP BY sender
             ORDER BY total DESC
             LIMIT 1`,
            (err, row) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(row);

            }
        );

    });

}

function getContacts() {

    return new Promise((resolve, reject) => {

        db.all(
            `SELECT
                sender,
                COUNT(*) AS total,
                MAX(created_at) AS lastMessage
             FROM chats
             GROUP BY sender
             ORDER BY lastMessage DESC`,
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

module.exports = {
    db,
    saveMessage,
    saveAIReply,
    getRecentMessages,
    getTotalMessages,
    getTotalContacts,
    getLatestMessages,
    getLatestAIReplies,
    searchMessages,
    getTodayMessages,
    getTotalAIReplies,
    getMostActiveContact,
    getContacts
};