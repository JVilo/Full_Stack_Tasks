import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ searchWord, setSearchWord }) => {
  return (
    <div>
      filter shown with:{' '}
      <input
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
    </div>
  )
}

const PersonForm = ({
  addPerson,
  newName,
  setNewName,
  newNumber,
  setNewNumber
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <button type="submit">add</button>
    </form>
  )
}

const Persons = ({ persons, handleDelete }) => {
  return (
    <ul>
      {persons.map(person => (
        <li key={person.id}>
          {person.name}: {person.number}
          <button onClick={() => handleDelete(person.id, person.name)}>
            delete
          </button>
        </li>
      ))}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [searchWord, setSearchWord] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const showSuccess = (text) => {
    setNotification({ message: text, type: 'notification' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const showError = (text) => {
    setNotification({ message: text, type: 'error' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(prev =>
              prev.map(p => (p.id !== existingPerson.id ? p : returnedPerson))
            )
            setNewName('')
            setNewNumber('')
            showSuccess(`Updated ${returnedPerson.name}`)
          })
          .catch(error => {
            console.error(`Failed to update ${existingPerson.name}`, error)

            if (error.response && error.response.status === 404) {
              showError(`Information of ${existingPerson.name} has already been removed from the server`)
              setPersons(prev =>
                prev.filter(person => person.id !== existingPerson.id)
              )
            } else if (error.response && error.response.data.error) {
              showError(error.response.data.error)
            } else {
              showError('Updating the person failed')
            }
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(prev => prev.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showSuccess(`Added ${returnedPerson.name}`)
      })
      .catch(error => {
        console.error('Failed to save person:', error)
        if (error.response && error.response.data.error) {
          showError(error.response.data.error)
        } else {
          showError('Saving the person failed')
        }
      })
  }

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return

    personService
      .delete(id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== id))
        showSuccess(`Deleted ${name}`)
      })
    .catch(error => {
      console.error(`Failed to delete ${name}`, error)

      if (error.response && error.response.status === 404) {
        showError(`Information of ${name} has already been removed from the server`)
        setPersons(prev => prev.filter(person => person.id !== id))
      } else {
        showError('Removing the person failed')
      }
    })
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchWord.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={notification?.message} type={notification?.type} />

      <Filter
        searchWord={searchWord}
        setSearchWord={setSearchWord}
      />

      <h2>Add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App