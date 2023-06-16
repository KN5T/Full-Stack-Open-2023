import Person from "./Person"

const Persons = ({ filteredPersons, handleClick }) => {
  return (
    <div>
      {filteredPersons.map((person) => (
        <div key={person.name}>
          <Person
            name={person.name}
            number={person.number}
            id={person.id}
            handleClick={handleClick}
          />
        </div>
      ))}
    </div>
  )
}

export default Persons
