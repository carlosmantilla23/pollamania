const express = require('express');
const Tournament = require('./models/Tournament');
const Match = require('./models/Match');

const router = express.Router();

// Ruta para crear un torneo
router.post('/api/tournaments', async (req, res) => {
    const { name, country, season, startDate, endDate } = req.body;
    const tournament = new Tournament({ name, country, season, startDate, endDate });
    await tournament.save();
    res.status(201).send(tournament);
});

// Ruta para obtener todos los torneos
router.get('/api/tournaments', async (req, res) => {
    const tournaments = await Tournament.find();
    res.send(tournaments);
});

// Ruta para obtener un torneo específico
router.get('/api/tournaments/:id', async (req, res) => {
    const { id } = req.params;
    const tournament = await Tournament.findById(id);
    if (!tournament) {
        return res.status(404).send({ message: 'Torneo no encontrado' });
    }
    res.send(tournament);
});

// Ruta para crear un partido
router.post('/api/matches', async (req, res) => {
    const { tournamentId, homeTeam, awayTeam, matchDate, stadium, result } = req.body;
    const match = new Match({ tournamentId, homeTeam, awayTeam, matchDate, stadium, result });
    await match.save();
    res.status(201).send(match);
});

// Ruta para obtener los partidos de un torneo específico
router.get('/api/matches/:tournamentId', async (req, res) => {
    const { tournamentId } = req.params;
    const matches = await Match.find({ tournamentId });
    res.send(matches);
});

// Ruta para obtener detalles de un partido específico
router.get('/api/match/:id', async (req, res) => {
    const { id } = req.params;
    const match = await Match.findById(id);
    if (!match) {
        return res.status(404).send({ message: 'Partido no encontrado' });
    }
    res.send(match);
});

module.exports = router;
