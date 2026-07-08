const { getLatestAIReplies } = require("../database/database");

exports.getReplies = async (req, res) => {

    try {

        const replies = await getLatestAIReplies();

        res.json(replies);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch AI replies"
        });

    }

};