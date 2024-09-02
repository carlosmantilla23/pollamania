const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
    name: String,
    country: String,
    season: String,
    startDate: Date,
    endDate: Date,
});

const Tournament = mongoose.model('Tournament', TournamentSchema);

module.exports = Tournament;
