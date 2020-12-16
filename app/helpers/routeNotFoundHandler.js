let routeNotFound = (req, res, next) => {
    res.status(404).send('no route found')
}

module.exports = {
    routeNotFound: routeNotFound
}