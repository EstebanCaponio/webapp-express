const connection = require('../data/db');

function index(req, res) {

    const { search } = req.query

    let sql = `
    SELECT
     movies.*, round(AVG(reviews.vote), 2) as average_vote
    FROM
     movies
    LEFT JOIN
     reviews on movies.id = reviews.movie_id`;

    if (search) {
        sql += ` WHERE title like "%${search}%" or abstract like "%${search}%"`
    }

    sql += ` GROUP BY movies.ID`

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err })
        res.json(results.map(result => ({
            ...result,
            image: 'http://127.0.0.1:3000/' + result.image
        })))
    })
};

function show(req, res) {
    // res.send('dettagli film');
    const id = req.params.id

    // const sql = 'SELECT * FROM movies WHERE id = ?';
    const sql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS vote_review
    FROM movies
    LEFT JOIN reviews ON movies.id = reviews.movie_id
    WHERE movies.id = ?`;

    const sqlrev = `
    SELECT reviews.*
    FROM reviews
    WHERE movie_id = ?
    `;

    // connection.query(sql, [id], (err, results) => {
    //     if (err) return res.status(500).json({ error: 'Database query failed' });
    //     if (results.length === 0) return res.status(404).json({ error: 'film not found' });
    //     res.json(results[0]);
    // });

    connection.query(sql, [id], (err, filmsResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (filmsResults.length === 0) return res.status(404).json({ error: 'film non trovato' });
        const film = filmsResults[0];

        connection.query(sqlrev, [id], (err, reviewsResults) => {
            if (err) return res.status(500).json({ error: 'Database query failed' });
            film.tags = reviewsResults;
            res.json({
                ...film,
                image: 'http://127.0.0.1:3000/' + film.image
            });
        });
    });
};

module.exports = {
    index,
    show
};