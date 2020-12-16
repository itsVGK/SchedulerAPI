const express = require('express');
const app = express();
const http = require('http');
const body_parser = require('body-parser');

const mongoose = require('mongoose');
const handler = require('./app/helpers/routeNotFoundHandler');
const fs = require('fs');

const routespath = './app/route';
const modelspath = './app/modal';

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});

fs.readdirSync(modelspath).forEach((file) => {
    if (~file.indexOf('.js')) {
        require(modelspath + '/' + file);
    }
});

fs.readdirSync(routespath).forEach((file) => {
    if (~file.indexOf('.js')) {
        let route = require(routespath + '/' + file);
        route.setRouter(app);
    }
})

app.use(handler.routeNotFound);

const server = http.createServer(app);
server.listen(3000);

server.on('listening', () => {
    console.log('server is listening on port 3000');
    mongoose.connect(`mongodb://127.0.0.1:27017/schdulerDB`, { useNewUrlParser: true, useUnifiedTopology: true })
})

server.on('error', (err) => {
    console.log('error while tryin to listen on server')
})

mongoose.connection.on('error', (err) => {
    console.log('database connection error');
})

mongoose.connection.on('open', (err) => {
    if (err)
        console.log('error while trying to open db')
    else
        console.log('connected to db successfully')
})

module.exports = app;