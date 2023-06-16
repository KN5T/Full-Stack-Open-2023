const Person = ({ name, number, id, handleClick }) => (
  <p>
    {name} {number}{" "}
    <button onClick={() => handleClick(id, name)}>delete</button>
  </p>
)

export default Person
