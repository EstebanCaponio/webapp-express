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

    const sql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS vote_review
    FROM movies
    LEFT JOIN reviews ON movies.id = reviews.movie_id
	where movies.id = ?`;

    const sqlrev = `
    SELECT reviews.*
    FROM reviews
    WHERE movie_id = ?`;

    connection.query(sql, [id], (err, filmsResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (filmsResults.length === 0) return res.status(404).json({ error: 'film non trovato' });
        const film = filmsResults[0];

        connection.query(sqlrev, [id], (err, reviews) => {
            if (err) return res.status(500).json({ error: 'Database query failed' });
            film.reviews = reviews;
            res.json({
                ...film,
                image: 'http://127.0.0.1:3000/' + film.image
            });
        });
    });
};

function store(req, res) {
    //identificativo del film
    const { id } = req.params;

    //corpo della richiesta
    console.log(req.body);

    const { name, vote, text } = req.body;

    const sql = `INSERT INTO reviews (movie_id, name, vote, text)
    VALUES(?, ?, ?, ?)`;

    connection.query(sql, [id, name, vote, text], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
    })

    res.status(201);
    res.json({ message: "review created successfully" })
}

function storeAdd(req, res) {
    // res.send('aggiunta libro');

    const { title, director, abstract } = req.body;

    const sql = `INSERT INTO movies (title, director, abstract)
    VALUES(?, ?, ?)`;

    connection.query(sql, [title, director, abstract], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
    })

    res.status(201);
    res.json({ message: "film added successfully" })
}

module.exports = {
    index,
    show,
    store,
    storeAdd
};