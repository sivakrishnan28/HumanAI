const {
    getTotalMessages,
    getTotalContacts
} = require("../database/database");

exports.dashboard = async (req, res) => {

    try {

        const totalMessages = await getTotalMessages();
        const totalContacts = await getTotalContacts();

        res.json({

            whatsapp: "Connected",

            ai: "Online",

            database: "Connected",

            totalMessages,

            contacts: totalContacts

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Dashboard Error"
        });

    }

};