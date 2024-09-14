const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
    homeTeam: String,
    awayTeam: String,
    matchDate: Date,
    stadium: String,
    result: {
        homeGoals: Number,
        awayGoals: Number,
    },
});

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;
