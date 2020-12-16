const { mongo } = require("mongoose");

const mongoose = require('mongoose');
const { get } = require("../..");
const AppointmentModel = mongoose.model('Appointment');

const response = require('./../helpers/response');

let bookAppointment = (req, res) => {

    checkAndBookSlot = (req, res) => {

        return new Promise((resolve, reject) => {
            let start_date = req.body.from_date;
            let end_date = req.body.to_date;
            AppointmentModel.find({
                $or: [
                    { from_date: { $gte: start_date, $lte: end_date } },
                    { to_date: { $gte: start_date, $lte: end_date } },
                    {
                        $and: [
                            { from_date: { $lte: start_date, $lte: end_date } },
                            { to_date: { $gte: start_date, $gte: end_date } }
                        ]
                    }
                ]
            })
                .exec((err, ret) => {
                    if (err) {
                        reject(response.generate(true, 'Error while trying to fetch Appointment Details', 400, null));
                    } else if (ret.length > 0) {
                        reject(response.generate(true, 'Lies in Between', 400, null));
                    } else {
                        let appointment = new AppointmentModel({
                            from_date: start_date,
                            to_date: end_date,
                            userName: req.body.userName,
                            mobile: parseInt(req.body.mobile) || 123,
                            from: req.body.from,
                            to: req.body.end
                        })
                        appointment.save((err, newAppointment) => {
                            if (err)
                                reject(response.generate(true, 'Error while trying to save Appointment', 400, null));
                            else {
                                resolve(response.generate(false, 'Booked the Slot Successfully', 200, newAppointment));
                            }
                        })
                    }
                })
        })
    }

    checkAndBookSlot(req, res)
        .then(data => res.send(data))
        .catch(err => res.send(err))
}

let getAppointment = (req, res) => {
    
    fetchSlotsFromCurrentDate = (req, res) => {
        return new Promise((resolve, reject) => {
            AppointmentModel.find({ from_date: { $gt: new Date() } }, { _id: 0, __v: 0 })
                .exec((err, retData) => {
                    if (err)
                        reject(response.generate(true, 'Unable to fetch Appointments', 400, null))
                    else if (retData.length < 1)
                        reject(response.generate(true, 'No Records Found from Current Time', 200, []))
                    else
                        resolve(response.generate(false, 'Retrieved Records from Current Time', 200, retData))
                })
        })
    }

    fetchSlotsFromCurrentDate(req, res)
        .then((data) => res.send(data))
        .catch(err => res.send(err));
}

module.exports = {
    bookAppointment: bookAppointment,
    getAppointment: getAppointment
}