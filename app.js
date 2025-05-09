const express = require('express');
const app = express();
const port = process.env.port;

// middelware
const notFound = require('./middlewares/notFound');
const handleError = require('./middlewares/handleError');

// routers
const filmsRouter = require('./routers/movies');

app.use(express.static('public'));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('sei nella home')
});

app.use('/movies', filmsRouter);

// error 500
app.use(handleError);
// error 404
app.use(notFound);


app.listen(port, () => {
    console.log(`il server è partito nella porta ${port}`);
});

