const express = require('express');
const app = express();

const appController = require('./../controller/appController');

module.exports.setRouter = (app) => {
    let baseUrl = `/api/v1/slots`;
    app.post(`${baseUrl}/bookSlot`, appController.bookAppointment);

    app.get(`${baseUrl}/getAppointment`, appController.getAppointment);
}