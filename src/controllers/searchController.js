const { searchMessages } = require("../database/database");

exports.searchMessages = async (req, res) => {

    try {

        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({
                error: "Search keyword is required"
            });
        }

        const results = await searchMessages(keyword);

        res.json(results);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Search failed"
        });

    }

};