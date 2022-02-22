const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    cities: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [],
        ref: 'Cities',
    },
})

module.exports = mongoose.model('Country', countrySchema)