const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://vilojohanna_db_user:${password}@cluster0.gdwahuy.mongodb.net/phonebookApp?appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (!name || !number) {
  // List all entries if name/number are missing
  console.log('phonebook:')
  Person.find({})
    .then(result => {
      result.forEach(p => {
        console.log(`${p.name} ${p.number}`)
      })
      mongoose.connection.close()
    })
    .catch(err => {
      console.error(err)
      mongoose.connection.close()
    })
} else {
  // Save new entry
  const person = new Person({ name, number })

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(err => {
      console.error(err)
      mongoose.connection.close()
    })
}