const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./src/database/humanai.db", (err) => {

    if (err) {
        console.log("❌ Database Error :", err.message);
    }
    else {
        console.log("✅ SQLite Connected");
    }

});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS chats (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            sender TEXT,

            message TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `);

});

function saveMessage(sender, message) {

    db.run(
        `INSERT INTO chats(sender,message) VALUES(?,?)`,
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

module.exports = {
    db,
    saveMessage
};