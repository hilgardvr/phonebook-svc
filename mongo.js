require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                const parts = v.split("-")
                if (parts.length != 2 || 
                    (parts[0].length < 2 || parts[0].length > 3) ||
                    v.length < 8 ||
                    !(/[0-9]/.test(parts[0])) ||
                    !(/[0-9]/.test(parts[1]))
                ) {
                    return false
                }
            }
        },
        required: true,
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)