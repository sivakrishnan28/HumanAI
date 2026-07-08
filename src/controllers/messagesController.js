const { getLatestMessages } = require("../database/database");

exports.getMessages = async (req, res) => {

    try {

        const messages = await getLatestMessages();

        res.json(messages);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch messages"
        });

    }

};