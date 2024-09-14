const mongoose = require('mongoose');
const Tournament = require('./models/Tournament');
const Match = require('./models/Match');

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/pollasdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function seedData() {
    // Torneos a insertar
    const tournaments = [
        {
            name: 'Liga BetPlay',
            country: 'Colombia',
            season: '2024',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-12-15'),
        },
        {
            name: 'Champions League',
            country: 'Europa',
            season: '2024/2025',
            startDate: new Date('2024-09-15'),
            endDate: new Date('2025-05-28'),
        },
        {
            name: 'Copa Libertadores',
            country: 'Sudamérica',
            season: '2024',
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-11-30'),
        },
        {
            name: 'UEFA Europa League',
            country: 'Europa',
            season: '2024/2025',
            startDate: new Date('2024-09-20'),
            endDate: new Date('2025-05-22'),
        }
    ];

    // Verificar si los torneos ya existen antes de insertarlos
    for (const tournamentData of tournaments) {
        const existingTournament = await Tournament.findOne({
            name: tournamentData.name,
            season: tournamentData.season
        });

        if (!existingTournament) {
            const newTournament = new Tournament(tournamentData);
            await newTournament.save();
            console.log(`Torneo ${tournamentData.name} insertado.`);
        } else {
            console.log(`Torneo ${tournamentData.name} ya existe en la base de datos.`);
        }
    }

    // Crear y guardar los partidos solo si los torneos existen
    const tournamentLigaBetPlay = await Tournament.findOne({ name: 'Liga BetPlay', season: '2024' });
    const tournamentChampionsLeague = await Tournament.findOne({ name: 'Champions League', season: '2024/2025' });
    const tournamentLibertadores = await Tournament.findOne({ name: 'Copa Libertadores', season: '2024' });
    const tournamentEuropaLeague = await Tournament.findOne({ name: 'UEFA Europa League', season: '2024/2025' });

    const matches = [
        // Partidos para Liga BetPlay
        {
            tournamentId: tournamentLigaBetPlay._id,
            homeTeam: 'Atlético Nacional',
            awayTeam: 'Millonarios FC',
            matchDate: new Date('2024-02-15'),
            stadium: 'Estadio Atanasio Girardot',
            result: { homeGoals: 2, awayGoals: 1 },
        },
        {
            tournamentId: tournamentLigaBetPlay._id,
            homeTeam: 'Deportivo Cali',
            awayTeam: 'América de Cali',
            matchDate: new Date('2024-03-01'),
            stadium: 'Estadio Deportivo Cali',
            result: { homeGoals: 0, awayGoals: 0 },
        },
        {
            tournamentId: tournamentLigaBetPlay._id,
            homeTeam: 'Junior FC',
            awayTeam: 'Santa Fe',
            matchDate: new Date('2024-03-15'),
            stadium: 'Estadio Metropolitano',
            result: { homeGoals: 1, awayGoals: 1 },
        },

        // Partidos para Champions League
        {
            tournamentId: tournamentChampionsLeague._id,
            homeTeam: 'FC Barcelona',
            awayTeam: 'Manchester City',
            matchDate: new Date('2024-10-15'),
            stadium: 'Camp Nou',
            result: { homeGoals: 3, awayGoals: 2 },
        },
        {
            tournamentId: tournamentChampionsLeague._id,
            homeTeam: 'Real Madrid',
            awayTeam: 'Chelsea FC',
            matchDate: new Date('2024-10-20'),
            stadium: 'Santiago Bernabéu',
            result: { homeGoals: 2, awayGoals: 0 },
        },
        {
            tournamentId: tournamentChampionsLeague._id,
            homeTeam: 'Liverpool FC',
            awayTeam: 'Paris Saint-Germain',
            matchDate: new Date('2024-11-01'),
            stadium: 'Anfield',
            result: { homeGoals: 1, awayGoals: 3 },
        },

        // Partidos para Copa Libertadores
        {
            tournamentId: tournamentLibertadores._id,
            homeTeam: 'Boca Juniors',
            awayTeam: 'River Plate',
            matchDate: new Date('2024-04-10'),
            stadium: 'La Bombonera',
            result: { homeGoals: 1, awayGoals: 1 },
        },
        {
            tournamentId: tournamentLibertadores._id,
            homeTeam: 'Flamengo',
            awayTeam: 'Palmeiras',
            matchDate: new Date('2024-05-20'),
            stadium: 'Maracanã',
            result: { homeGoals: 2, awayGoals: 2 },
        },
        {
            tournamentId: tournamentLibertadores._id,
            homeTeam: 'Gremio',
            awayTeam: 'Santos FC',
            matchDate: new Date('2024-06-01'),
            stadium: 'Arena do Grêmio',
            result: { homeGoals: 3, awayGoals: 1 },
        },

        // Partidos para UEFA Europa League
        {
            tournamentId: tournamentEuropaLeague._id,
            homeTeam: 'Manchester United',
            awayTeam: 'AC Milan',
            matchDate: new Date('2024-09-25'),
            stadium: 'Old Trafford',
            result: { homeGoals: 2, awayGoals: 2 },
        },
        {
            tournamentId: tournamentEuropaLeague._id,
            homeTeam: 'Arsenal FC',
            awayTeam: 'AS Roma',
            matchDate: new Date('2024-10-05'),
            stadium: 'Emirates Stadium',
            result: { homeGoals: 1, awayGoals: 0 },
        },
        {
            tournamentId: tournamentEuropaLeague._id,
            homeTeam: 'Sevilla FC',
            awayTeam: 'Villarreal CF',
            matchDate: new Date('2024-11-15'),
            stadium: 'Ramón Sánchez Pizjuán',
            result: { homeGoals: 3, awayGoals: 2 },
        }
    ];

    // Guardar todos los partidos en la base de datos
    await Match.insertMany(matches);

    console.log('Datos iniciales cargados con más partidos');
    mongoose.connection.close();
}

// Ejecutar la función de seed
seedData();
