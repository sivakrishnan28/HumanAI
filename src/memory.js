const { db } = require("../database/database");

function getLastMessages(sender, limit = 10) {

    return new Promise((resolve, reject) => {

        db.all(
            `SELECT message
             FROM chats
             WHERE sender = ?
             ORDER BY id DESC
             LIMIT ?`,
            [sender, limit],

            (err, rows) => {

                if (err) return reject(err);

                resolve(rows.reverse());

            }

        );

    });

}

module.exports = {
    getLastMessages
};