const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const AppointmentSChema = new Schema({

    userName: {
        default: '',
        type: String
    },
    mobile: {
        default: '',
        type: Number
    },
    from_date: {
        default: '',
        type: Date
    },
    to_date: {
        default: '',
        type: Date
    }

})

mongoose.model('Appointment', AppointmentSChema);