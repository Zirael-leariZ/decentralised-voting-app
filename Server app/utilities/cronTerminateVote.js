const cron = require("node-cron");
const VoteModel = require('../models/voteModel');

// Run every day at 00:00
cron.schedule("0 0 * * *", async () => {
    try {
        // Get yesterday's date (formatted as YYYY-MM-DD)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const activeVotes = await VoteModel.find({ status: 'active' });
        for (const vote of activeVotes) {
            const expirationDate = new Date(vote.expiration_date).toISOString().split('T')[0];

            if (expirationDate === yesterdayStr) {
                await VoteModel.updateOne(
                    { _id: vote._id },
                    { $set: { status: 'completed' } }
                );
            }
        }
    } catch (err) {
        console.error('Cron job error:', err.message);
    }
});
