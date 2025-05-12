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