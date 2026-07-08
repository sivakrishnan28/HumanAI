const { getContacts } = require("../database/database");

exports.getContacts = async (req, res) => {

    try {

        const contacts = await getContacts();

        res.json(contacts);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to load contacts"
        });

    }

};