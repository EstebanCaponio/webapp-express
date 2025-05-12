const connection = require('../data/db');

function index(req, res) {
    // res.send('elenco film');
    const sql = `
    SELECT movies.*, AVG(reviews.vote) as average_vote  
    FROM movies
    LEFT JOIN reviews on movies.id = reviews.movie_id
    GROUP BY movies.ID`;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });

    res.json(results.map(result => ({
        ...result,
        image: 'http://127.0.0.1:3000/movies' + result.image
    })))

};

function show(req, res) {
    // res.send('dettagli film');
    const id = req.params.id

    const sql = 'SELECT * FROM movies WHERE id = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({ error: 'fillm not found' });
        res.json(results[0]);
    });
};

module.exports = {
    index,
    show
};