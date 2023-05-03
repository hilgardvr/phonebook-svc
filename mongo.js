const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('need node mongo.js pw (name number)')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://hilgardvr:${password}@cluster0.hajsdav.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    Person
        .find({})
        .then(persons => {
            console.log("Found persons:", persons)
            mongoose.connection.close()
            process.exit(0)
        })
} else if (process.argv.length == 5) {
    const p = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    console.log('person', p)

    p.save().then(result => {
        console.log('result', result)
        mongoose.connection.close()
    })
} else {
    console.log("Invalid args")
}
