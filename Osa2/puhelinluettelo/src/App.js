import { useState, useEffect } from "react"
import personService from "./services/persons"
import Filter from "./components/Filter"
import Notification from "./components/Notification"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState({ message: "", type: "error" })

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find((person) => person.name === newName)
    if (
      person &&
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      const changedPerson = { ...person, number: newNumber }

      personService.update(person.id, changedPerson).then((response) => {
        setPersons(persons.map((p) => (person.id !== p.id ? p : response)))
        setNewName("")
        setNewNumber("")
        setMessage({ message: `updated ${person.name}`, type: "success" })
        setTimeout(() => {
          setMessage({ message: "" })
        }, 5000)
      })
      .catch(error => {
        setMessage({ message :`Infromation of ${person.name} has already been removed from server`, type: "error"})
        setTimeout(() => {
          setMessage({ message: "" })
        }, 5000)
      })
      setPersons(persons.filter(p => p.id !== person.id))
    } else {
      const newPerson = { name: newName, number: newNumber }

      personService.create(newPerson).then((response) => {
        setPersons(persons.concat(response))
        setNewName("")
        setNewNumber("")
        setMessage({ message: `added ${newName}`, type: "success" })
        setTimeout(() => {
          setMessage({ message: "" })
        }, 5000)
      })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.remove(id).then((response) => {
        setPersons(persons.filter((person) => person.id !== id))
        setMessage({ message: `deleted ${name}`, type: "success" })
        setTimeout(() => {
          setMessage({ message: "" })
        }, 5000)
      })
    }
  }

  const filteredPersons =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.message} type={message.type} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} handleClick={deletePerson} />
    </div>
  )
}

export default App


