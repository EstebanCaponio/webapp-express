function notFound(req, res, next) {

    res.status(404);
    res.json({
        errorStatus: 404,
        errorMessage: 'resource not found'
    });
};

module.exports = notFound;